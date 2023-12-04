import { createSlice } from '../';
import { useEffect, useContext, useReducer } from 'react';
import { ReactReduxContext } from 'react-redux';
const FETCH_DATA = 'FETCH_DATA';
function fetchBaseQuery({ baseUrl }) {
  return async function (url) {
    url = baseUrl + url;
    let data = await fetch(url).then((res) => res.json());
    return data;
  };
}

function createApi({ reducerPath, baseQuery, endpoints }) {
  let builder = {
    query(options) {
      function useQuery(id) {
        const { store } = useContext(ReactReduxContext);
        const [, forceUpdate] = useReducer((x) => x + 1, 0);
        useEffect(() => {
          let unSubscribe = store.subscribe(forceUpdate);
          let url = options.query(id);
          store.dispatch({ type: FETCH_DATA, payload: { url } });
          return unSubscribe;
        }, [id, store]);
        let state = store.getState();
        return state ? state[reducerPath] : {};
      }
      return { useQuery };
    },
  };
  let slice = createSlice({
    name: reducerPath,
    initialState: { data: null, error: null, isLoading: false },
    reducers: {
      setValue(state, { payload = {} }) {
        for (let key in payload) state[key] = payload[key];
      },
    },
  });
  const { actions, reducer } = slice;
  let api = {
    reducerPath,
    reducer,
    endpoints: endpoints(builder),
    middleware: function ({ dispatch }) {
      return function (next) {
        return function (action) {
          if (action.type === FETCH_DATA) {
            let { url } = action.payload;
            (async function () {
              try {
                dispatch(actions.setValue({ isLoading: true }));
                let data = await baseQuery(url);
                dispatch(actions.setValue({ data, isLoading: false }));
              } catch (error) {
                console.log(error);
                console.log(typeof error);
                dispatch(
                  actions.setValue({
                    error: { error: error.toString() },
                    isLoading: false,
                  })
                );
              }
            })();
          } else {
            next(action);
          }
        };
      };
    },
  };
  return api;
}

export { fetchBaseQuery, createApi };
