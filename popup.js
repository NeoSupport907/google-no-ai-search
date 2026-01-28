const cleanQuery = (query, suffix) => {
  const term = suffix.trim();
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(\\s|^)${escaped}(\\s|$)`, 'gi');
  let cleaned = query;
  while (regex.test(cleaned)) {
    cleaned = cleaned.replace(regex, ' ');
  }
  return cleaned.replace(/\s+/g, ' ').trim();
};

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const suffixInput = document.getElementById('suffix');
  const domainsInput = document.getElementById('domains');
  const saveBtn = document.getElementById('save');
  const status = document.getElementById('status');

  chrome.storage.local.get(['enabled', 'suffix', 'customDomains'], (result) => {
    toggle.checked = result.enabled !== false;
    suffixInput.value = result.suffix || ' -ai';
    domainsInput.value = (result.customDomains || []).join('\n');
  });

  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.local.set({ enabled: isEnabled });

    chrome.storage.local.get(['suffix'], (result) => {
      const suffix = (result.suffix || ' -ai').trim();

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab || !activeTab.url) return;

        try {
          const urlObj = new URL(activeTab.url);
          if (urlObj.pathname === '/search') {
            const params = new URLSearchParams(urlObj.search);
            const originalQuery = params.get('q');

            if (originalQuery) {
              const baseQuery = cleanQuery(originalQuery, suffix);
              
              if (!isEnabled) {
                if (originalQuery !== baseQuery) {
                  params.set('q', baseQuery);
                  urlObj.search = params.toString();
                  chrome.tabs.update(activeTab.id, { url: urlObj.toString() });
                }
              } else {
                const newQuery = `${baseQuery} ${suffix}`;
                if (originalQuery !== newQuery) {
                  params.set('q', newQuery);
                  urlObj.search = params.toString();
                  chrome.tabs.update(activeTab.id, { url: urlObj.toString() });
                }
              }
            }
          }
        } catch (e) {}
      });
    });
  });

  saveBtn.addEventListener('click', () => {
    const suffix = suffixInput.value;
    const customDomains = domainsInput.value
      .split('\n')
      .map(d => d.trim())
      .filter(d => d.length > 0);

    chrome.storage.local.set({
      suffix,
      customDomains
    }, () => {
      status.classList.add('visible');
      setTimeout(() => {
        status.classList.remove('visible');
      }, 2000);
    });
  });
});