# [loader.js](https://memob0x.github.io/loader/demos/index.html)

![Node.js CI](https://github.com/memob0x/loader/workflows/Node.js%20CI/badge.svg?branch=new-aim)

💤 **loader.js** is a small script that lets you programmatically fetch whatever resource type you want in a separate thread leaving the main one free to "concentrate" on animations and other visually noticeable changes in order to enhance the perceived performance to the end user.

# Recipees

Under the hood this script uses `Worker` and `fetch` API to retrieve a `Blob` object to the main thread in order to be consumed by `URL` API.

## [HTML](https://memob0x.github.io/loader/demos/html.html)

This can be used to retrieve views.

```javascript
//
void new Loader()
    .load("/Messages/Inbox")
    .then((result) => (document.body.innerHTML = result));
```

## [Stylesheets Loader](https://memob0x.github.io/loader/demos/styles.html)

This can be used to achieve a proper asynchronous stylesheets load callback (wich is a quite ancient cross-browser [problem](https://www.phpied.com/when-is-a-stylesheet-really-loaded/)).

```javascript
(async () => {
    //
    await Promise.allSettled(
        new Loader().load(["theme.blue.css", "area.account.css"], document)
    );

    //
    document.body.classList.remove("page-loading-spinner");
})();
```

## [Scripts Loader](https://memob0x.github.io/loader/demos/scripts.html)

In large applications the list of asynchronous scripts to be loaded may become quite long, give em to another thread, keeping the script loader of your choice.

```javascript
//
void new Loader().load("cart.js").then((Cart) => {
    const cart = new Cart();

    cart.add("product-foo-12345678-bar");
});
```

## [Lazyload Images](https://memob0x.github.io/loader/demos/image.html)

```javascript
//
const loader = new Loader();

//
const observer = new IntersectionObserver((entries) =>
    entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
            const image = entry.target;

            //
            observer.unobserve(image);

            //
            loader.load(image.dataset.src, image);
        })
);

//
[...document.querySelectorAll("img[data-src]")].forEach((image) =>
    observer.observe(image)
);
```

## [Manual Handling: RequireJS](https://memob0x.github.io/loader/demos/require.html)

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

# Fetch settings

The class constructor accepts an only `Object` parameter that is internally passed to the `fetch` API to provide [options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options).

```javascript
const loader = new Loader({
    method: "POST",
    mode: "cors",
    // ...
});
```

## Requirements

-   https://caniuse.com/#feat=webworkers
-   https://caniuse.com/#feat=fetch
-   https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
