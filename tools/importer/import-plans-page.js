/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import tabsPlanNavParser from './parsers/tabs-plan-nav.js';
import cardsPricingParser from './parsers/cards-pricing.js';
import cardsCompareParser from './parsers/cards-compare.js';
import heroBannerParser from './parsers/hero-banner.js';
import cardsDealsParser from './parsers/cards-deals.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import boostmobileCleanupTransformer from './transformers/boostmobile-cleanup.js';
import boostmobileSectionsTransformer from './transformers/boostmobile-sections.js';

// PARSER REGISTRY
const parsers = {
  'tabs-plan-nav': tabsPlanNavParser,
  'cards-pricing': cardsPricingParser,
  'cards-compare': cardsCompareParser,
  'hero-banner': heroBannerParser,
  'cards-deals': cardsDealsParser,
  'accordion-faq': accordionFaqParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'plans-page',
  description: 'Plans listing page showing mobile plan options and pricing',
  urls: [
    'https://www.boostmobile.com/plans',
    'https://www.boostmobile.com/plans/byod',
  ],
  blocks: [
    {
      name: 'tabs-plan-nav',
      instances: ['#text-442f0bc3bf'],
    },
    {
      name: 'cards-pricing',
      instances: [
        '.cmp-experiencefragment--unlimited-plan-cards .contentcardshelf',
        '.cmp-experiencefragment--infinite-access-plan-cards .contentcardshelf',
      ],
    },
    {
      name: 'cards-compare',
      instances: ['.cmp-container__margin-64 > .cmp-container > .aem-Grid > .contentcardshelf'],
    },
    {
      name: 'hero-banner',
      instances: ['.cmp-container__full-width.cmp-container__padding-top-0.cmp-container__padding-bottom-0'],
    },
    {
      name: 'cards-deals',
      instances: ['.cmp-experiencefragment--special-deals .contentcardshelf'],
    },
    {
      name: 'accordion-faq',
      instances: ['.accordion.panelcontainer'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Plan Navigation and Hero',
      selector: '#text-442f0bc3bf',
      style: null,
      blocks: ['tabs-plan-nav'],
      defaultContent: ['h1'],
    },
    {
      id: 'section-2',
      name: 'Connect More Spend Less',
      selector: '.cmp-experiencefragment--unlimited-plan-cards',
      style: null,
      blocks: ['cards-pricing'],
      defaultContent: ['h2', 'p', '.cmp-button'],
    },
    {
      id: 'section-3',
      name: 'Buy Now Pay Later Plans',
      selector: '.cmp-experiencefragment--infinite-access-plan-cards',
      style: null,
      blocks: ['cards-pricing'],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-4',
      name: 'Compare Plans',
      selector: '#container-72f957f771',
      style: null,
      blocks: ['cards-compare'],
      defaultContent: ['h2', 'p'],
    },
    {
      id: 'section-5',
      name: 'Customize Your Plan Banner',
      selector: '#container-4a1c264453',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Save When You Shop Online',
      selector: '.cmp-experiencefragment--special-deals',
      style: null,
      blocks: ['cards-deals'],
      defaultContent: ['h2', '.cmp-button'],
    },
    {
      id: 'section-7',
      name: 'FAQs',
      selector: '#container-fb2ea01c96',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['h2'],
    },
    {
      id: 'section-8',
      name: 'Legal Disclaimers',
      selector: '#container-cd78c3adfe',
      style: null,
      blocks: [],
      defaultContent: ['p'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  boostmobileCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [boostmobileSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
