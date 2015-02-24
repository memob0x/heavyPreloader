# heavyPreloader
heavyPreloader is a tool that offers an elegant way to detect (or trigger) the loading process of images, and here's an example:
```
<script>
  $.heavyPreload({
    urls : [
      'http://image-url-1.jpg',
      'http://image-url-2.jpg',
      'http://image-url-3.png',
      'http://image-url-4.tif'
    ]
  }, function(){
     // everything is now fully loaded here, m8! ;)
  });
</script>
```
### An images finder
Tired with retrieving all the images urls? Not a problem, <strong>heavyPreloader</strong> can do it for you:
```
<div class="someImages">
  <img src="image-1.gif"/>
  <img src="image-2.jpg"/>
  <img src="image-3.jpg"/>
</div>
```
```
<script>
  $('div.someImages').heavyPreload(function(){
     // sir, your div is now ready for the show!
  });
</script>
```
### Custom attributes
This method won't only look for images contained in <code>&lt;img /&gt;</code> tags, but also in <i>backgrounds</i> defined in your <strong>CSS</strong> and in <strong> custom attributes</strong> you may want to specify, for instance:
```
<article>
  <div data-src="image.gif">
    hey there!
  </div>
  <p data-background=-"image.png">
    some content...
  </p>
  <span rel=-"an-image.jpg" data-src=-"another-one.png">
    lorem ipsum
  </span>
</article>
```
```
<script>
  $('article').heavyPreload({
    attrs : ['data-src', 'data-background', 'rel']
  }, function(){
     // ready! and i've found your special images in those attributes :D
  });
</script>
```
### Callbacks
You want a <i>callback</i> for <u>every single</u> image that <strong>heavyPreloader</strong> would find and load? There's a <code>onProgress</code> function that will suit you well:
```
<script>
  $('div.someImages').heavyPreload({
    onProgress : function(){
      // i've found one more image here, d00d!
    }
  }, function(){
     // cool, everything is now loaded.
  });
</script>
```
---
### Load the entire website!
<i>"Don't bother me once more!"</i>  ─ Ok then... preload your entire app!
```
<script>
  $(document).heavyPreload(function(){
     // Phew, your entire thing is ready...
  });
</script>
```
---
### One last thing before you go... <i>this</i>
In the general callback function <code>this</code> is the current element, so you can do...
```
<script>
  $('html').heavyPreload(function(){
     $(this).addClass('ready');
  });
</script>
```
... and after your page is fully loaded you will have:
```
<html class="ready">
```
