/*! JQuery Heavy ResourcesLoader | Daniele Fioroni | dfioroni91@gmail.com */
(function(window, document, $, undefined){
    'use strict';

    const
        namespace_prefix = 'nite',
        namespace_method = namespace_prefix+'Preload',
        namespace = namespace_method+'er',
        _console = function(message, level){

            if( !window.console )
                return;

            let display = window.console.log;

            switch(level){
                case 1:
                    if( window.console.warn )
                        display = window.console.warn;
                    break;
                case 2:
                    if( window.console.error )
                        display = window.console.error;
                    break;
            }

            display(message);

        };

    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    if( !$ ) {
        _console('jQuery is needed for '+namespace+' to work!', 2);
        return undefined;
    }
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~


    const

        $document = $(document),
        $window = $(window),

        unique_id = function(){

            return $.nite ? $.nite.uniqueId() : Math.floor(Math.random() * (9999 - 1000)) + 1000;

        },

        is_visible = function(element){

            const $el = $(element);

            let in_viewport = false;

            if( $.nite )
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

            return is_html_object(element) && (
                (
                    element.complete &&
                    Math.floor(element.naturalWidth) >= 1 &&
                    Math.floor(element.naturalHeight) >= 1
                )
                ||
                (
                    element.readyState >= 2 &&
                    element.videoWidth !== 0 &&
                    element.videoHeight !== 0
                )
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

            this._settings  = $.extend(true, {
                playthrough  : false,
                srcsetAttr   : 'data-srcset',
                srcAttr      : 'data-src',
                visible      : false
            }, options);

            this._id        = null;
            this._id_event  = null;

            this._element   = null;
            this._$element  = $();

            this._resource  = null;
            this._process   = false;

            this._format    = null;

            this._callback  = $.noop;
            this._done      = function(e){

                if( !self._process ) {

                    const trigger_event = e.type.charAt(0).toUpperCase() + e.type.slice(1);

                    self._$element.trigger(namespace_prefix + trigger_event + '.' + namespace_prefix, [self._$element]);
                }

                self._callback.call(null /* todo context */, self._id, self._element.currentSrc || self._element.src);

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
            this._process  = this._id_event !== undefined;
            this._id_event = this._process ? this._id_event : namespace + '_unique_' + unique_id();

        }

        process(){

            if( this._settings.visible && !is_visible(this._element) )
                return;

            const
                self = this,
                src = this._settings.srcAttr,
                src_clean = this._settings.srcAttr.replace('data-', '');

            if ( is_loaded(this._element) ) {

                if (!this._process)
                    this._$element.off('.' + this._id_event);

                this._done(new Event($.isNumeric(this._element.naturalWidth) ? namespace_prefix+'Load' : namespace_prefix+'Error'));

            }else{

                if( this._format === 'image' ) {

                    this._$element[this._process ? 'on' : 'one']('load.' + this._id_event + ' error.' + this._id_event, this._done);

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
                }

                if( this._format === 'video' || this._format === 'audio' ){

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
                        [this._process ? 'on' : 'one']('error.' + this._id_event, function(e){

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
                                [this._process ? 'on' : 'one']('error.' + this._id_event, self._done);

                            call_media_load = true;

                        }

                    }

                    if( call_media_load )
                        this._element.load();

                    this._$element
                        [this._process ? 'on' : 'one']('loadedmetadata.' + this._id_event, function () {

                            if (true !== self._settings.playthrough && 'full' !== self._settings.playthrough)
                                self._done(new Event('load'));

                        })
                        [this._process ? 'on' : 'one']('canplay.' + self._id_event, function () {

                            if ( 'full' === self._settings.playthrough && this.currentTime === 0 && !is_fully_buffered(this) )
                                this.currentTime++;

                        })
                        [this._process ? 'on' : 'one']('progress.' + self._id_event, function () {

                            if ( 'full' === self._settings.playthrough) {

                                const media = this;

                                setTimeout(function () {

                                    if (media.readyState > 0 && !media.duration) {

                                        self._done(new Event('error'));

                                    }else if ( is_fully_buffered(media) ) {

                                        media.currentTime = 0;

                                        if (!self._process && media.paused && $(media).is('[autoplay]'))
                                            media.play();

                                        self._done(new Event('load'));

                                    }else{

                                        if (!media.paused)
                                            media.pause();

                                        if (!self._process)
                                            media.currentTime += 2;

                                    }

                                }, 25);

                            }

                        })
                        [this._process ? 'on' : 'one']('canplaythrough.' + this._id_event, function(){

                            if( true === self._settings.playthrough )
                                self._done(new Event('load'));

                        });

                }

                if ( !this._process )
                    this._$element.data(namespace, this._id_event);

            }

            this._resource = this._element.currentSrc || this._element.src;

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

            const context = this;

            this._callback = function(resource){
                callback.call(context, resource);
            };

        };

    }
    
    class ResourcesLoader {

        constructor(collection, options) {

            this._collection = [];
            this._collection_loaded = [];
            this._collection_instances = [ new ResourceLoader(this._settings) ];

            if ($.isArray(collection) && ( typeof collection[0] === 'string' || is_html_object(collection[0]) ))
                for ( const resource in collection )
                    if( collection.hasOwnProperty(resource) )
                        this._collection.push({ id : unique_id(), resource : collection[resource] });
            if ( typeof collection === 'string' || is_html_object(collection) )
                this._collection.push({ id : unique_id(), resource : collection });

            this._settings = $.extend(true, {
                sequential: false
            }, options);

            this.percentage = 0;

            this._callback = $.noop();
            this._progress = $.noop();
            this._abort = false;

            this._complete = false;

            this._loaded = 0;

            this.loop();

        }

        loop(){

            const self = this;

            if ( !this._collection.length )
                return;

            if( true === this._complete ){

                self._callback.call(null /* todo context */);

                return;

            }

            for (let i = 0; i < this._collection.length; i++) {

                if (this._abort)
                    break;

                // todo this._settings.sequential --> must be called in the following .done() call and taking account of visibility check in ResourceLoader();

                let load_instance = new ResourceLoader(this._settings);

                this._collection_instances.push(load_instance);

                load_instance.resource = this._collection[i];

                load_instance.process();

                load_instance.done(function(id, resource){

                    if( $.inArray(id, self._collection_loaded) === -1 ) {

                        self._loaded++;

                        self._collection_loaded.push(id);

                        self.percentage = self._loaded / self._collection.length * 100;

                        self._progress.call(null /* todo */, resource);

                    }

                    if ( self._loaded > self._collection.length || self._abort )
                        return;

                    if( self._loaded === self._collection.length ) {

                        self._callback.call(null /* todo */);

                        self._complete = true;

                    }

                });

            }

        }

        done(callback){

            if( !$.isFunction(callback) )
                return false;

            const
                context = this,
                _func = function(){
                    callback.call(context);
                };

            if( this._collection.length )
                this._callback = _func;
            else
                _func();

            return true;

        };

        progress(callback){

            if( !$.isFunction(callback) )
                return false;

            const
                context = this,
                _func = function(resource){
                    callback.call(context, resource);
                };

            if( this._collection.length )
                this._progress = _func;
            else
                _func();

            return true;

        };

        abort(){

            for( const instance in this._collection_instances )
                this._collection_instances[ instance ].abort();

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

        collect( /*output*/ ) { // todo output types es: only elements, only, urls, mixed, all ... dunno

            let collection = [];

            const
                targets = 'img, video, audio',
                targets_extended = targets + ', picture, source';

            let $targets = this._$element.find(targets);
            if (this._$element.is(targets))
                $targets.add(this._$element);
            $targets.each(function () {
                collection.push(this);
            });

            if (true === this._settings.backgrounds)
                this._$element.find('*').addBack().not(targets_extended).filter(function () {
                    return $(this).css('background-image') !== 'none';
                }).each(function () {
                    collection.push($(this).css('background-image').replace(/url\("|url\('|url\(|(("')\)$)/igm, ''));
                });

            if (this._settings.attributes.length)
                for (const attr in this._settings.attributes) {
                    if( this._settings.attributes.hasOwnProperty(attr) ) {

                        this._$element.find('[' + attr + ']:not(' + targets_extended + ')').each(function () {
                            collection.push($(this).attr(attr));
                        });

                        if (this._$element.is('[' + attr + ']') && !this._$element.is(targets_extended))
                            collection.push(this._$element.attr(attr));

                    }
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

            visible       : false,

            sequential    : false,

            backgrounds   : false,
            extraAttrs    : [],

            playthrough   : false

        }, options);

        if( !$.isArray(settings.attributes) )
            settings.attributes = [];
        if( typeof settings.attributes === 'string' )
            settings.attributes = settings.attributes.split(' ');

        return this.each(function(){

            let _complete = false;

            const
                element = this,
                $element = $(element),
                collection = new CollectionPopulator($element, settings).collect(),
                event_namespace = namespace + '_' + unique_id(),
                complete = function(){

                    if( $.nite )
                        $document.off('scroll.' + event_namespace);
                    else
                        $window.off('scroll.'+event_namespace);

                    $element.removeData(namespace);

                    _complete = true;

                };

            let load_instance = $element.data(namespace);

            if( undefined !== load_instance ) {

                load_instance.abort();

                complete();

            }

            load_instance = new ResourcesLoader(collection, settings);

            load_instance.progress(function () {

                $element.trigger(namespace_prefix+'Progress.'+namespace_prefix, [$element]);

            });

            load_instance.done(function () {

                if( _complete )
                    return;

                complete();

                $element.trigger(namespace_prefix+'Load.'+namespace_prefix, [$element]);

                callback.call(element);
                callback = $.noop;

            });

            $element.data(namespace, load_instance);

            if( settings.visible ){

                if( $.nite )
                    $.nite.scroll(event_namespace, function(){ load_instance.loop(); }, { fps : 25 });

                else{

                    const throttle_scroll_event = function(fn, wait) {

                        let time = Date.now();

                        return function() {
                            if ((time + wait - Date.now()) < 0) {
                                fn();
                                time = Date.now();
                            }
                        }

                    };

                    $window.on('scroll.'+event_namespace, throttle_scroll_event(function(){ load_instance.loop(); }, 1000));

                }

            }

        });

    };

})(window, document, jQuery);