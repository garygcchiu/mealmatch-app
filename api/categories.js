const { standardGet } = require('./base');

async function getExplore() {
    return standardGet(`/categories/explore`);
}

async function getCategoryRestaurants(categoryId) {
    return standardGet('/categories/restaurants', { categoryId });
}

module.exports = {
    getExplore,
    getCategoryRestaurants,
};
