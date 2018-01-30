/*! JQuery Nite Preloader | Daniele Fioroni | dfioroni91@gmail.com */
(function(window, document, $, undefined){
    'use strict';

    const
        namespace_prefix = 'nite',
        namespace_method = namespace_prefix+'Preload',
        namespace = namespace_method+'er';


    // thanks to https://github.com/paulmillr/console-polyfill
    // - - - - - - - - - - - - - - - - - - - -
    (function(global) {
        if (!global.console)
            global.console = {};
        let con = global.console,
            prop, method,
            dummy = function() {},
            properties = ['memory'],
            methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
                'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
                'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
        while (prop = properties.pop())
            if (!con[prop])
                con[prop] = {};
        while (method = methods.pop())
            if (!con[method])
                con[method] = dummy;
    })(window);
    // - - - - - - - - - - - - - - - - - - - -


    // - - - - - - - - - - - - - - - - - - - -
    if( !$ ) {
        console.error('jQuery is needed for '+namespace+' to work!');
        return undefined;
    }
    // - - - - - - - - - - - - - - - - - - - -


    // thanks to https://github.com/jsPolyfill/Array.prototype.findIndex
    // todo check efficiency and reliability in MS Internet Explorer
    // - - - - - - - - - - - - - - - - - - - -
    Array.prototype.findIndex = Array.prototype.findIndex || function(callback) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        } else if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }
        const
            list = Object(this),
            // Makes sures is always has an positive integer as length.
             length = list.length >>> 0,
             thisArg = arguments[1];
        for (let i = 0; i < length; i++) {
            if ( callback.call(thisArg, list[i], i, list) ) {
                return i;
            }
        }
        return -1;
    };
    // - - - - - - - - - - - - - - - - - - - -


    // thanks to https://gist.github.com/eliperelman/1031656
    // todo check efficiency and reliability in MS Internet Explorer
    // - - - - - - - - - - - - - - - - - - - -
    [].filter||(Array.prototype.filter=function(a,b,c,d,e){c=this;d=[];for(e in c)~~e+''==e&&e>=0&&a.call(b,c[e],+e,c)&&d.push(c[e]);return d})
    // - - - - - - - - - - - - - - - - - - - -



    const

        capitalize = function(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        $document = $(document),
        $window = $(window),

        unique_id = function(){

            return $.nite && 'uniqueId' in $.nite ? $.nite.uniqueId() : Math.floor(Math.random() * (9999 - 1000)) + 1000;

        },

        is_visible = function(element){

            const $el = $(element);

            let in_viewport = false;

            if( $.nite && 'inViewport' in $.nite )
                in_viewport = $.nite.inViewport(element).ratio;

            else{

                const rect = element.getBoundingClientRect();

                in_viewport = !( rect.right < 0 || rect.bottom < 0 || rect.left > $window.width() || rect.top > $window.height() );

            }

            return in_viewport && $el.is(':visible') && $el.css('visibility') !== 'hidden';

        },

        is_html_object = function( object ){

            if( typeof object !== 'object' )
                return false;

            try {
                return object instanceof HTMLElement;
            }
            catch(e){
                return object.nodeType === 1 && typeof object.style === 'object' && typeof object.ownerDocument === 'object';
            }

        },

        is_loaded = function(element){

            return is_html_object(element)
                && ( 'currentSrc' in element && element.currentSrc.length )
                && ( ( 'complete' in element && element.complete ) || ( 'readyState' in element && element.readyState >= 2 ) );

        },

        is_broken = function(element){

            return is_loaded(element) && (
                    ( 'naturalWidth' in element && Math.floor(element.naturalWidth) === 0 )
                    ||
                    ( 'videoWidth' in element && element.videoWidth === 0 )
                );

        },
        
        is_format = function( item, expected_format ){

            const
                format_extensions = {
                    image : 'jp[e]?g|gif|png|tif[f]?|bmp',
                    audio : 'mp3|ogg',
                    video : 'mp4|ogv|ogg|webm'
                },
                format_names = Object.keys(format_extensions),
                base64_heading = '\;base64\,';

            let output = { format: null, extension: null };

            if( typeof item === 'string' ) {

                item = item.split('?')[0]; // get rid of query strings
                item = item.split('#')[0]; // get rid of hashes

                if (item === '')
                    return false;

                let format_queue = undefined !== expected_format ? [ expected_format ] : format_names;

                for (const x in format_queue) {

                    if (format_queue.hasOwnProperty(x)){

                        if (new RegExp('(\.(' + format_extensions[format_queue[x]] + ')$)|' + base64_heading, 'g').test(item)) {

                            if (new RegExp(base64_heading, 'g').test(item)) {

                                let matches64 = item.match(new RegExp('^data:' + format_queue[x] + '\/(' + format_extensions[format_queue[x]] + ')', 'g'));

                                if ( !matches64 || null === matches64 )
                                    continue;

                                matches64 = matches64[0];

                                output.format = matches64.replace('data:' + format_queue[x] + '/g', '');

                                break;

                            } else {

                                let matches = item.match(new RegExp(format_extensions[format_queue[x]], 'g'));

                                if (matches) {

                                    output.format = format_queue[x];
                                    output.extension = matches[0];

                                    break;

                                }

                            }

                        }

                    }

                }

            }

            if( is_html_object(item) ){

                let tag_name = item.tagName.toLowerCase();
                
                if( $.inArray(tag_name, format_names) > -1 )
                    output.format = item.tagName.toLowerCase();

                if( tag_name === 'img' )
                    output.format = 'image';

            }

            return output;
    
        };

    class ResourceLoader {

        constructor(options){

            const self = this;

            // todo make _vars really private
            // todo make useful vars since this class is not public but is returned in .progress() callback
            this._settings  = $.extend(true, {
                srcAttr     : 'data-src',
                srcsetAttr  : 'data-srcset',
                playthrough : false,
                visible     : false,
            }, options);

            this._id        = null;
            this._id_event  = null;

            this._element   = null;
            this._$element  = $();

            this._resource  = null;
            this._busy      = false;

            this._format    = null;

            this._callback  = $.noop;
            this._done      = function(e){

                let resource = self._element.currentSrc || self._element.src;

                if( !self._busy ) { // todo it should enter here only once

                    let event_name = capitalize(e.type);

                    self._$element.trigger(namespace_prefix + event_name + '.' + namespace_prefix, [ self._element, resource ]);

                }

                self._$element.removeData(namespace);

                self._busy = false;

                self._callback.call(self, e.type, resource, self._id);

            };

        }

        set resource( data ){

            const
                element_resource = is_html_object(data.resource),
                string_resource = typeof data.resource === 'string';

            if( !element_resource && !string_resource )
                return;

            this._id = data.id;
            this._format = is_format(data.resource).format;

            if( string_resource ){

                let is_img = this._format === 'image';

                this._element = document.createElement(is_img ? 'img' : this._format);

                if( is_img )
                    this._settings.srcsetAttr = 'data-srcset';
                this._settings.srcAttr = 'data-src';

                this._resource = data.resource;

            }

            if( element_resource )
                this._element = data.resource;

            this._$element = $(this._element);

            if( string_resource ){

                this._$element
                    .data(this._settings.srcAttr.replace('data-', ''), this._resource)
                    .data(this._settings.srcsetAttr.replace('data-', ''), this._resource)
                    .attr(this._settings.srcAttr, this._resource)
                    .attr(this._settings.srcsetAttr, this._resource);

            }

            this._id_event = this._$element.data(namespace);
            this._busy = this._id_event !== undefined;
            this._id_event = this._busy ? this._id_event : namespace + '_unique_' + this._element.tagName + '_'+ unique_id();

        }

        /**
         *
         * @returns {boolean} se ha preso in carico il caricamento oppure no per vari motivi (è già caricato, non è nella viewport etc)
         */
        process(){

            const
                self = this,
                src = this._settings.srcAttr,
                src_clean = this._settings.srcAttr.replace('data-', '');

            if ( is_loaded(this._element) ) {

                if (!this._busy)
                    this._$element.off('.' + this._id_event);

                this._done(new Event(!is_broken(this._element) ? 'load' : 'error'));

                return false;

            }else if( this._settings.visible && !is_visible(this._element) ){ // todo check if starts scrolling from the bottom of the page

                return false;

            }else{

                if( this._format === 'image' ) {

                    this._$element[this._busy ? 'on' : 'one']('load.' + this._id_event + ' error.' + this._id_event, this._done);

                    const
                        $picture = this._$element.closest('picture'),
                        srcset = this._settings.srcsetAttr,
                        srcset_clean = this._settings.srcsetAttr.replace('data-', '');

                    if ($picture.length && 'HTMLPictureElement' in window ) {

                        this._$element
                            .removeData(srcset_clean)
                            .removeAttr(srcset)
                            .removeData(src_clean)
                            .removeAttr(src);

                        $picture.find('source[' + srcset + ']')
                            .attr('srcset', $picture.data(srcset_clean))
                            .removeData(srcset_clean)
                            .removeAttr(srcset);

                    } else {

                        if (this._$element.is('[' + srcset + ']'))
                            this._$element
                                .attr('srcset', this._$element.data(srcset_clean))
                                .removeData(srcset_clean)
                                .removeAttr(srcset);

                        if (this._$element.is('[' + src + ']'))
                            this._$element
                                .attr('src', this._$element.data(src_clean))
                                .removeData(src_clean)
                                .removeAttr(src);

                    }

                }else if( this._format === 'video' || this._format === 'audio' ){

                    const
                        $sources = this._$element.find('source'),
                        is_fully_buffered = function(media){

                            return media.buffered.length && Math.round(media.buffered.end(0)) / Math.round(media.seekable.end(0)) === 1;

                        };

                    let call_media_load = false;

                    if( $sources.length ){

                        $sources.each(function() {

                            if ( $(this).is('[' + src + ']') ) {

                                $(this)
                                    .attr('src', $(this).data(src_clean))
                                    .removeData(src_clean)
                                    .removeAttr(src);

                                call_media_load = true;

                            }

                        })
                        [this._busy ? 'on' : 'one']('error.' + this._id_event, function(e){

                            const sources_error_id = namespace+'_error';

                            $(this).data(sources_error_id, true);

                            if( $sources.length === $sources.filter(function(){ return true === $(this).data(sources_error_id); }).length )
                                self._done(e);

                        });

                    }else{

                        if (this._$element.is('[' + src + ']')) {

                            this._$element
                                .attr('src', this._$element.data(src_clean))
                                .removeData(src_clean)
                                .removeAttr(src)
                                [this._busy ? 'on' : 'one']('error.' + this._id_event, self._done);

                            call_media_load = true;

                        }

                    }

                    if( call_media_load )
                        this._element.load();

                    this._$element
                        [this._busy ? 'on' : 'one']('loadedmetadata.' + this._id_event, function () {

                            if ( true !== self._settings.playthrough && 'full' !== self._settings.playthrough )
                                self._done(new Event('load'));

                            if( 'full' === self._settings.playthrough ) {

                                let on_progress_replacement_interval = setInterval(function(){

                                    let is_error = self._element.readyState > 0 && !self._element.duration;

                                    if( is_error || is_fully_buffered(self._element) ){

                                        self._element.currentTime = 0;

                                        if( !is_error && !self._busy && self._element.paused && $(self._element).is('[autoplay]') )
                                            self._element.play();

                                        clearInterval(on_progress_replacement_interval);

                                        self._done(new Event( !is_error ? 'load' : 'error' ));

                                    } else {

                                        if( !self._element.paused )
                                            self._element.pause();

                                        if( !self._busy )
                                            self._element.currentTime += 2;

                                    }

                                }, 500);

                                self._$element.data(self._id_event, on_progress_replacement_interval);

                            }

                        })
                        [this._busy ? 'on' : 'one']('canplay.' + this._id_event, function () {

                            if ('full' === self._settings.playthrough && this.currentTime === 0 && !is_fully_buffered(this))
                                this.currentTime++;

                        })
                        [this._busy ? 'on' : 'one']('canplaythrough.' + this._id_event, function () {

                            if (true === self._settings.playthrough)
                                self._done(new Event('load'));

                        });

                }else {

                    return false;

                }

                if ( !this._busy )
                    this._$element.data(namespace, this._id_event);

            }

            this._resource = this._element.currentSrc || this._element.src;

            return !this._busy;

        }

        abort(){

            this._$element
                .off('.' + this._id_event);

            if( is_loaded(this._element) )
                return;

            const
                src = this._$element.attr('srcset'),
                srcset = this._$element.attr('src');

            if( undefined !== src )
                this._$element
                    .data(this._settings.srcAttr, src)
                    .attr(this._settings.srcAttr, src)
                    .removeAttr('src').removeAttr('srcset');

            if( undefined !== srcset )
                this._$element
                    .data(this._settings.srcsetAttr, srcset)
                    .attr(this._settings.srcsetAttr, srcset)
                    .removeAttr('src').removeAttr('srcset');

        }

        done(callback){

            if( !$.isFunction(callback) )
                return;

            this._callback = function(status, resource, id){
                callback.call(this, status, resource, id);
            };

        };

    }
    
    class ResourcesLoader {

        constructor(collection, options) {

            const self = this;

            // todo make _vars really private
            this._collection = [];
            this._collection_loaded = [];
            this._collection_instances = [];
            this._resources_loaded = [];

            if ($.isArray(collection) && ( typeof collection[0] === 'string' || is_html_object(collection[0]) ))
                for ( const resource in collection )
                    if( collection.hasOwnProperty(resource) )
                        this._collection.push({ id : unique_id(), resource : collection[resource] });
            if ( typeof collection === 'string' || is_html_object(collection) )
                this._collection.push({ id : unique_id(), resource : collection });

            this._settings = $.extend(true, {
                srcAttr     : 'data-src',
                srcsetAttr  : 'data-srcset',
                playthrough : false,
                visible     : false,
            }, options);

            this.percentage = 0;

            this._callback = $.noop;
            this._progress = $.noop;

            this._abort = false;
            this._loaded = 0;
            this._complete = false;
            this._busy = false;

            this._loop = (function async_loop() {
                
                setTimeout(function () { // force asynchrony (gives time to chain methods synchronously)

                    self.loop();

                }, 25);

                return async_loop;

            })();

        }

        loop(){

            const
                self = this,
                sequential_mode = true === this._settings.sequential;

            for( let i = 0; i < this._collection.length; i++ ){

                if( this._abort )
                    break;

                let this_load_id = this._collection[i].id,
                    this_load_index = self._collection_instances.findIndex( x => x.id === this_load_id ),
                    this_load_instance = new ResourceLoader(this._settings);

                if( this_load_index === -1 ) {
                    this._collection_instances.push({id: this_load_id, instance: this_load_instance});
                    this_load_index = self._collection_instances.findIndex( x => x.id === this_load_id );
                }else
                    this._collection_instances[this_load_index].instance = this_load_instance;

                this_load_instance.resource = this._collection[i];

                this_load_instance.done(function(status, resource, id){

                    if( !self._complete && !self._abort && $.inArray(id, self._collection_loaded) === -1 ) {

                        self._collection_loaded.push(id);
                        self._busy = false;

                        self._loaded++;
                        self.percentage = self._loaded / self._collection.length * 100;
                        self.percentage = parseFloat(self.percentage.toFixed(4));

                        let this_resource = { resource : resource, status : status };
                        self._resources_loaded.push(this_resource);

                        self._progress.call(this, this_resource);

                        if( sequential_mode ){

                            let next_load_instance = self._collection_instances.findIndex( x => x.id === id ) + 1;

                            if( next_load_instance > 0 && next_load_instance < self._collection_instances.length ) {

                                next_load_instance = self._collection_instances[ next_load_instance ];

                                next_load_instance.instance.process();

                            }

                        }

                    }

                    if( !self._complete && !self._abort && self._loaded === self._collection.length ) {

                        self._callback.call(self, self._resources_loaded);

                        self._complete = true;

                    }

                });

                if( !sequential_mode || ( sequential_mode && !this._busy ) )
                    this._busy = this_load_instance.process();

            }

        }

        // todo success(callback){}

        // todo error(callback){}

        done(callback){

            if( !$.isFunction(callback) )
                return false;

            const _func = function(resources){
                callback.call(this, resources);
            };

            if( this._collection.length ) {

                this._callback = _func;

                this._loop();

            }else
                _func();

            return true;

        };

        progress(callback){

            if( !$.isFunction(callback) )
                return false;

            const _func = function(resource){
                callback.call(this, resource);
            };

            if( this._collection.length ) {

                this._progress = _func;

                this._loop();

                return true;

            }

            return false;

        };

        abort(){

            for( const key in this._collection_instances )
                this._collection_instances[ key ].instance.abort();

            if( !this._collection.length )
                return;

            this._abort = true;

        };

    }

    class CollectionPopulator {

        constructor($element, options) {

            this._$element  = $element;
            this._element   = $element[0];

            this._settings  = $.extend(true, {
                srcAttr     : 'data-src',
                srcsetAttr  : 'data-srcset',
                backgrounds : false,
                attributes  : []
            }, options);

        }

        collect( output ) {

            let collection = [];

            const
                is_plain_data_collection = output === 'plain',
                self = this,
                targets = 'img, video, audio',
                targets_extended = targets + ', picture, source';

            let $targets = this._$element.find(targets);
            if (this._$element.is(targets))
                $targets = $targets.add(this._$element);
            $targets = $targets.filter(function(){
                let filter = '['+self._settings.srcAttr+'], ['+self._settings.srcsetAttr+']';
                return $(this).is(filter) || $(this).children(targets_extended).filter(filter).length;
            });
            $targets.each(function () {

                let collection_item = {
                    element : this,
                    resource : $(this).attr(self._settings.srcAttr) || $(this).attr(self._settings.srcsetAttr)
                };

                if( is_plain_data_collection )
                    collection_item = collection_item.element;

                collection.push(collection_item);

            });

            if (true === this._settings.backgrounds)
                this._$element.find('*').addBack().not(targets_extended).filter(function () {
                    return $(this).css('background-image') !== 'none';
                }).each(function () {

                    let collection_item = {
                        element : this,
                        resource : $(this).css('background-image').replace(/url\("|url\('|url\(|(("')\)$)/igm, '')
                    };

                    if( is_plain_data_collection )
                        collection_item = collection_item.resource;

                    collection.push(collection_item);

                });

            if (this._settings.attributes.length)
                for (const attr in this._settings.attributes) {
                    if( this._settings.attributes.hasOwnProperty(attr) ) {

                        this._$element.find('[' + attr + ']:not(' + targets_extended + ')').each(function () {

                            let collection_item = {
                                element : this,
                                resource : $(this).attr(attr)
                            };

                            if( is_plain_data_collection )
                                collection_item = collection_item.resource;

                            collection.push(collection_item);

                        });

                        if (this._$element.is('[' + attr + ']') && !this._$element.is(targets_extended)) {

                            let collection_item = {
                                element: this._element,
                                resource: this._$element.attr(attr)
                            };

                            if( is_plain_data_collection )
                                collection_item = collection_item.resource;

                            collection.push(collection_item);

                        }

                    }
                }

            return collection;

        }

    }

    $[namespace_method] = ResourcesLoader;

    let method_collection = [];

    $.fn[namespace_method] = function(options){

        let original_user_options = options;

        if( typeof options !== 'object' )
            options = {};

        let settings = $.extend(true, {

            srcAttr       : 'data-src',
            srcsetAttr    : 'data-srcset',

            visible       : false,

            sequential    : false,

            backgrounds   : false,
            extraAttrs    : [],

            playthrough   : false,

            early         : false,
            earlyTimeout  : 0,

            onProgress    : $.noop,
            onLoad        : $.noop,
            onError       : $.noop,

            onComplete    : $.noop,

        }, options);

        let callback = settings.onComplete;
        if( $.isFunction(original_user_options) )
            callback = original_user_options;

        if( !$.isArray(settings.attributes) )
            settings.attributes = [];
        if( typeof settings.attributes === 'string' )
            settings.attributes = settings.attributes.split(' ');

        return this.each(function(){

            const
                element = this,
                $element = $(element),
                collection = new CollectionPopulator($element, settings).collect('plain'),
                //element_in_collection = $.inArray(element, collection) > -1,
                unique_method_namespace = namespace + '_' + unique_id(),

                this_load_instance = new ResourcesLoader(collection, settings);

            method_collection.push({
                id : unique_method_namespace,
                instance : this_load_instance,
                element : element,
                timeout : null
            });

            this_load_instance.progress(function (resource) {

                $element.trigger(namespace_prefix+'Progress.'+namespace_prefix, [element, resource]);

                if( $.isFunction(settings.onProgress) )
                    settings.onProgress.call(element, this_load_instance, resource );

                let event_name = capitalize(resource.status);
                if( $.isFunction(settings['on'+event_name]) )
                    settings['on'+event_name].call(element, this_load_instance, resource );

            });

            this_load_instance.done(function(resources){

                $element.trigger(namespace_prefix + 'Complete.'+namespace_prefix, [element, resources]);
                callback.call(element, this_load_instance, resources);

                if( settings.visible )
                    $( $.nite && 'scroll' in $.nite ? $document : $window ).off('scroll.' + unique_method_namespace);

                // refresh other method calls for same el (omitting this one)
                method_collection = method_collection.filter(function(obj) {
                    return obj.id !== unique_method_namespace;
                });
                for( let key in method_collection ) {
                    let this_method_collection = method_collection[key];
                    if ($element.is(this_method_collection.element))
                        this_method_collection.instance.loop();
                }

            });

            if( settings.visible ){

                if( $.nite && 'scroll' in $.nite )
                    $.nite.scroll(unique_method_namespace, function(){ this_load_instance.loop(); }, { fps : 25 });

                else{

                    const throttle_scroll_event = function(fn, wait) {
                        let time = Date.now();
                        return function() {
                            if( ( time + wait - Date.now() ) < 0 ){
                                fn();
                                time = Date.now();
                            }
                        }
                    };

                    $window.on('scroll.'+unique_method_namespace, throttle_scroll_event(function(){ this_load_instance.loop(); }, 1000));

                }

            }

            if( true === settings.early ) for( let key in method_collection )
                if( method_collection[key].id === unique_method_namespace ){

                    let this_method_collection = method_collection[key];

                    clearTimeout( this_method_collection.timeout );

                    this_method_collection.timeout = setTimeout(function(){

                        // todo appropriate method for setting settings?
                        this_method_collection.instance._settings.visible = false;
                        this_method_collection.instance._settings.sequential = true;

                        this_method_collection.instance.loop();

                    }, $.isNumeric(settings.earlyTimeout) ? parseInt(settings.earlyTimeout) : 0 );

                    break;

                }

        });

    };

})(window, document, jQuery);