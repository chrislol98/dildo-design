const cache = new Map();

const setCache = (key, cachedData) => {
  cache.set(key, {
    ...cachedData,
  });
};

const getCache = (key) => {
  return cache.get(key);
};

const clearCache = (key) => {
  if (key) {
    const cacheKeys = Array.isArray(key) ? key : [key];
    cacheKeys.forEach((cacheKey) => cache.delete(cacheKey));
  } else {
    cache.clear();
  }
};
export { getCache, setCache, clearCache };
