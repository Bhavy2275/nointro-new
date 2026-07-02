<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Codebase Knowledge Graph Maintenance

Whenever you create, modify, or delete source files (such as React components, hooks, or pages) in this workspace, you must run the codebase-memory-mcp indexer command immediately to keep the knowledge graph synchronized:
```bash
node cbm.js index_repository
```

