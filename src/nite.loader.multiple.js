import { generateInstanceID, stringStartsWith, arrayFindIndex, hyphensToCamelCase, nodelistToArray, isInArray } from './nite.loader.tools';

import { isVisible, isHTMLElement } from './nite.loader.element';

import { SingleLoader } from './nite.loader.single';

// TODO: Promise support
// TODO: private vars
// TODO: refactory succes/done/progress code...
/** TODO: description of the MyClass constructor function.
 * @class
 * @classdesc TODO: description of the Loader class.
 */
export class Loader {
	/**
	 * @param {Object} [options={srcAttr: 'data-src', srcsetAttr: 'data-srcset', playthrough: false, visible: false, backgrounds: false }]
	 */
	constructor(options) {
		this._collection = [];
		this._collectionLoaded = [];
		this._collectionInstances = [];
		this._collectionPending = [];
		this._resourcesLoaded = [];

		this._settings = {
			...{
				srcAttr: 'data-src',
				srcsetAttr: 'data-srcset',
				playthrough: false,
				visible: false,
				backgrounds: false
			},
			...options
		};

		if (!stringStartsWith(this._settings.srcAttr, 'data-') || !stringStartsWith(this._settings.srcsetAttr, 'data-')) {
			throw new Error('Wrong arguments format: srcAttr and srcsetAttr parameters must be dataset values.');
		}

		this.srcAttr = hyphensToCamelCase(this._settings.srcAttr.replace('data-', ''));
		this.srcsetAttr = hyphensToCamelCase(this._settings.srcsetAttr.replace('data-', ''));

		this.percentage = 0;

		this._done = () => {};
		this._progress = () => {};
		this._success = () => {};
		this._error = () => {};
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
	static findResources(element, options) {
		let settings = {
			srcAttr: 'src',
			srcsetAttr: 'srcset',
			backgrounds: false
		};

		if (typeof element === 'object' && undefined === options) {
			for (let key in settings) {
				if (key in element) {
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

		let collectedResources = [];

		settings = {
			...settings,
			...options
		};

		const targets = 'img, video, audio';
		const targetsExtended = targets + ', picture, source';
		const targetsFilter = '[' + settings.srcAttr + '], [' + settings.srcsetAttr + ']';

		let targetsTags = nodelistToArray(element.querySelectorAll(targets));

		if (element.matches(targetsExtended)) {
			targetsTags.push(element);
		}

		targetsTags = targetsTags.filter(target => {
			let children = nodelistToArray(target.children);
			children = children.filter(x => x.matches(targetsExtended));
			children = children.filter(x => x.matches(targetsFilter));
			return target.matches(targetsFilter) || children.length;
		});
		targetsTags.forEach(target => {
			let targetSource = target;

			if (!targetSource.matches(targetsFilter)) {
				targetSource = targetSource.querySelectorAll(targetsFilter);
				targetSource = [...targetSource][0];
			}

			collectedResources.push({
				element: target,
				resource: targetSource.getAttribute(settings.srcAttr) || targetSource.getAttribute(settings.srcsetAttr)
			});
		});

		if (true === settings.backgrounds) {
			let targetsBg = nodelistToArray(element.querySelectorAll('*'));
			targetsBg.push(element);
			targetsBg = targetsBg.filter(target => !target.matches(targetsExtended));
			targetsBg = targetsBg.filter(target => getComputedStyle(target).backgroundImage !== 'none');
			targetsBg.forEach(target => {
				const url = getComputedStyle(target).backgroundImage.match(/\((.*?)\)/);

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

	/**
	 * @param {(Array.<String>|HTMLElement)} collection
	 */
	set collection(collection) {
		let collectedResources = collection;

		try {
			collectedResources = Loader.findResources(collection, this._settings);
		} catch (err) {}

		collectedResources.forEach(item => {
			let element = {
				resource: '',
				element: null,
				id: generateInstanceID()
			};

			if (typeof item === 'string') {
				element.resource = item;
			} else if (typeof item === 'object' && 'resource' in item) {
				element = { ...element, ...item };
			} else {
				return;
			}

			this._collection.push(element);
		});
	}

	/**
	 * @returns {Array} collection
	 */
	get collection() {
		return this._collection;
	}

	/**
	 * @returns {undefined}
	 */
	load() {
		if (!this._collection.length) {
			this._done.call(this, this._resourcesLoaded);
		}

		// resets pending elements (sequential opt helper array) every time we loop
		this._collectionPending = [];

		const sequentialMode = true === this._settings.sequential;

		for (let i = 0; i < this._collection.length; i++) {
			if (this._abort) {
				break;
			}

			let thisLoadId = this._collection[i].id;
			let thisLoadIndex = arrayFindIndex(this._collectionInstances, x => x.id === thisLoadId);
			let thisLoadInstance = new SingleLoader(this._settings);

			if (thisLoadIndex === -1) {
				this._collectionInstances.push({
					id: thisLoadId,
					instance: thisLoadInstance
				});
				thisLoadIndex = arrayFindIndex(this._collectionInstances, x => x.id === thisLoadId);
			} else {
				this._collectionInstances[thisLoadIndex].instance = thisLoadInstance;
			}

			thisLoadInstance.resource = this._collection[i];

			thisLoadInstance.done((element, status, resource, id) => {
				if (this._complete || this._abort) {
					return;
				}

				const aProgress = !isInArray(id, this._collectionLoaded);

				if (aProgress) {
					this._collectionLoaded.push(id);
					this._busy = false;

					this._loaded++;
					this.percentage = (this._loaded / this._collection.length) * 100;
					this.percentage = parseFloat(this.percentage.toFixed(4));

					const thisResource = {
						resource: resource,
						status: status,
						element: element
					};
					this._resourcesLoaded.push(thisResource);
					this._progress.call(this, thisResource);
					this[status !== 'error' ? '_success' : '_error'].call(this, thisResource);
					// TODO: dispatch event on element maybe?
					// element.dispatchEvent(new CustomEvent(pluginPrefix + capitalize(status) + '.' + pluginPrefix));
				}

				if (this._loaded === this._collection.length) {
					this._done.call(this, this._resourcesLoaded);

					this._complete = true;
				} else if (aProgress && sequentialMode && this._collectionPending.length) {
					this._collectionPending = this._collectionPending.filter(x => x.id !== id);

					if (this._collectionPending.length) {
						this._busy = this._collectionPending[0].instance.load();
					}
				}
			});

			if (!sequentialMode || (sequentialMode && !this._busy)) {
				this._busy = thisLoadInstance.load();
			} else if (
				sequentialMode &&
				this._busy &&
				(!this._settings.visible || !thisLoadInstance._exists || (this._settings.visible && thisLoadInstance._exists && isVisible(thisLoadInstance._originalElement)))
			) {
				this._collectionPending.push({
					id: thisLoadId,
					instance: thisLoadInstance
				});
			}
		}
	}

	/**
	 * @param {Function} callback
	 * @returns {undefined}
	 */
	done(callback) {
		if (typeof callback !== 'function') {
			return;
		}

		this._done = function(resources) {
			callback.call(this, resources);
		};
	}

	/**
	 * @param {Function} callback
	 * @returns {undefined}
	 */
	progress(callback) {
		if (typeof callback !== 'function') {
			return;
		}

		this._progress = function(resource) {
			callback.call(this, resource);
		};
	}

	/**
	 * @param {Function} callback
	 * @returns {undefined}
	 */
	success(callback) {
		if (typeof callback !== 'function') {
			return;
		}

		this._success = function(resource) {
			callback.call(this, resource);
		};
	}

	/**
	 * @param {Function} callback
	 * @returns {undefined}
	 */
	error(callback) {
		if (typeof callback !== 'function') {
			return;
		}

		this._error = function(resource) {
			callback.call(this, resource);
		};
	}

	/**
	 * @returns {undefined}
	 */
	abort() {
		this._collectionInstances.forEach(thisInstance => {
			thisInstance.instance.abort();
		});

		this._abort = true;
	}
}
