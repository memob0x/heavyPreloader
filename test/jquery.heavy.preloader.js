/*! JQuery Heavy Preloader | Daniele Fioroni | dfioroni91@gmail.com */
(function(window, document, $, undefined){
    'use strict';

    // TODO support <picture>
    // TODO support <iframe>
    // TODO make srcset to load only one pic (the current one) --> done?

    // heavy freamwork
    //----------------
    $.heavy             = undefined === $.heavy ? {} : $.heavy;
    $.heavy.preloader   = { name : 'HeavyPreloader', version : '2.0-beta', method : 'heavyPreload', nameCSS : 'heavy-preloader' };

    var mediaSupport = function(type, extension){

        var tmpVid = document.createElement(type);

        return tmpVid.canPlayType(type+'/'+extension);

    };

    if( mediaSupport('video', 'ogg') )
        $.heavy.videoSupport = 'ogg';

    if( mediaSupport('video', 'ogv') )
        $.heavy.videoSupport = 'ogv';

    if( mediaSupport('video', 'webm') )
        $.heavy.videoSupport = 'webm';

    if( mediaSupport('video', 'mp4') )
        $.heavy.videoSupport = 'mp4';

    if( mediaSupport('audio', 'ogg') )
        $.heavy.audioSupport = 'ogg';

    if( mediaSupport('audio', 'mp3') )
        $.heavy.audioSupport = 'mp3';

    $[$.heavy.preloader.method]    = function(element, options, callback){

        if( $.isFunction(options) && undefined === callback ) {
            callback = options;
            options = {};
        }

        var plugin = this,

            $element = $(element),

            collection = [],

            defaults = {
                attrs        : [],
                backgrounds  : false,
                onProgress   : null
            },

            isImage = function( url ){

                return /([^\s]+(?=\.(jp[e]?g|gif|png|tif[f]?|bmp))\.\2)/gi.test( url );

            },
            isAudio = function( url ){

                return /([^\s]+(?=\.(mp3|ogg))\.\2)/gi.test( url );

            },
            isVideo = function( url ){

                return /([^\s]+(?=\.(mp4|ogv|webm|ogg))\.\2)/gi.test( url );

            },

            collect = function(urls, $element, type){

                if( undefined === urls || urls === false )
                    return;

                var urls = urls.split(/,|\s/);

                for( var k in urls ) {

                    var url = urls[k].replace(/\"|\'|\)|\(|url/gi, '');

                    switch( type ){

                        case 'image':

                            if( isImage(url) ) {

                                collection.push({
                                    $el: $element,
                                    url: url,
                                    type: type,
                                    ext: url.match(/jp[e]?g|gif|png|tif[f]?|bmp/gi)
                                });

                            }

                        break;

                        case 'audio/video':

                            if( isAudio(url) ) {

                                var ext = url.match(/mp3|ogg/gi);

                                if( mediaSupport('audio', ext) ) collection.push({
                                    $el: $element,
                                    url: url,
                                    type: type,
                                    ext: ext
                                });

                            }

                            if( isVideo(url) ) {

                                var ext = url.match(/mp4|ogv|ogg|webm/gi);

                                if( mediaSupport('video', ext) ) collection.push({
                                    $el: $element,
                                    url: url,
                                    type: type,
                                    ext: ext
                                });

                            }

                        break;

                    }

                }

            };

        plugin.settings = {};
        plugin.settings = $.extend({}, defaults, options);

        plugin.element = $element;

        plugin.destroy = function(){

            $collection.off('.'+ $.heavy.preloader.name);

        }

        plugin.settings.attrs = typeof plugin.settings.attrs === 'string' ? [plugin.settings.attrs] : plugin.settings.attrs;

        plugin.init = function(){

            // custom attrs in other tags
            if( plugin.settings.attrs && !plugin.element.is('img') && !plugin.element.is('audio') && !plugin.element.is('video') && !plugin.element.is('source') )
                for( var k in plugin.settings.attrs ){

                    // se this ha un custom attr
                    if( plugin.element.is('['+plugin.settings.attrs[k]+']') ) {

                        var url = plugin.element.attr(plugin.settings.attrs[k]);

                        collect(url, null, isImage(url) ? 'image' : 'audio/video');

                    }

                    // se trovo un custom attr
                    plugin.element.find('['+plugin.settings.attrs[k]+']:not(img, audio, video, source)').each(function(){

                        var url = $(this).attr(plugin.settings.attrs[k]);

                        collect(url, null, isImage(url) ? 'image' : 'audio/video');

                    });

                }

            // se this è un audio / video
            if( plugin.element.is('video') || plugin.element.is('audio') )
                plugin.element.children('source').each(function(){

                    var interrupt = false;

                    if( $(this).is('[data-src]') ) {
                        collect($(this).attr('src'), plugin.element, 'audio/video');
                        interrupt = true;
                    }

                    if( interrupt )
                        return true;

                    if( plugin.settings.attrs ) for( var k in plugin.settings.attrs )
                        if( $(this).is('['+plugin.settings.attrs[k]+']') ) {
                            collect($(this).attr(plugin.settings.attrs[k]), plugin.element, 'audio/video');
                            interrupt = true;
                        }

                    if( interrupt )
                        return true;

                    if( $(this).is('[data-src]') ) {
                        collect( $(this).data('src'), plugin.element, 'audio/video' );
                    }

                });
            // se this è una source video/audio
            if( plugin.element.is('source') ){

                var interrupt = false;

                if( plugin.element.is('[src]') ){
                    collect( plugin.element.attr('src'), plugin.element.closest('audio, video'), 'audio/video' );
                    interrupt = true;
                }

                if( !interrupt && plugin.settings.attrs ) for( var k in plugin.settings.attrs )
                    if( $(this).is('['+plugin.settings.attrs[k]+']') ) {
                        collect(plugin.element.attr(plugin.settings.attrs[k]), plugin.element, 'audio/video');
                        interrupt = true;
                    }

                if( !interrupt && plugin.element.is('[data-src]') )
                    collect( plugin.element.data('src'), plugin.element.closest('audio, video'), 'audio/video' );

            }
            // cerca video e audio
            plugin.element.find('video, audio').children('source').each(function(){

                var interrupt = false;

                if( $(this).is('[src]') ) {
                    collect($(this).attr('src'), $(this).parent(), 'audio/video');
                    interrupt = true;
                }

                if( interrupt )
                    return true;

                if( plugin.settings.attrs ) for( var k in plugin.settings.attrs )
                    if( $(this).is('['+plugin.settings.attrs[k]+']') ) {
                        collect($(this).attr(plugin.settings.attrs[k]), $(this).parent(), 'audio/video');
                        interrupt = true;
                    }

                if( interrupt )
                    return true;

                if( $(this).is('[data-src]') ) {
                    collect( $(this).data('src'), $(this).parent(), 'audio/video' );
                }


            })

            // se this è un immagine
            if( plugin.element.is('img') ){ // todo check priorities

                var interrupt = false;

                if( plugin.element.is('[src]') ){
                    collect( plugin.element.attr('src'), plugin.element, 'image' );
                    interrupt = true;
                }

                if( !interrupt && plugin.element.is('[srcset]') ) {
                    collect(plugin.element.attr('srcset'), plugin.element, 'image');
                    interrupt = true;
                }

                if( plugin.settings.attrs ) for( var k in plugin.settings.attrs )
                    if( plugin.element.is('['+plugin.settings.attrs[k]+']') ) {
                        collect(plugin.element.attr(plugin.settings.attrs[k]), plugin.element, 'image');
                        interrupt = true;
                    }

                if( !interrupt && plugin.element.is('[data-src]') )
                    collect( plugin.element.attr('data-src'), plugin.element, 'image' );

            }
            // cerca immagini
            plugin.element.find('img').each(function(){

                var interrupt = false;

                if( $(this).is('[src]') ){
                    collect( $(this).attr('src'), $(this), 'image' );
                    interrupt = true;
                }

                if( interrupt )
                    return true;

                if( $(this).is('[srcset]') ){
                    collect( $(this).attr('srcset'), $(this), 'image' );
                    interrupt = true;
                }

                if( interrupt )
                    return true;

                if( plugin.settings.attrs ) for( var k in plugin.settings.attrs )
                    if( $(this).is('['+plugin.settings.attrs[k]+']') ) {
                        collect($(this).attr(plugin.settings.attrs[k]), $(this), 'image');
                        interrupt = true;
                    }

                if( interrupt )
                    return true;

                if( $(this).is('[data-src]') ){
                    collect( $(this).data('src'), $(this), 'image' );
                }

            });

            //se this ha un background
            if( plugin.settings.backgrounds && document !== plugin.element[0] && plugin.element.css('background-image') != 'none' )
                gcollect( plugin.element.css('background-image'), null, 'image' );
            // trovo sfondi
            if( plugin.settings.backgrounds )
                plugin.element.find('*:not(img)').filter(function(){ return $(this).css('background-image') != 'none'; }).each(function(){

                    collect( $(this).css('background-image'), null, 'image' );

                });

            var count  = 0,
                length = collection.length,
                progress = function(){

                    count++;

                    plugin.progress = count / length * 100;

                    if( $.isFunction(plugin.onProgress) )
                        plugin.onProgress();

                    if( count === length )
                        callback();

                }


            if( length ){

                $.each(collection, function(i, v){

                    switch( v.type ){

                        case 'image' :

                            var $target = !v.$el ? $(new Image()) : v.$el;

                            $target
                                .error(progress)
                                .load(progress)
                                .not('[src]')
                                    .attr('src', v.url+'?'+ $.heavy.preloader.nameCSS)
                                    .removeAttr('data-src');

                        break;

                        case 'audio/video' :

                            if( v.$el ){

                                var done = function () {

                                    if( this.paused )
                                        this.currentTime = 0;

                                    v.$el.off('.'+ $.heavy.preloader.name);

                                    progress();

                                };


                                v.$el

                                    .find('source[type*="/'+ v.ext +'"], source[src*=".'+ v.ext +'"], source[data-src*=".'+ v.ext +'"]')
                                        .not('[src]')
                                            .attr('src', v.url+'?'+ $.heavy.preloader.nameCSS)
                                            .removeAttr('data-src')
                                        .end()
                                    .end()

                                    .load()

                                    .on('canplaythrough.' + $.heavy.preloader.name, done)

                                    .on('loadedmetadata.' + $.heavy.preloader.name, function () {

                                        if( this.paused )
                                            this.currentTime++;

                                    })

                                    .on('progress.' + $.heavy.preloader.name, function () {

                                        if (this.readyState > 0 && !this.duration) { // error!

                                            done();

                                            return;

                                        }

                                        if( this.paused )
                                            this.currentTime++; // force

                                    });

                            }

                        break;


                    }


                });

            }else
                callback();

        }

        plugin.init();

    },


    $.fn[$.heavy.preloader.method] = function(options, callback){

        return this.each(function(){

            if( $.isFunction(options) && undefined === callback ){
                callback = options;
                options = {};
            }

            var t = this,
                c = function(){
                    callback.call(t);
                };

            // loop
            if( undefined == $(this).data($.heavy.preloader.name) ){

                var plugin = new $[$.heavy.preloader.method](this, options, c)

                $(this).data($.heavy.preloader.name, plugin);

            }

        });
    };

})(window, document, jQuery);


/*
todo

$(new Image())

e

var $tmp = $('<'+( isVideo(url) ? 'video' : 'audio' )+' />', {
 src: url + '?' + $.heavy.preloader.nameCSS,
 type: ( isVideo(url) ? 'video' : 'audio' ) + '/' + ( isVideo(url) ? vidExt : audExt ),
 muted: true,
 preload: 'metadata'
});

$('body').append( $tmp.css({
 width       : 2,
 height      : 1,
 visibility  : 'hidden',
 position    : 'absolute',
 left        : -9999,
 top         : -9999,
 'z-index'   : -1
}) );


 */
