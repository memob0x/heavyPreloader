/*! JQuery Heavy Preloader | Daniele Fioroni | dfioroni91@gmail.com */
(function(window, document, $, undefined){
    'use strict';

    // TODO support <picture>
    // TODO support <iframe>
    // TODO make srcset to load only one pic (the current one) --> done?

    // heavy freamwork
    //----------------
    $.heavy             = undefined === $.heavy ? {} : $.heavy;
    $.heavy.preloader   = { name : 'HeavyPreloader', version : '1.2.7', method : 'heavyPreload', nameCSS : 'heavy-preloader' };

    var mediaSupport = function(type, extension){
            var tmpVid = document.createElement(type);
            return tmpVid.canPlayType(type+'/'+extension);
        },
        isImg = function(s){
            return /([^\s]+(?=\.(jp[e]?g|gif|png|tif[f]?|bmp))\.\2)/gi.test(s);
        },
        isVid = function(s){
            return /([^\s]+(?=\.(mp4|ogv|webm|ogg))\.\2)/gi.test(s);
        },
        isAud = function(s){
            return /([^\s]+(?=\.(mp3|ogg))\.\2)/gi.test(s);
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

    $.heavy.preloader.cache = new Array();

    $.heavy.preloader.customAttrs = new Array();

    $[$.heavy.preloader.method]    = function(element, options, callback){

        if( $.isFunction(options) && undefined === callback ) {
            callback = options;
            options = {};
        }

        var plugin = this,
            $element = $(element),
            urls     = [],
            defaults = {
                attrs        : new Array(),
                backgrounds  : false,
                onProgress   : null
            },
            g = function(s){

                if( undefined === s || s === false )
                    return;

                var a = s.split(/,|\s/);

                for( var k in a ) {

                    var s = a[k].replace(/\"|\'|\)|\(|url/gi, '');

                    if( isImg(s) || isVid(s) || isAud(s) )
                        urls.push(s);

                }

            };

        plugin.settings = {};
        plugin.settings = $.extend({}, defaults, options);

        plugin.element = $element;


        // CERCA_ cerca negli attributi personalizzati
        // ----------------------
        for( var k in plugin.settings.attrs ){

            $.heavy.preloader.customAttrs.push(plugin.settings.attrs[k]);

            if( plugin.element.is('['+plugin.settings.attrs[k]+']') )
                g( plugin.element.attr(plugin.settings.attrs[k]) );

            plugin.element.find('['+plugin.settings.attrs[k]+']').each(function(){

                g( $(this).attr(plugin.settings.attrs[k]) );

            });

        }


        // CERCA_ interpreta this
        // ----------------------
        // se this è un immagine
        if( plugin.element.is('img') ){

            if( $(this).is('[srcset]') )
                g( plugin.element.attr('srcset') );
            else if( $(this).is('[data-src]') )
                g( plugin.element.attr('data-src') );
            else
                g( plugin.element.attr('src') );

        }

        // se this è un audio / video
        if( plugin.element.is('video') || plugin.element.is('audio') ){

            plugin.element.find('source[data-src]').each(function(){

                g( $(this).attr('data-src') );

            });

            g( plugin.element[0].currentSrc );

        }

        // se this ha un background
        if( plugin.settings.backgrounds && document !== plugin.element[0] && plugin.element.css('background-image') != 'none' )
            g( plugin.element.css('background-image') );


        // CERCA_ ...nei discendenti
        // -------------------------

        // cerca <img />
        plugin.element
            .find('img[src], img[srcset], img[data-src]').each(function(){

                if( $(this).is('[srcset]') ){
                    g( $(this).attr('srcset') );
                    return true;
                }

                if( $(this).is('[data-src]') ){
                    g( $(this).data('src') );
                    return true;
                }

                if( $(this).is('[src]') )
                    g( $(this).attr('src') );

            })

            .end()

            // cerca audio/video
            .find('video, audio, source[data-src]').each(function(){

                if( $(this).is('[data-src]') ) {
                    g( $(this).attr('data-src') );
                    return true;
                }

                g( this.currentSrc );

            });

        // cerca sfondi
        if( plugin.settings.backgrounds ) plugin.element.find('*:not(img)').filter(function(){ return $(this).css('background-image') != 'none'; }).each(function(){

            g( $(this).css('background-image') );

        });

        var urls_ = urls,
            urls = urls_.filter(function(elem, pos) {
                return urls_.indexOf(elem) == pos;
            }),
            j = urls.length,
            i = 0,
            l = function(){ setTimeout(function(){

                //incremento
                ++i;

                // restituisce all'utente la percentuale di caricamento del set di immagini
                var J = j === 0 ? 1 : j;
                plugin.progress = i / J * 100;

                // funzione eseguita ad ogni immagine caricata
                if( $.isFunction(plugin.onProgress) )
                    plugin.onProgress();

                // esegue la callback se il totale viene raggiunto (o superato -> se non ci sono cose da caricare viene forzata la condizione)
                if( i >= j )
                    callback();

               // console.log(i, j)

            }) };

        // se c'è almeno un elemento da caricare, daje caricalo!
        if( j > 0 ) for( var k in urls ){

            var url = urls[k],
                id = $.heavy.preloader.name + 'Vid' + Math.floor( Math.random() * 99999),
                vidExt = url.match(/mp4|ogv|ogg|webm/gi),
                audExt = url.match(/mp3|ogg/gi),
                wasCached = $.inArray(url.replace('?'+$.heavy.preloader.nameCSS, ''), $.heavy.preloader.cache) > -1,

                nonExistent = false,

                selector = '';


            // PRELIMINAR OPERATIONS
            if( isImg(url) ){

                if( $.heavy.preloader.customAttrs.length )
                    for( var k in $.heavy.preloader.customAttrs )
                        selector += ',img['+$.heavy.preloader.customAttrs[k]+'="'+ url +'"]';

                window[id] = $('img[src="' + url + '"], img[srcset*="' + url + '"], img[data-src="' + url + '"]'+selector).not('.heavy-preloaded').first().addClass('heavy-preloaded'); // todo check srcset

                nonExistent = !window[id].length;

            }

            if( isVid(url) || isAud(url) ) {

                if( $.heavy.preloader.customAttrs.length )
                    for( var k in $.heavy.preloader.customAttrs )
                        selector += ', source['+$.heavy.preloader.customAttrs[k]+'="'+ url +'"]';

                window[id] = $( isVid(url) ? 'video' : 'audio' ).filter(function(){ return $(this).find('source[src="' + url + '"], source[data-src="' + url + '"]'+selector).length; }).not('.heavy-preloaded').first().addClass('heavy-preloaded');

                nonExistent = !window[id].length;

            }


            // CACHE IT
            if( !wasCached )
                $.heavy.preloader.cache.push(url);

           // console.log(url, wasCached, nonExistent)

            // CONTINUE
            if( wasCached || ( isVid(url) && !mediaSupport('video', vidExt) ) || ( isAud(url) && !mediaSupport('audio', audExt) ) ){

                if( !nonExistent ){

                    if( isImg(url) && !window[id].is('[src]') )
                        window[id].attr('src', url+'?'+$.heavy.preloader.nameCSS);

                    if( ( isVid(url) && mediaSupport('video', vidExt) ) || ( isAud(url) && mediaSupport('audio', audExt) ) ){
                        var $src = window[id].find('source[src="' + url + '"], source[data-src="' + url + '"]'+selector);
                        if( !$src.is('[src]') ) {
                            $src.attr('src', url + '?' + $.heavy.preloader.nameCSS);
                            window[id].load();
                        }
                    }

                }

                //delete window[id];

                l();

                continue;

            }

            // PRELOAD!
            if( isImg(url) ){

                window[id] = nonExistent ? $(new Image()) : window[id];

                var l_          = function () {

                    //delete window[id];

                    l();

                };

                if( window[id].is('[src]') ) // ok questa cosa rompe ios non so perchè ma lo fa // todo check!
                    window[id].error(l_).load(l_).attr('src', url);
                else
                    window[id].error(l_).load(l_).attr('src', url+'?'+$.heavy.preloader.nameCSS);

            }

            if( isVid(url) || isAud(url) ){

                if( nonExistent ){

                    window[id] = $('<'+( isVid(url) ? 'video' : 'audio' )+' />', {
                        src: url + '?' + $.heavy.preloader.nameCSS,
                        type: ( isVid(url) ? 'video' : 'audio' ) + '/' + ( isVid(url) ? vidExt : audExt ),
                        muted: true,
                        preload: 'metadata'
                    });

                    $('body').append( window[id].css({
                        width       : 2,
                        height      : 1,
                        visibility  : 'hidden',
                        position    : 'absolute',
                        left        : -9999,
                        top         : -9999,
                        'z-index'   : -1
                    }) );

                }else{
                    var $src = window[id].find('source[src="' + url + '"], source[data-src="' + url + '"]'+selector);
                    if( !$src.is('[src]') ) {
                        $src.attr('src', url + '?' + $.heavy.preloader.nameCSS);
                        window[id].load();
                    }
                }

                var l_          = function () {

                    this.currentTime = 0;

                    $(this).off('.' + $.heavy.preloader.nameCSS);

                    if( nonExistent )
                        this.remove();

                    delete window[id];

                    l();

                };

                window[id]
                    .on('loadedmetadata', function () { // init

                        this.currentTime++;

                    })
                    .on('progress.' + $.heavy.preloader.nameCSS, function (e) {

                        if (this.readyState > 0 && !this.duration) { // probably an error occurred!

                            l_();

                            return;

                        }

                        // force preload!
                        this.currentTime++;

                        // todo o.progress for percentage stuff...
                        // console.log( parseInt( video.buffered.end(0) / video.duration * 100) ); // ??
                        // console.log( e.originalEvent.loaded / e.originalEvent.total * 100 );

                    })
                    .on('error.' + $.heavy.preloader.nameCSS, l_)
                    .on('canplaythrough.' + $.heavy.preloader.nameCSS, l_);

                if (!isNaN(window[id][0].duration)) // modern browsers ? // todo: check if still needed cuz loadedmetadata
                    window[id][0].currentTime++;

            }


        }

        // altrimenti, se si sta cercando di preloadare un contenitore in cui non è stato trovato nessun elemento-immagine, esegue subito la callback
        else
            l(); // callback();

        // per accedere all'oggetto delle opzioni dalle opzioni stesse TODO: trovare eventuali controindicazioni
        //return o;

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
