# Second Brain App Specification

## Overview
A document viewer app that displays markdown files from Zach's second brain. The UI should feel like a mix of Obsidian (knowledge graph vibes, sidebar navigation) and Linear (clean, modern, fast, beautiful typography).

## Design Language
- **Dark theme** — Deep blacks (#0a0a0f), charcoal grays (#18181b, #27272a)
- **Accent color** — Soft purple/violet (#8b5cf6) for highlights and interactive elements
- **Typography** — Clean, readable. Use Inter or system fonts. Good hierarchy.
- **Feel** — Minimal, fast, focused. Like a premium productivity tool.

## Layout
```
┌─────────────────────────────────────────────────────────────┐
│  🧠 Second Brain                              [search] [⚙]  │
├──────────────────┬──────────────────────────────────────────┤
│                  │                                          │
│  📁 Concepts     │  # Document Title                        │
│    └─ doc1.md    │                                          │
│    └─ doc2.md    │  Document content rendered as markdown   │
│                  │  with beautiful typography...            │
│  📁 Journals     │                                          │
│    └─ 2026-02-05 │  ## Section Header                       │
│                  │                                          │
│  📁 Research     │  More content here...                    │
│    └─ report.md  │                                          │
│                  │                                          │
│  📁 Projects     │                                          │
│    └─ ...        │                                          │
│                  │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

## Features

### Sidebar (Left Panel)
- Collapsible folder structure
- Folders: concepts, journals, research, projects
- Files listed under each folder
- Active file highlighted
- Click to open document
- Folder icons (📁) and document icons (📄)

### Document Viewer (Main Panel)
- Renders markdown beautifully
- Supports: headings, lists, code blocks, links, bold/italic, blockquotes
- Good line height and spacing
- Soft scrollbar styling
- Document title at top
- Show file metadata (date modified, word count)

### Header
- App title with emoji: "🧠 Second Brain"
- Search input (filters documents by name/content)
- Settings gear icon (placeholder for now)

### Document Source
Read markdown files from: `/Users/maxbot/.openclaw/workspace/second-brain/`

The app should:
1. Scan this directory recursively for .md files
2. Parse frontmatter (if any) using gray-matter
3. Render content using react-markdown with remark-gfm

## Technical Notes
- Use Next.js App Router
- Server components for file reading
- Client components for interactivity
- Use `fs` to read from the document directory
- Cache document list with revalidation

## File Structure
```
src/
  app/
    page.tsx          # Main layout with sidebar + viewer
    api/
      documents/
        route.ts      # GET endpoint to list all documents
      document/
        [path]/
          route.ts    # GET endpoint to fetch single document
  components/
    Sidebar.tsx       # Folder tree navigation
    DocumentViewer.tsx # Markdown renderer
    SearchBar.tsx     # Document search
  lib/
    documents.ts      # File system utilities
  styles/
    globals.css       # Dark theme styles
```

## Build Priority
1. Basic layout with sidebar and viewer
2. Document listing and navigation
3. Markdown rendering
4. Search functionality
5. Polish (animations, hover states, etc.)
