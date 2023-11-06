import { ProxyRaw } from './environment'
export const isObservable = (target) => {
    return ProxyRaw.has(target)
}