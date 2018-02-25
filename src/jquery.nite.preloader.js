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


    let cache = [];

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

            return (
                typeof element === 'string'
                && $.inArray(element, cache) > -1
            )
            || (
                is_html_object(element)
                && ( 'currentSrc' in element && element.currentSrc.length )
                && ( ( 'complete' in element && element.complete ) || ( 'readyState' in element && element.readyState >= 2 ) )
            );

        },

        is_broken = function(element){

            return is_loaded(element) && (
                    (
                        typeof element === 'object' && (
                            ( 'naturalWidth' in element && Math.floor(element.naturalWidth) === 0 )
                            ||
                            ( 'videoWidth' in element && element.videoWidth === 0 )
                        )
                    )
                    || typeof element === 'string' // todo check if is url maybe?
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

                                output.format = format_queue[x];
                                output.extension = matches64.replace('data:' + format_queue[x] + '/', '');

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

            this._done      = $.noop;
            this._success   = $.noop;
            this._error     = $.noop;

            this._callback  = (e) => {

                this._$element.removeData(namespace);

                this._busy = false;

                const src = this._element.currentSrc || this._element.src;

                if( $.inArray(src, cache) === -1 )
                    cache.push(src);

                let this_arguments = [ this._element, e.type, src, this._id ];

                this[ e.type !== 'error' ? '_success' : '_error' ].apply(this, this_arguments);
                this._done.apply(this, this_arguments);

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

            this._exists = element_resource; // todo maybe search for an element with this src

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
                src = this._settings.srcAttr,
                src_clean = this._settings.srcAttr.replace('data-', '');

            if ( is_loaded( this._exists ? this._element : this._resource ) ) {

                if (!this._busy)
                    this._$element.off('.' + this._id_event); // todo this should be called when in callback

                this._callback(new Event(!is_broken( this._exists ? this._element : this._resource ) ? 'load' : 'error'));

                return false;

            }else if( this._exists && this._settings.visible && !is_visible(this._element) ){

                return false;

            }else{

                if( this._format === 'image' ) {

                    this._$element[this._busy ? 'on' : 'one']('load.' + this._id_event + ' error.' + this._id_event, this._callback);

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

                        is_playthrough_mode__normal = true === this._settings.playthrough,
                        is_playthrough_mode__full = 'full' === this._settings.playthrough,

                        $sources = this._$element.find('source'),
                        is_fully_buffered = function(media){

                            return media.buffered.length && Math.round(media.buffered.end(0)) / Math.round(media.seekable.end(0)) === 1;

                        };

                    let call_media_load = false;

                    if( $sources.length ){

                        let self = this; // todo arrow func ?

                        $sources.each(function() {

                            let $t = $(this);

                            if ( $t.is('[' + src + ']') ) {

                                $t
                                    .attr('src', $t.data(src_clean))
                                    .removeData(src_clean)
                                    .removeAttr(src);

                                call_media_load = true;

                            }

                        })
                        [this._busy ? 'on' : 'one']('error.' + this._id_event, function(e){

                            const sources_error_id = namespace+'_error';

                            $(this).data(sources_error_id, true);

                            if( $sources.length === $sources.filter(function(){ return true === $(this).data(sources_error_id); }).length )
                                self._callback(e);

                        });

                    }else{

                        if (this._$element.is('[' + src + ']')) {

                            this._$element
                                .attr('src', this._$element.data(src_clean))
                                .removeData(src_clean)
                                .removeAttr(src)
                                [this._busy ? 'on' : 'one']('error.' + this._id_event, this._callback);

                            call_media_load = true;

                        }

                    }

                    if( call_media_load )
                        this._element.load();

                    this._$element
                        [this._busy ? 'on' : 'one']('loadedmetadata.' + this._id_event, () => {

                            if ( !is_playthrough_mode__normal && !is_playthrough_mode__full )
                                this._callback(new Event('load'));

                            if( is_playthrough_mode__full ) {

                                let on_progress_replacement_interval = setInterval(() => {

                                    let is_error = this._element.readyState > 0 && !this._element.duration;

                                    if( is_error || is_fully_buffered(this._element) ){

                                        this._element.currentTime = 0;

                                        if( !is_error && !this._busy && this._element.paused && this._$element.is('[autoplay]') )
                                            this._element.play();

                                        clearInterval(on_progress_replacement_interval);

                                        this._callback(new Event( !is_error ? 'load' : 'error' ));

                                    } else {

                                        if( !this._element.paused )
                                            this._element.pause();

                                        if( !this._busy )
                                            this._element.currentTime += 2;

                                    }

                                }, 500);

                                this._$element.data(this._id_event, on_progress_replacement_interval);

                            }

                        })
                        [this._busy ? 'on' : 'one']('canplay.' + this._id_event, () => {

                            if ( is_playthrough_mode__full && this._element.currentTime === 0 && !is_fully_buffered(this._element))
                                this._element.currentTime++;

                        })
                        [this._busy ? 'on' : 'one']('canplaythrough.' + this._id_event, () => {

                            if( is_playthrough_mode__normal )
                                this._callback(new Event('load'));

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

        done(callback){

            if( !$.isFunction(callback) )
                return;

            this._done = function(element, status, resource, id){
                callback.apply(this, [element, status, resource, id]);
            };

        };

        abort(){

            this._$element
                .off('.' + this._id_event);

            if( is_loaded(this._exists ? this._element : this._resource ) )
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

    }
    
    class ResourcesLoader {

        constructor(collection, options) {

            // todo make _vars really private
            this._collection           = [];
            this._collection_loaded    = [];
            this._collection_instances = [];
            this._collection_pending   = [];
            this._resources_loaded     = [];

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

            this._done      = $.noop;
            this._progress  = $.noop;
            this._success   = $.noop;
            this._error     = $.noop;

            this._abort     = false;
            this._loaded    = 0;
            this._complete  = false;
            this._busy      = false;

            (this._loop = () => { // self invoking this._loop
                setTimeout( () => { // force asynchrony (gives time to chain methods synchronously)
                    this.loop();
                }, 25);
            })();

        }

        loop(){

            this._collection_pending = []; // resets pending elements (sequential opt helper array) every time we loop

            const sequential_mode = true === this._settings.sequential;

            for( let i = 0; i < this._collection.length; i++ ){

                if( this._abort )
                    break;

                let this_load_id = this._collection[i].id,
                    this_load_index = this._collection_instances.findIndex( x => x.id === this_load_id ),
                    this_load_instance = new ResourceLoader(this._settings);

                if( this_load_index === -1 ) {
                    this._collection_instances.push({ id : this_load_id, instance : this_load_instance });
                    this_load_index = this._collection_instances.findIndex( x => x.id === this_load_id );
                }else
                    this._collection_instances[this_load_index].instance = this_load_instance;

                this_load_instance.resource = this._collection[i];

                this_load_instance.done((element, status, resource, id) => {

                    if( this._complete || this._abort )
                        return;

                    let a_progress = $.inArray(id, this._collection_loaded) === -1;

                    if( a_progress ) {

                        this._collection_loaded.push(id);
                        this._busy = false;

                        this._loaded++;
                        this.percentage = this._loaded / this._collection.length * 100;
                        this.percentage = parseFloat(this.percentage.toFixed(4));

                        let this_resource = { resource : resource, status : status };
                        this._resources_loaded.push(this_resource);

                        this._progress.call(this, this_resource);
                        this[ status !== 'error' ? '_success' : '_error' ].call(this, this_resource);

                        $(element).trigger(namespace_prefix + capitalize(status) + '.' + namespace_prefix, [ element, resource ]);

                    }

                    if( this._loaded === this._collection.length ) {

                        this._done.call(this, this._resources_loaded);

                        this._complete = true;

                    }else if( a_progress && sequential_mode ){

                        if( this._collection_pending.length ){

                            this._collection_pending = this._collection_pending.filter(x => x.id !== id);
                            this._collection_pending = this._collection_pending.filter(x => x.id !== id);

                            if( this._collection_pending.length )
                                this._busy = this._collection_pending[0].instance.process();

                        }

                    }

                });

                if( !sequential_mode || ( sequential_mode && !this._busy ) )
                    this._busy = this_load_instance.process();

                else if( sequential_mode && this._busy ){

                    if( !this._settings.visible || ( this._settings.visible && is_visible(this_load_instance._element) ) )
                        this._collection_pending.push({ id : this_load_id, instance : this_load_instance });

                }


            }

        }

        done(callback){ // todo refactory

            if( !$.isFunction(callback) )
                return;

            const _func = function(resources){
                callback.call(this, resources);
            };

            if( this._collection.length ) {

                this._done = _func;

                this._loop();

            }else
                _func();

        };

        progress(callback){ // todo refactory

            if( !$.isFunction(callback) )
                return;

            const _func = function(resource){
                callback.call(this, resource);
            };

            if( this._collection.length ) {

                this._progress = _func;

                this._loop();

            }

        };

        success(callback){ // todo refactory

            if( !$.isFunction(callback) )
                return;

            const _func = function(resource){
                callback.call(this, resource);
            };

            if( this._collection.length ) {

                this._success = _func;

                this._loop();

            }

        };

        error(callback){ // todo refactory

            if( !$.isFunction(callback) )
                return;

            const _func = function(resource){
                callback.call(this, resource);
            };

            if( this._collection.length ) {

                this._error = _func;

                this._loop();

            }

        };

        abort(){

            for( const key in this._collection_instances )
                this._collection_instances[ key ].instance.abort();

            if( this._collection.length )
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

                src = this._settings.srcAttr,
                srcset = this._settings.srcsetAttr,

                targets = 'img, video, audio',
                targets_extended = targets + ', picture, source';

            let $targets = this._$element.find(targets);
            if (this._$element.is(targets))
                $targets = $targets.add(this._$element);
            $targets = $targets.filter(function(){
                let $t = $(this),
                    filter = '['+src+'], ['+srcset+']';
                return $t.is(filter) || $t.children(targets_extended).filter(filter).length;
            });
            $targets.each(function () {

                let collection_item = {
                    element : this,
                    resource : $(this).attr(src) || $(this).attr(srcset)
                };

                if( is_plain_data_collection )
                    collection_item = collection_item.element;

                collection.push(collection_item);

            });

            if (true === this._settings.backgrounds)
                this._$element.find('*').addBack().not(targets_extended).filter(function () {
                    return $(this).css('background-image') !== 'none';
                }).each(function () {

                    const url = $(this).css('background-image').match(/\((.*?)\)/);

                    if( null === url || url.length < 2 )
                        return true;

                    let collection_item = {
                        element : this,
                        resource : url[1].replace(/('|")/g,'')
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

                const this_arguments = [ this_load_instance, resource ];

                if( $.isFunction(settings.onProgress) )
                    settings.onProgress.apply(element, this_arguments);

                let event_name = capitalize(resource.status);
                if( $.isFunction(settings['on'+event_name]) )
                    settings['on'+event_name].apply(element, this_arguments);

            });

            this_load_instance.done(function(resources){

                $element.trigger(namespace_prefix + 'Complete.' + namespace_prefix, [ element, resources ]);
                callback.apply(element, [ this_load_instance, resources ]);

                if( settings.visible )
                    $( $.nite && 'scroll' in $.nite ? $document : $window ).off('scroll.' + unique_method_namespace);

                // refresh other method calls for same el (omitting this one)
                method_collection = method_collection.filter( x => x.id !== unique_method_namespace );
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