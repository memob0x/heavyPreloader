# Loader

💤 A _preloader_ / _lazy-load_ library for `img`, `picture`, `video`, `audio` and `iframe` elements with full control on _events callbacks_, _loading percentage_, _sequential_ / _parallel_ mode, resources _auto-discovery_ (including **backgrounds**), and much more.

---

## Instance

Every **Loader** instance needs to be initialized.

```javascript
const instance = new Loader();
```

#### Options

The constructor accepts the following `Object` _properties_ as only `argument`.

```javascript
const instance = new Loader({
    lazy: false, // preloader mode is by default
    srcAttributes: {
        src: 'src', // data-src is the default if lazy: true
        srcset: 'srcset' // data-srcset is the default if lazy: true
    },
    sizesAttributes: {
        sizes: 'sizes', // data-sizes is the default if lazy: true
        media: 'media' // data-media is the default if lazy: true
    },
    playthrough: false, // "loadedmetadata" is the default load event for audio/video resources
    backgrounds: false, // background are not processed by default
    sequential: false // parallel load is the default loading mode
});
```

---

## Collection

The _collection_ is the list of resources that a **Loader** instance would process.

#### Populate

As a `setter`, this method would let you to create a _collection_ based on the supplied value.

##### ...with element(s)

A single `HTMLElement` can be supplied...

```javascript
instance.collection = document.querySelector('img#main');
```

...as long as a `NodeList`.

```javascript
instance.collection = document.querySelectorAll('img');
```

##### ...and descendants auto-discovery

A further **media lookup** is triggered by default when an `HTMLElement` or a `NodeList` value is supplied, in order to find descendants resources.

```javascript
instance.collection = document.body; // All img, picture, audio, video, iframe tags inside body.
```

##### ...with URL(s)

Just like element-values, you'll be able to supply a single `String` of **url**...

```javascript
instance.collection = 'image.jpg';
```

...or an `Array.<String>` of **urls**.

```javascript
instance.collection = ['image.jpg', 'another-image.webp', 'video.webm', 'another-video.mp4', 'audio.mp3'];
```

#### Retrieve

As a `getter`, this method gives you back the collection as an `Array.<Object>` of `Resource` instances.

```javascript
const collection = instance.collection;
```

<!-- TODO: describe type Resource -->

---

## Execution

Every instance needs to be _launched_ in order for it to process its own collection.

```javascript
const load = instance.load();
```

#### Percentage

At any point, as of the **load** taking place, the _percentage_ `getter` method can retrieve its percentage state.

```javascript
instance.percentage; // 25, 33.3333, 50 ...
```

#### Callbacks

Every **load** call returns a `Promise`-like `Object`.<br>
In addition to its common structure there's a unique `progress` method which fires a **callback** on every _resource load_.

```javascript
load.progress(data => console.log('A resource is ready', data.event, data.resource))
    .catch(error => console.log(error))
    .then(() => console.log('Fulfillment!'));
```

---

## Events

#### Scoped

```javascript
document.querySelector('img').addEventListener('resourceLoad', e => e.detail.element.classList.add('loaded'));

document.querySelector('img').addEventListener('resourceError', e => e.detail.element.classList.add('missing'));
```

#### Global

```javascript
document.addEventListener('resourceLoad', e => e.detail.element.classList.add('loaded'));

document.addEventListener('resourceError', e => e.detail.element.classList.add('missing'));
```

---

## Examples

#### Lazyloader

The [following example](https://memob0x.github.io/loader/demos/lazyloader.html) woud **trigger the load** of all `img`, `picture`, `video`, `audio`, `iframe` elements with `data-src` and/or `data-srcset` attributes as soon as they **appear in the viewport**.

```javascript
const lazyloader = new Loader({
    lazy: true
});

lazyloader.collection = document.body;

const load = lazyloader.load();

load.progress(resource => console.log(resource.element, 'appeared and loaded.'));
```

#### Page Preloader
The [following example](https://memob0x.github.io/loader/demos/page-preloader.html) would **track the natural load** of all `img`, `picture`, `video`, `audio`, `iframe` elements in page.

```javascript
const preloader = new Loader();

preloader.collection = document.body;

const load = preloader.load();

load.then(() => console.log('Page ready.'));
```

#### Static Resources
The [following example](https://memob0x.github.io/loader/demos/urls-preloader.html)  would **trigger the load of resource urls** in the `array`.

```javascript
const loader = new Loader();

loader.collection = ['resource.jpg', 'resource.mp4', 'resource.mp3'];

const load = loader.load();

load.then(() => console.log('All resources are ready.'));
```

---
