/* eslint-disable */
/* global WebImporter */
/** Parser for tabs-plan-nav. Base: tabs. Source: https://www.boostmobile.com/plans */
export default function parse(element, { document }) {
  // Source DOM: <p> with <span class="cmp-text__sparky-orange">Phone Plans</span>
  // and <a> links for Tablet Plans, Watch Plans
  const cells = [];
  const links = element.querySelectorAll('a[href]');
  const activeText = element.querySelector('.cmp-text__sparky-orange');

  // Active tab (Phone Plans - no link, just text)
  if (activeText) {
    const label = document.createElement('p');
    label.textContent = activeText.textContent.trim();
    const content = document.createElement('p');
    content.textContent = 'Active tab';
    cells.push([label, content]);
  }

  // Other tabs (linked)
  links.forEach((link) => {
    const label = document.createElement('p');
    label.textContent = link.textContent.trim();
    const content = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim();
    content.appendChild(a);
    cells.push([label, content]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-plan-nav', cells });
  element.replaceWith(block);
}
