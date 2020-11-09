const { standardGet } = require('./base');

async function searchPlaces(query, location) {
    return standardGet(`/places/search`, { query, location });
}

module.exports = {
    searchPlaces,
};
