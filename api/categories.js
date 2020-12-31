const { standardGet } = require('./base');

async function getExplore() {
    return standardGet(`/categories/explore`);
}

async function getCategoryRestaurants(categoryId, latitude, longitude) {
    return standardGet('/categories/restaurants', {
        categoryId,
        latitude,
        longitude,
    });
}

module.exports = {
    getExplore,
    getCategoryRestaurants,
};
