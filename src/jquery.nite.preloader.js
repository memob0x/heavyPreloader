/*! JQuery Heavy ResourcesLoader | Daniele Fioroni | dfioroni91@gmail.com */
(function(window, document, $, undefined){
    'use strict';

    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    if( !$ ) {
        console.error('jQuery is needed for $.fn.nitePreload(), $.nitePreload, $.niteLazyLoad to work!');
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
    // - - - - - - - - - - - - -

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

    const
        namespace_prefix = 'nite',
        namespace_method = namespace_prefix+'Preload',
        namespace = namespace_prefix+'er',

        $document = $(document),

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

    class ResourceLoader {

        constructor(){

            this._resource  = null;
            this._$resource = $();
            
            this._type      = null;
            this._instance  = null;
            this._processed = false;

            this.callback   = function(e){

                if( this._processed )
                    return;

                this._$resource.trigger(e.type + '.'+namespace_prefix);
                $document.trigger(e.type + '.'+namespace_prefix, [this._$resource]);

            };

        }
        
        set resource( resource ){
            
            if( typeof resource === 'string' ){
                
            }
            
            if( typeof resource === 'object' && 'element' in resource ){
                this._resource = resource.element;
                this._type = resource.type;
            }

            this._$resource = $(this._resource);

            this._instance  = this._$resource.data(namespace);
            this._processed = this._instance !== undefined;

            this._instance  = this._processed ? this._instance : namespace + '_unique_' + ( $.nite ? $.nite.uniqueId() : Math.random(1000, 9999) );

        }

        complete(callback){
            
            switch( this._type ) {

                case 'image':

                    this._$resource
                        [ this._processed ? 'on' : 'one']('load.' + this._instance + ' error.' + this._instance, function (e) {
                        this.callback(e, callback);
                    });

                    const $picture = this._$resource.closest('picture');

                    if ($picture.length) {

                        this._$resource
                            .removeData('srcset')
                            .removeAttr('data-srcset')
                            .removeData('src')
                            .removeAttr('data-src');

                        $picture.find('source[data-srcset]')
                            .attr('srcset', $picture.data('srcset'))
                            .removeData('srcset')
                            .removeAttr('data-srcset');

                    } else {

                        if( this._$resource.is('[data-srcset]') )
                            this._$resource
                                .attr('srcset', this._$resource.data('srcset'))
                                .removeData('srcset')
                                .removeAttr('data-srcset');

                        if( this._$resource.is('[data-src]') )
                            this._$resource
                                .attr('src', this._$resource.data('src'))
                                .removeData('src')
                                .removeAttr('data-src');

                    }

                    if (true === this._resource.complete && this._resource.naturalWidth !== 0 && this._resource.naturalHeight !== 0) {

                        if ( !this._processed )
                            this._$resource.off('.' + this._instance);

                        this.callback(new Event(undefined !== this._resource.naturalWidth ? 'load' : 'error'), callback);

                    }

                    break;

                case 'media':



                    break;

                case 'iframe':



                    break;

            }


            if ( !this._processed )
                this._$resource.data(namespace, this._instance);
            
        };

    }
    
    class ResourcesLoader {

        constructor(collection, options) {

            this._collection = [];

            if ($.isArray(collection) && ( typeof collection[0] === 'string' || typeof collection[0] === 'object' && 'subject' in collection[0] ))
                this._collection = collection;

            if (typeof collection === 'string')
                this._collection.push(collection);

            this._settings = $.extend(true, {
                sequential: false,
                pipelineDelay: 0,
                playthrough: false
            }, options);

            this._callback = $.noop();
            this._progress = $.noop();
            this._abort = false;

            if (this._collection.length) {

                if (true !== this._settings.sequential) {

                    for (let i = 0; i < this._collection.length; i++) {

                        if (this._abort)
                            break;

                        let load = new ResourceLoader();

                        load.resource = this._collection[i];

                        load.complete(function () {

                            // todo

                            if (this._abort)
                                return;

                        });

                    }

                } else {

                    let i = -1;

                    const sequential_recursion = function () {

                        i++;

                        let load = new ResourceLoader();

                        load.resource = this._collection[i];

                        load.complete(function () {

                            // todo

                            if (this._abort)
                                return;

                            setTimeout(sequential_recursion, $.isNumeric(this._settings.pipelineDelay) ? parseInt(this._settings.pipelineDelay) : 0);

                        });

                    };

                    sequential_recursion();

                }

            }

        }

        done(callback){

            if( !$.isFunction(callback) )
                return;

            const
                context = this,
                _func = function(){
                    callback.call(context);
                };

            if( this.collection.length )
                this._callback = _func;
            else
                _func();

        };

        progress(callback){

            if( !$.isFunction(callback) )
                return;

            const
                context = this,
                _func = function(){
                    callback.call(context);
                };

            if( this._collection.length )
                this._progress = _func;
            else
                _func();

        };

        abort(){

            if( !this._collection.length )
                return;

            this._abort = true;

        };

    }

    $[namespace_method] = ResourcesLoader;

    $.fn[namespace_method] = function(options, callback){

        if( $.isFunction(options) )
            callback = options;
        if( !$.isFunction(callback) )
            callback = $.noop;
        if( typeof options !== 'object' )
            options = {};

        const default_attributes = [ 'src', 'data-src', 'srcset', 'data-nite-src' ];

        let settings = $.extend(true, {
            sequential    : false,
            pipelineDelay : 0,
            attributes    : default_attributes,
            backgrounds   : false,
            playthrough   : false
        }, options);

        if( !$.isArray(settings.attributes) )
            settings.attributes = default_attributes;
        if( typeof settings.attributes === 'string' )
            settings.attributes = settings.attributes.split(' ');

        return this.each(function(){

            const element = this,
                  $element = $(element);

            let instance = $element.data(namespace);

            if( undefined !== instance )
                instance.abort();

            // - - -
            let collection = [];

            const targets = 'img, video, audio, iframe',
                targets_extended = targets+', picture, source';

            collection.concat($element.find(targets).toArray());

            if( $element.is(targets) )
                collection.add($element[0]);

            if( true === settings.backgrounds )
                $element.find('*').addBack().not(targets_extended).filter(function(){ return $(this).css('background-image') !== 'none'; }).each(function(){
                    collection.push( $(this).css('background-image').replace(/url\(\"|url\(\'|url\(|((\"|\')\)$)/igm, '') );
                });

            if( settings.attributes.length )
                for( let attr in settings.attributes ) {

                    $element.find('[' + attr + ']:not('+targets_extended+')').each(function () {
                        collection.push($(this).attr(attr));
                    });

                    if( $element.is('[' + attr + ']') && !$element.is(targets_extended) )
                        collection.add($element.attr(attr));

                }
            // - - -

            instance = new ResourcesLoader(collection, settings);

            instance.progress(function(){
                // todo
            });

            instance.done(function(){
                callback.call(element);
            });

            $element.data(namespace, instance);

        });

    };

    $[namespace_prefix+'Lazyload'] = function(selector){

        if( !$.nite || !( 'inViewport' in $.nite ) || !( 'scroll' in $.nite ) ) {

            console.log('A recent version of $.nite is needed.');

            return;

        }

        $.nite.scroll(namespace, function(){

            $( is_valid_selector(selector) ? selector : '[data-nite-src]' ).inViewport()[namespace_method](function(){

                const $this = $(this);

                $this.trigger(e.type + '.'+namespace_prefix+'LazyLoad');
                $document.trigger(e.type + '.'+namespace_prefix+'LazyLoad', [$this]);

            });

        }, { fps : 25 });

    };

})(window, document, jQuery);