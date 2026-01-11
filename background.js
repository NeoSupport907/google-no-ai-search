const handleSearch = (tabId, url) => {
  chrome.storage.local.get(['enabled'], (result) => {
    if (result.enabled === false) return;

    try {
      const urlObj = new URL(url);
      
      if (!urlObj.hostname.includes('google.com') || urlObj.pathname !== '/search') {
        return;
      }

      const params = new URLSearchParams(urlObj.search);
      const query = params.get('q');

      if (query && !query.includes(' -ai')) {
        params.set('q', query + ' -ai');
        urlObj.search = params.toString();
        chrome.tabs.update(tabId, { url: urlObj.toString() });
      }
    } catch (e) {
    }
  });
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    handleSearch(tabId, changeInfo.url);
  } else if (changeInfo.status === 'loading' && tab.url) {
    handleSearch(tabId, tab.url);
  }
});