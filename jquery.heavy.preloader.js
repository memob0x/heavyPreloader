/*! JQuery Heavy Preloader | Daniele Fioroni | dfioroni91@gmail.com */
(function(window, document, $, undefined){
    'use strict';

    // heavy freamwork
    //----------------
    $.heavy             = undefined === $.heavy ? {} : $.heavy;
    $.heavy.preloader   = { name : 'HeavyPreloader', version : '1.4.4', method : 'heavyPreload', nameCSS : 'heavy-preloader', busy : false };

    var mediaSupport = function(type, extension){

            var tmpVid = document.createElement(type);

            return tmpVid.canPlayType(type+'/'+extension);

        },

        formats = {
            image  : 'jp[e]?g|gif|png|tif[f]?|bmp',
            audio  : 'mp3|ogg',
            video  : 'mp4|ogv|ogg|webm'
        },

        __urlSuffix = function( url ){

            if( /^data:/gi.test( url ) )
                return '';
            else
                return '#!'+ $.heavy.preloader.nameCSS;

        },

        __is     = function( url, format, args ){

            var opts = $.extend({
                warn : false
            }, args);

            url = url   .toLowerCase() // "i" flag nella regex dava problemi ;((((((((
                .split('?')[0]; // rimuove query strings

            if( url === ''  )
                return false;

            var base64 = '\;base64\,';

            if( new RegExp('(\.(' + formats[ format ] + ')$)|' + base64, 'g').test( url ) ){

                if( new RegExp(base64, 'g').test( url ) ){

                    var matches64 = url.match(new RegExp('^data:'+format+'\/(' + formats[ format ] + ')', 'g'));

                    if( !matches64 || null === matches64 ) {

                        //if( opts.warn ) // warna sempre problemi con base64
                        consoleWarn(url +': base64 '+ format +' format not recognized.');

                        return false;

                    }

                    matches64 = matches64[0];
                    return matches64.replace('data:'+format+'/g', '');

                }else{

                    var matches = url.match( new RegExp(formats[ format ], 'g') );
                    return matches ? matches[0] : false;

                }
            }else {

                if( opts.warn )
                    consoleWarn(url +': file '+ format +' not recognized.');

                return false;

            }

        },

        consoleWarn = function(message){

            if( undefined === console )
                return;

            console[ 'warn' in console ? 'warn' : 'log' ]( $.heavy.preloader.name+': '+ message );

        },

        __preloadImage = function($el, url, ext, cb){

            $el
                .on('load.'+ $.heavy.preloader.name+' error.'+ $.heavy.preloader.name, function(){

                    $el
                        .off('.'+$.heavy.preloader.name)
                        .trigger($.heavy.preloader.method);

                    $el.data($.heavy.preloader.name).preloaded = true;

                    cb.call({
                        type : 'image',
                        url  : url,
                        extension : ext,
                        naturalWidth : this.naturalWidth,
                        naturalHeight : this.naturalHeight
                    });

                })
                .attr('src', url)
                .removeAttr('data-src');

            if( $el[0].complete === true )
                $el.trigger('load.'+ $.heavy.preloader.name);

            return $el;

        },
        __fakeMedia    = function(url, type, ext){

            var $el = $('<'+type+' />', {
                src: url,
                type: type + '/' + ext,
                muted: true,
                preload: 'metadata'
            });

            $('body').append( $el.addClass($.heavy.preloader.nameCSS+'-temp').css({
                width      : 2,
                height     : 1,
                visibility : 'hidden',
                position   : 'absolute',
                left       : -9999,
                top        : -9999,
                zIndex     : -1
            }) );

            return $el;

        },
        __preloadMedia = function($el, url, ext,  cb, load, playthrough){

            var el   = $el[0],
                done = function () {

                    if( paused )
                        el.currentTime = 0;

                    $el
                        .off('.'+ $.heavy.preloader.name)
                        .trigger($.heavy.preloader.method);

                    $el.data($.heavy.preloader.name).preloaded = true;

                    var extra = {};

                    if( $el.is('video') ) {
                        extra = {
                            naturalWidth: el.videoWidth,
                            naturalHeight: el.videoHeight
                        };
                        el.naturalWidth = extra.naturalWidth;
                        el.naturalHeight = extra.naturalHeight;
                    }

                    cb.call($.extend(true, {
                        type : 'audio/video',
                        url  : url,
                        extension : ext,
                        duration : el.duration
                    }, extra));

                    if( $el.hasClass($.heavy.preloader.nameCSS+'-temp') )
                        $el.remove();

                },
                paused = el.paused;

            if( true === load && paused )
                el.load();

            $el
                .on('canplaythrough.' + $.heavy.preloader.name, done)

                .on('loadedmetadata.' + $.heavy.preloader.name, function () {

                    if( !playthrough ) {

                        done();

                        return;

                    }

                    paused = el.paused;

                    if( paused )
                        el.currentTime++;

                })

                .on('progress.' + $.heavy.preloader.name, function () {

                    if( !playthrough )
                        return;

                    if ( el.readyState > 0 && !el.duration ) { // error!

                        done();

                        return;

                    }

                    paused = el.paused;

                    if( paused )
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

                if( $.isFunction($.heavy.preloader.onProgress) )
                    $.heavy.preloader.onProgress.call( this ? $.extend(true, this, { context : null }) : null );

            },
            cb = function(){

                if( $.isFunction(callback) )
                    callback.call(this);

                if( $.isFunction($.heavy.preloader.callback) )
                    $.heavy.preloader.callback.call( $() );

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

            var extImg = __is(url, 'image'),
                extAud = __is(url, 'audio'),
                extVid = __is(url, 'video');

            if( extImg ) {

                __preloadImage($(new Image()), url + __urlSuffix(url), extImg, function () {
                    datas.push(this);
                    progress.call(this);
                });

                continue;

            }

            if( extAud ) {

                __preloadMedia(__fakeMedia(url + __urlSuffix(url), 'audio', extAud), url + __urlSuffix(url), extAud, function () {
                    datas.push(this);
                    progress.call(this);
                }, true, true);

                continue;

            }

            if( extVid ) {

                __preloadMedia(__fakeMedia(url + __urlSuffix(url), 'video', extVid), url + __urlSuffix(url), extVid, function () {
                    datas.push(this);
                    progress.call(this);
                }, true, true);

                continue;

            }

            if( undefined !== console && 'warn' in console )
                console.warn($.heavy.preloader.name+' couldn\'t recognize ' + url + ' media type!');

            var nothing = {
                type : null,
                url  : url,
                extension : null,
                naturalWidth : null,
                naturalHeight : null,
                duration : null
            };

            datas.push(nothing);
            progress.call(nothing);

        } else{

            pg.call(null);

            cb();

        }

    };

    $[$.heavy.preloader.method]    = function(element, options, callback){

        if( $.isFunction(options) && undefined === callback ) {
            callback = options;
            options = {};
        }

        var plugin = this,

            $element = $(element),

            collection = [],

            defaults = {
                pipeline    : false,
                attrs       : [],
                backgrounds : false,
                playthrough : false,
                onProgress  : null // todo check!
            },

            collect = function(urls, $element, type){

                if( undefined === urls || urls === false )
                    return;

                if( plugin.settings.backgrounds )
                    urls = urls.replace(/url\(\"|url\(\'|url\(|((\"|\')\)$)/igm, '');

                var splitter = '_' + Math.round( new Date().getTime() + ( Math.random() * 100 ) ) + '_';

                urls = urls.replace(new RegExp('(' + formats.image + '|' + formats.audio + '|' + formats.video + ')(\s|$|\,)', 'igm'), function(match, p1, p2){ return p1 + splitter; }).split(new RegExp(splitter, 'igm'));

                var cleanMedia = function( mime ){

                        if( $element.is('video') || $element.is('audio') )
                            $element.find('source[type="'+mime+'"]').siblings().remove();

                        if( $element.is('source') )
                            $element.siblings().remove();

                    },
                    eventFallback = function(){

                        return;

                        // todo
                        // potrebbe essere un'altra source dello stesso video etc etc etc
                        // console.log($element, $element.data($.heavy.preloader.name) )

                    };

                for( var k in urls ) {

                    var url = urls[k];

                    switch( type ){

                        case 'image':

                            var extImage = __is(url, 'image', { warn : true });

                            if( extImage ) {

                                if( typeof $element !== 'undefined' && ( null === $element || !$.data($element[0], $.heavy.preloader.name) ) ){

                                    var obj = {
                                        url: url,
                                        type: type,
                                        ext: extImage,
                                        preloaded : false
                                    };

                                    if( null !== $element )
                                        $element.data($.heavy.preloader.name, obj);

                                    collection.push( $.extend(true, { $el: $element }, obj) );

                                }else
                                    eventFallback();

                            }

                            break;

                        case 'audio/video':

                            var extAudio = __is(url, 'audio');

                            if( extAudio ) {

                                if( !plugin.settings.playthrough )
                                    consoleWarn('Audio element skipped because "playthrough" option is not true.');

                                else if( typeof $element[0] !== 'undefined' && ( mediaSupport('audio', extAudio) && ( null === $element || !$.data($element[0], $.heavy.preloader.name) ) ) ){
                                    // check for undefined is cuz cleanMedia --> remove useless <source />

                                    var obj = {
                                        url: url,
                                        type: type,
                                        ext: extAudio,
                                        preloaded : false
                                    };

                                    if( null !== $element )
                                        $element.data($.heavy.preloader.name, obj);

                                    collection.push( $.extend(true, { $el: $element }, obj) );

                                    cleanMedia('audio/'+extAudio);

                                }else
                                    eventFallback();

                            }

                            var extVideo = __is(url, 'video', { warn : true });

                            if( extVideo ) {

                                if( typeof $element[0] !== 'undefined' && mediaSupport('video', extVideo) && ( null === $element || !$.data($element[0], $.heavy.preloader.name) ) ) {

                                    var obj = {
                                        url: url,
                                        type: type,
                                        ext: extVideo,
                                        preloaded : false
                                    };

                                    if( null !== $element )
                                        $element.data($.heavy.preloader.name, obj);

                                    collection.push( $.extend(true, { $el: $element }, obj) );

                                    cleanMedia('video/'+extVideo);

                                }else
                                    eventFallback();

                            }

                            break;

                    }

                }

            },

            count  = 0,
            pipe   = 0,
            percentage = 0,
            abort = false,

            length = collection.length;

            onProgressCallback = function(n, context, data){

                var processing = { percentage : n, thisElement : context, data : data };

                if( $.isFunction(plugin.settings.onProgress) )
                    plugin.settings.onProgress.call($.extend(false, plugin, processing)); // shallowcopy --> todo : shouldn't be like that?

                if( $.isFunction($.heavy.preloader.onProgress) )
                    $.heavy.preloader.onProgress.call( data && context ? $.extend(true, processing.data, { context : context }) : null );


            },

            progress = function(){

                $.heavy.preloader.busy = true;

                count++;

                percentage = count / length * 100;

                onProgressCallback(percentage, this.target, this.data);

                if( count === length ) {

                    $.heavy.preloader.busy = false;

                    plugin.preloaded = true;

                    plugin.element.trigger( $.heavy.preloader.method );

                    callback();

                    return;

                }

                if( plugin.settings.pipeline === true ){

                    pipe++;

                    logic(pipe, collection[pipe]);

                }

            },
            logic = function(i, v){

                if( abort )
                    return;

                switch( v.type ){

                    case 'image' :

                        var isFake  = !v.$el,
                            $target = isFake ? $(new Image()) : v.$el;

                        __preloadImage($target, isFake ? v.url + __urlSuffix(v.url) : v.url, v.ext, function(){ progress.call({ target : $target, data : this }); });

                        break;

                    case 'audio/video' :

                        var $target = v.$el,
                            load = false;

                        if( !$target ) {

                            $target = __fakeMedia(v.url + __urlSuffix(v.url), __is(v.url, 'audio') ? 'audio' : 'video', v.ext);

                            load = true;

                        }else{

                            var $sources = $target.find('source[type="audio/'+ v.ext +'"], source[type="video/'+ v.ext +'"]')

                            if( !$sources.length )
                                $sources = $target.find('source[src*=".'+ v.ext +'"], source[data-src*=".'+ v.ext +'"]');

                            if( !$sources.is('[src]') ){

                                $sources
                                    .attr('src', v.url)
                                    .removeAttr('data-src');

                                load = true;

                            }

                        }

                        __preloadMedia($target, v.url, v.ext, function(){ progress.call({ target : $target, data : this }); }, load, plugin.settings.playthrough);

                        break;


                }


            };

        plugin.preloaded = false;

        plugin.settings = {};
        plugin.settings = $.extend({}, defaults, options);

        plugin.element = $element;

        plugin.stop = function(){

            abort = true;

            collection = [];
            count = length;
            pipe = length;

            $.heavy.preloader.busy = false;

            // auto-cleanup
            $element
                .removeData($.heavy.preloader.name)
                .data($.heavy.preloader.name, undefined); // overkill...

        };

        plugin.settings.attrs = typeof plugin.settings.attrs === 'string' ? [plugin.settings.attrs] : plugin.settings.attrs;

        plugin.init = function(){

            // TODO support <picture> ?
            // TODO support <iframe> --> $iframe[0].load();
            // TODO preload video poster ?
            // TODO make srcset to load only one pic (the current one) --> done already?

            // custom attrs in other tags
            if( plugin.settings.attrs && !plugin.element.is('img') && !plugin.element.is('audio') && !plugin.element.is('video') && !plugin.element.is('source') )
                for( var k in plugin.settings.attrs ){

                    // se this ha un custom attr
                    if( plugin.element.is('['+plugin.settings.attrs[k]+']') && !plugin.element.is('img, audio, video, source') ) {

                        var url = plugin.element.attr(plugin.settings.attrs[k]);

                        collect(url, null, __is(url, 'image') ? 'image' : 'audio/video');

                    }

                    // se trovo un custom attr
                    plugin.element.find('['+plugin.settings.attrs[k]+']:not(img, audio, video, source)').each(function(){

                        var url = $(this).attr(plugin.settings.attrs[k]);

                        collect(url, null, __is(url, 'image') ? 'image' : 'audio/video');

                    });

                }

            // se this è un audio / video
            if( plugin.element.is('video') || plugin.element.is('audio') ){
                if( plugin.element.is('[src]') )
                    collect($(this).attr('src'), plugin.element, 'audio/video');
                else
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

                        if( undefined !== $.data(this, 'src') || $(this).is('[data-src]') ) {
                            collect( $(this).data('src') || $(this).attr('data-src'), plugin.element, 'audio/video' );
                        }

                    });
            }

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

                if( !interrupt && ( undefined !== $.data(plugin.element, 'src') || plugin.element.is('[data-src]') ) )
                    collect( plugin.element.data('src') || plugin.element.attr('data-src'), plugin.element.closest('audio, video'), 'audio/video' );

            }

            // cerca video e audio
            plugin.element.find('video, audio')
                .filter('[src]').each(function(){

                    collect($(this).attr('src'), $(this), 'audio/video');

                })
                .end()
                .not('[src]').children('source').each(function(){

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

                if( undefined !== $.data(this, 'src') || $(this).is('[data-src]') ) {
                    collect( $(this).data('src') || $(this).attr('data-src'), $(this).parent(), 'audio/video' );
                }


            });

            // se this è un immagine
            if( plugin.element.is('img') ){ // todo check priorities

                var interrupt = false;

                if( plugin.element.is('[src]') ){
                    collect( plugin.element.attr('src'), plugin.element, 'image' );
                    interrupt = true;
                }

                if( !interrupt && plugin.element.is('[srcset]') ) {
                    collect(plugin.element.prop('currentSrc') || plugin.element.prop('src'), plugin.element, 'image');
                    interrupt = true;
                }

                if( plugin.settings.attrs ) for( var k in plugin.settings.attrs )
                    if( plugin.element.is('['+plugin.settings.attrs[k]+']') ) {
                        collect(plugin.element.attr(plugin.settings.attrs[k]), plugin.element, 'image');
                        interrupt = true;
                    }

                if( !interrupt && ( undefined !== $.data(plugin.element, 'src') || plugin.element.is('[data-src]') ) )
                    collect( plugin.element.data('src') || plugin.element.attr('data-src'), plugin.element, 'image' );

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
                    collect( this.currentSrc || this.src, $(this), 'image' );
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

                if( undefined !== $.data(this, 'src') || $(this).is('[data-src]') ){
                    collect( $(this).data('src') || $(this).attr('data-src'), $(this), 'image' );
                }

            });

            //se this ha un background
            if( plugin.settings.backgrounds && document !== plugin.element[0] && plugin.element.css('background-image') != 'none' )
                collect( plugin.element.css('background-image'), null, 'image' );

            // trovo sfondi
            if( plugin.settings.backgrounds )
                plugin.element.find('*:not(img)').filter(function(){ return $(this).css('background-image') != 'none'; }).each(function(){

                    collect( $(this).css('background-image'), null, 'image' );

                });

            // LOAD!
            length = collection.length;

            //count  = 0,
            //pipe   = 0,
            //percentage = 0,
            //abort = false;

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

        };

        plugin.init();

    };

    $.fn[$.heavy.preloader.method] = function(options, callback){

        return this.each(function(){

            if( $.isFunction(options) && undefined === callback ){
                callback = options;
                options = {};
            }

            var _this = this,
                $this = $(_this),
                _callback = function(e){

                    if( $.isFunction( callback ) )
                        callback.call( _this );

                    if( $.isFunction($ .heavy.preloader.callback ) )
                        $.heavy.preloader.callback.call( _this );

                };

            // .stop() is an api method to abort the preload operation, we assume it is always needed when trying to preload unique elements such as document obj or html tag or body tag
            if( ( $this.is(document) || $this.is('html') || $this.is('body') ) && undefined !== $this.data($.heavy.preloader.name) )
                $this.data($.heavy.preloader.name).stop();

            // loop
            if( undefined === $this.data($.heavy.preloader.name) ){

                var plugin = new $[$.heavy.preloader.method](_this, options, function(){

                    _callback();

                    // auto-cleanup
                    $this
                        .removeData($.heavy.preloader.name)
                        .data($.heavy.preloader.name, undefined); // overkill...

                });

                $this.data($.heavy.preloader.name, plugin);

            }else if( 'preloaded' in $this.data($.heavy.preloader.name) && $this.data($.heavy.preloader.name).preloaded === false ) { // todo check

                var $children = $this.find('img, video'),
                    j = $children.length,
                    i = 0;

                $this
                    .on($.heavy.preloader.method, _callback);

                $children
                    .on($.heavy.preloader.method, function(){

                        i++;

                        if( j === i )
                            _callback();

                    });


            }else if( 'preloaded' in $this.data($.heavy.preloader.name) && $(this).data($.heavy.preloader.name).preloaded === true ){ // todo check

                _callback();

            }


        });
    };

})(window, document, jQuery);