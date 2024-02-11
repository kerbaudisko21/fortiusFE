const getApi = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000';
    } else {
        return 'https://fortius-api.vercel.app/api/api/v1'
    }
};

export default getApi;
