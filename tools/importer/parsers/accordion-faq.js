/* eslint-disable */
/* global WebImporter */
/** Parser for accordion-faq. Base: accordion. Source: https://www.boostmobile.com/plans. FAQ section. */
export default function parse(element, { document }) {
  // Source DOM: .accordion.panelcontainer containing .cmp-accordion with .cmp-accordion__item children
  // Each item has: .cmp-accordion__header (question) and .cmp-accordion__panel (answer)
  // Accordion structure: each row = 2 columns [title | body content]
  const items = element.querySelectorAll('.cmp-accordion__item');
  const cells = [];

  items.forEach((item) => {
    const titleEl = item.querySelector('.cmp-accordion__title');
    const bodyEl = item.querySelector('.cmp-accordion__panel');

    if (titleEl) {
      const title = document.createElement('p');
      title.textContent = titleEl.textContent.trim();

      const body = document.createElement('div');
      if (bodyEl) {
        // Select only innermost p elements to avoid duplication from .cmp-text wrappers
        const paragraphs = bodyEl.querySelectorAll('p');
        if (paragraphs.length > 0) {
          paragraphs.forEach((p) => {
            const text = p.textContent.trim();
            if (text) {
              const newP = document.createElement('p');
              newP.textContent = text;
              body.appendChild(newP);
            }
          });
        } else {
          const text = bodyEl.textContent.trim();
          if (text) {
            const newP = document.createElement('p');
            newP.textContent = text;
            body.appendChild(newP);
          }
        }
      }

      cells.push([title, body]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
    element.replaceWith(block);
  }
}
