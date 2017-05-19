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

    var plugin_name = 'nitePreloader',

        support = function(type, extension){

            var tmpVid = document.createElement(type);

            return tmpVid.canPlayType(type+'/'+extension);

        },

        formats = {
            image  : 'jp[e]?g|gif|png|tif[f]?|bmp',
            audio  : 'mp3|ogg',
            video  : 'mp4|ogv|ogg|webm'
        },

        url_suffix = function( url ){

            if( /^data:/gi.test( url ) )
                return '';
            else
                return '#!'+ plugin_name;

        },

        is = function( url, format, args ){

            var opts = $.extend({
                warn : false
            }, args);

            url = url
                .toLowerCase() // "i" flag nella regex dava problemi ;((((((((
                .split('?')[0]; // rimuove query strings

            if( url === ''  )
                return false;

            var base64 = '\;base64\,';

            if( new RegExp('(\.(' + formats[ format ] + ')$)|' + base64, 'g').test( url ) ){

                if( new RegExp(base64, 'g').test( url ) ){

                    var matches64 = url.match(new RegExp('^data:'+format+'\/(' + formats[ format ] + ')', 'g'));

                    if( !matches64 || null === matches64 ) {

                        //if( opts.warn ) // warna sempre problemi con base64
                        console.warn(url +': base64 '+ format +' format not recognized.');

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
                    console.warn(url +': file '+ format +' not recognized.');

                return false;

            }

        },

        preload_image = function($el, url, ext, cb){

            $el
                .on('load.'+ plugin_name+' error.'+ plugin_name, function(){

                    $el.data(plugin_name).preloaded = true;

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
                $el.trigger('load.'+ plugin_name);

            return $el;

        },

        preload_media = function($el, url, ext,  cb, load, playthrough){

            var el   = $el[0],
                done = function () {

                    if( paused )
                        el.currentTime = 0;

                    $el.data(plugin_name).preloaded = true;

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

                    if( $el.hasClass(plugin_name+'-temp') )
                        $el.remove();

                },
                paused = el.paused;

            if( true === load && paused )
                el.load();

            $el
                .on('canplaythrough.' + plugin_name, done)

                .on('loadedmetadata.' + plugin_name, function () {

                    if( !playthrough ) {

                        done();

                        return;

                    }

                    paused = el.paused;

                    if( paused )
                        el.currentTime++;

                })

                .on('progress.' + plugin_name, function () {

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

        },
        append_fake_element    = function(url, type, ext){

            var $el = $('<'+type+' />', {
                src: url,
                type: type + '/' + ext,
                muted: true,
                preload: 'metadata'
            });

            $('body').append( $el.addClass(plugin_name+'-temp').css({
                width      : 2,
                height     : 1,
                visibility : 'hidden',
                position   : 'absolute',
                left       : -9999,
                top        : -9999,
                zIndex     : -1
            }) );

            return $el;

        };

    $.fn.nitePreload = function(options){

        return this.each(function(){

            // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
            var $element = $(this),

                settings = $.extend(true, {
                    pipeline : false,
                    attributes : [],
                    backgrounds : false,
                    playthrough : false
                }, options),

                collection = [],

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

                },

                count  = 0,
                pipe   = 0,
                percentage = 0,
                abort = false,

                length = collection.length,

                progress = function(){

                    count++;

                    percentage = count / length * 100;

                    $element.trigger('nitePreloading', [this.target, percentage, this.data]);

                    if( count === length ) {

                        $element.trigger('nitePreloaded');

                        return;

                    }

                    if( settings.pipeline === true ){

                        pipe++;

                        logic(pipe, collection[pipe]);

                    }

                },
                logic = function(i, v){

                    if( abort )
                        return;

                    var $target = $();

                    switch( v.type ){

                        case 'image' :

                            var is_fake  = !v.$el;

                            $target = is_fake ? $(new Image()) : v.$el;

                            preload_image($target, is_fake ? v.url + url_suffix(v.url) : v.url, v.ext, function(){ progress.call({ target : $target, data : this }); });

                            break;

                        case 'audio/video' :

                            var load = false;

                            $target = v.$el;

                            if( !$target.length ) {

                                $target = append_fake_element(v.url + url_suffix(v.url), is(v.url, 'audio') ? 'audio' : 'video', v.ext);

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

                            preload_media($target, v.url, v.ext, function(){ progress.call({ target : $target, data : this }); }, load, settings.playthrough);

                            break;


                    }


                };
            // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~


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
            if( settings.backgrounds && document !== $element[0] && $element.css('background-image') != 'none' )
                collect( $element.css('background-image'), null, 'image' );

            // trovo sfondi
            if( settings.backgrounds )
                $element.find('*:not(img)').filter(function(){ return $(this).css('background-image') != 'none'; }).each(function(){

                    collect( $(this).css('background-image'), null, 'image' );

                });
            // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~


            // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
            // load loop
            // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
            length = collection.length;

            $element.trigger('nitePreloading', [null, 0, {}]);

            if( length ){

                if( settings.pipeline === true )
                    logic(pipe, collection[pipe]);

                else
                    $.each(collection, logic);

            }else {

                $element
                    .trigger('nitePreloading', [null, 100, {}])
                    .trigger('nitePreloaded');

            }
            // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~


        });
    };

})(window, document, jQuery);