const cachePromise = new Map();

const getCachePromise = cacheKey => {
  return cachePromise.get(cacheKey);
};

const setCachePromise = (cacheKey, promise) => {
  cachePromise.set(cacheKey, promise);
  promise.then(res => {
    cachePromise.delete(cacheKey);
    return res;
  }).catch(() => {
    cachePromise.delete(cacheKey);
  });
};

export { getCachePromise, setCachePromise };