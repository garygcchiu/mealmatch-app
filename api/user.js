const { standardGet, standardPost } = require('./base');

export async function getAppetite() {
    return standardGet(`/users/appetite`);
}

export async function editAppetite(appetite) {
    return standardPost('/users/appetite', appetite);
}
