# [loader.js](https://memob0x.github.io/loader/demos/index.html)

![Node.js CI](https://github.com/memob0x/loader/workflows/Node.js%20CI/badge.svg?branch=new-aim)

⚙️ **loader.js** is a small script that lets you programmatically fetch whatever resource type you want in a **separate thread** leaving the main one free to "concentrate" on animations and other visually noticeable changes in order to enhance the perceived performance to the end user.

Under the hood it uses `Worker` and `fetch` API to retrieve a `Blob` object to the main thread in order to be consumed by `URL` API.

# Overview

The `Loader` class exposes these main methods:

-   `fetch` retrieves the given resource(s) from inside a _Web Worker_ returning it in `Blob` form.
    ```javascript
    asdsad
    ```
-   `load` fires `fetch` and possibly applies the loaded resource(s) interpreting the given options for each case returning
    -   a `CSSStyleSheet` object when loading **css**
    -   (possibly) the exported script **module** when loading **scripts**
    -   the load/error `Event` when loading **images**
    -   the retrieved **plain text** when loading **html**
    ```javascript
    asdsad
    ```
Please see the following programmatically load of a "lazy" image for a full example.

```javascript
// instance construction
const instance = new Loader();

// caching the example actors: an image element and its "data-src" attribute
const image = document.querySelector("img#dat-lazy-image");
const url = image.dataset.src;

// fetching the resource url in the second thread
const blob = instance.fetch(url);

// attaching the result to the image, waking it up from lazyness
const event = instance.load(blob, { element: image });
```

# Recipes

Let's go into detail by cooking some very common recipes.

## [HTML](https://memob0x.github.io/loader/demos/html/index.html)

Loader supports `text/html` mimetype so it can be used to retrieve new contents, also with `load` method updating the current view with fresh data is quite easy.

```javascript
// updating #root with new contents
new Loader().load("/Messages/Inbox", {
    // fetch options
    fetch: {
        method: "GET",
        body: JSON.stringify({
            timestamp: new Date().getTime(),
            foo: "bar",
        }),
    },
    // injection target
    element: document.querySelector("#root"),
    // result filter selector
    filter: "#root .messages",
});
```

## [Stylesheets Loader](https://memob0x.github.io/loader/demos/css/index.html)

Loader supports `text/css` mimetype so it can be used as an asynchronous stylesheets load callback (which is a quite an [ancient cross-browser issue](https://www.phpied.com/when-is-a-stylesheet-really-loaded/)).

```javascript
// loading a new visual theme and a new app area
Promise.allSettled(
    new Loader().load(["theme.blue.css", "area.account.css"])
).then(() =>
    // page ready, removing spinners and preloaders previously set
    document.body.classList.add("page-ready")
);
```

## [Scripts Loader](https://memob0x.github.io/loader/demos/javascript/index.html)

Loader internally uses dynamic `import` for `text/javascript` mimetype so it can be used to consume any kind of native module.

```javascript
// retrieving and consuming a specific module
new Loader().load("cart.js").then((module) => {
    const Cart = module.default;
    const cart = new Cart();

    cart.add("product-foo-12345678-bar");
});
```

## [Lazyload Images](https://memob0x.github.io/loader/demos/images/index.html)

Loader can be used with `IntersectionObserver` to provide an easy and enhanced lazy load functionality.

```javascript
// instance construction
const loader = new Loader();

// observer initialization
const observer = new IntersectionObserver((entries) =>
    entries
        // filtering the visible images
        .filter((entry) => entry.isIntersecting)
        // looping through visible images
        .forEach(async (entry) => {
            const image = entry.target;

            // detaching observer to the visible image
            observer.unobserve(image);

            // waking up the lazy image, fetching the image in a separate thread
            await loader.load(image.dataset.src, { element: image });

            // image is loaded, setting a css class
            image.classList.add("loaded");
        })
);

// attaching observer to a set of images with "data-src" attribute
[...document.querySelectorAll("img[data-src]")].forEach((image) =>
    observer.observe(image)
);
```

## [Manual Handling: RequireJS](https://memob0x.github.io/loader/demos/requirejs/index.html)

You want to manually handle some resources, just skip `load` method and use `fetch`, please see the following example adapted to support [requirejs](https://requirejs.org/) library.

```javascript
// constructing a Loader instance
const loader = new Loader();

// setting up requirejs modules
const requireConfig = {
    paths: {
        cart: "root/account/cart.js",
    },
};
requirejs.config(requireConfig);

/**
 * Wraps require to load modules in a separate thread
 * @param {string} path The path to a previously registered requirejs module
 * @returns {Promise} The module call in Promise form
 */
const include = async (path) => {
    // fetching the module in a secondary thread
    const blob = await loader.fetch(requireConfig.paths[path]);

    // creating an url from a blob
    const url = URL.createObjectURL(blob);

    // wrapping require to make a thenable of it in order to be consumed by await operatator
    const result = await new Promise((resolve, reject) =>
        require(url, resolve, reject)
    );

    // dispose the previously created url
    URL.revokeObjectURL(url);

    // returns the awaited module
    return result;
};

// use case
include("cart").then((Cart) => new Cart().add("product-foo-12345678-bar"));
```

## Requirements
For a manual use of `fetch` method you'll just need:
-   https://caniuse.com/#feat=webworkers
-   https://caniuse.com/#feat=fetch

For a complete use of `load` method with all its goodies you'll also need:
-   https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
-   https://caniuse.com/#feat=mdn-api_stylesheet
-   https://caniuse.com/#feat=es6-module-dynamic-import

