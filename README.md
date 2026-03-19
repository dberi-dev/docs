# Dberi Documentation

Official documentation for the Dberi Payment Platform.

## Setup

Install dependencies:

```bash
npm install
# or
bun install
```

## Development

Run the docs development server:

```bash
npm run dev
```

This will start the docs at `http://localhost:5173`

## Build

Build the documentation for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Tech Stack

- [VitePress](https://vitepress.dev/) - Documentation site generator
- Markdown - Content format

## Project Structure

```
docs/
 .vitepress/
    config.js          # VitePress configuration
 api/                   # API reference pages
    overview.md
    users.md
    merchants.md
    ...
 concepts/              # Conceptual documentation
 guides/                # Step-by-step guides
 index.md               # Homepage
 quickstart.md          # Quick start guide
```

## Contributing

To add a new page:

1. Create a `.md` file in the appropriate directory
2. Add it to the sidebar in `.vitepress/config.js`
3. Write content in Markdown

## Deployment

The documentation can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

Just point the deployment to this directory and run `npm run build`.
