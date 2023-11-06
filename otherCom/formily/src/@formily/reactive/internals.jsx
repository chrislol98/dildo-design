import { baseHandlers } from './handlers'
import { isNormalType } from './checkers';
import { ProxyRaw, RawProxy } from './environment';
export const createObservable = (target, key, value) => {
    if (typeof value !== 'object') return value;
    const raw = ProxyRaw.get(value)
    if (raw) {
        return value
    }
    if (isNormalType(value)) return createNormalProxy(value)
    return value
}
const createNormalProxy = (target) => {
    const proxy = new Proxy(target, baseHandlers)
    ProxyRaw.set(proxy, target)
    RawProxy.set(target, proxy)
    return proxy
}



