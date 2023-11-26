import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
function isPlainObject(value) {
  if (typeof value !== 'object' || value === null) return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}
function configureStore(options = {}) {
  let { reducer, middleware = [thunk], preloadedState } = options;
  let rootReducer;
  if (typeof reducer === 'function') {
    rootReducer = reducer;
  } else if (isPlainObject(reducer)) {
    rootReducer = combineReducers(reducer);
  }
  middleware =
    typeof middleware === 'function' ? middleware(() => [thunk]) : middleware;
  const enhancer = applyMiddleware(...middleware);
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  // api createStore
  // enhancer 增强createStore功能的函数 applymiddleware就是一个enhancer,跟其他enhancer用compose合起来一起用
  return createStore(rootReducer, preloadedState, composeEnhancers(enhancer));
}
export default configureStore;
