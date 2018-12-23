# loader.js

💤 **loader.js** is a _preload_ and _lazy-load_ library for `img`, `picture`, `video`, `audio` and `iframe` elements with full control on _events callbacks_, _loading percentage_, _sequential_ and _parallel_ mode, resources _auto-discovery_ (including **backgrounds**) and much more.

---

# Basic

The constructor accepts an `Object` as the **only argument** which will be explained in details in the [Advanced](#Advanced) section.

For starters, here's some basic configurations.

## Lazyloader

This configuration woud **trigger the load** of all `img`, `picture`, `video`, `audio`, `iframe` elements with `data-src` and/or `data-srcset` attributes as soon as they **appear in the viewport**. ([Live Demo](https://memob0x.github.io/loader/demos/lazyloader.html))

```javascript
const lazyloader = new Loader({
    lazy: true
});

lazyloader.collection = document.body;

const load = lazyloader.load();

load.progress(resource => console.log(resource.element, 'appeared and loaded.'));
```

## Page Preloader

This configuration would **track the natural load** of all `img`, `picture`, `video`, `audio`, `iframe` elements in page. ([Live Demo](https://memob0x.github.io/loader/demos/page-preloader.html))

```javascript
const preloader = new Loader();

preloader.collection = document.body;

const load = preloader.load();

load.then(() => console.log('Page ready.'));
```

## Static Resources

This configuration would **trigger the load of resource urls** in the `Array`. ([Live Demo](https://memob0x.github.io/loader/demos/urls-preloader.html))

```javascript
const loader = new Loader();

loader.collection = [
    'path/to/resource.jpg',
    'path/to/resource.mp4',
    'path/to/resource.mp3'
];

const load = loader.load();

load.then(() => console.log('All resources are ready.'));
```

## Events

While the retourned `Promise` would let you track the `load` execution status, **events** are attached to the involved DOM **elements** in order to perform more focused operations.

### Scoped

```javascript
document.querySelector('img#logo').addEventListener('resourceLoad', e => e.detail.element.classList.add('loaded'));

document.querySelector('img#logo').addEventListener('resourceError', e => e.detail.element.classList.add('missing'));
```

### Global

```javascript
document.addEventListener('resourceLoad', e => e.detail.element.filter(x => x.matches('img#logo')).classList.add('loaded'));

document.addEventListener('resourceError', e => e.detail.element.filter(x => x.matches('img#logo')).classList.add('missing'));
```

# Advanced

## Settings
Option | Type | Default | Condition | Description
------ | ---- | ------- | --------- | -----------
lazy | boolean | false || Enables _lazyloading_.
srcAttributes | object | { src : 'src', 'srcset: 'srcset' } |  | Sets custom **source** attributes.
|||{ src : 'data-src', 'srcset: 'data-srcset' } | If `lazy` option is set to `true` |
sizesAttributes | object | { sizes: 'sizes', media: 'media' } |  | Sets custom **sizes** and **media** attributes.
|||{ sizes: 'data-sizes', media: 'data-media' } | If `lazy` option is set to `true`
playthrough | boolean | false || Sets `canplaythrough` as the load event for `audio` and `video` **elements** instead of the default `loadedmetadata` event.
backgrounds | boolean | false || Enables the backgrounds detection within the **elements** of the `collection`.
sequential | boolean | false || Loads the `collection` one resource after the other instead of the default parallel mode.
---

## Collection

The `collection` is the list of resources that a `Loader` _instance_ would process.

### Populate

As a **setter**, this **method** would let you create a `collection` based on the supplied value.

#### Elements

A single `HTMLElement` can be supplied...

```javascript
instance.collection = document.querySelector('img#main');
```

...along with a `NodeList` (or an `Array` of **elements**).

```javascript
instance.collection = document.querySelectorAll('img');
```

#### Descendants auto-discovery

A further **media lookup** is triggered by default when an `HTMLElement` or a `NodeList` value is provided, in order to find descendants resources.

```javascript
instance.collection = document.body; // Retrieve img, picture, audio, video, iframe elements inside body.
```

#### Static Resources

Again, you'll be able to supply a single resource **url** `String`...

```javascript
instance.collection = 'image.jpg';
```

...or an `Array` of **strings** of direct resources **urls**.

```javascript
instance.collection = [
    'path/to/image.webp',
    'path/to/video.webm',
    'path/to/audio.mp3'
];
```

### Retrieve

As a **getter**, this **method** gives you back the `collection` as an `Array` of **objects** of `Resource` instances.

```javascript
const collection = instance.collection;
```

#### The Resource Object
To understand what a `Resource` is formed of, have a look at how the following DOM element would be parsed.

```html
<div class="example" style="background-image: url(path/to/resource.png);">Some content...</div>
```

Key | Type | Example Value | Description
--- | ---- | ------------- | -----------
consistent | boolean | false | Wether the element is a **valid DOM element** and its **resource type and extension are supported** by the element itself or not.
element | HTMLElement | div.example | The DOM element.
extension | string | "png" | The file extension.
type | string | "image" | The resource type.
url | string | "path/to/resource.png" | The resource full url.

---

## Execution

Every **_loader.js_** **instance** needs to be initialized.

```javascript
const instance = new Loader();
```

Only then an **instance** can be _launched_ and _process_ its `collection`.

```javascript
const load = instance.load();
```

### Percentage

At any point, as of the `load` taking place, the `percentage` **getter** method can retrieve its percentage state.

```javascript
instance.percentage; // 25, 33.3333, 50 ...
```

### Callbacks

Every `load` call returns a `Promise`.<br>
In addition to its common structure there's a unique `progress` method which fires a **callback** on every _resource load_.

```javascript
load.progress(data => console.log('A resource is ready', data.event, data.resource))
    .catch(error => console.log(error))
    .then(() => console.log('Fulfillment!'));
```
---
