chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    
    try {
      const urlObj = new URL(tab.url);
      
      if (urlObj.hostname.includes('google.com') && urlObj.pathname === '/search') {
        
        const params = new URLSearchParams(urlObj.search);
        let query = params.get('q');
        
        if (query && !query.includes(' -ai')) {
          
          params.set('q', query + ' -ai');
          
          urlObj.search = params.toString();
          
          chrome.tabs.update(tabId, { url: urlObj.toString() });
        }
      }
    } catch (e) {
      console.error(e);
    }
    chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
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