document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');

  chrome.storage.local.get(['enabled'], (result) => {
    toggle.checked = result.enabled !== false;
  });

  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;

    chrome.storage.local.set({ enabled: isEnabled });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      if (activeTab && activeTab.url) {
        try {
          const urlObj = new URL(activeTab.url);

          if (urlObj.hostname.includes('google.com') && urlObj.pathname === '/search') {
            const params = new URLSearchParams(urlObj.search);
            let query = params.get('q');

            if (query) {
              if (!isEnabled && query.includes(' -ai')) {
                query = query.replace(' -ai', '');
                params.set('q', query);
                urlObj.search = params.toString();
                chrome.tabs.update(activeTab.id, { url: urlObj.toString() });
              }
              
              else if (isEnabled && !query.includes(' -ai')) {
                params.set('q', query + ' -ai');
                urlObj.search = params.toString();
                chrome.tabs.update(activeTab.id, { url: urlObj.toString() });
              }
            }
          }
        } catch (e) {
          console.error("Not a valid URL or not Google:", e);
        }
      }
    });
  });
});