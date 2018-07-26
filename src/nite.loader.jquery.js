import { jQueryIncluded } from './nite.loader.client';

import { pluginPrefix, pluginMethod, pluginName } from './nite.loader.settings';

import { generateInstanceID, capitalize, throttle } from './nite.loader.tools';

import { Loader } from './nite.loader.multiple';

// TODO: think about a better and more elegant module-oriented way
if (jQueryIncluded) {
    const $ = jQuery;

    const $window = $(window);

    $[capitalize(pluginName)] = Loader;

    let methodCollection = [];

    $.fn[pluginMethod] = function(options) {
        let originalUserOptions = options;

        if (typeof options !== 'object') {
            options = {};
        }

        let settings = {
            ...{
                srcAttr: 'data-src',
                srcsetAttr: 'data-srcset',

                visible: false,
                sequential: false,

                backgrounds: false,
                playthrough: false,

                early: false,
                earlyTimeout: 0,

                onProgress: () => {},
                onLoad: () => {},
                onError: () => {},

                onComplete: () => {}
            },
            ...options
        };

        let callback = settings.onComplete;
        if ($.isFunction(originalUserOptions)) {
            callback = originalUserOptions;
        }

        return this.each(function(i) {
            // TODO: mutation observer when new children are appended

            const $element = $(this);
            const uniqueMethodPluginName = generateInstanceID() + i;
            const thisLoadInstance = new Loader(settings);

            thisLoadInstance.collection = this;

            methodCollection.push({
                id: uniqueMethodPluginName,
                instance: thisLoadInstance,
                element: this,
                timeout: null
            });

            thisLoadInstance.progress(resource => {
                $(resource.element).trigger(pluginPrefix + capitalize(resource.status) + '.' + pluginPrefix, [resource.element, resource.resource]);
                $element.trigger(pluginPrefix + 'Progress.' + pluginPrefix, [this, resource]);

                const thisArguments = [thisLoadInstance, resource];

                if (typeof settings.onProgress === 'function') {
                    settings.onProgress.apply(this, thisArguments);
                }

                let eventName = capitalize(resource.status);
                if (typeof settings['on' + eventName] === 'function') {
                    settings['on' + eventName].apply(this, thisArguments);
                }
            });

            thisLoadInstance.done(resources => {
                $element.trigger(pluginPrefix + 'Complete.' + pluginPrefix, [this, resources]);
                callback.apply(this, [thisLoadInstance, resources]);

                if (settings.visible) {
                    $window.off('scroll.' + uniqueMethodPluginName);
                }

                // refresh other method calls for same el (omitting this one)
                methodCollection = methodCollection.filter(x => x.id !== uniqueMethodPluginName);
                methodCollection.forEach(thisMethodCollection => {
                    if ($element.is(thisMethodCollection.element)) {
                        thisMethodCollection.instance.load();
                    }
                });
            });

            thisLoadInstance.load();

            if (settings.visible) {
                $window.on('scroll.' + uniqueMethodPluginName, throttle(() => thisLoadInstance.load(), 250));
            }

            if (true === settings.early) {
                let breakLoop = false;

                methodCollection.forEach(thisMethodCollection => {
                    if (breakLoop) {
                        return;
                    }

                    if (methodCollection[key].id === uniqueMethodPluginName) {
                        clearTimeout(thisMethodCollection.timeout);

                        let timeout = parseInt(settings.earlyTimeout);

                        thisMethodCollection.timeout = setTimeout(() => {
                            // TODO: $('.selector').niteLoad('option', 'value');
                            thisMethodCollection.instance._settings.visible = false;
                            thisMethodCollection.instance._settings.sequential = true;

                            thisMethodCollection.instance.load();
                        }, !isNaN(timeout) && isFinite(timeout) ? timeout : 0);

                        breakLoop = true;
                    }
                });
            }
        });
    };
}
