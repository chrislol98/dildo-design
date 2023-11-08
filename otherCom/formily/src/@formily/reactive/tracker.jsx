import { ReactionStack } from './environment'
export class Tracker {
    constructor(scheduler) {
        this.track.scheduler = scheduler;
    }
    track = (view) => {
        ReactionStack.push(this.track)
        const res = view();
        ReactionStack.pop()
        return res;
    }
}