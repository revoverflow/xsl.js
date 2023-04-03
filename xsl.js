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