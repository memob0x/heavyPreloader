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
        this.tagName = this.consistent ? this.element.tagName.toLowerCase() : null;
        this.type = null;
        this.extension = null;

        if (!this.url) {
            return;
        }

        this.url = item.url;

        // TODO: check if really needed
        // cleanup es: url.jpg, url.jpg x2 ...
        if (!new RegExp(`${base64head}`).test(this.url)) {
            this.url = this.url
                .split(',')
                .pop() // last
                .split(' ')
                .reduce((x, y) => (x.length > y.length ? x : y)); // longest in order to skip "x2", "" etc...
        }

        for (let format in supportedExtensions) {
            const extensions = supportedExtensions[format].join('|');

            if (new RegExp(`(.(${extensions})$)|data:${format}/(${extensions})${base64head}`).test(this.url)) {
                const matches = this.url.match(new RegExp(`.(${extensions})$`, 'g')) || this.url.match(new RegExp(`^data:${format}/(${extensions})`, 'g'));

                if (null !== matches) {
                    this.type = format;
                    this.extension = matches[0].replace(`data:${format}/`, '').replace('.', '');
                    this.tagName = this.tagName ? this.tagName : supportedTags[format][0];

                    break;
                }
            }
        }

        if (this.consistent && (this.tagName === 'audio' || this.tagName === 'video' || this.tagName === 'iframe')) {
            this.type = this.tagName;
        } else if (this.tagName) {
            for (let format in supportedTags) {
                if (supportedTags[format].includes(this.tagName)) {
                    this.type = format;
                    break;
                }
            }
        }
    }

    static isResource(item) {
        return typeof item === 'object' && 'tagName' in item && 'type' in item && 'url' in item && 'extension' in item && 'element' in item;
    }
}
