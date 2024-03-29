﻿# xsl.js

XS-Leaks, or Cross-Site Leaks, are a type of security vulnerability that can occur when sensitive data is inadvertently leaked from one website to another. This library provides a comprehensive set of functions and tools to assist researchers in identifying, testing, and exploiting XS-Leaks vulnerabilities.

More informations about XS-Leaks can be found in the [XS-Leaks Wiki](https://xsleaks.dev/).

## Features

- [x] Error probing (using `onerror` and `onload` events and `script` tags)
- [x] Network Timing (using `performance.now()`)
    - [x] Fetch method (using `fetch` API)
    - [x] Image method (using `img` tag)
    - [x] Frame method (using `iframe` tag)
- [ ] Cache Probing
- [ ] Frame Counting

## Installation

Just include the `xsl.js` file in your HTML page.

## Usage

### Error probing

```javascript
// Using callback
XSL.probeError({
    url: "https://example.com",
    timeout: 1000,
    timeoutShouldReturn: true,
    callback: function (result) {
        console.log(result);
    }
});

// Using promise
XSL.probeError({
    url: "https://example.com",
    timeout: 1000,
    timeoutShouldReturn: true
}).then(function (result) {
    console.log(result);
});
```

Learn more about this method : [XS-Leaks Wiki - Error Events](https://xsleaks.dev/docs/attacks/error-events/).

### Network Timing

- Fetch method

```javascript
// You can with this method specify options like the method, headers, body, etc.

// Using callback

XSL.fetchTimed({
    url: "https://example.com"
    callback: function (result) {
        console.log(result);
    }
});

// Using promise

XSL.networkTiming({
    url: "https://example.com"
}).then(function (result) {
    console.log(result);
});
```

- Image method

```javascript
// Using callback

XSL.imageTimed({
    url: "https://example.com",
    callback: function (result) {
        console.log(result);
    }
});

// Using promise

XSL.imageTimed({
    url: "https://example.com"
}).then(function (result) {
    console.log(result);
});
```

- Frame method

```javascript
// Using callback

XSL.frameTimed({
    url: "https://example.com",
    callback: function (result) {
        console.log(result);
    }
});

// Using promise

XSL.frameTimed({
    url: "https://example.com"
}).then(function (result) {
    console.log(result);
});
```

Learn more about this method : [XS-Leaks Wiki - Network Timing](https://xsleaks.dev/docs/attacks/timing-attacks/network-timing/).
