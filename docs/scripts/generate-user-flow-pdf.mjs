#!/usr/bin/env node
/**
 * Generates docs/APPLICATION_USER_FLOW_DOCUMENTATION.pdf from the markdown source.
 * Usage: node docs/scripts/generate-user-flow-pdf.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, '..');
const mdPath = join(docsDir, 'APPLICATION_USER_FLOW_DOCUMENTATION.md');
const pdfPath = join(docsDir, 'APPLICATION_USER_FLOW_DOCUMENTATION.pdf');
const htmlPath = join(docsDir, 'APPLICATION_USER_FLOW_DOCUMENTATION.html');

const md = readFileSync(mdPath, 'utf8');

marked.setOptions({ gfm: true, breaks: false });
const bodyHtml = marked.parse(md);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Rasoi — Application User Flow Documentation</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 20mm 16mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1a1a1a;
      max-width: 100%;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-size: 22pt;
      color: #0A0908;
      border-bottom: 3px solid #FF6B35;
      padding-bottom: 8px;
      margin-top: 0;
      page-break-after: avoid;
    }
    h2 {
      font-size: 14pt;
      color: #2d2d2d;
      border-bottom: 1px solid #e0d8d0;
      padding-bottom: 4px;
      margin-top: 24px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 11.5pt;
      color: #444;
      margin-top: 18px;
      page-break-after: avoid;
    }
    p, li { orphans: 3; widows: 3; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      margin: 12px 0 16px;
      page-break-inside: auto;
    }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; page-break-after: auto; }
    th {
      background: #FF6B35;
      color: #fff;
      text-align: left;
      padding: 7px 8px;
      font-weight: 600;
    }
    td {
      border: 1px solid #e8e0d8;
      padding: 6px 8px;
      vertical-align: top;
    }
    tr:nth-child(even) td { background: #faf8f5; }
    code {
      font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace;
      font-size: 8.5pt;
      background: #f4f0eb;
      padding: 1px 4px;
      border-radius: 3px;
    }
    hr {
      border: none;
      border-top: 1px solid #e0d8d0;
      margin: 20px 0;
    }
    strong { color: #0A0908; }
    ul, ol { padding-left: 20px; }
    li { margin-bottom: 4px; }
    .cover {
      text-align: center;
      padding: 60px 20px 40px;
      page-break-after: always;
    }
    .cover h1 {
      border: none;
      font-size: 28pt;
      margin-bottom: 8px;
    }
    .cover .subtitle {
      font-size: 14pt;
      color: #666;
      margin-bottom: 32px;
    }
    .cover .meta {
      font-size: 11pt;
      color: #888;
      line-height: 1.8;
    }
    .cover .brand {
      display: inline-block;
      background: #FF6B35;
      color: white;
      padding: 6px 18px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 12pt;
      margin-bottom: 24px;
    }
    footer.doc-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 8pt;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="cover">
    <div class="brand">Rasoi</div>
    <h1>Application User Flow Documentation</h1>
    <p class="subtitle">Complete navigation, auth, and screen inventory</p>
    <p class="meta">
      Generated: July 3, 2026<br/>
      Repositories: rasoi_mobile + rasoi_backend<br/>
      Analysis type: Read-only codebase trace
    </p>
  </div>
  <main>${bodyHtml}</main>
</body>
</html>`;

writeFileSync(htmlPath, html, 'utf8');
console.log('Wrote HTML:', htmlPath);

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `
      <div style="width:100%;font-size:8px;color:#999;text-align:center;padding:0 16mm;">
        Rasoi Application User Flow Documentation — Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>`,
    margin: { top: '16mm', bottom: '22mm', left: '16mm', right: '16mm' },
  });
  console.log('Wrote PDF:', pdfPath);
} finally {
  await browser.close();
}
