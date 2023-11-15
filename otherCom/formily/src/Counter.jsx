import { observable } from '@formily/reactive'
import { observer } from '@formily/reactive-react'
const counter = observable({
    number: 1
});
const Counter = observer(() => {
    return (
        <div>
            <p>{counter.number}</p>
            <button onClick={() => counter.number++}>+</button>
        </div>
    )
});
export default Counter;