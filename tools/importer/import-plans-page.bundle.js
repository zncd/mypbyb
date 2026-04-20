var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-plans-page.js
  var import_plans_page_exports = {};
  __export(import_plans_page_exports, {
    default: () => import_plans_page_default
  });

  // tools/importer/parsers/tabs-plan-nav.js
  function parse(element, { document: document2 }) {
    const cells = [];
    const links = element.querySelectorAll("a[href]");
    const activeText = element.querySelector(".cmp-text__sparky-orange");
    if (activeText) {
      const label = document2.createElement("p");
      label.textContent = activeText.textContent.trim();
      const content = document2.createElement("p");
      content.textContent = "Active tab";
      cells.push([label, content]);
    }
    links.forEach((link) => {
      const label = document2.createElement("p");
      label.textContent = link.textContent.trim();
      const content = document2.createElement("p");
      const a = document2.createElement("a");
      a.href = link.href;
      a.textContent = link.textContent.trim();
      content.appendChild(a);
      cells.push([label, content]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-plan-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-pricing.js
  function parse2(element, { document: document2 }) {
    const cards = element.querySelectorAll(".card-container");
    const cells = [];
    cards.forEach((card) => {
      const container = document2.createElement("div");
      const planNameEl = card.querySelector(".cmp-text__sparky-orange");
      if (planNameEl) {
        const h3 = document2.createElement("h3");
        h3.textContent = planNameEl.textContent.trim();
        container.appendChild(h3);
      }
      const allBold = card.querySelectorAll(".cmp-text__text-weight-bold");
      for (const b of allBold) {
        const text = b.textContent.trim();
        if (text.includes("$") && text.includes("/mo")) {
          const p = document2.createElement("p");
          p.innerHTML = `<strong>${text}</strong>`;
          container.appendChild(p);
          break;
        }
      }
      const subtitleSpans = card.querySelectorAll(".cmp-text__text-12-mobile, .cmp-text__text-10-mobile");
      const seenSubtitles = /* @__PURE__ */ new Set();
      subtitleSpans.forEach((sub) => {
        const text = sub.textContent.trim();
        if (text && text.length > 5 && text.length < 150 && !seenSubtitles.has(text)) {
          seenSubtitles.add(text);
          const p = document2.createElement("p");
          p.textContent = text;
          container.appendChild(p);
        }
      });
      const featureContainers = card.querySelectorAll(".cmp-image__image");
      const seenFeatures = /* @__PURE__ */ new Set();
      featureContainers.forEach((img) => {
        var _a, _b, _c;
        const featureRow = img.closest('div[class*="aem-Grid"]') ? (_b = (_a = img.parentElement) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement : (_c = img.parentElement) == null ? void 0 : _c.parentElement;
        if (featureRow) {
          const altText = img.alt || "";
          const rowText = featureRow.textContent.trim();
          const key = altText || rowText;
          if (key && !seenFeatures.has(key) && altText) {
            seenFeatures.add(key);
            const p = document2.createElement("p");
            const newImg = document2.createElement("img");
            newImg.src = img.src;
            newImg.alt = altText;
            p.appendChild(newImg);
            p.appendChild(document2.createTextNode(" " + (rowText || altText)));
            container.appendChild(p);
          }
        }
      });
      const promoLinks = card.querySelectorAll('a[href*="multiline"]');
      promoLinks.forEach((link) => {
        const text = link.textContent.trim();
        if (text) {
          const p = document2.createElement("p");
          const a = document2.createElement("a");
          a.href = link.href;
          a.textContent = text;
          p.appendChild(a);
          container.appendChild(p);
        }
      });
      const ctas = card.querySelectorAll("a.cmp-button");
      ctas.forEach((cta) => {
        const text = cta.textContent.trim();
        if (text && cta.href) {
          const p = document2.createElement("p");
          const a = document2.createElement("a");
          a.href = cta.href;
          a.textContent = text;
          p.appendChild(a);
          container.appendChild(p);
        }
      });
      if (!planNameEl && card.querySelector(".cmp-container__background-content")) {
        const bgImg = card.querySelector(".cmp-container__background-content");
        if (bgImg && bgImg.src) {
          const imgEl = document2.createElement("img");
          imgEl.src = bgImg.src;
          imgEl.alt = bgImg.alt || "Promotional card";
          container.insertBefore(imgEl, container.firstChild);
        }
        const chimeLogo = card.querySelector('img[alt*="Chime"], img[alt*="chime"]');
        if (chimeLogo) {
          const p = document2.createElement("p");
          const logoImg = document2.createElement("img");
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
      const block = WebImporter.Blocks.createBlock(document2, { name: "cards-pricing", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-compare.js
  function parse3(element, { document: document2 }) {
    const cards = element.querySelectorAll(".card-container");
    const cells = [];
    cards.forEach((card) => {
      const container = document2.createElement("div");
      const planName = card.querySelector(".cmp-text__sparky-orange, .cmp-text__text-24-desktop");
      if (planName) {
        const h3 = document2.createElement("h3");
        h3.textContent = planName.textContent.trim();
        container.appendChild(h3);
      }
      const allBold = card.querySelectorAll(".cmp-text__text-weight-bold");
      for (const b of allBold) {
        const text = b.textContent.trim();
        if (text.includes("$") && text.includes("/mo")) {
          const p = document2.createElement("p");
          p.innerHTML = `<strong>${text}</strong>`;
          container.appendChild(p);
          break;
        }
      }
      const textBlocks = card.querySelectorAll(".cmp-text");
      const seen = /* @__PURE__ */ new Set();
      textBlocks.forEach((tb) => {
        const text = tb.textContent.trim();
        if (text && text.length > 2 && text.length < 200 && !seen.has(text) && !text.includes("/mo")) {
          seen.add(text);
          const p = document2.createElement("p");
          p.textContent = text;
          container.appendChild(p);
        }
      });
      const ctas = card.querySelectorAll("a.cmp-button");
      ctas.forEach((cta) => {
        const text = cta.textContent.trim();
        if (text && cta.href) {
          const p = document2.createElement("p");
          const a = document2.createElement("a");
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
      const block = WebImporter.Blocks.createBlock(document2, { name: "cards-compare", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/hero-banner.js
  function parse4(element, { document: document2 }) {
    const cells = [];
    const contentCell = [];
    const headings = element.querySelectorAll("h2");
    for (const h of headings) {
      if (h.textContent.includes("CUSTOMIZE")) {
        const h2 = document2.createElement("h2");
        h2.textContent = h.textContent.trim();
        contentCell.push(h2);
        break;
      }
    }
    const ctas = element.querySelectorAll("a.cmp-button");
    for (const cta of ctas) {
      const text = cta.textContent.trim();
      if (text.includes("Add-Ons") && cta.href) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = cta.href;
        a.textContent = text;
        p.appendChild(a);
        contentCell.push(p);
        break;
      }
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
      const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-deals.js
  function parse5(element, { document: document2 }) {
    const cards = element.querySelectorAll(".card-container");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img.cmp-image__image, img.cmp-container__background-content");
      const imageCell = document2.createElement("div");
      if (img) {
        const newImg = document2.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        imageCell.appendChild(newImg);
      }
      const contentCell = document2.createElement("div");
      const titleEl = card.querySelector(".cmp-text__text-weight-bold, .cmp-text__text-24-desktop");
      if (titleEl) {
        const h3 = document2.createElement("h3");
        h3.textContent = titleEl.textContent.trim();
        contentCell.appendChild(h3);
      }
      const textBlocks = card.querySelectorAll(".cmp-text");
      const seen = /* @__PURE__ */ new Set();
      textBlocks.forEach((tb) => {
        const text = tb.textContent.trim();
        if (text && text.length > 3 && text.length < 300 && !seen.has(text)) {
          seen.add(text);
          const p = document2.createElement("p");
          p.textContent = text;
          contentCell.appendChild(p);
        }
      });
      const ctas = card.querySelectorAll("a.cmp-button");
      ctas.forEach((cta) => {
        const text = cta.textContent.trim();
        if (text && cta.href) {
          const p = document2.createElement("p");
          const a = document2.createElement("a");
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
      const block = WebImporter.Blocks.createBlock(document2, { name: "cards-deals", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    const items = element.querySelectorAll(".cmp-accordion__item");
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".cmp-accordion__title");
      const bodyEl = item.querySelector(".cmp-accordion__panel");
      if (titleEl) {
        const title = document2.createElement("p");
        title.textContent = titleEl.textContent.trim();
        const body = document2.createElement("div");
        if (bodyEl) {
          const paragraphs = bodyEl.querySelectorAll("p");
          if (paragraphs.length > 0) {
            paragraphs.forEach((p) => {
              const text = p.textContent.trim();
              if (text) {
                const newP = document2.createElement("p");
                newP.textContent = text;
                body.appendChild(newP);
              }
            });
          } else {
            const text = bodyEl.textContent.trim();
            if (text) {
              const newP = document2.createElement("p");
              newP.textContent = text;
              body.appendChild(newP);
            }
          }
        }
        cells.push([title, body]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/boostmobile-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-skip__link",
        ".mega-menu__overlay",
        ".cmp-card-shelf-overlay",
        ".cmp-card-shelf-overlay-2",
        "input.redirect"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".header-v3",
        ".harmony-header",
        ".footer-v2",
        ".cmp-harmony__footerv2--wrapper",
        ".utilityTopnav",
        ".languageselection",
        "iframe",
        "link",
        "noscript"
      ]);
      const trackingDomains = [
        "bat.bing.com",
        "sp.analytics.yahoo.com",
        "idsync.rlcdn.com",
        "sync.1rx.io",
        "x.bidswitch.net",
        "loadm.exelator.com",
        "dpm.demdex.net",
        "dsum-sec.casalemedia.com",
        "secure.adnxs.com",
        "image2.pubmatic.com",
        "s.ad.smaato.net",
        "tvspix.com",
        "p.veritone-ce.com",
        "us-u.openx.net",
        "match.adsrvr.org",
        "ps.eyeota.net",
        "fei.pro-market.net",
        "eb2.3lift.com",
        "sync.cootlogix.com",
        "sync.crwdcntrl.net",
        "cs.admanmedia.com",
        "verifi.podscribe.com"
      ];
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (trackingDomains.some((d) => src.includes(d)) || img.alt === "" && src.includes("?")) {
          img.remove();
        }
      });
    }
  }

  // tools/importer/transformers/boostmobile-sections.js
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
    const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectorList) {
      try {
        const found = element.querySelector(sel);
        if (found) return found;
      } catch (e) {
      }
    }
    return null;
  }
  function findClosestContainer(el) {
    let parent = el;
    while (parent && parent.parentElement) {
      parent = parent.parentElement;
      if (parent.classList && (parent.classList.contains("cmp-container__margin-64") || parent.classList.contains("cmp-container__full-width") || parent.classList.contains("content-width"))) return parent;
    }
    return el.parentElement || el;
  }
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      const doc = element.ownerDocument || document;
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const landmarks = {
        "section-1": () => findByText(element, "span", "Phone Plans"),
        "section-4": () => findByText(element, "h2", "Compare Plans"),
        "section-5": () => findByText(element, "h2", "CUSTOMIZE YOUR PLAN"),
        "section-7": () => findByText(element, "h2", "FAQs"),
        "section-8": () => {
          const allText = element.querySelectorAll(".cmp-text");
          for (const t of allText) {
            const txt = t.textContent;
            if (txt.length > 300 && (txt.includes("*") || txt.includes("Terms") || txt.includes("service"))) return t;
          }
          return null;
        }
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
      for (let i = anchors.length - 1; i >= 0; i--) {
        const { section, el } = anchors[i];
        if (!el) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          el.after(metaBlock);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          el.before(hr);
        }
      }
    }
  }

  // tools/importer/import-plans-page.js
  var parsers = {
    "tabs-plan-nav": parse,
    "cards-pricing": parse2,
    "cards-compare": parse3,
    "hero-banner": parse4,
    "cards-deals": parse5,
    "accordion-faq": parse6
  };
  var PAGE_TEMPLATE = {
    name: "plans-page",
    description: "Plans listing page showing mobile plan options and pricing",
    urls: [
      "https://www.boostmobile.com/plans",
      "https://www.boostmobile.com/plans/byod"
    ],
    blocks: [
      {
        name: "tabs-plan-nav",
        instances: ["#text-442f0bc3bf"]
      },
      {
        name: "cards-pricing",
        instances: [
          ".cmp-experiencefragment--unlimited-plan-cards .contentcardshelf",
          ".cmp-experiencefragment--infinite-access-plan-cards .contentcardshelf"
        ]
      },
      {
        name: "cards-compare",
        instances: [".cmp-container__margin-64 > .cmp-container > .aem-Grid > .contentcardshelf"]
      },
      {
        name: "hero-banner",
        instances: [".cmp-container__full-width.cmp-container__padding-top-0.cmp-container__padding-bottom-0"]
      },
      {
        name: "cards-deals",
        instances: [".cmp-experiencefragment--special-deals .contentcardshelf"]
      },
      {
        name: "accordion-faq",
        instances: [".accordion.panelcontainer"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Plan Navigation and Hero",
        selector: "#text-442f0bc3bf",
        style: null,
        blocks: ["tabs-plan-nav"],
        defaultContent: ["h1"]
      },
      {
        id: "section-2",
        name: "Connect More Spend Less",
        selector: ".cmp-experiencefragment--unlimited-plan-cards",
        style: null,
        blocks: ["cards-pricing"],
        defaultContent: ["h2", "p", ".cmp-button"]
      },
      {
        id: "section-3",
        name: "Buy Now Pay Later Plans",
        selector: ".cmp-experiencefragment--infinite-access-plan-cards",
        style: null,
        blocks: ["cards-pricing"],
        defaultContent: ["h2", "p"]
      },
      {
        id: "section-4",
        name: "Compare Plans",
        selector: "#container-72f957f771",
        style: null,
        blocks: ["cards-compare"],
        defaultContent: ["h2", "p"]
      },
      {
        id: "section-5",
        name: "Customize Your Plan Banner",
        selector: "#container-4a1c264453",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Save When You Shop Online",
        selector: ".cmp-experiencefragment--special-deals",
        style: null,
        blocks: ["cards-deals"],
        defaultContent: ["h2", ".cmp-button"]
      },
      {
        id: "section-7",
        name: "FAQs",
        selector: "#container-fb2ea01c96",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: ["h2"]
      },
      {
        id: "section-8",
        name: "Legal Disclaimers",
        selector: "#container-cd78c3adfe",
        style: null,
        blocks: [],
        defaultContent: ["p"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        try {
          const elements = document2.querySelectorAll(selector);
          elements.forEach((element) => {
            pageBlocks.push({
              name: blockDef.name,
              selector,
              element,
              section: blockDef.section || null
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
  var import_plans_page_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_plans_page_exports);
})();
