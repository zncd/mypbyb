/* eslint-disable */
/* global WebImporter */
/** Parser for cards-pricing. Base: cards. Source: https://www.boostmobile.com/plans */
export default function parse(element, { document }) {
  // Source DOM: .contentcardshelf containing .card-container items
  // Each card has: plan name, price, feature icon list (img + text), CTA buttons
  // Cards structure: 1 column per row [heading, features with icons, links]
  const cards = element.querySelectorAll('.card-container');
  const cells = [];

  cards.forEach((card) => {
    const container = document.createElement('div');

    // Plan name (bold colored text, e.g., "Unlimited")
    const planNameEl = card.querySelector('.cmp-text__sparky-orange');
    if (planNameEl) {
      const h3 = document.createElement('h3');
      h3.textContent = planNameEl.textContent.trim();
      container.appendChild(h3);
    }

    // Price (bold text with $/mo)
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

    // Subtitle text (e.g., "for the first 3 months, then $25 forever")
    const subtitleSpans = card.querySelectorAll('.cmp-text__text-12-mobile, .cmp-text__text-10-mobile');
    const seenSubtitles = new Set();
    subtitleSpans.forEach((sub) => {
      const text = sub.textContent.trim();
      if (text && text.length > 5 && text.length < 150 && !seenSubtitles.has(text)) {
        seenSubtitles.add(text);
        const p = document.createElement('p');
        p.textContent = text;
        container.appendChild(p);
      }
    });

    // Feature icons with images — each feature has an img + text inside a container
    // DOM structure: parent div > child divs each containing img + text span
    const featureContainers = card.querySelectorAll('.cmp-image__image');
    const seenFeatures = new Set();
    featureContainers.forEach((img) => {
      // Walk up to find the feature row container that has both img and text
      const featureRow = img.closest('div[class*="aem-Grid"]')
        ? img.parentElement?.parentElement?.parentElement
        : img.parentElement?.parentElement;

      if (featureRow) {
        const altText = img.alt || '';
        const rowText = featureRow.textContent.trim();
        // Use the feature text or alt text as identifier to avoid duplicates
        const key = altText || rowText;
        if (key && !seenFeatures.has(key) && altText) {
          seenFeatures.add(key);
          const p = document.createElement('p');
          const newImg = document.createElement('img');
          newImg.src = img.src;
          newImg.alt = altText;
          p.appendChild(newImg);
          p.appendChild(document.createTextNode(' ' + (rowText || altText)));
          container.appendChild(p);
        }
      }
    });

    // Multiline promo links (e.g., "Buy 2 Lines, Get $20 Off")
    const promoLinks = card.querySelectorAll('a[href*="multiline"]');
    promoLinks.forEach((link) => {
      const text = link.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = text;
        p.appendChild(a);
        container.appendChild(p);
      }
    });

    // CTA buttons/links (Plan Details, Select Plan)
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

    // Handle Chime partnership card (has background images, no plan name)
    if (!planNameEl && card.querySelector('.cmp-container__background-content')) {
      const bgImg = card.querySelector('.cmp-container__background-content');
      if (bgImg && bgImg.src) {
        const imgEl = document.createElement('img');
        imgEl.src = bgImg.src;
        imgEl.alt = bgImg.alt || 'Promotional card';
        container.insertBefore(imgEl, container.firstChild);
      }
      // Chime logos
      const chimeLogo = card.querySelector('img[alt*="Chime"], img[alt*="chime"]');
      if (chimeLogo) {
        const p = document.createElement('p');
        const logoImg = document.createElement('img');
        logoImg.src = chimeLogo.src;
        logoImg.alt = chimeLogo.alt;
        p.appendChild(logoImg);
        container.insertBefore(p, container.children[1] || null);
      }
    }

    if (container.children.length > 0) {
      cells.push([container]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pricing', cells });
    element.replaceWith(block);
  }
}
