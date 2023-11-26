const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');
const Output = require('./Output');
class Config extends ChainedMap {
    constructor(parent) {
        super(parent);
        this.entryPoints = new ChainedMap(this);
        this.output = new Output(this);
    }
    entry(name) {
        return this.entryPoints.getOrCompute(name, () => new ChainedSet(this));
    }
    toConfig() {
        const entryPoints = this.entryPoints.entries();
        return {
            entry: Object.keys(entryPoints).reduce(
                (acc, key) =>
                    Object.assign(acc, { [key]: entryPoints[key].values() }),
                {},
            ),
            output: this.output.entries()
        }
    }
}
module.exports = Config;