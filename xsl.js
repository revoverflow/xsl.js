let XSL = {};

/*
    * XSL.probeError
    * @description: Tries to load a script and returns true if it succeeds, false if it fails, or a custom value if it times out.
    * @param {Object} options
    * @param {String} options.url
    * @param {Number} options.timeout
    * @param {Any} options.timeoutShouldReturn
    * @param {Function} options.callback
    * @return {Promise}
*/
XSL.probeError = function (options) {
    options = options || {};

    if (!options.url) {
        throw new Error('url is required');
    }

    if (!options.callback) {
        return XSL._probeErrorPromise(options);
    }

    let script = document.createElement('script');
    script.src = options.url;

    let timeout = options.timeout || 5000;
    let timeoutShouldReturn = options.timeoutShouldReturn || new Error('timeout');

    let timer = setTimeout(function () {
        script.parentNode.removeChild(script);
        options.callback(timeoutShouldReturn);
    }, timeout);

    script.onload = function () {
        clearTimeout(timer);
        if (script.parentNode) script.parentNode.removeChild(script);
        options.callback(true);
    }

    script.onerror = function () {
        clearTimeout(timer);
        if (script.parentNode) script.parentNode.removeChild(script);
        options.callback(false);
    }

    document.head.appendChild(script);
};

/*
    * XSL._probeErrorPromise
    * @description: Promise wrapper for XSL.probeError
    * @param {Object} options
    * @param {String} options.url
    * @param {Number} options.timeout
    * @param {Any} options.timeoutShouldReturn
    * @return {Promise}
*/
XSL._probeErrorPromise = function (options) {
    return new Promise(function (resolve, reject) {
        XSL.probeError({
            url: options.url,
            timeout: options.timeout,
            timeoutShouldReturn: options.timeoutShouldReturn,
            callback: function (result) {
                resolve(result);
            }
        });
    });
};

/*
    * XSL.fetchTimed
    * @description: Fetches a resource and returns the time it took to fetch it.
    * @param {Object} options
    * @param {String} options.url
    * @param {String} options.method
    * @param {Object} options.headers
    * @param {String} options.body
    * @param {String} options.mode
    * @param {String} options.cache
    * @param {Function} options.callback
    * @return {Promise}
*/
XSL.fetchTimed = function (options) {
    options = options || {};

    if (!options.url) {
        throw new Error('url is required');
    }

    if (!options.callback) {
        return XSL._fetchTimedPromise(options);
    }

    let fetchOptions = {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body || null,
        mode: options.mode || 'no-cors',
        cache: options.cache || 'default'
    };

    let start = performance.now();

    fetch(options.url, fetchOptions)
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('fetch failed');
            }
        })
        .then(function (text) {
            let end = performance.now();
            options.callback(end - start, text);
        })
        .catch(function (err) {
            let end = performance.now();
            options.callback(end - start, err);
        });
};

/*
    * XSL._fetchTimedPromise
    * @description: Promise wrapper for XSL.fetchTimed
    * @param {Object} options
    * @param {String} options.url
    * @param {String} options.method
    * @param {Object} options.headers
    * @param {String} options.body
    * @param {String} options.mode
    * @param {String} options.cache
    * @return {Promise}
*/
XSL._fetchTimedPromise = function (options) {
    return new Promise(function (resolve, reject) {
        XSL.fetchTimed({
            url: options.url,
            method: options.method,
            headers: options.headers,
            body: options.body,
            mode: options.mode,
            cache: options.cache,
            callback: function (time, data) {
                resolve({
                    time: time,
                    data: data
                });
            }
        });
    });
};

/*
    * XSL.imageTimed
    * @description: Loads an image and returns the time it took to load it.
    * @param {Object} options
    * @param {String} options.url
    * @param {Function} options.callback
    * @return {Promise}
*/
XSL.imageTimed = function (options) {
    options = options || {};

    if (!options.url) {
        throw new Error('url is required');
    }

    if (!options.callback) {
        return XSL._imageTimedPromise(options);
    }

    let start = performance.now();

    let img = new Image();
    img.src = options.url;
    img.onload = function () {
        let end = performance.now();
        options.callback(end - start);
    };
    img.onerror = function () {
        let end = performance.now();
        options.callback(end - start);
    };
}

/*
    * XSL._imageTimedPromise
    * @description: Promise wrapper for XSL.imageTimed
    * @param {Object} options
    * @param {String} options.url
    * @return {Promise}
*/
XSL._imageTimedPromise = function (options) {
    return new Promise(function (resolve, reject) {
        XSL.imageTimed({
            url: options.url,
            callback: function (time) {
                resolve(time);
            }
        });
    });
}