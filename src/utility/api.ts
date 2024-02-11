const getApi = (): string => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000';
    } else {
        return 'https://your-production-api.com';
    }
};

export default getApi;
