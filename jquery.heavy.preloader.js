/*! JQuery Heavy Preloader | Daniele Fioroni | dfioroni91@gmail.com */
(function(window, document, $, undefined){
    'use strict';

    // heavy freamwork
    //----------------
    $.heavy             = undefined === $.heavy ? {} : $.heavy;
    $.heavy.preloader   = { name : 'HeavyPreloader', version : '1.4.1d', method : 'heavyPreload', nameCSS : 'heavy-preloader' };

    var mediaSupport = function(type, extension){

            var tmpVid = document.createElement(type);

            return tmpVid.canPlayType(type+'/'+extension);

        },

        isImage = function( url ){

            if( /([^\s]+(?=\.(jp[e]?g|gif|png|tif[f]?|bmp))\.\2)/gi.test( url ) )
                return url.match(/jp[e]?g|gif|png|tif[f]?|bmp/gi);
            else
                return false;

        },
        isAudio = function( url ){

            if( /([^\s]+(?=\.(mp3|ogg))\.\2)/gi.test( url ) )
                return url.match(/mp3|ogg/gi);
            else
                return false;

        },
        isVideo = function( url ){

            if( /([^\s]+(?=\.(mp4|ogv|webm|ogg))\.\2)/gi.test( url ) )
                return url.match(/mp4|ogv|ogg|webm/gi);
            else
                return false;

        },

        __preloadImage = function($el, url, ext, cb){

            $el
                .one('load.'+ $.heavy.preloader.name+' error.'+ $.heavy.preloader.name, function(){

                    cb.call({
                        type : 'image',
                        naturalWidth : this.naturalWidth,
                        naturalHeight : this.naturalHeight
                    });

                })
                .attr('src', url)
                .removeAttr('data-src');

            if( $el[0].complete === true ) // todo: check --> this should solve iOS gif bug
                $el.trigger('load.'+ $.heavy.preloader.name);

            return $el;

            // todo !!! iOS has a bug with gifs ;( they won't load.. they will take forever ... add a timer fallback?
            //if( ext === 'gif' && ( navigator.userAgent.indexOf('Safari') > -1 || (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ) )
            //    cb();

        },
        __fakeMedia    = function(url, type, ext){

            var $el = $('<'+type+' />', {
                src: url,
                type: type + '/' + ext,
                muted: true,
                preload: 'metadata'
            });

            $('body').append( $el.addClass($.heavy.preloader.nameCSS+'-temp').css({
                width       : 2,
                height      : 1,
                visibility  : 'hidden',
                position    : 'absolute',
                left        : -9999,
                top         : -9999,
                'z-index'   : -1
            }) );

            return $el;

        },
        __preloadMedia = function($el, cb){

            var el   = $el[0],
                wasPaused = el.paused,
                done = function () {

                    if( wasPaused )
                        el.currentTime = 0;

                    $el.off('.'+ $.heavy.preloader.name);

                    cb.call({
                        type : 'image',
                        duration : el.duration // todo --> find useful data...
                    });

                    if( $el.hasClass($.heavy.preloader.nameCSS+'-temp') )
                        $el.remove();

                };

            el.load();

            $el

                .on('canplaythrough.' + $.heavy.preloader.name, done)

                .on('loadedmetadata.' + $.heavy.preloader.name, function () {

                    if( wasPaused )
                        el.currentTime++;

                })

                .on('progress.' + $.heavy.preloader.name, function () {

                    if ( el.readyState > 0 && !el.duration ) { // error!

                        done();

                        return;

                    }

                    if( wasPaused )
                        el.currentTime++; // force

                });

            return $el;

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

    // shorthand
    $.heavy.preload = function(urls, onProgress, callback /*, todo pipeline */ ){

        if( !$.isArray(urls) )
            return;

        var pg = function(){

                if( $.isFunction(onProgress) )
                    onProgress.call(this);

            },
            cb = function(){

                if( $.isFunction(callback) )
                    callback.call(this);

            },

            datas = [],

            count  = 0,
            length = urls.length,
            progress = function(){

                count++;

                pg.call(this);

                if( count === length )
                    cb.call(datas);

            };

        pg.call(null);

        if( length ) for( var k in urls ){

            var url = urls[k];

            if( isImage(url) )
                __preloadImage($(new Image()), url + '?' + $.heavy.preloader.nameCSS, isImage(url), function(){
                    datas.push(this);
                    progress.call(this);
                });

            if( isAudio(url) )
                __preloadMedia(__fakeMedia(url + '?' + $.heavy.preloader.nameCSS, 'audio', isAudio(url)), function(){ 
                    datas.push(this);
                    progress.call(this);
                });

            if( isVideo(url) )
                __preloadMedia(__fakeMedia(url+'?'+ $.heavy.preloader.nameCSS, 'video', isVideo(url)), function(){
                    datas.push(this);
                    progress.call(this);
                });

        } else{

            pg.call(null);

            cb();

        }

    }

    $[$.heavy.preloader.method]    = function(element, options, callback){

        if( $.isFunction(options) && undefined === callback ) {
            callback = options;
            options = {};
        }

        var plugin = this,

        //eventID = Math.floor( Math.random() * 99999),

            $element = $(element),

            collection = [],

            defaults = {
                pipeline   : false,
                attrs        : [],
                backgrounds  : false,
                onProgress   : null // todo check!
            },

            collect = function(urls, $element, type){

                if( undefined === urls || urls === false )
                    return;

                var urls = urls.split(/,|\s/);

                for( var k in urls ) {

                    var url = urls[k].replace(/\"|\'|\)|\(|url/gi, '');

                    switch( type ){

                        case 'image':

                            var extImage = isImage(url);

                            if( extImage ) {

                                extImage = extImage[0];

                                if( null === $element || !$.data($element[0], $.heavy.preloader.name) ){

                                    var obj = {
                                        url: url,
                                        type: type,
                                        ext: extImage
                                    };

                                    if( null !== $element )
                                        $element.data($.heavy.preloader.name, obj);

                                    collection.push( $.extend(true, { $el: $element }, obj) );

                                }

                            }

                            break;

                        case 'audio/video':

                            var extAudio = isAudio(url);

                            if( extAudio ) {

                                extAudio = extAudio[0];

                                if( mediaSupport('audio', extAudio) && ( null === $element || !$.data($element[0], $.heavy.preloader.name) ) ){

                                    var obj = {
                                        url: url,
                                        type: type,
                                        ext: extAudio
                                    };

                                    if( null !== $element )
                                        $element.data($.heavy.preloader.name, obj);

                                    collection.push( $.extend(true, { $el: $element }, obj) );

                                }

                            }

                            var extVideo = isVideo(url);

                            if( extVideo ) {

                                extVideo = extVideo[0];

                                if( mediaSupport('video', extVideo) && ( null === $element || !$.data($element[0], $.heavy.preloader.name) ) ) {

                                    var obj = {
                                        url: url,
                                        type: type,
                                        ext: extVideo
                                    };

                                    if( null !== $element )
                                        $element.data($.heavy.preloader.name, obj);

                                    collection.push( $.extend(true, { $el: $element }, obj) );

                                }

                            }

                            break;

                    }

                }

            };

        plugin.settings = {};
        plugin.settings = $.extend({}, defaults, options);

        plugin.element = $element;

        plugin.destroy = function(){

            // todo --> do it...

            collection = [];

        }

        plugin.settings.attrs = typeof plugin.settings.attrs === 'string' ? [plugin.settings.attrs] : plugin.settings.attrs;

        plugin.init = function(){

            // TODO support <picture> ?
            // TODO support <iframe> --> $iframe[0].load();
            // TODO make srcset to load only one pic (the current one) --> done?
            // TODO preload video poster ?

            // custom attrs in other tags
            if( plugin.settings.attrs && !plugin.element.is('img') && !plugin.element.is('audio') && !plugin.element.is('video') && !plugin.element.is('source') )
                for( var k in plugin.settings.attrs ){

                    // se this ha un custom attr
                    if( plugin.element.is('['+plugin.settings.attrs[k]+']') && !plugin.element.is('img, audio, video, source') ) {

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

                    if( $(this).is('[src]') ) {
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
                    if( plugin.element.is('['+plugin.settings.attrs[k]+']') ) {
                        collect(plugin.element.attr(plugin.settings.attrs[k]), plugin.element.closest('audio, video'), 'audio/video');
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
                    collect( plugin.element.data('src'), plugin.element, 'image' );

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

            // LOAD!
            var count  = 0,
                pipe   = 0,
                percentage = 0,
                length = collection.length,
                onProgressCallback = function(n, context, data){

                    if( $.isFunction(plugin.settings.onProgress) )
                        plugin.settings.onProgress.call($.extend(false, plugin, { percentage : n, thisElement : context, data : data })); // shallowcopy --> todo : shouldn't be like that?

                },
                progress = function(){

                    count++;

                    percentage = count / length * 100;

                    onProgressCallback(percentage, this.target, this.data);

                    if( count === length ) {

                        callback();

                        return;

                    }

                    if( plugin.settings.pipeline === true ){

                        pipe++;

                        logic(pipe, collection[pipe]);

                    }

                },
                logic = function(i, v){

                    switch( v.type ){

                        case 'image' :

                            var isFake  = !v.$el,
                                $target = isFake ? $(new Image()) : v.$el;

                            __preloadImage($target, isFake ? v.url+'?'+ $.heavy.preloader.nameCSS : v.url, v.ext, function(){ progress.call({ target : $target, data : this }); });

                            break;

                        case 'audio/video' :

                            var $target = v.$el;

                            if( !$target ) {

                                $target = __fakeMedia(v.url+'?'+ $.heavy.preloader.nameCSS, isAudio(v.url) ? 'audio' : 'video', v.ext);

                            }else{

                                $target
                                    .find('source[type*="/'+ v.ext +'"], source[src*=".'+ v.ext +'"], source[data-src*=".'+ v.ext +'"]')
                                    .attr('src', v.url)
                                    .removeAttr('data-src');

                            }

                            __preloadMedia($target, function(){ progress.call({ target : $target, data : this }); });

                            break;


                    }


                };

            onProgressCallback(0, null, null);

            if( length ){

                if( plugin.settings.pipeline === true )
                    logic(pipe, collection[pipe]);

                else
                    $.each(collection, logic);

            }else {

                onProgressCallback(100, null, null);

                callback();

            }

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

                }else
                    c(); // todo check modo più elegante?

            });
        };

})(window, document, jQuery);