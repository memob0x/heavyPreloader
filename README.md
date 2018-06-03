```
let niteLoadInstance = new NiteLoader({
    srcAttr: 'data-src',
    srcsetAttr: 'data-srcset',
    playthrough: false,
    visible: false,
    backgrounds: false
});
```

```
niteLoadInstance.collection = ['image-1.jpg', 'image-2.webp', 'video.webm', 'audio.mp3'];
```

```
niteLoadInstance.collection = document.body;
```

```
niteLoadInstance.collection = document.querySelector('#test');
```

```
NiteLoader.findResources(document.querySelector('#has-backgrounds', { backgrounds:true }));
```

```
NiteLoader.findResources({ backgrounds:true }));
```

```
niteLoadInstance.done((resources) => { });
```

```
niteLoadInstance.load();
```

```
console.log(niteLoadInstance.percentage);
```

```
$('.playground').niteLoad({
    srcAttr: 'data-src',
    srcsetAttr: 'data-srcset',
    visible: false,
    sequential: false,
    backgrounds: false,
    extraAttrs: [],
    playthrough: false,
    early: false,
    earlyTimeout: 0,
    onProgress: () => { },
    onLoad: () => { },
    onError: () => { },
    onComplete: () => { },
});
```

```
$(document).on('niteLoad.nite niteError.nite', function (e, element) {

    console_log('jQuery.fn.niteLoad(): ' + element);

});
```

```
$(document).on('niteError.nite', 'figure img', function (e) {

    $(this).closest('figure').addClass('error');

});
```

```
$(document).on('niteLoad.nite niteError.nite', 'figure img, figure video', function (e) {

    $(this).closest('figure').addClass('loaded' + (e.type === 'niteError' ? '-error' : ''));

});
```
