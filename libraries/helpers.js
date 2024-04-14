class Helpers {
  static CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

  fromTo(from, to) { return Math.random() * (to - from) + from; }

  distance(x1, y1, x2, y2) { return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); }

  uniqueId(len) {
    let uniqueId = '';

    for (let i = 0; i < len; i++) {
      const rndIdx = Math.floor(Math.random() * YourClass.CHARS.length);
      uniqueId += YourClass.CHARS[rndIdx];
    }

    return uniqueId;
  }

  rgbToHex([r, g, b], alpha) {
    let hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

    if (alpha) hex += ((1 << 8) + Math.round(alpha * 255)).toString(16).slice(1);

    return `#${hex}`.toUpperCase();
  }

  hexToRgb(hex) {
    const hexClr = hex.replace('#', '');
    const clr = [
      parseInt(hexClr.slice(0, 2), 16),
      parseInt(hexClr.slice(2, 4), 16),
      parseInt(hexClr.slice(4, 6), 16),
      +(parseInt(hexClr.slice(6, 8) || 'ff', 16) / 255).toFixed(2)
    ];

    return [clr[0], clr[1], clr[2], clr[3]];
  }

  adjustColor(color, step) {
    const adjustComponent = (clr) => {
      const adjustValue = clr + Math.round(step * clr);
      return this.clamp(adjustValue, 0, 255);
    };

    return color.map(adjustComponent);
  }

  bindMethods(element, classInstance) {
    const prototype = Object.getPrototypeOf(classInstance);
    const methods = Object.getOwnPropertyNames(prototype).filter((method) => {
      return method !== 'constructor' && typeof prototype[method] === 'function';
    });

    for (const method of methods) {
      element[method] = (...args) => {
        return prototype[method].call(classInstance, ...args);
      };
    }
  }

  /**
   * Рекурсивное копирование Object или Map
   * @param {Object|Map} source
  */
  deepCopy(source) {
    if (source instanceof Map) {
      const copy = new Map();

      for (const [key, value] of source.entries()) {
        copy.set(key, deepCopy(value));
      }

      return copy;
    } else if (typeof source === 'object' && source !== null) {
      const copy = {};

      for (const [key, value] of Object.entries(source)) {
        copy[key] = deepCopy(value);
      }

      return copy;
    }

    return source;
  }
}

export default new Helpers();
