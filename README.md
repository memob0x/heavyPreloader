# [loader.js](https://memob0x.github.io/loader/demos/index.html)

![Node.js CI](https://github.com/memob0x/loader/workflows/Node.js%20CI/badge.svg?branch=new-aim)

⚙️ **loader.js** is a small script that lets you programmatically fetch whatever resource type you want in a **separate thread** leaving the main one free to "concentrate" on animations and other visually noticeable changes in order to enhance the perceived performance to the end user.

Under the hood it uses `Worker` and `fetch` API to retrieve a `Blob` object to the main thread in order to be consumed by `URL` API.

# Overview

The `Loader` class exposes these main methods:

-   **fetch**
    -   **First Argument:** the resource(s) url (`String` or `URL` object) as an only argument
    -   **Second Argument:** an **options** `Object` as a second argument
    -   **Only Job:** fetches the given resource(s) from inside a _Web Worker_.
    -   **Returns:** the loaded resource(s) `Blob` object
-   **load**
    -   **Arguments:** same as **fetch**
    -   **First Job:** possibly fetches the given resources url(s) from inside a _Web Worker_.
    -   **Second Job:** possibly applies the loaded resource(s) interpreting the given options for each case
    -   **Returns:** the consumed `Blob` returned by **fetch response**, which is a different result for each case
        -   A `CSSStyleSheet` object when loading **css**
        -   (Possibly) The exported script **module** when loading **scripts**
        -   The load/error `Event` when loading **images**
        -   The retrieved **plain text** when loading **html**

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
void new Loader().load("/Messages/Inbox", {
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

Loader supports stylesheets so it can be used as an asynchronous stylesheets load callback (which is a quite an [ancient cross-browser issue](https://www.phpied.com/when-is-a-stylesheet-really-loaded/)).

```javascript
(async () => {
    // loading a new visual theme and a new app area
    await Promise.allSettled(
        new Loader().load(["theme.blue.css", "area.account.css"])
    );

    // page ready, removing spinners and preloaders previously set
    document.body.classList.add("page-ready");
})();
```

## [Scripts Loader](https://memob0x.github.io/loader/demos/javascript/index.html)

Loader internally uses dynamic `import` so it can be used to consume any kind of native module.

```javascript
// retrieving a specific module and using it
void new Loader().load("cart.js").then((module) => {
    const Cart = module.default;
    const cart = new Cart();

    cart.add("product-foo-12345678-bar");
});
```

## [Lazyload Images](https://memob0x.github.io/loader/demos/images/index.html)

```javascript
// instance construction
const loader = new Loader();

// observer initialization
const observer = new IntersectionObserver((entries) =>
    entries
        // filtering the visible images
        .filter((entry) => entry.isIntersecting)
        // looping through visible images
        .forEach((entry) => {
            const image = entry.target;

            // detaching observer to the visible image
            observer.unobserve(image);

            // waking up the lazy image
            loader.load(image.dataset.src, { element: image });
        })
);

// attaching observer to a set of images with "data-src" attribute
[...document.querySelectorAll("img[data-src]")].forEach((image) =>
    observer.observe(image)
);
```

## [Manual Handling: RequireJS](https://memob0x.github.io/loader/demos/require/index.html)


```javascript
//
const loader = new Loader();

/**
 *
 */
const include = async (path) => {
    //
    const blob = await loader.fetch(path);

    //
    const url = URL.createObjectURL(blob);

    //
    const result = await new Promise((resolve, reject) =>
        require(url, resolve, reject)
    );

    //
    URL.revokeObjectURL(url);

    //
    return result;
};

//
include("cart").then((Cart) => {
    const cart = new Cart();

    cart.add("product-foo-12345678-bar");
});
```

## Requirements

-   https://caniuse.com/#feat=webworkers
-   https://caniuse.com/#feat=fetch
-   https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
