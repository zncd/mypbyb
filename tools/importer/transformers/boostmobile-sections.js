/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Boost Mobile section breaks and section metadata.
 * Uses content landmarks since AEM container IDs are dynamic.
 * Runs in afterTransform only. Uses text landmarks as fallback for dynamic IDs.
 */

function findByText(element, tag, text) {
  const els = element.querySelectorAll(tag);
  for (const el of els) {
    if (el.textContent.trim().toLowerCase().includes(text.toLowerCase())) {
      return el;
    }
  }
  return null;
}

function findSectionAnchor(element, section) {
  // Try selector first
  const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectorList) {
    try {
      const found = element.querySelector(sel);
      if (found) return found;
    } catch (e) { /* skip invalid */ }
  }
  return null;
}

function findClosestContainer(el) {
  let parent = el;
  while (parent && parent.parentElement) {
    parent = parent.parentElement;
    if (parent.classList && (
      parent.classList.contains('cmp-container__margin-64')
      || parent.classList.contains('cmp-container__full-width')
      || parent.classList.contains('content-width')
    )) return parent;
  }
  return el.parentElement || el;
}

export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const doc = element.ownerDocument || document;
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    // Content-based landmark map for sections without stable selectors
    const landmarks = {
      'section-1': () => findByText(element, 'span', 'Phone Plans'),
      'section-4': () => findByText(element, 'h2', 'Compare Plans'),
      'section-5': () => findByText(element, 'h2', 'CUSTOMIZE YOUR PLAN'),
      'section-7': () => findByText(element, 'h2', 'FAQs'),
      'section-8': () => {
        // Legal disclaimers — find a large text block with legal content
        const allText = element.querySelectorAll('.cmp-text');
        for (const t of allText) {
          const txt = t.textContent;
          if (txt.length > 300 && (txt.includes('*') || txt.includes('Terms') || txt.includes('service'))) return t;
        }
        return null;
      },
    };

    const sections = template.sections;
    const anchors = [];

    for (const section of sections) {
      let el = findSectionAnchor(element, section);
      if (!el && landmarks[section.id]) {
        const landmark = landmarks[section.id]();
        if (landmark) el = findClosestContainer(landmark);
      }
      anchors.push({ section, el });
    }

    // Process in reverse order to preserve DOM positions
    for (let i = anchors.length - 1; i >= 0; i--) {
      const { section, el } = anchors[i];
      if (!el) continue;

      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        el.after(metaBlock);
      }

      if (i > 0) {
        const hr = doc.createElement('hr');
        el.before(hr);
      }
    }
  }
}
