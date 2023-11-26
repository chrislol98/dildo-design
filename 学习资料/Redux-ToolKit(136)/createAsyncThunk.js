import { createAction } from './';
function createAsyncThunk(typePrefix, payloadCreator) {
    let pending = createAction(typePrefix + "/pending", function () {
        return ({ payload: void 0 });
    });
    let fulfilled = createAction(typePrefix + "/fulfilled", function (payload) {
        return ({ payload });
    });
    let rejected = createAction(typePrefix + "/rejected", function (error) {
        return ({ error });
    });


    // 这就是一个thunk函数，只不过事async的
    // store.dispatch能拿到 Object.assign(promise, { abort }); 和 applyMiddle 有关
    function actionCreator(arg) {
        return function (dispatch) {
            dispatch(pending());
            const promise = payloadCreator(arg);
            let abort;
            const abortedPromise = new Promise((_, reject) => {
                abort = () => {
                    reject({ name: "AbortError", message: "Aborted" });
                }
            });
            Promise.race([promise, abortedPromise]).then(result => {
                return dispatch(fulfilled(result));
            }, (error) => {
                return dispatch(rejected(error));
            });
            // 返回一个promise的原因是为了能调用abort让promise reject
            return Object.assign(promise, { abort });
        }
    }
    return Object.assign(actionCreator, { pending, rejected, fulfilled });
}
export default createAsyncThunk;