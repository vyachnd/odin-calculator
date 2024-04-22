import CalculatorModel from './model.js';

class CalculatorController {
  constructor(model, render) {
    this.model = model;
    this.render = render;

    this.render.emitter.subscribe('handleKeyDown', this.handleKeyDown.bind(this));
    this.render.emitter.subscribe('handleCommand', this.handleCommand.bind(this));
    this.render.emitter.subscribe('handleOperator', this.handleOperator.bind(this));
    this.render.emitter.subscribe('handleInput', this.handleInput.bind(this));
    this.render.emitter.subscribe('onBlur', this.onBlur.bind(this));

    this.render.emitter.subscribe('handleHistory', this.handleHistory.bind(this));

    this.render.keyboardControlElement.updateEvents({ click: [this.toggleKeyboard.bind(this)] });
    this.render.historyControlElement.updateEvents({ click: [this.toggleHistory.bind(this)] });
    this.render.historyClearControlElement.updateEvents({ click: [this.clearHistory.bind(this)] });
  }

  clearHistory() {
    this.model.clearHistory();
    this.render.updateHistory();
  }

  toggleHistory() { this.render.toggleHistory(); }
  toggleKeyboard() { this.render.toggleKeyboard(); }

  focus() { this.render.element.focus(); }

  onBlur() { this.focus(); }

  updateDisplay() {
    this.render.updateInput();
    this.render.updateResult();
  }

  handleHistory(historyNode) {
    this.model.historySelect(historyNode);
    this.updateDisplay();
    this.render.updateHistory();
  }

  handleInput(input) {
    let currentValue = this.model.currentNode?.value || '0';

    if (input === 'neg') {
      if (currentValue.startsWith('-')) {
        currentValue = currentValue.slice(1);
      } else {
        currentValue = '-' + currentValue;
      }
    } else if (input === 'flt') {
      if (currentValue.indexOf('.') === -1) {
        currentValue += '.';
      }
    } else if (input.match(/^[0-9]$/)) {
      const isNeg = currentValue.startsWith('-');

      if (isNeg) currentValue = currentValue.slice(1);

      if (currentValue === '0') {
        currentValue = input;
      } else if (currentValue !== '0') {
        currentValue += input;
      }

      if (isNeg) currentValue = '-' + currentValue;
    }

    if (currentValue === '') return;

    this.model.processInput(currentValue);
    this.updateDisplay();
  }

  handleOperator(operator) {
    const operators = CalculatorModel.operators;

    if (!operators.hasOwnProperty(operator)) return;
    if (operator === 'per' && this.model.currentNode?.root?.value === 'per') return;

    if (!(this.model.isOperator && operator !== 'per')) {
      this.model.processOperator(operator);
    } else {
      this.model.processAnswer();
      this.model.processOperator(operator);
      this.render.updateHistory();
    }
    this.updateDisplay();
  }

  handleCommand(command) {
    switch (command) {
      case 'clr':
        this.model.clear();
        break;
      case 'rmv':
        this.model.processRemove();
        break;
      case 'ans':
        this.model.processAnswer();
        this.render.updateHistory();
        this.updateDisplay();
        break;
      default:
        break;
    }

    this.updateDisplay();
  }

  handleKeyDown(event) {
    const { key, shiftKey, ctrlKey, metaKey } = event;
    const metaKeys = metaKey || ctrlKey;

    if (!this.render.keyboardEnable || metaKeys) return;

    if (key.match(/^[\d\.]$/) || key === '.' || (key === '_' && shiftKey)) {
      let input = '';

      if (key.match(/^[\d\.]$/)) input = key;
      if (key === '.') input = 'flt';
      if (key === '_' && shiftKey) input = 'neg';

      this.handleInput(input);
      this.render.processKeyDown(input);
    }

    if (key === 'Backspace' || key === 'Escape' || (key === 'Enter' || key === '=')) {
      let command = '';

      if (key === 'Backspace') command = 'rmv';
      if (key === 'Escape') command = 'clr';
      if (key === 'Enter' || key === '=') command = 'ans';

      this.handleCommand(command);
      this.render.processKeyDown(command);
    }

    if (key === '-' || key === '+' || key === '*' || key === '/' || key === '%') {
      let operator = '';

      if (key === '-') operator = 'sub';
      if (key === '+') operator = 'add';
      if (key === '*') operator = 'mul';
      if (key === '/') operator = 'div';
      if (key === '%') operator = 'per';

      this.handleOperator(operator);
      this.render.processKeyDown(operator);
    }
  }
}

export default CalculatorController;
