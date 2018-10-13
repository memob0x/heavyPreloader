import { isInArray } from './toolbox/src/toolbox.utils.mjs';
import { supportedExtensions, supportedTags, allSupportedTags, supportedTypes } from './loader.settings.mjs';

/**
 * @param {Object} item
 * @returns {Object}
 */
export class Media {
    constructor(item) {
        const isElement = item.element instanceof HTMLElement;

        this.url = item.url;
        this.consistent = isElement && isInArray(item.element.tagName.toLowerCase(), allSupportedTags);
        this.element = isElement ? item.element : null;
        this.tagName = this.consistent ? this.element.tagName.toLowerCase() : null;
        this.type = null;
        this.extension = null;

        if (!this.url) {
            return;
        }

        this.url = item.url;

        for (let format in supportedExtensions) {
            const extensions = supportedExtensions[format].join('|');

            if (new RegExp('(.(' + extensions + ')$)|data:' + format + '/(' + extensions + ');base64,').test(this.url)) {
                const matches = this.url.match(new RegExp('.(' + extensions + ')$', 'g')) || this.url.match(new RegExp('^data:' + format + '/(' + extensions + ')', 'g'));

                if (null !== matches) {
                    this.type = format;
                    this.extension = matches[0].replace('data:' + format + '/', '').replace('.', '');
                    this.tagName = this.tagName ? this.tagName : supportedTags[format][0];

                    break;
                }
            }
        }

        if (this.consistent && (this.tagName === 'audio' || this.tagName === 'video' || this.tagName === 'iframe')) {
            this.type = this.tagName;
        } else if (this.tagName) {
            for (let format in supportedTags) {
                if (isInArray(this.tagName, supportedTags[format])) {
                    this.type = format;
                    break;
                }
            }
        }
    }

    static isMedia(item) {
        return typeof item === 'object' && 'tagName' in item && 'type' in item && 'url' in item && 'extension' in item && 'element' in item;
    }
}
