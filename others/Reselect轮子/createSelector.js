function createSelector(selectors, reducer) {
  let lastState;
  let lastValue;
  return function (state) {
      if (lastState === state) {
          return lastValue;
      }
      let values = selectors.map(selector => selector(state));
      lastValue = reducer(...values);
      lastState = state;
      return lastValue;
  }
}
export default createSelector;