class CreateElement {
  constructor(tagName, attributes, children) {
    this.element = document.createElement(tagName || 'div');
    this.attributes = attributes || {};
    this.children = children || [];

    this.#setAttributes();
    this.#renderChildren();
  }

  #setAttributes() {
    for (const attribute of Object.entries(this.attributes)) {
      const [attributeKey, attributeValue] = attribute;

      if (attributeKey === 'dataset') {
        for (const dataset of Object.entries(attributeValue)) {
          const [datasetKey, datasetValue] = dataset;
          this.element.dataset[datasetKey] = datasetValue;
        }
      } else if (attributeKey === 'class') {
        this.element.classList.add(...attributeValue);
      } else {
        this.element.setAttribute(attributeKey, attributeValue);
      }
    }
  }

  #renderChildren() {
    for (const child of this.children) {
      if (child instanceof CreateElement) {
        child.mount(this.element);
      } else {
        this.element.append(child);
      }
    }
  }

  updateAttributes(newAttributes) {
    for (const newAttribute of Object.entries(newAttributes)) {
      const [newAttributeKey, newAttributeValue] = newAttribute;

      if (newAttributeKey === 'dataset') {
        for (const dataset of Object.entries(newAttributeValue)) {
          const [datasetKey, datasetValue] = dataset;

          if (datasetValue !== this.attributes?.dataset[datasetKey]) {
            this.element.dataset[datasetKey] = datasetValue;
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
          this.element.setAttribute(newAttributeKey, newAttributeValue);
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
        if (oldChild instanceof CreateElement) oldChild.unmount();

        if (newChild instanceof CreateElement) {
          newChild.mount(this.element);
        } else {
          oldNodes[i].replaceWith(newChild);
        }
      }

      if (!oldChild) {
        if (newChild instanceof CreateElement) {
          newChild.mount(this.element);
        } else {
          this.element.append(newChild);
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

  mount(parent) { parent.append(this.element); }
}

export default CreateElement;
