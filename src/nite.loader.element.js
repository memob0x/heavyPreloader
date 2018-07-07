import { isInArray } from './nite.loader.tools';
import { privateCache } from './nite.loader.cache';
import { intersectionObserverSupported } from './nite.loader.client';

/**
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export const isVisible = element => {
	if (intersectionObserverSupported && 'intersectionRatio' in element) {
		return element.intersectionRatio > 0;
	}

	if (window.getComputedStyle(element, 'display') === 'none') {
		return false;
	}

	const bodyEl = document.getElementsByTagName('body')[0];
	const winWidth = window.innerWidth || documnt.documentElement.clientWidth || bodyEl.clientWidth;
	const winHeight = window.innerHeight || documnt.documentElement.clientHeight || bodyEl.clientHeight;
	const rect = element.getBoundingClientRect();

	return !(rect.right < 0 || rect.bottom < 0 || rect.left > winWidth || rect.top > winHeight);
};

/**
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export const isHTMLElement = element => {
	if (typeof element !== 'object') {
		return false;
	}
	try {
		return element instanceof HTMLElement;
	} catch (e) {
		return element.nodeType === 1 && typeof element.style === 'object' && typeof element.ownerDocument === 'object';
	}
};

/**
 * @param {(string|HTMLVideoElement|HTMLAudioElement|HTMLImageElement)} source
 * @returns {boolean}
 */
export const isLoaded = source => {
	return (
		(typeof source === 'string' && isInArray(source, privateCache)) ||
		(isHTMLElement(source) &&
			('currentSrc' in source && source.currentSrc.length > 0) &&
			(('complete' in source && source.complete) || ('readyState' in source && source.readyState >= 2)))
	);
};

/**
 * @param {(HTMLVideoElement|HTMLAudioElement)} source
 * @returns {boolean}
 */
export const isFullyBuffered = media => {
	return media.buffered.length && Math.round(media.buffered.end(0)) / Math.round(media.seekable.end(0)) === 1;
};

/**
 * @param {(string|HTMLElement)} source
 * @returns {boolean}
 */
export const isBroken = source => {
	return (
		isLoaded(source) &&
		((isHTMLElement(source) && (('naturalWidth' in source && Math.floor(source.naturalWidth) === 0) || ('videoWidth' in source && source.videoWidth === 0))) ||
			typeof source === 'string')
	);
};
