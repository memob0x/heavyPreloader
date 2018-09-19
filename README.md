
WIP...

💤 A preloader/lazy-load library for images, videos, and audio elements with full control on events callbacks, loading percentage, sequential/parallel mode, resources auto-discovery (including backgrounds), and much more.

```
let loadInstance = new Loader({
    srcAttr: 'data-src',
    srcsetAttr: 'data-srcset',
    playthrough: false,
    visible: false,
    backgrounds: false
});
```

```
loadInstance.collection = ['image-1.jpg', 'image-2.webp', 'video.webm', 'audio.mp3'];
```

```
loadInstance.collection = document.body;
```

```
loadInstance.collection = document.querySelector('#test');
```

```
Loader.findResources(document.querySelector('#has-backgrounds', { backgrounds:true }));
```

```
Loader.findResources({ backgrounds:true }));
```

```
loadInstance.done((resources) => { });
```

```
loadInstance.load();
```

```
console.log(loadInstance.percentage);
```

```
global event
document.addEventListener('resourceLoad', e => e.detail.element.classList.add('loaded-image'));
```

```
targeted event
[...document.querySelectorAll('figure img')].forEach(element => element.addEventListener('resourceError', e => e.detail.element.classList.add('missing-image')));
```
