/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Boost Mobile cleanup.
 * Selectors from captured DOM at https://www.boostmobile.com/plans
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove elements that may interfere with block parsing
    // Found in DOM: .cmp-skip__link, .mega-menu__overlay, overlay/redirect elements
    WebImporter.DOMUtils.remove(element, [
      '.cmp-skip__link',
      '.mega-menu__overlay',
      '.cmp-card-shelf-overlay',
      '.cmp-card-shelf-overlay-2',
      'input.redirect',
    ]);
  }
  if (hookName === H.after) {
    // Remove non-authorable content (header, footer, nav, etc.)
    // Found in DOM: .header-v3 (site header), .footer-v2 (site footer),
    // .utilityTopnav (utility nav), .languageselection (language picker)
    WebImporter.DOMUtils.remove(element, [
      '.header-v3',
      '.harmony-header',
      '.footer-v2',
      '.cmp-harmony__footerv2--wrapper',
      '.utilityTopnav',
      '.languageselection',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove tracking pixels and ad network images (1x1 pixels, analytics beacons)
    // Found in DOM: img tags from bat.bing.com, sp.analytics.yahoo.com, sync.*, idsync.*, etc.
    const trackingDomains = [
      'bat.bing.com', 'sp.analytics.yahoo.com', 'idsync.rlcdn.com',
      'sync.1rx.io', 'x.bidswitch.net', 'loadm.exelator.com',
      'dpm.demdex.net', 'dsum-sec.casalemedia.com', 'secure.adnxs.com',
      'image2.pubmatic.com', 's.ad.smaato.net', 'tvspix.com',
      'p.veritone-ce.com', 'us-u.openx.net', 'match.adsrvr.org',
      'ps.eyeota.net', 'fei.pro-market.net', 'eb2.3lift.com',
      'sync.cootlogix.com', 'sync.crwdcntrl.net', 'cs.admanmedia.com',
      'verifi.podscribe.com',
    ];
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (trackingDomains.some((d) => src.includes(d)) || (img.alt === '' && src.includes('?'))) {
        img.remove();
      }
    });
  }
}
