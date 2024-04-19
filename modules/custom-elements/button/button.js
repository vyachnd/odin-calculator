/*
  Size                'xs', 'sm', 'base', 'lg', 'xl'
  Variant             'base', 'secondary', 'warning', 'error', 'submit'
  Align               'base', 'center', 'right'
  Active              Boolean
  Fill                Boolean
  Transparent         Boolean
  Rounded             Boolean
  Disabled            Boolean
*/

import CreateElement from '../../createElement.js';
import { CEIcon } from '../init.js';

class CEButton extends CreateElement {
  constructor(children, settings, attributes = {}, events = {}) {
    super(
      'button',
      {
        type: 'button',
        ...attributes,
        class: [...(attributes?.class || []), 'ce-button'],
        dataset: {
          fill: true,
          ...settings,
        },
        disabled: Boolean(settings?.disabled),
      },
      [],
      events,
    );

    this.settings = {};

    this.setSettings(settings);
    this.setChildren(children);
  }

  setSettings(settings) {
    this.updateAttributes({
      ...this.attributes,
      disabled: Boolean(settings?.disabled),
      dataset: {
        fill: true,
        ...settings,
      },
    });

    this.settings = settings;
  }

  setChildren(children) {
    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];

      if (child instanceof CEIcon) {
        child.updateAttributes({
          ...child.attributes,
          class: [...(child.attributes?.class || []), 'ce-button__icon'],
        });
      } else if (typeof child === 'string') {
        children[i] = new CreateElement(
          'span',
          { class: ['ce-button__caption'] },
          [child?.element?.textContent || child]
        );
      }
    }

    this.updateChildren(children);

    this.children = children;
  }
}

export default CEButton;
