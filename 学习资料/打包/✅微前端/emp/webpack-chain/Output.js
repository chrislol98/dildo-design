const ChainedMap = require('./ChainedMap');
module.exports = class extends ChainedMap {
    constructor(parent) {
        super(parent);
        this.extend([
            'path',
            'filename'
        ]);
    }
};