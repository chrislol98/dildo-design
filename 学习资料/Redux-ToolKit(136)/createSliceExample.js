//import {configureStore,createAction,createReducer,createSlice} from '@reduxjs/toolkit';
import {configureStore,createAction,createReducer,createSlice,createSelector} from './toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const counter1Slice = createSlice({
  name: 'counter1',
  initialState: { number: 0 },
  reducers: {
    add: state => { state.number += 1 },
    minus: state => { state.number -= 1 }
  }
})
const counter2Slice = createSlice({
  name: 'counter2',
  initialState: { number: 0 },
  reducers: {
    add: state => { state.number += 1 },
    minus: state => { state.number -= 1 }
  }
})
const { actions: { add: add1, minus: minus1 }, reducer: reducer1 } = counter1Slice
const { actions: { add: add2, minus: minus2 }, reducer: reducer2 } = counter2Slice

const store = configureStore({
  // 不懂 可以用combineReducer吗？
  reducer: { counter1: reducer1, counter2: reducer2 },
  middleware: [thunk, logger]
})
var value1El = document.getElementById('value1')
var value2El = document.getElementById('value2')
var sumEl = document.getElementById('sum')
const selectCounter1 = state => state.counter1
const selectCounter2 = state => state.counter2
const totalSelector = createSelector(
  [selectCounter1, selectCounter2],
  (counter1, counter2) => {
    return counter1.number + counter2.number;
  }
)
function render() {
  value1El.innerHTML = store.getState().counter1.number;
  value2El.innerHTML = store.getState().counter2.number;
  sumEl.innerHTML = totalSelector(store.getState());
}

render()
store.subscribe(render)

document.getElementById('add1').addEventListener('click', function () {
  store.dispatch(add1())
})

document.getElementById('minus1').addEventListener('click', function () {
  store.dispatch(minus1())
})

document.getElementById('add2').addEventListener('click', function () {
  store.dispatch(add2())
})

document.getElementById('minus2').addEventListener('click', function () {
  store.dispatch(minus2())
})