/**
 * codebase-memory-mcp CLI wrapper for nointro project
 * Usage: node cbm.js <tool> [args as JSON]
 * Example: node cbm.js search_graph '{"name_pattern":".*Hls.*"}'
 */
const { execFileSync } = require('child_process');
const path = require('path');

const EXE = path.join(
  process.env.LOCALAPPDATA,
  'Programs', 'codebase-memory-mcp', 'codebase-memory-mcp.exe'
);
const REPO = 'C:/Users/sonib/Desktop/nointro';
const PROJECT_NAME = 'C-Users-sonib-Desktop-nointro';

const [,, tool, argsStr] = process.argv;
if (!tool) {
  console.log('Usage: node cbm.js <tool> [json-args]');
  console.log('Tools: search_graph, trace_path, get_code_snippet, get_architecture,');
  console.log('       query_graph, search_code, detect_changes, list_projects, index_repository');
  process.exit(0);
}

let args = {};
if (argsStr) {
  try { args = JSON.parse(argsStr); } catch { args = {}; }
}

// Map appropriate key based on tool type
if (tool === 'index_repository') {
  if (!args.repo_path) {
    args.repo_path = REPO;
  }
} else if (tool !== 'list_projects') {
  if (!args.project) {
    args.project = PROJECT_NAME;
  }
}

try {
  const result = execFileSync(EXE, ['cli', tool, JSON.stringify(args)], {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const parsed = JSON.parse(result.trim());
  console.log(JSON.stringify(parsed, null, 2));
} catch (e) {
  const stderr = e.stderr || '';
  const out = stderr.split('\n').find(l => l.startsWith('{'));
  if (out) {
    try { console.log(JSON.stringify(JSON.parse(out), null, 2)); } catch { console.log(out); }
  } else {
    console.error(e.message);
  }
}
