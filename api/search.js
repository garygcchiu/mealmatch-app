const { standardGet, standardPost } = require('./base');

export async function search(query) {
    return standardGet(`/search`, { query });
}
