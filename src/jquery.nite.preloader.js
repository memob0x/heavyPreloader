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

    /* todo new specs as following

    // global instance mode
    // - - - - - - - - - - - - -
    let siteLoader = new $.nitePreload({ // no arguments or object of parameters
       selector : ‘data-src’
    });
    // uses interception observer to find inViewport images
    // - - - - - - - - - - - - -

    // single instance mode
    // - - - - - - - - - - - - -
    let instance = new $.nitePreload([ // array
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


    let do_load = function(){

            this.image = function(callback){

                callback();

            };

            this.audio = function(callback){

                callback();

            };

            this.video = function(callback){

                callback();

            };


            this.iframe = function(callback){

                callback();

            };

        },
        get_resource_info = function(){

            // recognition stuff

            return {
                type : 'audio', // video image iframe etc
                extension : 'mp3'
            }

        },
        nite_preloader_core = function(argument){

            let options = {},
                collection = [];

            if( $.isArray(argument) )
                collection = argument;

            if( typeof argument === 'string' )
                collection.push(argument);

            let settings = $.extend(true, {
                    pipeline    : false,
                    playthrough : false
                }, options),
                callback = $.noop(),
                progress = $.noop(),
                abort = false,
                collection_size = collection.length;

            if( true !== settings.pipeline ) {

                for (let i = 0; i < collection_size; i++) {

                    if (abort)
                        break;

                    let resource = collection[i],
                        resource_type = get_resource_info(resource);

                    do_load[resource_type](function () {

                        if (abort)
                            return;

                        // do stuff...

                    });

                }

            }else{

                let resource = null,
                    i = -1,
                    pipeline_recursion = function(){

                        i++;

                        resource = collection[i];
                        let resource_type = get_resource_info(resource);

                        do_load[resource_type](function () {

                            if (abort)
                                return;

                            // do stuff...

                            pipeline_recursion();

                        });

                    };

                pipeline_recursion();

            }

            this.done = function(func){

                if( !$.isFunction(func) )
                    return;

                let context = this;

                callback = function(){
                    func.call(context);
                };

            };

            this.progress = function(func){

                if( !$.isFunction(func) )
                    return;

                let context = this;

                progress = function(){
                    func.call(context);
                };

            };

            this.abort = function(){

                abort = true;

            };

        },
        is_valid_selector = function(selector){

            let $element = $();

            if ( typeof(selector) !== 'string' )
                return false;

            try {

                $element = $(selector);

            } catch(error) {

                return false;

            }

            return $element.length;
        };

    $.nitePreload = nite_preloader_core;

    $.niteLazyload = function(selector){

        if( !$.nite || !( 'inViewport' in $.nite ) || !( 'scroll' in $.nite ) ) {

            console.log('nite is needed, maybe outdated?');

            return;

        }

        $.nite.scroll('nitePreloader', function(){

            $( is_valid_selector(selector) ? selector : '[data-nite-src]' ).inViewport().nitePreload(function(){

                // ...

            });

        }, { fps : 25 });

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


    let nite_preloader_finder = function($element, attributes, backgrounds){

        let collection = [],
            collect = function(urls){

                if( !urls || typeof urls !== 'string' )
                    return;

                if( backgrounds )
                    urls = urls.replace(/url\(\"|url\(\'|url\(|((\"|\')\)$)/igm, '');

                let splitter = '_' + Math.round( new Date().getTime() + ( Math.random() * 100 ) ) + '_';

                urls = urls
                        .replace(new RegExp('(' + formats.image + '|' + formats.audio + '|' + formats.video + ')(\s|$|\,)', 'igm'), function(match, p1, p2){ return p1 + splitter; })
                        .split(new RegExp(splitter, 'igm'));

                for( let k in urls )
                    if( $.inArray(collection) > -1 )
                        collection.push(urls[k]);

            };

        $element.find('*').addBack().filter(function(){ return $(this).css('background-image') !== 'none'; }).each(function(){
            collect( $(this).css('background-image') );
        });

        if( backgrounds )
            $element.find('*').addBack().filter(function(){ return $(this).css('background-image') !== 'none'; }).each(function(){
                collect( $(this).css('background-image') );
            });

        return collection;

    };

    $.nitePreloaderFinder = nite_preloader_finder;

    $.fn.nitePreload = function(options, callback){

        if( $.isFunction(options) && undefined === callback ){
            callback = options;
            options = {};
        }

        let default_attributes = [ 'src', 'data-src', 'srcset', 'data-nite-src' ],
            settings = $.extend(true, {
                pipeline    : false,
                attributes  : default_attributes,
                backgrounds : false,
                playthrough : false
            }, options);

        if( !$.isArray(settings.attributes) )
            settings.attributes = default_attributes;
        if( typeof settings.attributes === 'string' )
            settings.attributes = settings.attributes.split(' ');

        return this.each(function(){

            let $element = $(this),
                instance = $element.data('nitePreloader');


            if( undefined !== instance )
                instance.abort();

            instance = new nite_preloader_core(nite_preloader_finder($element, settings.attributes, true === settings.backgrounds));

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