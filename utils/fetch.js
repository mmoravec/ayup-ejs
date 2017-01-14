
export function getData(url) {
    let response = fetch(url, { method: 'GET' });
    return { res: response.res, err: response.err };
}
