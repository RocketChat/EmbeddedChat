/**
 * POC: GSoC 2026 - Stack Modernization & API Audit Tool
 * This script demonstrates the automated assessment mechanism for upgrading 
 * EmbeddedChat to modern versions (Node 20, React 18, latest Rocket.Chat APIs).
 */

const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const packagePath = path.join(rootDir, 'package.json');
const reactPkgPath = path.join(rootDir, 'packages/react/package.json');

console.log('--- EmbeddedChat 2026: Upgrade & API Audit POC ---\n');

function auditPackageJson(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.error(`[Error] ${label} package.json not found.`);
    return;
  }
  const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`[Audit] Scanning ${label}...`);
  console.log(`  - Name: ${pkg.name}`);
  console.log(`  - Current Version: ${pkg.version}`);
  
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const criticalUpdates = [
    { name: 'react', target: '^18.3.0', reason: 'Modernization requirement' },
    { name: 'node', target: '>=20.0.0', reason: 'LTS requirement' },
    { name: '@rocket.chat/sdk', target: '^1.0.0', reason: 'API Unified schema support' },
    { name: 'eslint', target: '^8.0.0', reason: 'Compatibility with React 18 plugins' }
  ];

  criticalUpdates.forEach(update => {
    const current = deps[update.name] || 'Not found';
    const status = (current === update.target) ? 'OK' : 'NEEDS UPGRADE';
    console.log(`  - ${update.name.padEnd(16)}: ${current.padEnd(10)} -> Target: ${update.target.padEnd(10)} [${status}]`);
  });
}

function scanForDeprecatedPatterns(dir) {
  const patterns = [
    { regex: /ReactDOM\.render/g, name: 'ReactDOM.render', fix: 'createRoot (React 18)' },
    { regex: /componentWillReceiveProps/g, name: 'Legacy Lifecycle', fix: 'getDerivedStateFromProps' },
    { regex: /stream-room-messages/g, name: 'Legacy WS Subscription', fix: 'Realtime API v2' }
  ];

  console.log('\n[Code Audit] Scanning for deprecated patterns in src/ ...');

  const files = getAllFiles(dir).filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
  const findings = [];

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    patterns.forEach(p => {
      if (p.regex.test(content)) {
        findings.push(`[${p.name}] found in ${path.relative(rootDir, file)}. Suggested fix: ${p.fix}`);
      }
    });
  });

  if (findings.length > 0) {
    findings.slice(0, 5).forEach(f => console.log(`  ! ${f}`));
    if (findings.length > 5) console.log(`  ... and ${findings.length - 5} more findings.`);
  } else {
    console.log('  - No deprecated patterns found in the sampled files.');
  }
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

auditPackageJson(packagePath, 'Root Monorepo');
auditPackageJson(reactPkgPath, 'React Package');
scanForDeprecatedPatterns(path.join(rootDir, 'packages/react/src'));

console.log('\n[Conclusion] Automated audit complete. Summary generated for GSoC 2026 Roadmap.');
