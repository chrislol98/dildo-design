import { useState, useCallback, useRef } from 'react';
import { Tracker } from '@/@formily/reactive'
export const useObserver = (view) => {
    const [, setState] = useState([])
    const forceUpdate = useCallback(() => setState([]), [])
    const instRef = useRef(null)
    if (!instRef.current) {
        instRef.current = new Tracker(forceUpdate)
    }
    return instRef.current.track(view)
}