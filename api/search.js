const { standardGet, standardPost } = require('./base');

export async function searchUsers(query) {
    return standardGet(`/search`, { query });
}
