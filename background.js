chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 1. Check if the page has finished loading
  if (changeInfo.status === 'complete' && tab.url) {
    
    // 2. Parse the URL to check if it is Google Search
    try {
      const urlObj = new URL(tab.url);
      
      // Ensure we are on google.com and specifically the /search path
      if (urlObj.hostname.includes('google.com') && urlObj.pathname === '/search') {
        
        // 3. Get the search parameters
        const params = new URLSearchParams(urlObj.search);
        let query = params.get('q');
        
        // 4. Check if query exists and does NOT already contain "-ai"
        // We add a trailing space check " -ai" to ensure we don't duplicate it
        if (query && !query.includes(' -ai')) {
          
          // Append the text
          params.set('q', query + ' -ai');
          
          // Reconstruct the URL
          urlObj.search = params.toString();
          
          // 5. Update the tab with the new "clean" URL
          chrome.tabs.update(tabId, { url: urlObj.toString() });
        }
      }
    } catch (e) {
      // Ignore invalid URLs
      console.error(e);
    }
  }
});