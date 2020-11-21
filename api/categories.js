const { standardGet } = require('./base');

async function getExplore() {
    return standardGet(`/categories/explore`);
}

module.exports = {
    getExplore,
};
