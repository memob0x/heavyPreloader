'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*! Nite Loader | Daniele Fioroni | dfioroni91@gmail.com */
(function () {
	'use strict';

	/**
  * @returns {string}
  */

	var generateInstanceID = function generateInstanceID() {
		return Math.floor(Math.random() * (9999 - 1000)) + 1000;
	};

	var pluginPrefix = 'nite';
	var pluginMethod = pluginPrefix + 'Load';
	var pluginName = pluginMethod + 'er';
	var pluginInstance = generateInstanceID();
	var eventNamespaceParserSeparator = '__namespace__';

	var CustomEvent = window.CustomEvent || function () {
		var _polyfill = function _polyfill(event, params) {
			params = params || { bubbles: false, cancelable: false, detail: undefined };
			var evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		};
		_polyfill.prototype = window.Event.prototype;
		return _polyfill;
	}();

	var supportedExtensions = {
		image: 'jp[e]?g|jpe|jif|jfif|jfi|gif|png|tif[f]?|bmp|dib|webp|ico|cur|svg',
		audio: 'mp3|ogg|oga|spx|ogg|wav',
		video: 'mp4|ogv|webm'
	};
	var supportedTags = {
		image: 'img|picture|source',
		audio: 'audio|source',
		video: 'video|source'
	};

	var IntersectionObserverSupported = 'IntersectionObserver' in window;
	var pictureElementSupported = 'HTMLPictureElement' in window;

	/**
  * @param {string} heystack
  * @param {string} needle
  * @returns {boolean}
  */
	var stringContains = function stringContains(heystack, needle) {
		return String.prototype.includes ? heystack.includes(needle) : heystack.indexOf(needle, 0) !== -1;
	};

	/**
  * @param {string} heystack
  * @param {string} needle
  * @returns {boolean}
  */
	var stringStartsWith = function stringStartsWith(heystack, needle) {
		return String.prototype.startsWith ? heystack.startsWith(needle) : heystack.substr(0, needle.length) === needle;
	};

	/**
  * @param {Array} heystack
  * @param {Function} filter
  * @returns {number}
  */
	var arrayFindIndex = function arrayFindIndex(heystack, filter) {
		return Array.prototype.findIndex ? heystack.findIndex(filter) : function () {
			var length = heystack.length,
			    index = -1;
			while (++index < length) {
				if (filter(heystack[index], index, heystack)) {
					return index;
				}
			}
			return -1;
		}();
	};

	/**
  * @param {HTMLElement} element
  * @param {string} events
  * @returns {undefined}
  */
	var detachEventListener = function detachEventListener(element, events) {
		if (!element || typeof events !== 'string') {
			return;
		}

		if (stringStartsWith(events, '.')) {
			for (var _key in privateEventsStorage) {
				var eventNameWithNamespace = _key.replace(eventNamespaceParserSeparator, '.');
				if (stringContains(eventNameWithNamespace, events) && privateEventsStorage[_key].element === element) {
					detachEventListener(element, eventNameWithNamespace);
				}
			}
		} else {
			events = events.split('.');

			var type = events[0],
			    namespace = events[1];

			if (namespace) {
				events = events.join(eventNamespaceParserSeparator);
			}

			if (events in privateEventsStorage) {
				element.removeEventListener(type, privateEventsStorage[events].handler);
				delete privateEventsStorage[events];
			}
		}
	};

	/**
  * @param {HTMLElement} element
  * @param {string} events
  * @param {Function} handler
  * @param {boolean} once
  * @returns {undefined}
  */
	var attachEventListener = function attachEventListener(element, events, handler, once) {
		if (!element || typeof events !== 'string' || typeof handler !== 'function') {
			return;
		}

		events = events.split('.');

		var type = events[0];
		var namespace = events[1];

		if (namespace) {
			events = events.join(eventNamespaceParserSeparator);
		}

		privateEventsStorage[events] = { element: element, count: 0, once: false };

		if (true === once) {
			var _handler = handler;
			handler = function handler(event) {
				if (events in privateEventsStorage) {
					privateEventsStorage[events].count++;
					if (privateEventsStorage[events].once && privateEventsStorage[events].count > 1) {
						return;
					}
					_handler.call(this, event);
				}
				detachEventListener(element, events);
			};
		} else {
			once = false;
		}

		privateEventsStorage[events] = _extends({}, privateEventsStorage[events], { handler: handler, once: once });

		element.addEventListener(type, privateEventsStorage[events].handler, { once: once });
	};

	/**
  * @param {string} string
  * @returns {string}
  */
	var hyphensToCamelCase = function hyphensToCamelCase(string) {
		return string.replace(/-([a-z])/g, function (g) {
			return g[1].toUpperCase();
		});
	};

	/**
  * @param {string} string
  * @returns {string}
  */
	var capitalize = function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	/**
  * @param {NodeList} nodelist
  * @returns {Array}
  */
	var nodelistToArray = function nodelistToArray(nodelist) {
		return [].concat(_toConsumableArray(nodelist));
	};

	/**
  * @param {String|number} needle
  * @param {Array} heystack
  * @returns {boolean}
  */
	var isInArray = function isInArray(needle, heystack) {
		return heystack.indexOf(needle) > -1;
	};

	/**
  * @param {HTMLElement} element
  * @returns {boolean}
  */
	var isVisible = function isVisible(element) {
		if (IntersectionObserverSupported && 'intersectionRatio' in element) {
			return element.intersectionRatio > 0;
		}

		if (window.getComputedStyle(element, 'display') === 'none') {
			return false;
		}

		var bodyEl = document.getElementsByTagName('body')[0];
		var winWidth = window.innerWidth || documnt.documentElement.clientWidth || bodyEl.clientWidth;
		var winHeight = window.innerHeight || documnt.documentElement.clientHeight || bodyEl.clientHeight;
		var rect = element.getBoundingClientRect();

		return !(rect.right < 0 || rect.bottom < 0 || rect.left > winWidth || rect.top > winHeight);
	};

	/**
  * @param {HTMLElement} element
  * @returns {boolean}
  */
	var isHTMLElement = function isHTMLElement(element) {
		if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) !== 'object') {
			return false;
		}
		try {
			return element instanceof HTMLElement;
		} catch (e) {
			return element.nodeType === 1 && _typeof(element.style) === 'object' && _typeof(element.ownerDocument) === 'object';
		}
	};

	/**
  * @param {(string|HTMLVideoElement|HTMLAudioElement|HTMLImageElement)} source
  * @returns {boolean}
  */
	var isLoaded = function isLoaded(source) {
		return typeof source === 'string' && isInArray(source, privateCache) || isHTMLElement(source) && 'currentSrc' in source && source.currentSrc.length > 0 && ('complete' in source && source.complete || 'readyState' in source && source.readyState >= 2);
	};

	/**
  * @param {(HTMLVideoElement|HTMLAudioElement)} source
  * @returns {boolean}
  */
	var isFullyBuffered = function isFullyBuffered(media) {
		return media.buffered.length && Math.round(media.buffered.end(0)) / Math.round(media.seekable.end(0)) === 1;
	};

	/**
  * @param {(string|HTMLElement)} source
  * @returns {boolean}
  */
	var isBroken = function isBroken(source) {
		return isLoaded(source) && (isHTMLElement(source) && ('naturalWidth' in source && Math.floor(source.naturalWidth) === 0 || 'videoWidth' in source && source.videoWidth === 0) || typeof source === 'string');
	};

	/**
  * @param {Object} resource
  * @returns {Object}
  */
	var decodeResource = function decodeResource(resource) {
		var output = { format: null, extension: null, tag: null, consistent: false };

		resource.resource = resource.resource.split('?')[0];
		resource.resource = resource.resource.split('#')[0];
		for (var formatCandidate in supportedExtensions) {
			var base64Heading = ';base64,';

			if (new RegExp('(.(' + supportedExtensions[formatCandidate] + ')$)|' + base64Heading, 'g').test(resource.resource)) {
				if (new RegExp(base64Heading, 'g').test(resource.resource)) {
					var matches64 = resource.resource.match(new RegExp('^data:' + formatCandidate + '/(' + supportedExtensions[formatCandidate] + ')', 'g'));

					if (null === matches64) {
						return;
					}

					matches64 = matches64[0];

					output.format = formatCandidate;
					output.extension = matches64.replace('data:' + formatCandidate + '/', '');
					output.tag = supportedTags[formatCandidate];

					break;
				} else {
					var matches = resource.resource.match(new RegExp(supportedExtensions[formatCandidate], 'g'));

					if (matches) {
						output.format = formatCandidate;
						output.extension = matches[0];
						output.tag = supportedTags[formatCandidate];

						break;
					}
				}
			}
		}

		if (isHTMLElement(resource.element)) {
			var tagName = resource.element.tagName.toLowerCase();
			var allTags = '';

			Object.values(supportedTags).forEach(function (tags) {
				allTags += '|' + tags;
			});

			allTags = allTags.split('|');

			if (isInArray(tagName, allTags)) {
				output.tag = tagName;
				output.consistent = true;
				if (output.format === null) {
					for (var format in supportedTags) {
						if (stringContains(supportedTags[format], output.tag)) {
							output.format = format;
							break;
						}
					}
				}
			}
		}

		if (stringContains(output.tag, '|')) {
			output.tag = output.tag.split('|')[0];
		}

		return output;
	};

	var privateEventsStorage = {};

	var privateCache = [];

	// TODO: Promise support
	// TODO: think about useful vars in callback args (this class is not public but its vars are returned in .progress() callback)
	/** TODO: description of the MyClass constructor function.
  * @class
  * @classdesc TODO: description of the SingleLoader class.
  */

	var SingleLoader = function () {
		/**
   * @param {Object} [options={ srcAttr: 'data-src', srcsetAttr: 'data-srcset', playthrough: false, visible: false }]
   */
		function SingleLoader(options) {
			var _this = this;

			_classCallCheck(this, SingleLoader);

			this._settings = _extends({
				srcAttr: 'data-src',
				srcsetAttr: 'data-srcset',
				playthrough: false,
				visible: false
			}, options);

			if (!stringStartsWith(this._settings.srcAttr, 'data-') || !stringStartsWith(this._settings.srcsetAttr, 'data-')) {
				throw new Error('Wrong arguments format: srcAttr and srcsetAttr parameters must be dataset values.');
			}

			this.srcAttr = hyphensToCamelCase(this._settings.srcAttr.replace('data-', ''));
			this.srcsetAttr = hyphensToCamelCase(this._settings.srcsetAttr.replace('data-', ''));

			this._id = null;
			this._idEvent = null;
			this._busy = false;

			this._element = null;
			this._resource = null;
			this._format = null;
			this._observer = null;

			this._done = function () {};
			this._success = function () {};
			this._error = function () {};

			this._callback = function (e) {
				_this._busy = false;
				if (null !== _this._observer) {
					_this._observer.unobserve(_this._element);
				}

				var src = _this._element.currentSrc || _this._element.src;

				if (!isInArray(src, privateCache)) {
					privateCache.push(src);
				}

				var thisArguments = [_this._element, e.type, src, _this._id];

				_this[e.type !== 'error' ? '_success' : '_error'].apply(_this, thisArguments);
				_this._done.apply(_this, thisArguments);
			};
		}

		/**
   * @param {Object} data
   */


		_createClass(SingleLoader, [{
			key: 'load',


			/**
    * @returns {boolean} se ha preso in carico il caricamento oppure no per vari motivi (è già caricato, non è nella viewport etc)
    */
			value: function load() {
				var _this2 = this;

				if (isLoaded(this._exists && this._consistent ? this._element : this._resource)) {
					if (!this._busy) {
						// TODO: mayabe this should be called in this._callback
						detachEventListener(this._element, '.' + this._idEvent);
					}

					this._callback(new CustomEvent(!isBroken(this._exists && this._consistent ? this._element : this._resource) ? 'load' : 'error'));

					return false;
				} else if (this._exists && this._settings.visible && !isVisible(this._originalElement)) {
					return false;
				} else {
					if (this._format === 'image') {
						attachEventListener(this._element, 'load.' + this._idEvent, this._callback, !this._busy);
						attachEventListener(this._element, 'error.' + this._idEvent, this._callback, !this._busy);

						var picture = this._element.closest('picture');

						if (picture && pictureElementSupported) {
							delete this._element.dataset[this.srcsetAttr];
							delete this._element.dataset[this.srcAttr];

							picture.querySelectorAll('source[' + this._settings.srcsetAttr + ']').forEach(function (el) {
								el.setAttribute('srcset', el.dataset[_this2.srcAttr]);
								delete el.dataset[_this2.srcAttr];
							});
						} else {
							if (this._element.matches('[' + this._settings.srcsetAttr + ']')) {
								this._element.setAttribute('srcset', this._element.dataset[this.srcsetAttr]);
								delete this._element.dataset[this.srcsetAttr];
							}

							if (this._element.matches('[' + this._settings.srcAttr + ']')) {
								this._element.setAttribute('src', this._element.dataset[this.srcAttr]);
								delete this._element.dataset[this.srcAttr];
							}
						}
					} else if (this._format === 'video' || this._format === 'audio') {
						var isStandardPlaythrough = true === this._settings.playthrough;
						var isFullPlaythrough = 'full' === this._settings.playthrough;
						var sources = this._element.querySelectorAll('source');

						var callMediaLoad = false;

						if (sources) {
							sources.forEach(function (source) {
								if (source.matches('[' + _this2._settings.srcAttr + ']')) {
									source.setAttribute('src', source.dataset[_this2.srcAttr]);
									delete source.dataset[_this2.srcsetAttr];

									callMediaLoad = true;
								}

								attachEventListener(source, 'error.' + _this2._idEvent, function (e) {
									var sourcesErrorId = pluginName + '_error';

									source[pluginInstance + '_' + sourcesErrorId] = true;

									if (sources.length === nodelistToArray(sources).filter(function (thisSource) {
										return true === thisSource[pluginInstance + '_' + sourcesErrorId];
									}).length) {
										_this2._callback(e);
									}
								}, !_this2._busy);
							});
						} else if (this._element.matches('[' + this._settings.srcAttr + ']')) {
							this._element.setAttribute('src', this._element.dataset[this.srcAttr]);
							delete this._element.dataset[this.srcAttr];

							attachEventListener(this._element, 'error.' + this._idEvent, this._callback, !this._busy);

							callMediaLoad = true;
						}

						if (callMediaLoad) {
							this._element.load();
						}

						attachEventListener(this._element, 'loadedmetadata.' + this._idEvent, function () {
							if (!isStandardPlaythrough && !isFullPlaythrough) {
								_this2._callback(new CustomEvent('load'));
							}

							if (isFullPlaythrough) {
								var onProgressReplacementInterval = setInterval(function () {
									var isError = _this2._element.readyState > 0 && !_this2._element.duration;

									if (isError || isFullyBuffered(_this2._element)) {
										_this2._element.currentTime = 0;

										if (!isError && !_this2._busy && _this2._element.paused && _this2._element.matches('[autoplay]')) {
											_this2._element.play();
										}

										clearInterval(onProgressReplacementInterval);

										_this2._callback(new CustomEvent(!isError ? 'load' : 'error'));
									} else {
										if (!_this2._element.paused) {
											_this2._element.pause();
										}

										if (!_this2._busy) {
											_this2._element.currentTime += 2;
										}
									}
								}, 500);

								_this2._element[pluginName + '_' + _this2._idEvent] = onProgressReplacementInterval;
							}
						}, !this._busy);

						attachEventListener(this._element, 'canplay.' + this._idEvent, function () {
							if (isFullPlaythrough && _this2._element.currentTime === 0 && !isFullyBuffered(_this2._element)) {
								_this2._element.currentTime++;
							}
						}, !this._busy);

						attachEventListener(this._element, 'canplaythrough.' + this._idEvent, function () {
							if (isStandardPlaythrough) {
								_this2._callback(new CustomEvent('load'));
							}
						}, !this._busy);
					} else {
						return false;
					}

					if (!this._busy) {
						this._element[pluginInstance + '_IDEvent'] = this._idEvent;
					}
				}

				this._resource = this._element.currentSrc || this._element.src;

				return !this._busy;
			}

			/**
    * @param {Function} callback
    * @returns {undefined}
    */

		}, {
			key: 'done',
			value: function done(callback) {
				if (typeof callback !== 'function') {
					return;
				}

				this._done = function (element, status, resource, id) {
					callback.apply(this, [element, status, resource, id]);
				};
			}

			/**
    * @returns {undefined}
    */

		}, {
			key: 'abort',
			value: function abort() {
				detachEventListener(this._element, '.' + this._idEvent);

				if (isLoaded(this._exists ? this._element : this._resource)) {
					return;
				}

				var src = this._element.getAttribute('srcset'),
				    srcset = this._element.getAttribute('src');

				if (undefined !== src) {
					this._element.dataset[this.srcAttr] = src;
					this._element.setAttribute(this._settings.srcAttr, src);
					this._element.removeAttribute('src');
					this._element.removeAttribute('srcset');
				}

				if (undefined !== srcset) {
					this._element.dataset[this.srcsetAttr] = srcset;
					this._element.setAttribute(this._settings.srcsetAttr, srcset);
					this._element.removeAttribute('src');
					this._element.removeAttribute('srcset');
				}
			}
		}, {
			key: 'resource',
			set: function set(data) {
				if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && 'id' in data && 'element' in data && 'resource' in data) {
					this._id = data.id;
					this._element = data.element;
					this._resource = data.resource;

					var info = decodeResource({
						resource: this._resource,
						element: this._element
					});
					this._tag = info.tag;
					this._consistent = info.consistent;
					this._format = info.format;
					this._exists = this._element !== null;
					this._originalElement = this._element;

					if (!this._exists || !this._consistent) {
						this._element = document.createElement(this._tag);
						this._element.dataset[this.srcAttr] = this._resource;
					}

					if (this._exists && this._settings.visible && IntersectionObserverSupported) {
						this._observer = new IntersectionObserver(function (entries, observer) {
							entries.forEach(function (entry) {
								return entry.target.intersectionRatio = entry.intersectionRatio;
							});
						}, {
							root: null,
							rootMargin: '0px',
							threshold: 0.1
						});
						this._observer.observe(this._originalElement);
					}

					this._idEvent = this._element[pluginInstance + '_IDEvent'];
					this._busy = this._idEvent !== undefined;
					this._idEvent = this._busy ? this._idEvent : pluginName + '_unique_' + this._element.tagName + '_' + generateInstanceID();
				}
			}

			/**
    * @returns {string}
    */
			,
			get: function get() {
				return this._resource;
			}
		}]);

		return SingleLoader;
	}();

	// TODO: Promise support
	// TODO: private vars
	// TODO: refactory succes/done/progress code...
	/** TODO: description of the MyClass constructor function.
  * @class
  * @classdesc TODO: description of the Loader class.
  */


	var Loader = function () {
		/**
   * @param {Object} [options={srcAttr: 'data-src', srcsetAttr: 'data-srcset', playthrough: false, visible: false, backgrounds: false }]
   */
		function Loader(options) {
			_classCallCheck(this, Loader);

			this._collection = [];
			this._collectionLoaded = [];
			this._collectionInstances = [];
			this._collectionPending = [];
			this._resourcesLoaded = [];

			this._settings = _extends({
				srcAttr: 'data-src',
				srcsetAttr: 'data-srcset',
				playthrough: false,
				visible: false,
				backgrounds: false
			}, options);

			if (!stringStartsWith(this._settings.srcAttr, 'data-') || !stringStartsWith(this._settings.srcsetAttr, 'data-')) {
				throw new Error('Wrong arguments format: srcAttr and srcsetAttr parameters must be dataset values.');
			}

			this.srcAttr = hyphensToCamelCase(this._settings.srcAttr.replace('data-', ''));
			this.srcsetAttr = hyphensToCamelCase(this._settings.srcsetAttr.replace('data-', ''));

			this.percentage = 0;

			this._done = function () {};
			this._progress = function () {};
			this._success = function () {};
			this._error = function () {};
			this._loop = this.load;

			this._abort = false;
			this._loaded = 0;
			this._complete = false;
			this._busy = false;
		}

		/**
   *
   * @param {HTMLElement} [element=document.body]
   * @param {Object} [options={ srcAttr: 'src', srcsetAttr: 'srcset', backgrounds: false }]
   */


		_createClass(Loader, [{
			key: 'load',


			/**
    * @returns {undefined}
    */
			value: function load() {
				var _this3 = this;

				if (!this._collection.length) {
					this._done.call(this, this._resourcesLoaded);
				}

				// resets pending elements (sequential opt helper array) every time we loop
				this._collectionPending = [];

				var sequentialMode = true === this._settings.sequential;

				var _loop = function _loop(i) {
					if (_this3._abort) {
						return 'break';
					}

					var thisLoadId = _this3._collection[i].id;
					var thisLoadIndex = arrayFindIndex(_this3._collectionInstances, function (x) {
						return x.id === thisLoadId;
					});
					var thisLoadInstance = new SingleLoader(_this3._settings);

					if (thisLoadIndex === -1) {
						_this3._collectionInstances.push({
							id: thisLoadId,
							instance: thisLoadInstance
						});
						thisLoadIndex = arrayFindIndex(_this3._collectionInstances, function (x) {
							return x.id === thisLoadId;
						});
					} else {
						_this3._collectionInstances[thisLoadIndex].instance = thisLoadInstance;
					}

					thisLoadInstance.resource = _this3._collection[i];

					thisLoadInstance.done(function (element, status, resource, id) {
						if (_this3._complete || _this3._abort) {
							return;
						}

						var aProgress = !isInArray(id, _this3._collectionLoaded);

						if (aProgress) {
							_this3._collectionLoaded.push(id);
							_this3._busy = false;

							_this3._loaded++;
							_this3.percentage = _this3._loaded / _this3._collection.length * 100;
							_this3.percentage = parseFloat(_this3.percentage.toFixed(4));

							var thisResource = {
								resource: resource,
								status: status,
								element: element
							};
							_this3._resourcesLoaded.push(thisResource);
							_this3._progress.call(_this3, thisResource);
							_this3[status !== 'error' ? '_success' : '_error'].call(_this3, thisResource);
							// TODO: dispatch event on element maybe?
							// element.dispatchEvent(new CustomEvent(pluginPrefix + capitalize(status) + '.' + pluginPrefix));
						}

						if (_this3._loaded === _this3._collection.length) {
							_this3._done.call(_this3, _this3._resourcesLoaded);

							_this3._complete = true;
						} else if (aProgress && sequentialMode && _this3._collectionPending.length) {
							_this3._collectionPending = _this3._collectionPending.filter(function (x) {
								return x.id !== id;
							});

							if (_this3._collectionPending.length) {
								_this3._busy = _this3._collectionPending[0].instance.load();
							}
						}
					});

					if (!sequentialMode || sequentialMode && !_this3._busy) {
						_this3._busy = thisLoadInstance.load();
					} else if (sequentialMode && _this3._busy && (!_this3._settings.visible || !thisLoadInstance._exists || _this3._settings.visible && thisLoadInstance._exists && isVisible(thisLoadInstance._originalElement))) {
						_this3._collectionPending.push({
							id: thisLoadId,
							instance: thisLoadInstance
						});
					}
				};

				for (var i = 0; i < this._collection.length; i++) {
					var _ret = _loop(i);

					if (_ret === 'break') break;
				}
			}

			/**
    * @param {Function} callback
    * @returns {undefined}
    */

		}, {
			key: 'done',
			value: function done(callback) {
				if (typeof callback !== 'function') {
					return;
				}

				this._done = function (resources) {
					callback.call(this, resources);
				};
			}

			/**
    * @param {Function} callback
    * @returns {undefined}
    */

		}, {
			key: 'progress',
			value: function progress(callback) {
				if (typeof callback !== 'function') {
					return;
				}

				this._progress = function (resource) {
					callback.call(this, resource);
				};
			}

			/**
    * @param {Function} callback
    * @returns {undefined}
    */

		}, {
			key: 'success',
			value: function success(callback) {
				if (typeof callback !== 'function') {
					return;
				}

				this._success = function (resource) {
					callback.call(this, resource);
				};
			}

			/**
    * @param {Function} callback
    * @returns {undefined}
    */

		}, {
			key: 'error',
			value: function error(callback) {
				if (typeof callback !== 'function') {
					return;
				}

				this._error = function (resource) {
					callback.call(this, resource);
				};
			}

			/**
    * @returns {undefined}
    */

		}, {
			key: 'abort',
			value: function abort() {
				this._collectionInstances.forEach(function (thisInstance) {
					thisInstance.instance.abort();
				});

				this._abort = true;
			}
		}, {
			key: 'collection',


			/**
    * @param {(Array.<String>|HTMLElement)} collection
    */
			set: function set(collection) {
				var _this4 = this;

				var collectedResources = collection;

				try {
					collectedResources = Loader.findResources(collection, this._settings);
				} catch (err) {}

				collectedResources.forEach(function (item) {
					var element = {
						resource: '',
						element: null,
						id: generateInstanceID()
					};

					if (typeof item === 'string') {
						element.resource = item;
					} else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && 'resource' in item) {
						element = _extends({}, element, item);
					} else {
						return;
					}

					_this4._collection.push(element);
				});
			}

			/**
    * @returns {Array} collection
    */
			,
			get: function get() {
				return this._collection;
			}
		}], [{
			key: 'findResources',
			value: function findResources(element, options) {
				var settings = {
					srcAttr: 'src',
					srcsetAttr: 'srcset',
					backgrounds: false
				};

				if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && undefined === options) {
					for (var _key2 in settings) {
						if (_key2 in element) {
							options = element;
							element = undefined;
							break;
						}
					}
				}

				if (undefined === element || element === document) {
					element = document.body;
				}

				if (!isHTMLElement(element)) {
					throw new Error('TypeError: ' + element + ' is not of type HTMLElement.');
				}

				var collectedResources = [];

				settings = _extends({}, settings, options);

				var targets = 'img, video, audio';
				var targetsExtended = targets + ', picture, source';
				var targetsFilter = '[' + settings.srcAttr + '], [' + settings.srcsetAttr + ']';

				var targetsTags = nodelistToArray(element.querySelectorAll(targets));

				if (element.matches(targetsExtended)) {
					targetsTags.push(element);
				}

				targetsTags = targetsTags.filter(function (target) {
					var children = nodelistToArray(target.children);
					children = children.filter(function (x) {
						return x.matches(targetsExtended);
					});
					children = children.filter(function (x) {
						return x.matches(targetsFilter);
					});
					return target.matches(targetsFilter) || children.length;
				});
				targetsTags.forEach(function (target) {
					var targetSource = target;

					if (!targetSource.matches(targetsFilter)) {
						targetSource = targetSource.querySelectorAll(targetsFilter);
						targetSource = [].concat(_toConsumableArray(targetSource))[0];
					}

					collectedResources.push({
						element: target,
						resource: targetSource.getAttribute(settings.srcAttr) || targetSource.getAttribute(settings.srcsetAttr)
					});
				});

				if (true === settings.backgrounds) {
					var targetsBg = nodelistToArray(element.querySelectorAll('*'));
					targetsBg.push(element);
					targetsBg = targetsBg.filter(function (target) {
						return !target.matches(targetsExtended);
					});
					targetsBg = targetsBg.filter(function (target) {
						return getComputedStyle(target).backgroundImage !== 'none';
					});
					targetsBg.forEach(function (target) {
						var url = getComputedStyle(target).backgroundImage.match(/\((.*?)\)/);

						if (null !== url && url.length >= 2) {
							collectedResources.push({
								element: target,
								resource: url[1].replace(/('|")/g, '')
							});
						}
					});
				}

				return collectedResources;
			}
		}]);

		return Loader;
	}();

	// public interface
	// - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// requirejs


	if (typeof define === 'function' && define.amd) {
		define(capitalize(pluginName), Loader);
		// nodejs
	} else if ('object' === (typeof exports === 'undefined' ? 'undefined' : _typeof(exports))) {
		module.exports[capitalize(pluginName)] = Loader;
		// vanilla
	} else {
		window[capitalize(pluginName)] = Loader;
	}
	// - - - - - - - - - - - - - - - - - - - - - - - - - - -

	// jQuery interface
	// - - - - - - - - - - - - - - - - - - - -
	if (!('jQuery' in window)) {
		return;
	}

	var $ = jQuery;

	$[capitalize(pluginName)] = Loader;

	var $document = $(document);
	var $window = $(window);
	// thanks https://gist.github.com/beaucharman/e46b8e4d03ef30480d7f4db5a78498ca
	var throttle = function throttle(callback, wait) {
		var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

		var timeout = null;
		var callbackArgs = null;
		var later = function later() {
			callback.apply(context, callbackArgs);
			timeout = null;
		};
		return function () {
			if (!timeout) {
				callbackArgs = arguments;
				timeout = setTimeout(later, wait);
			}
		};
	};

	var methodCollection = [];

	$.fn[pluginMethod] = function (options) {
		var originalUserOptions = options;

		if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
			options = {};
		}

		var settings = _extends({
			srcAttr: 'data-src',
			srcsetAttr: 'data-srcset',

			visible: false,
			sequential: false,

			backgrounds: false,
			playthrough: false,

			early: false,
			earlyTimeout: 0,

			onProgress: function onProgress() {},
			onLoad: function onLoad() {},
			onError: function onError() {},

			onComplete: function onComplete() {}
		}, options);

		var callback = settings.onComplete;
		if ($.isFunction(originalUserOptions)) {
			callback = originalUserOptions;
		}

		return this.each(function (i) {
			var _this5 = this;

			// TODO: mutation observer when new children are appended

			var $element = $(this);
			var uniqueMethodPluginName = generateInstanceID() + i;
			var thisLoadInstance = new Loader(settings);

			thisLoadInstance.collection = this;

			methodCollection.push({
				id: uniqueMethodPluginName,
				instance: thisLoadInstance,
				element: this,
				timeout: null
			});

			thisLoadInstance.progress(function (resource) {
				$(resource.element).trigger(pluginPrefix + capitalize(resource.status) + '.' + pluginPrefix, [resource.element, resource.resource]);
				$element.trigger(pluginPrefix + 'Progress.' + pluginPrefix, [_this5, resource]);

				var thisArguments = [thisLoadInstance, resource];

				if (typeof settings.onProgress === 'function') {
					settings.onProgress.apply(_this5, thisArguments);
				}

				var eventName = capitalize(resource.status);
				if (typeof settings['on' + eventName] === 'function') {
					settings['on' + eventName].apply(_this5, thisArguments);
				}
			});

			thisLoadInstance.done(function (resources) {
				$element.trigger(pluginPrefix + 'Complete.' + pluginPrefix, [_this5, resources]);
				callback.apply(_this5, [thisLoadInstance, resources]);

				if (settings.visible) {
					/*if (IntersectionObserverSupported) {
                        thisLoadInstance.collection.forEach(item => item.element.intersectionObserver.unobserve(item.element));
                      } else {*/
					$window.off('scroll.' + uniqueMethodPluginName);

					//}
				}

				// refresh other method calls for same el (omitting this one)
				methodCollection = methodCollection.filter(function (x) {
					return x.id !== uniqueMethodPluginName;
				});
				methodCollection.forEach(function (thisMethodCollection) {
					if ($element.is(thisMethodCollection.element)) {
						thisMethodCollection.instance.load();
					}
				});
			});

			thisLoadInstance.load();

			if (settings.visible) {
				/* if (IntersectionObserverSupported) {
                      thisLoadInstance.collection.forEach(item => {
                          item.element.intersectionObserver = new IntersectionObserver((entries, observer) => {
                            entries.forEach(entry => {
                                if( entry.intersectionRatio > 0 ){
                                    thisLoadInstance.load();
                                }
                            });
                        }, {
                            root: null,
                            rootMargin: '0px',
                            threshold: 0.0
                        });
                          item.element.intersectionObserver.observe(item.element);
                      });
                  } else {*/

				$window.on('scroll.' + uniqueMethodPluginName, throttle(function () {
					return thisLoadInstance.load();
				}, 250));

				//}
			}

			if (true === settings.early) {
				var breakLoop = false;

				methodCollection.forEach(function (thisMethodCollection) {
					if (breakLoop) {
						return;
					}

					if (methodCollection[key].id === uniqueMethodPluginName) {
						clearTimeout(thisMethodCollection.timeout);

						var timeout = parseInt(settings.earlyTimeout);

						thisMethodCollection.timeout = setTimeout(function () {
							// TODO: appropriate method to set/update settings?
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
})();
//# sourceMappingURL=nite.loader.js.map
