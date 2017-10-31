/**
 * @type {RegExp}
 */
var nameRegExp = /^function\s*([^\s(]+)/;

/**
 * @param {Function} fn
 * @returns {string}
 */
function getName(fn) {
    let name;
    if (typeof fn.name) {
        name = fn.name;
    } else {
        let matched = this.toString().match(nameRegExp);
        if (matched) {
            name = matched[1];
        }
    }
    return name;
}

/**
 * Extends specified parent with heir.
 * @param {Function} heir - Constructor for inheritance.
 * @param {Function} parent - Parent constructor.
 * @param {Function} [prototype] - Prototype
 * @returns {Function}
 */
function extend(heir, parent, prototype) {
    let result, key, keys, ancestorName, properties = {};

    if (heir.prototype && heir.prototype.__inherits__) {
        throw new Error('already extends the ' + heir.prototype.__inherits__);
    }

    if (parent instanceof Function) {
        if (prototype instanceof Function) {
            prototype.prototype = parent.prototype;
            ancestorName = getName(parent) || 'Anonymous';
        } else {
            ancestorName = getName(parent);
            if (ancestorName) {
                prototype = new Function();
                prototype.prototype = parent.prototype;
            } else {
                prototype = parent;
                parent = Object;
                prototype.prototype = parent.prototype;
                ancestorName = getName(parent);
            }
        }
    } else {
        throw 'Invalid arguments.';
    }

    result = new prototype();

    keys = Object.keys(result);
    for (let i = keys.length - 1; i >= 0; i--) {
        key = keys[i];
        properties[key] = {
            enumerable: true,
            configurable: false
        };
    }
    properties.__inherits__ = {
        value: ancestorName
    };
    properties.constructor = {
        enumerable: true,
        value: heir
    };
    Object.defineProperties(result, properties);

    heir.prototype = result;

    return heir;
}

module.exports = extend;