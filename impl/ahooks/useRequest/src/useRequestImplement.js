import useCreation from "../../useCreation";
import useLatest from "../../useLatest";
import useMount from "../../useMount";
import useUpdate from "../../useUpdate";
import Fetch from "./Fetch";
import useMemoizedFn from "../../useMemoizedFn";
import useUnmount from "../../useUnmount";
function useRequestImplement(service, options = {}, plugins = []) {
  const { manual = false, ...rest } = options;
  const fetchOptions = { manual, ...rest };
  const serviceRef = useLatest(service);
  const update = useUpdate();
  const fetchInstance = useCreation(() => {
    const initState = plugins.map((p) => p?.onInit?.(fetchOptions)).filter(Boolean);
    return new Fetch(serviceRef, fetchOptions, update, Object.assign({}, ...initState));
  }, []);
  //fetchInstance.options = fetchOptions;
  fetchInstance.pluginImpls = plugins.map((p) => p(fetchInstance, fetchOptions));
  useMount(() => {
    if (!manual) {
      const params = fetchInstance.state.params || options.defaultParams || [];
      fetchInstance.run(...params);
    }
  });
  useUnmount(() => {
    fetchInstance.cancel();
  });
  return {
    loading: fetchInstance.state.loading,
    data: fetchInstance.state.data,
    error: fetchInstance.state.error,
    params: fetchInstance.state.params || [],
    run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
    runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)),
    refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)),
    refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)),
    mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance)),
    cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)),
  };
}

export default useRequestImplement;
