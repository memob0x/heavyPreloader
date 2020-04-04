# loader.js
![Node.js CI](https://github.com/memob0x/loader/workflows/Node.js%20CI/badge.svg?branch=new-aim)

💤 [**loader.js**](https://memob0x.github.io/loader/demos/) is a small script that lets you programmatically fetch whatever resource type you want in a separate thread leaving the main one free to "concentrate" on animations and other visually noticeable changes in order to enhance the perceived performance to the end user.

# Recipees
It uses `Worker` and `fetch` API to retrieve a `Blob` object to the main thread in order to be consumed by `URL` API.

## [Lazyload Images](https://memob0x.github.io/loader/demos/lazy-load-images/)
```javascript
//
const loader = new Loader();
const observer = new IntersectionObserver(callback);

//
const images = document.querySelectorAll("img[data-src]");
//
[...images].forEach(image => observer.observe(image));

/**
 * 
 */
function observerCallback(entries){
    const visibleImages = entries.filter(entry => entry.isIntersecting)
    
    visibleImages.forEach(onEntryIntersection);
}

/**
 * 
 */
function onEntryIntersection(image){
    const image = entry.target;

    observer.unobserve(image);

    const blob = await loader.fetch(image.dataset.src);
    const url = URL.createObjectURL(blob);
    const dispose = () => URL.revokeObjectURL(url);

    x.onload = dispose;
    x.onerror = dispose;

    x.src = url;
}
```

## [Stylesheets Loader](https://memob0x.github.io/loader/demos/async-styles/)
This can be used to achieve a proper asynchronous stylesheets load callback (wich is a quite ancient cross-browser [problem](https://www.phpied.com/when-is-a-stylesheet-really-loaded/)).

```javascript
//
const loader = new Loader();

//
const stylesheetsLoad = loader.fetch([
    "dist/header.css",
    "dist/footer.css",
    "dist/menu.css",
    "dist/account.css"
]);

//
Promise.allSettled(stylesheetsLoad).then() => document.body.classList.remove("page-loading-spinner"));

//
stylesheetsLoad.forEach(async (stylesheetLoad) => {
    //
    const blob = await stylesheetLoad;
    const url = URL.createObjectURL(blob);

    //
    const sheet = new CSSStyleSheet();
    const promise = sheet.replace(`@import url("${url}")`);
    if ("adoptedStyleSheets" in document) {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    }

    //
    promise.finally(() => URL.revokeObjectURL(url));
});
```

## Scripts Loader
In large applications the list of asynchronous scripts to be loaded may become quite long, give em to another thread, keeping the script loader of your choice.

### [requirejs](https://memob0x.github.io/loader/demos/require/)

```javascript
//
const loader = new Loader();

/**
 * 
 */
const include = async (path) => {
    //
    const blob = await loader.fetch(path);
    const url = URL.createObjectURL(blob);

    //
    const result = new Promise((resolve, reject) => require(url, resolve, reject));

    //
    result.finally(() => URL.revokeObjectURL(url));

    //
    return result;
}

//
include("cart.js").then(Cart => {
    const cart = new Cart();
    
    cart.add("product-foo-12345678-bar");
});
```

### [Native imports](https://memob0x.github.io/loader/demos/import/)

```javascript
//
const loader = new Loader();

/**
 * 
 */
const include = async (path) => {
    //
    const blob = await loader.fetch(path);
    const url = URL.createObjectURL(blob);

    //
    const result = await import(url)

    //
    URL.revokeObjectURL(url);

    //
    return result;
}

//
include("product.js").then(Cart => {
    const product = new Product("product-foo-12345678-bar");

    console.log(product.color, product.sizes);
});
```

# Fetch settings
The class constructor accepts an only `Object` parameter that is internally passed to the `fetch` API to provide [options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options).

```javascript
const instance = new Loader({
    method: 'POST',
    mode: 'cors'
    // ...
});
```

## Requirements

* https://caniuse.com/#feat=webworkers
* https://caniuse.com/#feat=fetch
* https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL