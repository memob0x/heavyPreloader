# Loader

💤 A preloader/lazy-load library for images, videos, and audio elements with full control on events callbacks, loading percentage, sequential/parallel mode, resources auto-discovery (including backgrounds), and much more.

---

## 1. Instance

```
const loader = new Loader();
```

#### Options

```
const loader = new Loader({
    srcAttributes: {
        src: 'data-src',
        srcset: 'data-srcset'
    },
    sizesAttributes: {
        sizes: 'data-sizes',
        media: 'data-media'
    },
    lazy: false,
    playthrough: false,
    backgrounds: false,
    sequential: false
});
```

---

## 2. Collection

```
loader.collection;
```

#### From Element(s)

```
loader.collection = document.body;
```

#### From URLs

```
loader.collection = ['image-1.jpg', 'image-2.webp', 'video.webm', 'audio.mp3'];
```

---

## 3. Execution

```
const load = loader.load();
```

#### Percentage

```
loader.percentage;
```

#### Callbacks

```
load.progress(resource => console.log(resource));
load.then(object => console.log(object));
load.catch(error => console.log(error));
```

---

## 4. Events

#### Scoped

```
document.querySelector('img').addEventListener('mediaLoad', e => e.detail.element.classList.add('loaded'));
document.querySelector('img').addEventListener('mediaError', e => e.detail.element.classList.add('missing'));
```

#### Global

```
document.addEventListener('mediaLoad', e => e.detail.element.classList.add('loaded'));
document.addEventListener('mediaError', e => e.detail.element.classList.add('missing'));
```

---
