import { Auth, API } from 'aws-amplify';

function getApiName() {
    return `mealmatch-${
        process.env.NODE_ENV === 'development'
            ? 'dev'
            : process.env.NODE_ENV === 'production'
            ? 'prod'
            : 'staging'
    }`;
}

export async function standardGet(path, params) {
    const init = {
        headers: {
            Authorization: `Bearer ${(await Auth.currentSession())
                .getIdToken()
                .getJwtToken()}`,
        },
    };
    const urlParams = new URLSearchParams(params).toString();

    return API.get(getApiName(), `${path}?${urlParams}`, init);
}
