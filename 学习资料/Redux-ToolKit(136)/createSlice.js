import { createReducer, createAction } from './'
function createSlice(options) {
  let { name, initialState={}, reducers={},extraReducers={}  } = options;
    let actions = {};
    const prefixReducers = {};
    Object.keys(reducers).forEach(function (key) {
        var type = getType(name, key);
        actions[key] = createAction(type);
        prefixReducers[type]=reducers[key];
    })
   let reducer = createReducer(initialState, prefixReducers,extraReducers);
    return {
        name,
        reducer,
        actions
    };
}
function getType(slice, actionKey) {
    return slice + "/" + actionKey;
}
export default createSlice;