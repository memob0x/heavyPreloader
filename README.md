# [loader.js](https://memob0x.github.io/loader/demo/index.html)

![Node.js CI](https://github.com/memob0x/loader/workflows/Node.js%20CI/badge.svg?branch=new-aim)

⚙️ **loader.js** is a small script (~4,0K) that lets you programmatically fetch whatever resource type in a **separate thread** leaving the main one free to "concentrate" on animations and other visually noticeable changes in order to enhance the perceived performance to the end user.

Under the hood it uses `Worker` and `fetch` API to retrieve a `Blob` object to the main thread in order to be consumed by `URL` API, `FileReader` instances and so on...

# Methods

## `fetch(resource, [options])`

This method **fetches** the given **resource(s)** and returns it as a `Blob` object.

It is passed the following **arguments**:

-   _resource_ (`String`|`URL`|`Array.<String>`|`Array.<URL>`) The resource(s) url to be fetched.
-   _options_ (`Object`) An object of options consumed by the fetch method.
    -   _cache_ (`Boolean`) Default set to true, if set to false, it will force the requested resource(s) not to be retrieved from the library cache.
    -   _fetch_ (`Object`) The [fetch API options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options) object.

**Returns** a _promise_ (or an _array of promises_ if multiple resources are passed) with a `Blob` resolution type.

## `load(resource, [options])`

This method **fetches** the given **resource(s)** and possibly **attach** it to an existent **element** compatibly with the given **options** object.

It is passed the following **arguments**:

-   _resource_ (`String`|`URL`|`Blob`|`Array.<String>`|`Array.<URL>`|`Array.<Blob>`) The resource(s) url to be fetched and loaded or the resource(s) blob to be loaded.
-   _options_ (`Object`|`Array.<Object>`) An object or an array of objects with the options consumed by the load method.
    -   (fetch method options)
    -   _element_ (`HTMLElement`) The element to attach the fetched resource(s) to.
    -   _filter_ (`String`) Used only when fetching `text/html`, traverses the fetched DOM in order to append only a certain part of it.

**Returns** a _promise_ (or an _array of promises_ if multiple resources are passed) whose resolution type varies depending on the given resource MIME type:

| MIME type      | Returned Type   |
| -------------- | --------------- |
| `text/html`    | `String`        |
| `text/css`     | `CSSStyleSheet` |
| `*/javascript` | `Object`        |
| `image/*`      | `Event`         |

## `register(type, loader)`

This method lets you **register** a custom **loader** for a given MIME type.

It is passed the following **arguments**:

-   _resource_ (`String`) The MIME type to be manually
    handled. A specificity prioritization is applied, which means that while "_text/html_" would win over "_text_" and "_html_", "_text_" would win over "_html_".
-   _options_ (`Function`) The loader function itself. Please note that this function should accept a mandatory `Blob` **resource** argument (besides an optional `Object` **options** argument) and should return a `Promise`.

Have a look at the [Manual Handling](#manual-handling) section for a code example.

# Recipes and Demos

Let's go into detail by cooking some of the most common recipes.

#### All live demos:

-   [Loading HTML](https://memob0x.github.io/loader/demo/html/index.html)
-   [Loading Stylesheets](https://memob0x.github.io/loader/demo/css/index.html)
-   [Loading Scripts](https://memob0x.github.io/loader/demo/javascript/index.html)
-   [Lazily Loading Images](https://memob0x.github.io/loader/demo/images/index.html)

## [HTML](https://memob0x.github.io/loader/demo/html/index.html)

`Loader` supports `text/html` MIME type so it can be used to retrieve new contents, also with `load` method updating the current view with fresh data is quite easy.

```javascript
// updating #root with new contents
new Loader().load("/Messages/Inbox", {
    // injection target
    element: document.querySelector("#root"),
    // result filter selector
    filter: "#root .messages",
    // fetch API options
    fetch: {
        body: JSON.stringify({
            timestamp: new Date().getTime(),
            foo: "bar"
        })
    }
});
```

Here's the full [demo](https://memob0x.github.io/loader/demo/html/index.html).

## [Stylesheets](https://memob0x.github.io/loader/demo/css/index.html)

`Loader` supports `text/css` MIME type so it can be used as an asynchronous stylesheets load callback (which is a quite an [ancient cross-browser issue](https://www.phpied.com/when-is-a-stylesheet-really-loaded/)).

```javascript
// loading a new visual theme and a new app area
Promise.allSettled(
    new Loader().load(["theme.blue.css", "area.account.css"])
).then(() =>
    // page ready, removing spinners and preloaders previously set
    document.body.classList.add("page-ready")
);
```

Here's the full [demo](https://memob0x.github.io/loader/demo/css/index.html).

## [Scripts](https://memob0x.github.io/loader/demo/javascript/index.html)

`Loader` internally uses dynamic `import` for `text/javascript` MIME type so it can be used to consume any kind of native module.

```javascript
// retrieving and consuming a specific module
new Loader().load("cart.js").then((module) => {
    const Cart = module.default;
    const cart = new Cart();

    cart.add("product-foo-12345678-bar");
});
```

Here's the full [demo](https://memob0x.github.io/loader/demo/javascript/index.html).

## [Lazy Images](https://memob0x.github.io/loader/demo/images/index.html)

`Loader` can be used with `IntersectionObserver` to provide an easy and enhanced lazy load functionality.

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

Here's the full [demo](https://memob0x.github.io/loader/demo/images/index.html).

## Manual Handling

`Loader` supports **custom loaders registration** which means that you can add support for MIME types that are not already supported by default, override the default ones or even wrap legacy resource loaders in order to enhance existent perfomance state.

The following example is adapted to support **pdf** files.

```javascript
// constructing a Loader instance
const loader = new Loader();

// registering a custom loader for "application/pdf" MIME type
loader.register("application/pdf", async (blob, options) => {
    // creating an url from a blob
    const url = URL.createObjectURL(blob);

    // handling pdf load (to be replaced with your own working implementation)
    const result = await Promise.resolve("handled");

    // doing something with the given options (optional)
    options.element.classList.add("loaded");

    // dispose the previously created url
    URL.revokeObjectURL(url);

    // returning the handler result
    return result;
});

// fetching depliant.pdf file in a separate thread and doing something with a DOM node to provide feedback to the user
loader.load("depliant.pdf", { element: document.querySelector("#depliant") });
```

## Requirements

For basic functionality of this library (plugins excluded) the following requirements are needed:

-   https://caniuse.com/#feat=webworkers
-   https://caniuse.com/#feat=fetch
-   https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
