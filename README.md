# nite-cropper
### Basic
<p>Consider a box <em>.inscribe</em> which takes up a certain amount of space <em>(for wathever reason: width, height, padding...)</em>.</p>

```
<div class="inscribe">
   <img src="http://placehold.it/120x120.jpg" />
</div>
```

<p>If you want to <strong>cover ✂</strong> that element with an <em>&lt;img /&gt;</em> tag without using <em>css backgrounds</em> just do:</p>

```
$('.inscribe').niteCrop();
```

<p>That's it! 👏 </p>

<hr>
<p>This plugin listens to images 'load', and videos 'onloadedmetadata' events so you don't need to wait for those stuff with other plugins. 👌 </p>
<hr>

<p>You may need to address specific elements:</p>

```
$('.inscribe').niteCrop({
  elements : 'img.inscribe__element, video.inscribe__element'
});
```

<br>

### Advanced
<p>If you want to crop a block-level element (<em>&lt;div&gt;</em>,<em>&lt;span&gt;</em>, 🍫 etc...) you need to define its size like that:</p>

```
$('.inscribe').niteCrop({
  elements : 'div',
  width : 1920,
  height : 1240
});
```

<hr>

<p>🎟️ There's a dedicated <strong>event</strong> that occurs when the operation is done:</p>

```
$(document).on('niteCrop', '.inscribe', function(){

   $(this).addClass('inscribed');
   
});

```

<hr>

<p>If you change your mind you can destroy an instance.</p>

```
$('.inscribe').niteCrop('destroy');
```

<hr>

<p>You can get useful data 🎒 with this:</p>

```
var usefulCropData = $('.inscribe img').data('niteCropper');
```
<br>

### Extra

<p>There's an awesome built-in parallax func! 😎</p>

```
$('.inscribe-with-parallax').niteCrop({
   parallax : true
});

$('.inscribe-with-parallax--horizontal-only').niteCrop({
   parallax : 'horizontal'
});

$('.inscribe-with-parallax--vertical-only').niteCrop({
   parallax : 'vertical'
});
```
<hr>

<br><br><br>

<em>TO BE CONTINUED...</em>
