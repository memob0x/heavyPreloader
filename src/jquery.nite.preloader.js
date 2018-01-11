/*! JQuery Heavy ResourcesLoader | Daniele Fioroni | dfioroni91@gmail.com */
(function(window, document, $, undefined){
    'use strict';

    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    if( !$ ) {
        console.error('jQuery is needed for $.fn.nitePreload(), $.nitePreload, $.niteLazyLoad to work!');
        return undefined;
    }
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~


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
        },
        
        is_format = function( string, expected_format ){
    
            string = string
                .toLowerCase()
                .split('?')[0]; // get rid of query strings
    
            if( string === ''  )
                return false;
    
            const
                formats = {
                    image : 'jp[e]?g|gif|png|tif[f]?|bmp',
                    audio : 'mp3|ogg',
                    video : 'mp4|ogv|ogg|webm'
                },
                base64_heading = '\;base64\,',
                formats_queue = undefined !== expected_format ? [ expected_format ] : Object.keys(formats);

            let output = { format : null, extension : null };

            for( let x in formats_queue ) {

                if (new RegExp('(\.(' + formats[ formats_queue[x] ] + ')$)|' + base64_heading, 'g').test(string)) {

                    if (new RegExp(base64_heading, 'g').test(string)) {

                        let matches64 = string.match(new RegExp('^data:' +  formats_queue[x]  + '\/(' + formats[ formats_queue[x] ] + ')', 'g'));

                        if (!matches64 || null === matches64) {

                            console.warn(string + ': base64 ' +  formats_queue[x]  + ' format not recognized.');

                            continue;

                        }

                        matches64 = matches64[0];

                        output = { format : matches64.replace('data:' +  formats_queue[x]  + '/g', ''), extension : 'base64' };

                        break;

                    } else {

                        let matches = string.match(new RegExp(formats[ formats_queue[x] ], 'g'));

                        if( matches ){

                            output = { format : formats_queue[x], extension : matches[0] };

                            break;

                        }

                    }

                }

            }

            return output;
    
        };

    class ResourceLoader {

        constructor(settings){

            const self = this;

            this._settings = settings;

            this._element  = null;
            this._$element = $();

            this._resource = null;
            
            this._format    = null;
            this._instance  = null;
            this._processed = false;

            this._callback  = $.noop;
            this._done  = function(e){

                self._callback.call(null /*temp*/, self._resource);

                if( self._processed )
                    return;

                self._$element.trigger(e.type + '.'+namespace_prefix);
                $document.trigger(e.type + '.'+namespace_prefix, [this._$element]);

            };

        }
        
        set resource( resource ){

            const
                recognized_resource = typeof resource === 'object' && 'standard' in resource,
                standard_resource   = recognized_resource && resource.standard === true,
                string_resource     = typeof resource === 'string';

            if( !recognized_resource && !string_resource )
                return false;

            const self = this;

            if( string_resource || !standard_resource ){

                this._format = is_format(resource).format;

                if( this._format === 'image' )
                    this._element = new Image();
                else
                    this._element = document.createElement(this._format);

                this._settings.srcsetAttr = 'data-srcset';
                this._settings.srcAttr    = 'data-src';

                this._resource = resource;

            }

            this._$element = $(this._element);

            if( string_resource || !standard_resource ){

                this._$element
                    .data(this._settings.srcAttr.replace('data-', ''), this._resource)
                    .data(this._settings.srcsetAttr.replace('data-', ''), this._resource)
                    .attr(this._settings.srcAttr, this._resource)
                    .attr(this._settings.srcsetAttr, this._resource);

            }
            
            if( !string_resource && standard_resource ){

                this._element = resource.element;
                this._format  = resource.format;

                this._$element = $(this._element);

            }

            this._instance  = this._$element.data(namespace);
            this._processed = this._instance !== undefined;

            this._instance  = this._processed ? this._instance : namespace + '_unique_' + ( $.nite ? $.nite.uniqueId() : Math.random(1000, 9999) );

            switch( this._format ) {

                case 'image':

                    this._$element[ this._processed ? 'on' : 'one']('load.' + this._instance + ' error.' + this._instance, this._done);

                    const
                        $picture     = this._$element.closest('picture'),
                        src          = this._settings.srcAttr,
                        src_clean    = this._settings.srcAttr.replace('data-', ''),
                        srcset       = this._settings.srcsetAttr,
                        srcset_clean = this._settings.srcsetAttr.replace('data-', '');

                    if ($picture.length) {

                        this._$element
                            .removeData(srcset_clean)
                            .removeAttr(srcset)
                            .removeData(src_clean)
                            .removeAttr(src);

                        $picture.find('source[data-srcset]')
                            .attr('srcset', $picture.data('srcset'))
                            .removeData(srcset_clean)
                            .removeAttr(srcset);

                    } else {

                        if( this._$element.is('[data-srcset]') )
                            this._$element
                                .attr('srcset', this._$element.data('srcset'))
                                .removeData(srcset_clean)
                                .removeAttr(srcset);

                        if( this._$element.is('[data-src]') )
                            this._$element
                                .attr('src', this._$element.data('src'))
                                .removeData(src_clean)
                                .removeAttr(src);

                    }

                    this._resource = this._element.currentSrc || this._element.src;

                    if (true === this._element.complete && this._element.naturalWidth !== 0 && this._element.naturalHeight !== 0) {

                        if ( !this._processed )
                            this._$element.off('.' + this._instance);

                        this._done.call(new Event(undefined !== this._element.naturalWidth ? 'load' : 'error'));

                    }

                    break;

                case 'media':



                    break;

                case 'iframe':



                    break;

            }


            if ( !this._processed )
                this._$element.data(namespace, this._instance);

        }

        abort(){

            this._$element
                .filter('[src], [srcset]')
                    .data(this._settings.srcsetAttr, this._$element.attr('srcset'))
                    .data(this._settings.srcAttr, this._$element.attr('src'))
                    .attr(this._settings.srcsetAttr, this._$element.attr('srcset'))
                    .attr(this._settings.srcAttr, this._$element.attr('src'))
                    .removeAttr('src').removeAttr('srcset')
                .end()
                .off('load.' + this._instance + ' error.' + this._instance);

        }

        done(callback){

            if( !$.isFunction(callback) )
                return;

            const context = this;

            this._callback = function(resource){
                console.log(resource)
                callback.call(context, resource);
            };

        };

    }
    
    class ResourcesLoader {

        constructor(collection, options) {

            const self = this;

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

            this.percentage = 0;

            this._callback = $.noop();
            this._progress = $.noop();
            this._abort = false;

            this._load_instances = [ new ResourceLoader(this._settings) ];

            if (this._collection.length) {

                if (true !== this._settings.sequential) {

                    let loaded = 0;

                    for (let i = 0; i < this._collection.length; i++) {

                        if (this._abort)
                            break;

                        let load_instance = new ResourceLoader(this._settings);

                        this._load_instances.push(load_instance);

                        load_instance.resource = this._collection[i];

                        load_instance.done(function(resource){

                            loaded++;

                            self.percentage = loaded / self._collection.length * 100;

                            self._progress.call(null /* todo */, resource);

                            if ( loaded > self._collection.length || self._abort )
                                return;

                            if( loaded === self._collection.length )
                                self._callback.call(null /* todo */ );

                        });

                    }

                } else {

                    let loaded = -1;

                    const sequential_recursion = function () {

                        loaded++;

                        if ( loaded > this._collection.length || this._abort )
                            return;

                        if( loaded === this._collection.length )
                            this._callback.call(null /* todo */ );

                        this._load_instances[0].resource = this._collection[loaded];

                        this._load_instances[0].done(function (resource) {

                            self.percentage = loaded / self._collection.length * 100;

                            self._progress.call(null /* todo */, resource);

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

            if( this._collection.length )
                this._callback = _func;
            else
                _func();

        };

        progress(callback){

            if( !$.isFunction(callback) )
                return;

            const
                context = this,
                _func = function(resource){
                    callback.call(context, resource);
                };

            if( this._collection.length )
                this._progress = _func;
            else
                _func();

        };

        abort(){

            for( let instance in this._load_instances )
                this._load_instances[ instance ].abort();

            if( !this._collection.length )
                return;

            this._abort = true;

        };

    }

    class CollectionPopulator {

        constructor($element, settings) {

            this._$element = $element;
            this._settings = settings;

        }

        collect() {

            let collection = [];

            const
                targets = 'img, video, audio, iframe',
                targets_extended = targets + ', picture, source';

            let $targets = this._$element.find(targets);
            if (this._$element.is(targets))
                $targets.add($element);
            $targets.each(function () {
                collection.push({
                    element  : this,
                    resource : this.currentSrc || this.src,
                    standard : true
                });
            });

            if (true === this._settings.backgrounds)
                this._$element.find('*').addBack().not(targets_extended).filter(function () {
                    return $(this).css('background-image') !== 'none';
                }).each(function () {
                    collection.push({
                        element  : this,
                        resource : $(this).css('background-image').replace(/url\(\"|url\(\'|url\(|((\"|\')\)$)/igm, ''),
                        standard : false
                    });
                });

            if (this._settings.attributes.length)
                for (let attr in this._settings.attributes) {

                    this._$element.find('[' + attr + ']:not(' + targets_extended + ')').each(function () {
                        collection.push({
                            element  : this,
                            resource : $(this).attr(attr),
                            standard : false
                        });
                    });

                    if (this._$element.is('[' + attr + ']') && !this._$element.is(targets_extended))
                        collection.add({
                            element  : this,
                            resource : this._$element.attr(attr),
                            standard : false
                        });

                }

            return collection;

        }

    }

    $[namespace_method] = ResourcesLoader;

    $.fn[namespace_method] = function(options, callback){

        if( $.isFunction(options) )
            callback = options;
        if( !$.isFunction(callback) )
            callback = $.noop;
        if( typeof options !== 'object' )
            options = {};

        let settings = $.extend(true, {
            srcAttr       : 'data-src',
            srcsetAttr    : 'data-srcset',
            sequential    : false,
            pipelineDelay : 0,
            extraAttrs    : [],
            backgrounds   : false,
            playthrough   : false
        }, options);

        if( !$.isArray(settings.attributes) )
            settings.attributes = [];
        if( typeof settings.attributes === 'string' )
            settings.attributes = settings.attributes.split(' ');

        return this.each(function(){

            const element = this,
                  $element = $(element);

            let load_instance = $element.data(namespace);

            if( undefined !== load_instance )
                load_instance.abort();

            load_instance = new ResourcesLoader(new CollectionPopulator($element, settings).collect(), settings);

            load_instance.progress(function(){

                // todo trigger event ...

            });

            load_instance.done(function(){

                callback.call(element);

                // todo trigger event ...

            });

            $element.data(namespace, load_instance);

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