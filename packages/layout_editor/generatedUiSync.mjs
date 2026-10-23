import { randomUUID } from 'node:crypto';
import { mkdir, rename, writeFile, unlink } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MAX_GENERATED_UI_BYTES,
  validateGeneratedUiConfiguration,
} from '@embeddedchat/ui-kit/generated-ui.mjs';

const fixturePath = fileURLToPath(
  new URL('./src/fixtures/generatedUiPreview.js', import.meta.url)
);
const sendJson = (response, status, body) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
};

export const writePreviewFixture = async (
  configuration,
  destination = fixturePath
) => {
  const temporaryPath = `${destination}.${randomUUID()}.tmp`;
  try {
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(
      temporaryPath,
      `// Automatically synced from the Layout Editor component generator.\nexport const generatedUiPreview = ${JSON.stringify(
        configuration,
        null,
        2
      )};\n`,
      'utf8'
    );
    await rename(temporaryPath, destination);
  } finally {
    await unlink(temporaryPath).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
};

export const createGeneratedUiSyncMiddleware = (
  writePreview = writePreviewFixture
) => {
  // Serialize writes so two successful sync requests cannot finish out of order.
  let writes = Promise.resolve();
  return async (request, response, next) => {
    if ((request.url || '/').split('?')[0] !== '/__generated-ui-preview')
      return next();
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      return sendJson(response, 405, { error: 'Use POST to sync a preview.' });
    }
    const protocol = request.socket?.encrypted ? 'https:' : 'http:';
    const expectedOrigin = `${protocol}//${request.headers.host}`;
    let localOrigin = false;
    try {
      localOrigin = ['localhost', '127.0.0.1', '[::1]'].includes(
        new URL(expectedOrigin).hostname
      );
    } catch {
      /* Invalid Host. */
    }
    if (
      !localOrigin ||
      !request.headers.origin ||
      request.headers.origin !== expectedOrigin ||
      request.headers['sec-fetch-site'] === 'cross-site'
    ) {
      return sendJson(response, 403, {
        error: 'Preview sync requires a same-origin request on localhost.',
      });
    }
    if (
      request.headers['content-type']?.split(';')[0].trim().toLowerCase() !==
      'application/json'
    ) {
      return sendJson(response, 415, {
        error: 'Preview sync requires application/json.',
      });
    }
    if (Number(request.headers['content-length']) > MAX_GENERATED_UI_BYTES)
      return sendJson(response, 413, {
        error: 'Preview payload is too large.',
      });
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of request) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.length;
        if (size > MAX_GENERATED_UI_BYTES)
          return sendJson(response, 413, {
            error: 'Preview payload is too large.',
          });
        chunks.push(buffer);
      }
      let configuration;
      try {
        configuration = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch {
        return sendJson(response, 400, {
          error: 'Preview payload must be valid JSON.',
        });
      }
      const { errors } = validateGeneratedUiConfiguration(configuration);
      if (errors.length)
        return sendJson(response, 400, { error: errors.join(' ') });
      const write = writes.then(() => writePreview(configuration));
      writes = write.catch(() => {});
      await write;
      return sendJson(response, 200, { ok: true });
    } catch {
      if (!response.headersSent)
        return sendJson(response, 500, {
          error:
            'Unable to write the local preview fixture. Check filesystem permissions and retry.',
        });
      return undefined;
    }
  };
};

export const generatedUiPreviewSyncPlugin = () => ({
  name: 'generated-ui-preview-sync',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use(createGeneratedUiSyncMiddleware());
  },
});
