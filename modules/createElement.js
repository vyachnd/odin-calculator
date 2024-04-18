import helpers from '../libraries/helpers.js';
import Emitter from './emitter.js';

class CreateElement {
  constructor(tagName, attributes, children) {
    this.element = document.createElement(tagName || 'div');
    this.attributes = attributes || {};
    this.children = children || [];
    this.emitter = new Emitter();

    this.#setAttributes();
    this.#renderChildren();
  }

  #setAttributes() {
    for (const attribute of Object.entries(this.attributes)) {
      const [attributeKey, attributeValue] = attribute;

      if (attributeKey === 'dataset') {
        for (const dataset of Object.entries(attributeValue)) {
          const [datasetKey, datasetValue] = dataset;

          if (typeof datasetValue === 'boolean') {
            if (datasetValue) this.element.dataset[datasetKey] = '';
          } else {
            this.element.dataset[datasetKey] = datasetValue;
          }
        }
      } else if (attributeKey === 'style') {
        for (const style of Object.entries(attributeValue)) {
          const [styleKey, styleValue] = style;
          this.element.style[styleKey] = styleValue;
        }
      } else if (attributeKey === 'class') {
        this.element.classList.add(...attributeValue);
      } else {
        if (typeof attributeValue === 'boolean') {
          this.element[attributeKey] = attributeValue;
        } else {
          this.element.setAttribute(attributeKey, attributeValue);
        }
      }
    }
  }

  #renderChildren() {
    for (const child of this.children) {
      if (child instanceof CreateElement) {
        child.mount(this.element);
      } else if (child instanceof HTMLElement) {
        this.element.append(child);
      } else {
        let htmlEntityChild = null;

        if (child.match(/&.+;/)) {
          htmlEntityChild = child.replaceAll(/&.+;/g, (match) => helpers.htmlEntityToUnicode(match));
        }

        this.element.append(document.createTextNode(htmlEntityChild || child));
      }
    }
  }

  updateAttributes(newAttributes) {
    for (const newAttribute of Object.entries(newAttributes)) {
      const [newAttributeKey, newAttributeValue] = newAttribute;

      if (newAttributeKey === 'dataset') {
        for (const dataset of Object.entries(newAttributeValue)) {
          const [datasetKey, datasetValue] = dataset;

          if (datasetValue !== this.attributes?.dataset?.[datasetKey]) {
            if (typeof datasetValue === 'boolean') {
              if (datasetValue) this.element.dataset[datasetKey] = '';
            } else {
              this.element.dataset[datasetKey] = datasetValue;
            }
          }
        }
      } else if (newAttributeKey === 'style') {
        for (const style of Object.entries(newAttributeValue)) {
          const [styleKey, styleValue] = style;

          if (styleValue !== this.attributes?.style?.[styleKey]) {
            this.element.style[styleKey] = styleValue;
          }
        }
      } else if (newAttributeKey === 'class') {
        if (newAttributeValue.length === 0) {
          this.element.removeAttribute('class');
        } else {
          this.element.classList.add(...newAttributeValue);
        }
      } else {
        if (this.attributes[newAttributeKey] !== newAttributeValue) {
          if (typeof newAttributeValue === 'boolean') {
            this.element[newAttributeKey] = newAttributeValue;
          } else {
            this.element.setAttribute(newAttributeKey, newAttributeValue);
          }
        }
      }
    }

    for (const oldAttribute of Object.entries(this.attributes)) {
      const [oldAttributeKey, oldAttributeValue] = oldAttribute;

      if (oldAttributeKey === 'dataset') {
        for (const dataset of Object.entries(oldAttributeValue)) {
          const [datasetKey] = dataset;

          if (!newAttributes?.dataset?.hasOwnProperty(datasetKey)) {
            delete this.element.dataset[datasetKey];
          }
        }
      } else if (oldAttributeKey === 'style') {
        for (const style of Object.entries(oldAttributeValue)) {
          const [styleKey] = style;

          if (!newAttributes?.style?.hasOwnProperty(styleKey)) {
            this.element.style[styleKey] = null;
          }
        }
      } else if (oldAttributeKey === 'class') {
        for (const cls of oldAttributeValue) {
          if (!newAttributes?.class?.includes(cls)) {
            this.element.classList.remove(cls);
          }
        }

        if (this.element.classList.length === 0) this.element.removeAttribute('class');
      } else {
        if (!newAttributes.hasOwnProperty(oldAttributeKey)) {
          this.element.removeAttribute(oldAttributeKey);
        }
      }
    }

    this.attributes = newAttributes;
  }

  updateChildren(newChildren) {
    const oldNodes = Array.from(this.element.childNodes);

    for (let i = 0; i < newChildren.length; i += 1) {
      const newChild = newChildren[i];
      const oldChild = this.children[i];

      if (oldChild && (newChild !== oldChild)) {
        if (newChild instanceof CreateElement) newChild.mount(this.element);

        let htmlEntityChild = null;
        const child = newChild?.element || newChild;

        if (child instanceof HTMLElement) {
          oldNodes[i].replaceWith(child);
        } else {
          if (child.match(/&.+;/)) {
            htmlEntityChild = child.replaceAll(/&.+;/g, (match) => helpers.htmlEntityToUnicode(match));
            oldNodes[i].replaceWith(document.createTextNode(htmlEntityChild || child));
          }
        }

        if (oldChild instanceof CreateElement) oldChild.unmount();
      }

      if (!oldChild) {
        if (newChild instanceof CreateElement) {
          newChild.mount(this.element);
        } else if (newChild instanceof HTMLElement) {
          this.element.append(newChild);
        } else {
          let htmlEntityChild = null;

          if (newChild.match(/&.+;/)) {
            htmlEntityChild = newChild.replaceAll(/&.+;/g, (match) => helpers.htmlEntityToUnicode(match));
          }

          this.element.append(document.createTextNode(htmlEntityChild || newChild));
        }
      }
    }

    for (let i = newChildren.length; i < oldNodes.length; i += 1) {
      const oldNode = oldNodes[i];


      if (oldNode instanceof CreateElement) {
        oldNode.unmount();
      } else {
        oldNode.remove();
      }
    }

    this.children = newChildren;
  }

  unmount() {
    if (this.element.parentElement) {
      for (const child of this.element.children) {
        child.remove();
      }

      this.element.remove();
    }
  }

  mount(parent, isPrepend) {
    if (isPrepend) {
      parent.prepend(this.element);
    } else {
      parent.append(this.element);
    }
  }
}

CreateElement.prototype.addEventListener = function (eventName, callback, options) {
  this.element.addEventListener(eventName, callback, options);
};

CreateElement.prototype.removeEventListener = function (eventName, callback, options) {
  this.element.removeEventListener(eventName, callback, options);
};

export default CreateElement;
