chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  chrome.storage.local.get(['enabled'], (result) => {
    if (result.enabled === false) return;

    try {
      const urlObj = new URL(details.url);
      const params = new URLSearchParams(urlObj.search);
      const query = params.get('q');

      if (query && !query.includes(' -ai')) {
        params.set('q', query + ' -ai');
        urlObj.search = params.toString();
        chrome.tabs.update(details.tabId, { url: urlObj.toString() });
      }
    } catch (e) {
      console.error(e);
    }
  });
}, {
  url: [{ hostContains: '.google.', pathEquals: '/search' }]
});