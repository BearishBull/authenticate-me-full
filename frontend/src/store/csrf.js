import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
    // set options.method to 'GET' if no method
    options.method = options.method || 'GET';

    // set options.headers to an empty object if there is no headers
    options.headers = options.headers || {};

    // if the options.method is not 'GET'
    // then set "Content-Type" header to "appliation/json", 
    // and set "XSRF-TOKEN" header to value in the cookie
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    // call the default window's fetch with the url and the options passed int
    const res = await window.fetch(url, options);

    // if the response status code if 400 or above, then throw an error with the error being the response
    if( res.status >= 400) throw res;

    // if the response status code is under 400, then return the response to the next promise chain
    return res;
}

export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}