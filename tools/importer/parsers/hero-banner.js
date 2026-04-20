/* eslint-disable */
/* global WebImporter */
/** Parser for hero-banner. Base: hero. Source: https://www.boostmobile.com/plans. Customize Your Plan banner. */
export default function parse(element, { document }) {
  // Source DOM: Container with "CUSTOMIZE YOUR PLAN WITH ADD-ONS" heading + "View Add-Ons" CTA
  // on an orange gradient background
  // Hero structure: Row 1 = [background image], Row 2 = [heading, text, CTA]
  const cells = [];

  // Content cell: heading + CTA
  const contentCell = [];

  // Find the CUSTOMIZE heading
  const headings = element.querySelectorAll('h2');
  for (const h of headings) {
    if (h.textContent.includes('CUSTOMIZE')) {
      const h2 = document.createElement('h2');
      h2.textContent = h.textContent.trim();
      contentCell.push(h2);
      break;
    }
  }

  // Find the View Add-Ons CTA
  const ctas = element.querySelectorAll('a.cmp-button');
  for (const cta of ctas) {
    const text = cta.textContent.trim();
    if (text.includes('Add-Ons') && cta.href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = text;
      p.appendChild(a);
      contentCell.push(p);
      break;
    }
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
    element.replaceWith(block);
  }
}
