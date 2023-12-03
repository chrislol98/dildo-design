const Chainable = require('./Chainable');
class ChainedMap extends Chainable {
    constructor(parent) {
        super(parent);
        this.store = new Map();
    }
    extend(methods) {
        this.shorthands = methods;
        methods.forEach((method) => {
            this[method] = (value) => this.set(method, value);
        });
        return this;
    }
    getOrCompute(key, fn) {
        if (!this.has(key)) {
            this.set(key, fn());
        }
        return this.get(key);
    }
    has(key) {
        return this.store.has(key);
    }
    set(key, value) {
        this.store.set(key, value);
        return this;
    }
    get(key) {
        return this.store.get(key);
    }
    entries() {
        const entries = [...this.store].reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
        return entries;
    }
}
module.exports = ChainedMap