import axios from 'axios';
const BSAE_URL = 'https://tadbo.github.io/viplist/viplist.json';
const instance = axios.create({
    baseURL: BSAE_URL,
    timeout: 10000,
});

const createAPI = (url, method, config) => {
    config = config || {};  // eslint-disable-line
    return instance({
        url,
        method,
        ...config,
    });
};

const source = {
    getAllList:config => createAPI('', 'GET', config),
};

export {
    source,
}