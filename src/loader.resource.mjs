import { supportedExtensions, supportedTags, allSupportedTags } from './loader.settings.mjs';

const base64head = ';base64,';

/**
 * @param {Object} item
 * @returns {Object}
 */
export class Resource {
    constructor(item) {
        const isElement = item.element instanceof HTMLElement;

        this.url = item.url;
        this.consistent = isElement && allSupportedTags.includes(item.element.tagName.toLowerCase());
        this.element = isElement ? item.element : null;
        const tagName = isElement ? this.element.tagName.toLowerCase() : null;
        this.type = null;
        this.extension = null;

        if (!this.url) {
            return;
        }

        this.url = item.url;

        // this cleans urls like "url.jpg, url.jpg x2" ...
        if (!new RegExp(`${base64head}`).test(this.url)) {
            this.url = this.url
                .split(',')
                .pop() // gets the last
                .split(' ')
                .reduce((x, y) => (x.length > y.length ? x : y)); // gets the longest fragment in order to skip "x2", "" etc...
        }

        for (let format in supportedExtensions) {
            const extensions = supportedExtensions[format].join('|');

            if (new RegExp(`(.(${extensions})$)|data:${format}/(${extensions})${base64head}`).test(this.url)) {
                const matches = this.url.match(new RegExp(`.(${extensions})$`, 'g')) || this.url.match(new RegExp(`^data:${format}/(${extensions})`, 'g'));

                if (null !== matches) {
                    this.type = format;
                    this.extension = matches[0].replace(`data:${format}/`, '').replace('.', '');

                    break;
                }
            }
        }

        if (this.consistent && (tagName === 'audio' || tagName === 'video' || tagName === 'iframe')) {
            this.type = tagName;
        } else if (tagName) {
            for (let format in supportedTags) {
                if (supportedTags[format].includes(tagName)) {
                    this.type = format;
                    break;
                }
            }
        }
    }

    static isResource(item) {
        return typeof item === 'object' && 'type' in item && 'url' in item && 'extension' in item && 'element' in item;
    }
}
