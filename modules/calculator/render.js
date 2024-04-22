import CreateElement from '../createElement.js';
import { CEButton, CEIcon } from '../custom-elements/init.js';

const keypadVariants = {
  base: { transparent: true },
  secondary: { variant: 'secondary', transparent: true },
  submit: { variant: 'submit', transparent: true },
  warning: { variant: 'warning', transparent: true },
  error: { variant: 'error', transparent: true },
};

class CalculatorRender extends CreateElement {
  constructor(model) {
    super('div', { tabIndex: -1, class: ['calculator'] }, [], {
      keydown: [(event) => this.emitter.emit('handleKeyDown', event)],
      blur: [(event) => this.emitter.emit('onBlur', event)]
    });

    this.model = model;

    this.keypadKeys = {
      '0': new CEButton(['0'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', '0')] }),
      '1': new CEButton(['1'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', '1')] }),
      '2': new CEButton(['2'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', '2')] }),
      '3': new CEButton(['3'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', '3')] }),
      '4': new CEButton(['4'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', '4')] }),
      '5': new CEButton(['5'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', '5')] }),
      '6': new CEButton(['6'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', '6')] }),
      '7': new CEButton(['7'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', '7')] }),
      '8': new CEButton(['8'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', '8')] }),
      '9': new CEButton(['9'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', '9')] }),
      'flt': new CEButton(['.'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', 'flt')] }),
      'neg': new CEButton(['&minus;/+'], { ...keypadVariants.base }, {}, { click: [() => this.emitter.emit('handleInput', 'neg')] }),

      'div': new CEButton(['&divide;'], { ...keypadVariants.warning }, {}, { click: [() => this.emitter.emit('handleOperator', 'div')] }),
      'mul': new CEButton(['&times;'], { ...keypadVariants.warning }, {}, { click: [() => this.emitter.emit('handleOperator', 'mul')] }),
      'sub': new CEButton(['&minus;'], { ...keypadVariants.warning }, {}, { click: [() => this.emitter.emit('handleOperator', 'sub')] }),
      'add': new CEButton(['+'], { ...keypadVariants.warning }, {}, { click: [() => this.emitter.emit('handleOperator', 'add')] }),
      'per': new CEButton(['%'], { ...keypadVariants.warning }, {}, { click: [() => this.emitter.emit('handleOperator', 'per')] }),

      'clr': new CEButton(['C'], { ...keypadVariants.error }, {}, { click: [() => this.emitter.emit('handleCommand', 'clr')] }),
      'rmv': new CEButton(['CE'], { ...keypadVariants.secondary }, {}, { click: [() => this.emitter.emit('handleCommand', 'rmv')] }),
      'ans': new CEButton(['='], { ...keypadVariants.submit }, {}, { click: [() => this.emitter.emit('handleCommand', 'ans')] }),
    };

    this.renderCalculator();
    this.updateInput();
    this.updateResult();
  }

  updateInput() {
    const { children: [input] } = this.children[0].children[0];
    input.updateChildren([this.model.stringifyExpression()]);
  }

  updateResult() {
    const { children: [, result] } = this.children[0].children[0];
    result.updateChildren([this.model.solve()]);
  }

  processKeyDown(key) {
    const keypadKey = this.keypadKeys[key];

    if (!keypadKey) return;

    keypadKey.setSettings({ ...keypadKey.settings, active: true });

    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      keypadKey.setSettings({ ...keypadKey.settings, active: false });
    }, 150);
  }

  renderCalculator() {
    // Main calculator container
    const leftContainer = new CreateElement('div', { class: ['calculator-container'] });
    const leftDisplay = new CreateElement('div', { class: ['calculator__display'] });
    const leftControls = new CreateElement('div', { class: ['calculator__controls'] });
    const leftKeypad = new CreateElement('div', { class: ['calculator__keypad'] });

    leftDisplay.updateChildren([
      new CreateElement('span', { class: ['calculator__input'] }),
      new CreateElement('span', { class: ['calculator__result'] }),
    ]);

    leftControls.updateChildren([
      new CEButton([new CEIcon('keyboard', { opsz: 48 })], { size: 'sm', boxed: true, transparent: true }),
      new CEButton([new CEIcon('history', { opsz: 48 })], { size: 'sm', boxed: true, transparent: true }),
    ]);

    leftKeypad.updateChildren([
      this.keypadKeys['clr'], this.keypadKeys['rmv'], this.keypadKeys['per'], this.keypadKeys['div'],
      this.keypadKeys['7'], this.keypadKeys['8'], this.keypadKeys['9'], this.keypadKeys['mul'],
      this.keypadKeys['4'], this.keypadKeys['5'], this.keypadKeys['6'], this.keypadKeys['sub'],
      this.keypadKeys['1'], this.keypadKeys['2'], this.keypadKeys['3'], this.keypadKeys['add'],
      this.keypadKeys['neg'], this.keypadKeys['0'], this.keypadKeys['flt'], this.keypadKeys['ans'],
    ]);

    leftContainer.updateChildren([leftDisplay, leftControls, leftKeypad]);

    // Secondary calculator container
    const rightContainer = new CreateElement('div', { class: ['calculator-container'] });
    const rightControls = new CreateElement('div', { class: ['calculator__controls'] });
    const rightHistory = new CreateElement('ul', { class: ['calculator__history'] });
    const historyItems = [];

    rightControls.updateChildren([
      new CEButton([new CEIcon('delete_history', { opsz: 48 })], { size: 'sm', variant: 'error', boxed: true, transparent: true }),
    ]);

    for (let i = 0; i < 10; i += 1) {
      const historyItem = new CreateElement('li', { tabIndex: '0', class: ['history'] }, [
        new CreateElement('span', { class: ['history__result'] }, ['200']),
        new CreateElement('span', { class: ['history__input'] }, ['100 + 100']),
      ]);

      historyItems.push(historyItem);
    }

    rightHistory.updateChildren(historyItems);

    rightContainer.updateChildren([rightControls, rightHistory]);

    this.updateChildren([leftContainer, rightContainer]);
  }
}

export default CalculatorRender;
