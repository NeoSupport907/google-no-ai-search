const DEFAULT_SUFFIX = ' -ai';
const GOOGLE_REGEX = /^www\.google\.[a-z.]{2,6}$/;

const getSettings = async () => {
  const data = await chrome.storage.local.get(['enabled', 'suffix', 'customDomains']);
  return {
    enabled: data.enabled !== false,
    suffix: (data.suffix || DEFAULT_SUFFIX).trim(),
    customDomains: data.customDomains || []
  };
};

const isTargetDomain = (hostname, customDomains) => {
  if (GOOGLE_REGEX.test(hostname)) return true;
  return customDomains.some(domain => hostname.includes(domain));
};

const cleanQuery = (query, suffix) => {
  const escaped = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(\\s|^)${escaped}(\\s|$)`, 'gi');
  let cleaned = query;
  while (regex.test(cleaned)) {
    cleaned = cleaned.replace(regex, ' ');
  }
  return cleaned.replace(/\s+/g, ' ').trim();
};

const handleSearch = async (tabId, url) => {
  const { enabled, suffix, customDomains } = await getSettings();
  
  if (!enabled || !suffix) return;

  try {
    const urlObj = new URL(url);
    
    if (!isTargetDomain(urlObj.hostname, customDomains) || urlObj.pathname !== '/search') {
      return;
    }

    const params = new URLSearchParams(urlObj.search);
    const originalQuery = params.get('q');

    if (originalQuery) {
      const baseQuery = cleanQuery(originalQuery, suffix);
      const newQuery = `${baseQuery} ${suffix}`;

      if (originalQuery !== newQuery) {
        params.set('q', newQuery);
        urlObj.search = params.toString();
        chrome.tabs.update(tabId, { url: urlObj.toString() });
      }
    }
  } catch (e) {
  }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    handleSearch(tabId, changeInfo.url);
  } else if (changeInfo.status === 'loading' && tab.url) {
    handleSearch(tabId, tab.url);
  }
});