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

    var plugin          = $.heavy.preloader,
        mediaSupport = function(type, extension){
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

    $[plugin.method]    = function(options, callback){

        var o = $.extend({}, {
                urls       : new Array(),
                onProgress : null,
                stop       : false
            }, options || {}),
            c = function(){

                if( $.isFunction(callback) )
                    callback.call(this);

                callback = null; // O.o ... ehm. evita il ripetersi della callback al resize? caching matto? todo: check

            };

        // rimuove duplicati
        var dupes = o.urls,
            cleans = dupes.filter(function(elem, pos) {
                return dupes.indexOf(elem) == pos;
            });
        o.urls = cleans;

        var j = o.urls.length,
            i = 0,
            l = function(){

                // abort
                if( o.stop )
                    return;

                //incremento
                ++i;

                // restituisce all'utente la percentuale di caricamento del set di immagini
                var J = j === 0 ? 1 : j;
                o.progress = i / J * 100;

                // funzione eseguita ad ogni immagine caricata
                if( $.isFunction(o.onProgress) )
                    o.onProgress();

                //console.log(i, j)

                // esegue la callback se il totale viene raggiunto (o superato -> se non ci sono cose da caricare viene forzata la condizione)
                if( i >= j )
                    c();

            }

        // se c'è almeno un elemento da caricare, daje caricalo!
        if( j > 0 ) for( var k in o.urls ){

            var url = o.urls[k],
                id = $.heavy.preloader.name + 'Vid' + Math.floor( Math.random() * 99999),
                vidExt = url.match(/mp4|ogv|ogg|webm/gi),
                audExt = url.match(/mp3|ogg/gi),
                wasCached = $.inArray(url.replace('?'+plugin.nameCSS, ''), $.heavy.preloader.cache) > -1,

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


            // CONTINUE
            if( wasCached || ( isVid(url) && !mediaSupport('video', vidExt) ) || ( isAud(url) && !mediaSupport('audio', audExt) ) ){

                if( !nonExistent ){

                    if( isImg(url) && !window[id].is('[src]') )
                        window[id].attr('src', url+'?'+plugin.nameCSS);

                    if( ( isVid(url) && mediaSupport('video', vidExt) ) || ( isAud(url) && mediaSupport('audio', audExt) ) ){
                        var $src = window[id].find('source[src="' + url + '"], source[data-src="' + url + '"]'+selector);
                        if( !$src.is('[src]') ) {
                            $src.attr('src', url + '?' + plugin.nameCSS);
                            window[id].load();
                        }
                    }

                }

                delete window[id];

                l();

                continue;

            }

            // PRELOAD!
            if( isImg(url) ){

                window[id] = nonExistent ? $(new Image()) : window[id];

                var l_          = function () {

                    delete window[id];

                    l();

                };

                //if( window[id].is('[src]') ) // ok questa cosa rompe ios non so perchè ma lo fa // todo check!
                //    window[id].error(l_).load(l_).attr('src', url);
                //else
                    window[id].error(l_).load(l_).attr('src', url+'?'+plugin.nameCSS);

            }

            if( isVid(url) || isAud(url) ){

                if( nonExistent ){

                    window[id] = $('<'+( isVid(url) ? 'video' : 'audio' )+' />', {
                        src: url + '?' + plugin.nameCSS,
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
                        $src.attr('src', url + '?' + plugin.nameCSS);
                        window[id].load();
                    }
                }

                var l_          = function () {

                    this.currentTime = 0;

                    $(this).off('.' + plugin.nameCSS);

                    if( nonExistent )
                        this.remove();

                    delete window[id];

                    l();

                };

                window[id]
                    .on('loadedmetadata', function () { // init

                        this.currentTime++;

                    })
                    .on('progress.' + plugin.nameCSS, function (e) {

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
                    .on('error.' + plugin.nameCSS, l_)
                    .on('canplaythrough.' + plugin.nameCSS, l_);

                if (!isNaN(window[id][0].duration)) // modern browsers ? // todo: check if still needed cuz loadedmetadata
                    window[id][0].currentTime++;

            }


        }

        // altrimenti, se si sta cercando di preloadare un contenitore in cui non è stato trovato nessun elemento-immagine, esegue subito la callback
        else
            l(); // c();

        // per accedere all'oggetto delle opzioni dalle opzioni stesse TODO: trovare eventuali controindicazioni
        return o;

    },


    $.fn[plugin.method] = function(options, callback){

        return this.each(function(){

            var t  = this,
                $t = $(t),
                o  = $.extend({}, {
                    attrs        : new Array(),
                    urls         : new Array(),
                    backgrounds  : false,
                    onProgress   : null
                }, options || {}),
                g = function(s){

                    if( undefined === s || s === false )
                        return;

                    var a = s.split(/,|\s/);

                    for( var k in a ) {

                        var s = a[k].replace(/\"|\'|\)|\(|url/gi, '');

                        if( isImg(s) || isVid(s) )
                            o.urls.push(s);

                    }

                };

            // se ci sono accodate altre richieste vale solo l'ultima se non si forza
            if( $.data(t, $.heavy.preloader.name) && !$t.data($.heavy.preloader.name).force ) // TODO fix *(1)
                $t.data($.heavy.preloader.name).stop();


            // CERCA_ interpreta this
            // ----------------------
            // se this è un immagine
            if( $t.is('img[src]') || $t.is('img[srcset]') || $t.is('img[data-src]') ){

                g( $t.attr('src') );

                g( $t.attr('srcset') );

                g( $t.attr('data-src') );

            }

            // se this è un audio / video
            if( $t.is('video') || $t.is('audio') ){

                g( t.currentSrc );

                $t.find('source[data-src]').each(function(){

                    g( $(this).attr('data-src') );

                });

            }

            // se this ha un background
            if( o.backgrounds && document !== t && $t.css('background-image') != 'none' )
                g( $t.css('background-image') );


            // CERCA_ ...nei discendenti
            // -------------------------

            // cerca <img />
            $t.find('img[src], img[srcset], img[data-src]').each(function(){

                g( $(this).attr('src') );

                g( $(this).attr('srcset') );

                g( $(this).attr('data-src') );

            });

            // cerca audio/video
            $t.find('video, audio, source[data-src]').each(function(){

                g( this.currentSrc );

                g( $(this).attr('data-src') );

            });

            // cerca sfondi
            if( o.backgrounds ) $t.find('*:not(img)').filter(function(){ return $(this).css('background-image') != 'none'; }).each(function(){

                g( $(this).css('background-image') );

            });

            // cerca negli attributi personalizzati
            for( var k in o.attrs ){

                $.heavy.preloader.customAttrs.push(o.attrs[k]);

                if( $t.is('['+o.attrs[k]+']') )
                    g( $t.attr(o.attrs[k]) );

                $t.find('['+o.attrs[k]+']').each(function(){

                    g( $(this).attr(o.attrs[k]) );

                });

            }


            // loop
            var m = new $[plugin.method]({
                urls       : o.urls,
                onProgress : function(){

                    o.progress = undefined === m ? ( !o.urls.length ? 100 : 0 ) : m.progress;

                    if( $.isFunction(o.onProgress) )
                        o.onProgress();

                    return o;

                }
            }, function(){

                // se la callback prende il posto delle options, altrimenti, callback normale con parametri specificati
                var w = typeof options === 'function' && typeof callback === 'undefined' ? options : callback;
                if( $.isFunction(w) )
                    w.call(t);

                //
                $.removeData(t, $.heavy.preloader.name);

            });

            // public methods...
            $(this).data($.heavy.preloader.name, {
                //force : false,        // ... per forzare una richiesta anche se ce n'è un'altra in atto
                stop  : function(){ // ... per stoppare una richiesta

                    m.stop = true;

                    $.removeData(t, $.heavy.preloader.name);

                }
            });

        });
    };

})(window, document, jQuery);
