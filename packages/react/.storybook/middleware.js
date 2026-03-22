// packages/react/.storybook/middleware.js
const express = require('express');

// Simple in-memory session store for development
const sessions = {};

module.exports = function expressMiddleware(app) {
  app.use(express.json());

  // 1. Session Setup Endpoint
  app.post('/api/proxy-auth', (req, res) => {
    const { rc_token, rc_uid, host } = req.body;
    if (!rc_token || !rc_uid || !host) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    // Generate a simple session ID
    const sessionId = Math.random().toString(36).substring(2, 15);
    sessions[sessionId] = { rc_token, rc_uid, host };

    // Set HTTP-only cookie
    res.cookie('ec_session', sessionId, {
      httpOnly: true,
      secure: false, // For local Storybook (http://localhost:6006)
      sameSite: 'lax',
      path: '/',
    });

    res.json({ success: true });
  });

  // 2. Image Proxy Endpoint
  app.get('/api/proxy-media', async (req, res) => {
    const { url } = req.query;
    if (!url) {
      return res.status(400).send('Missing url parameter');
    }

    // Parse cookies manually to avoid needing cookie-parser
    const cookieHeader = req.headers.cookie || '';
    const cookies = cookieHeader.split(';').reduce((acc, cookieStr) => {
      const [key, val] = cookieStr.split('=').map((s) => s.trim());
      if (key && val) acc[key] = val;
      return acc;
    }, {});

    const sessionId = cookies['ec_session'];
    const session = sessionId ? sessions[sessionId] : null;

    const headers = new Headers();
    if (session) {
      headers.append('X-Auth-Token', session.rc_token);
      headers.append('X-User-Id', session.rc_uid);
    }

    try {
      // Fetch the file from the remote Rocket.Chat server
      const proxyRes = await fetch(url, { headers });

      if (!proxyRes.ok) {
        return res.status(proxyRes.status).send('RC Server returned an error');
      }

      // Copy relevant headers (Content-Type, Content-Length)
      const contentType = proxyRes.headers.get('content-type');
      const contentLength = proxyRes.headers.get('content-length');
      if (contentType) res.setHeader('Content-Type', contentType);
      if (contentLength) res.setHeader('Content-Length', contentLength);

      // Pipe the stream using Node API
      // proxyRes.body is a web stream in Node 18+, convert to Node stream if needed or use Response.arrayBuffer
      const arrayBuffer = await proxyRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    } catch (e) {
      console.error('Proxy Fetch Error:', e);
      res.status(500).send('Proxy backend error');
    }
  });
};
