/* eslint-disable */
/* global WebImporter */
/** Parser for cards-compare. Base: cards. Source: https://www.boostmobile.com/plans. Compare Plans section. */
export default function parse(element, { document }) {
  // Source DOM: .contentcardshelf with .card-container items for plan comparison
  // Each card has: plan name, price, feature rows, CTA buttons
  const cards = element.querySelectorAll('.card-container');
  const cells = [];

  cards.forEach((card) => {
    const container = document.createElement('div');

    // Plan name
    const planName = card.querySelector('.cmp-text__sparky-orange, .cmp-text__text-24-desktop');
    if (planName) {
      const h3 = document.createElement('h3');
      h3.textContent = planName.textContent.trim();
      container.appendChild(h3);
    }

    // Price
    const allBold = card.querySelectorAll('.cmp-text__text-weight-bold');
    for (const b of allBold) {
      const text = b.textContent.trim();
      if (text.includes('$') && text.includes('/mo')) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${text}</strong>`;
        container.appendChild(p);
        break;
      }
    }

    // Feature rows - collect all .cmp-text paragraphs that are feature descriptions
    const textBlocks = card.querySelectorAll('.cmp-text');
    const seen = new Set();
    textBlocks.forEach((tb) => {
      const text = tb.textContent.trim();
      if (text && text.length > 2 && text.length < 200 && !seen.has(text) && !text.includes('/mo')) {
        seen.add(text);
        const p = document.createElement('p');
        p.textContent = text;
        container.appendChild(p);
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
        container.appendChild(p);
      }
    });

    if (container.children.length > 0) {
      cells.push([container]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-compare', cells });
    element.replaceWith(block);
  }
}
