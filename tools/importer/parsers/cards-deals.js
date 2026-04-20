/* eslint-disable */
/* global WebImporter */
/** Parser for cards-deals. Base: cards. Source: https://www.boostmobile.com/plans. Device deals section. */
export default function parse(element, { document }) {
  // Source DOM: .contentcardshelf with .card-container items for device deals
  // Each card has: savings badge, device image, device name, pricing, CTA
  const cards = element.querySelectorAll('.card-container');
  const cells = [];

  cards.forEach((card) => {
    // Image cell - device image
    const img = card.querySelector('img.cmp-image__image, img.cmp-container__background-content');
    const imageCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.appendChild(newImg);
    }

    // Content cell
    const contentCell = document.createElement('div');

    // Device/deal name from bold text or heading
    const titleEl = card.querySelector('.cmp-text__text-weight-bold, .cmp-text__text-24-desktop');
    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      contentCell.appendChild(h3);
    }

    // Pricing/promo text
    const textBlocks = card.querySelectorAll('.cmp-text');
    const seen = new Set();
    textBlocks.forEach((tb) => {
      const text = tb.textContent.trim();
      if (text && text.length > 3 && text.length < 300 && !seen.has(text)) {
        seen.add(text);
        const p = document.createElement('p');
        p.textContent = text;
        contentCell.appendChild(p);
      }
    });

    // CTA links
    const ctas = card.querySelectorAll('a.cmp-button');
    ctas.forEach((cta) => {
      const text = cta.textContent.trim();
      if (text && cta.href) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = cta.href;
        a.textContent = text;
        p.appendChild(a);
        contentCell.appendChild(p);
      }
    });

    if (contentCell.children.length > 0) {
      if (img) {
        cells.push([imageCell, contentCell]);
      } else {
        cells.push([contentCell]);
      }
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-deals', cells });
    element.replaceWith(block);
  }
}
