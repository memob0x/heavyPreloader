/*! JQuery Heavy Preloader | Daniele Fioroni | dfioroni91@gmail.com */
(function(window, document, $, undefined){
    'use strict';

    // todo: support <picture> ?
    // todo: support <iframe> --> $iframe[0].load();
    // todo: preload video poster ?
    // todo: make srcset to load only one pic (the current one) --> done already?



    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    if( !$ ) {
        console.error('jQuery is needed for $.fn.niteCrop() to work!')
        return undefined;
    }
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

    var default_settings = {
            pipeline    : false,
            attributes  : [],
            backgrounds : false,
            playthrough : false
        };

    /* todo new specs as following

    // global instance mode
    // - - - - - - - - - - - - -
    var siteLoader = new $.nitePreload({ // no arguments or object of parameters
       selector : ‘data-src’
    });
    // uses interception observer to find inViewport images
    // - - - - - - - - - - - - -

    // single instance mode
    // - - - - - - - - - - - - -
    var instance = new $.nitePreload([ // array
       ‘immagine.jpg’,
       ‘immagine.png’,
       ‘immagine.gif’
    ]);

    console.log(instance.percentage);

    instance.abort();

    instance.loaded(function(url){
        // url is loaded…
    });

    instance.error(function(url){
        // url has encountered a problem
    });

    instance.done(function(){
       // finito…
    });
    // - - - - - - - - - - - - - */


    var nite_preloader_core = function(argument){

        var options = {},
            collection = [];

        if( $.isArray(argument) )
            collection = argument;

        if( typeof argument === 'string' )
            collection.push(argument);

        var settings = $.extend(true, default_settings, options);

        this.done = $.noop();
        this.progress = $.noop();

        // do stuff

        this.abort = function(){

            // abort stuff

        };

    };

    $.nitePreload = nite_preloader_core;

    $.niteLazyload = function(){

        if( !$.nite || !( 'inViewport' in $.nite ) || !( 'scroll' in $.nite ) ) {

            console.log('nite is needed, maybe outdated?');

            return;

        }

        $.nite.scroll('nitePreloader', function(){

            // lazyload stuff

        });

    };


    /* todo new specs as following



    // - - - - - - - - - - - - -
    trova tutte le immagini, audio e video e li aspetta.
    // nothing loaded yet…
    $(‘div.parent, img.test-images, video#bunny, audio#metallica’).nitePreload({
       srcAttr : ‘data-src’,
       findBackgrounds : false,
       canplaythrough : true // video e audio senza interruzioni
    }, function(){
         // everything loaded at this point!
    });
    // - - - - - - - - - - - - -


    // events
    // - - - - - - - - - - - - -
    $(document).on(‘load.nite error.nite’, function(event, $element){

        // $element is loaded at this point

    });
    $(document).on(‘load.nite error.nite’, ‘.element’, function(event){

        // this is loaded at this point

    });
    $(‘.element’).on(‘load.nite error.nite’, function(){

       // this is loaded

    });
    // - - - - - - - - - - - - - */


    var nite_preloader_finder = function($element, options){

        var settings = $.extend(true, default_settings, options);

        var collection = [],
            collect = function(urls, $el, type){

                if( !urls || !$el || !$el.length )
                    return;

                if( settings.backgrounds )
                    urls = urls.replace(/url\(\"|url\(\'|url\(|((\"|\')\)$)/igm, '');

                var splitter = '_' + Math.round( new Date().getTime() + ( Math.random() * 100 ) ) + '_';

                urls = urls.replace(new RegExp('(' + formats.image + '|' + formats.audio + '|' + formats.video + ')(\s|$|\,)', 'igm'), function(match, p1, p2){ return p1 + splitter; }).split(new RegExp(splitter, 'igm'));

                for( var k in urls ) {

                    var url = urls[k],
                        ext_audio = is(url, 'audio'),
                        ext_video = is(url, 'video'),
                        ext_image = is(url, 'image');

                    if( ext_image || ( ext_video && support('audio', ext_audio) ) || ( ext_video && support('audio', ext_video) ) )
                        collection.push( $.extend(true, { $el : $el }, {
                            url : url,
                            type : type,
                            ext : ext_image || ext_video || ext_audio
                        }));

                }

            };

        // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
        // search
        // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

        //
        settings.attributes = typeof settings.attributes === 'string' ? [settings.attributes] : settings.attributes;

        // custom attributes in other tags
        if( settings.attributes && !$element.is('img') && !$element.is('audio') && !$element.is('video') && !$element.is('source') )
            for( var k in settings.attributes ){

                // se this ha un custom attr
                if( $element.is('['+settings.attributes[k]+']') && !$element.is('img, audio, video, source') ) {

                    var url = $element.attr(settings.attributes[k]);

                    collect(url, null, is(url, 'image') ? 'image' : 'audio/video');

                }

                // se trovo un custom attr
                $element.find('['+settings.attributes[k]+']:not(img, audio, video, source)').each(function(){

                    var url = $(this).attr(settings.attributes[k]);

                    collect(url, null, is(url, 'image') ? 'image' : 'audio/video');

                });

            }

        // se this è un audio / video
        if( $element.is('video') || $element.is('audio') ){
            if( $element.is('[src]') )
                collect($(this).attr('src'), $element, 'audio/video');
            else
                $element.children('source').each(function(){

                    var interrupt = false;

                    if( $(this).is('[src]') ) {
                        collect($(this).attr('src'), $element, 'audio/video');
                        interrupt = true;
                    }

                    if( interrupt )
                        return true;

                    if( settings.attributes ) for( var k in settings.attributes )
                        if( $(this).is('['+settings.attributes[k]+']') ) {
                            collect($(this).attr(settings.attributes[k]), $element, 'audio/video');
                            interrupt = true;
                        }

                    if( interrupt )
                        return true;

                    if( undefined !== $.data(this, 'src') || $(this).is('[data-src]') ) {
                        collect( $(this).data('src') || $(this).attr('data-src'), $element, 'audio/video' );
                    }

                });
        }

        // se this è una source video/audio
        if( $element.is('source') ){

            var interrupt = false;

            if( $element.is('[src]') ){
                collect( $element.attr('src'), $element.closest('audio, video'), 'audio/video' );
                interrupt = true;
            }

            if( !interrupt && settings.attributes ) for( var k in settings.attributes )
                if( $element.is('['+settings.attributes[k]+']') ) {
                    collect($element.attr(settings.attributes[k]), $element.closest('audio, video'), 'audio/video');
                    interrupt = true;
                }

            if( !interrupt && ( undefined !== $.data($element, 'src') || $element.is('[data-src]') ) )
                collect( $element.data('src') || $element.attr('data-src'), $element.closest('audio, video'), 'audio/video' );

        }

        // cerca video e audio
        $element.find('video, audio')
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

            if( settings.attributes ) for( var k in settings.attributes )
                if( $(this).is('['+settings.attributes[k]+']') ) {
                    collect($(this).attr(settings.attributes[k]), $(this).parent(), 'audio/video');
                    interrupt = true;
                }

            if( interrupt )
                return true;

            if( undefined !== $.data(this, 'src') || $(this).is('[data-src]') ) {
                collect( $(this).data('src') || $(this).attr('data-src'), $(this).parent(), 'audio/video' );
            }


        });

        // se this è un immagine
        if( $element.is('img') ){ // todo check priorities

            var interrupt = false;

            if( $element.is('[src]') ){
                collect( $element.attr('src'), $element, 'image' );
                interrupt = true;
            }

            if( !interrupt && $element.is('[srcset]') ) {
                collect($element.prop('currentSrc') || $element.prop('src'), $element, 'image');
                interrupt = true;
            }

            if( settings.attributes ) for( var k in settings.attributes )
                if( $element.is('['+settings.attributes[k]+']') ) {
                    collect($element.attr(settings.attributes[k]), $element, 'image');
                    interrupt = true;
                }

            if( !interrupt && ( undefined !== $.data($element, 'src') || $element.is('[data-src]') ) )
                collect( $element.data('src') || $element.attr('data-src'), $element, 'image' );

        }

        // cerca immagini
        $element.find('img').each(function(){

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

            if( settings.attributes ) for( var k in settings.attributes )
                if( $(this).is('['+settings.attributes[k]+']') ) {
                    collect($(this).attr(settings.attributes[k]), $(this), 'image');
                    interrupt = true;
                }

            if( interrupt )
                return true;

            if( undefined !== $.data(this, 'src') || $(this).is('[data-src]') ){
                collect( $(this).data('src') || $(this).attr('data-src'), $(this), 'image' );
            }

        });

        //se this ha un background
        if( settings.backgrounds && document !== $element[0] && $element.css('background-image') !== 'none' )
            collect( $element.css('background-image'), null, 'image' );

        // trovo sfondi
        if( settings.backgrounds )
            $element.find('*:not(img)').filter(function(){ return $(this).css('background-image') !== 'none'; }).each(function(){

                collect( $(this).css('background-image'), null, 'image' );

            });
        // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

        return collection;

    };

    $.nitePreloaderFinder = nite_preloader_finder;

    $.fn.nitePreload = function(options, callback){

        if( $.isFunction(options) && undefined === callback ){
            callback = options;
            options = {};
        }

        var settings = $.extend(true, default_settings, options);

        return this.each(function(){

            var $element = $(this),
                instance = $element.data('nitePreloader');

            if( undefined !== instance )
                instance.abort();

            instance = new nite_preloader_core(nite_preloader_finder($element, settings));

            instance.progress(function(){
                // todo
            });

            instance.done(function(){
                callback.call($element[0]);
            });

            $element.data('nitePreloader', instance);


        });

    };

})(window, document, jQuery);