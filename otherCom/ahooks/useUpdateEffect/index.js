import { useEffect } from 'react';
import { createUpdateEffect } from '../createUpdateEffect';
// api useUpdateEffect 挂载的时候不执行useEffect,只会在deps变化的时候执行
// 有一个同类型的useUpdateLayoutEffect
export default createUpdateEffect(useEffect);