import { useRef } from "react";
import * as cache from "../utils/cache";
import useCreation from "../../../useCreation";
import * as cachePromise from "../utils/cachePromise";
import * as cacheSubscribe from "../utils/cacheSubscribe";
const useCachePlugin = (
  fetchInstance,
  {
    cacheKey,
    staleTime = 0,
    cacheTime = 5 * 60 * 1000,
    setCache: customSetCache,
    getCache: customGetCache,
  }
) => {
  const unSubscribeRef = useRef();
  const currentPromiseRef = useRef();
  const _setCache = (key, cachedData) => {
    if (customSetCache) {
      customSetCache(cachedData);
    } else {
      cache.setCache(key, cacheTime, cachedData);
    }
    cacheSubscribe.trigger(key, cachedData.data);
  };

  const _getCache = (key, params) => {
    if (customGetCache) {
      // 不懂 为什么传params
      return customGetCache(params);
    }
    return cache.getCache(key);
  };
  // 不懂 为什么在只在useCreation执行一次，组件到底什么时候卸载
  // 不懂 performUnitofWork的时候，每个fiber都可能挂载或者更新吗？还是只有第一次挂载，之后都是更新？？
  useCreation(() => {
    if (!cacheKey) {
      return;
    }
    const cacheData = _getCache(cacheKey);
    if (cacheData && Object.hasOwnProperty.call(cacheData, "data")) {
      fetchInstance.state.data = cacheData.data;
      fetchInstance.state.params = cacheData.params;
      if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
        fetchInstance.state.loading = false;
      }
    }
  });
  if (!cacheKey) {
    return {};
  }

  return {
    onBefore: (params) => {
      // 不懂 react18 并发模式 这么取会不会有问题
      const cacheData = _getCache(cacheKey, params);
      if (!cacheData || !Object.hasOwnProperty.call(cacheData, "data")) {
        return {};
      }
      if (staleTime === -1 || new Date().getTime() - cacheData.time <= staleTime) {
        return {
          loading: false,
          data: cacheData?.data,
          returnNow: true,
        };
      } else {
        return {
          data: cacheData?.data,
        };
      }
    },
    onRequest: (service, args) => {
      let servicePromise = cachePromise.getCachePromise(cacheKey);
      if (servicePromise && servicePromise !== currentPromiseRef.current) {
        return {
          servicePromise,
        };
      }
      servicePromise = service(...args);
      currentPromiseRef.current = servicePromise;
      cachePromise.setCachePromise(cacheKey, servicePromise);
      return {
        servicePromise,
      };
    },
    onSuccess: (data, params) => {
      if (cacheKey) {
        _setCache(cacheKey, {
          data,
          params,
          time: new Date().getTime(),
        });
        // 不懂 todo 没有unSubscribe
        unSubscribeRef.current = cacheSubscribe.subscribe(cacheKey, (d) => {
          fetchInstance.setState({
            data: d,
          });
        });
      }
    },
  };
};
export default useCachePlugin;
