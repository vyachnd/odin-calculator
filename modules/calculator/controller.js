import CalculatorModel from './model.js';

class CalculatorController {
  constructor(model, render) {
    this.model = model;
    this.render = render;

    this.render.emitter.subscribe('onBlur', this.onBlur.bind(this));
    this.render.emitter.subscribe('handleCommand', this.handleCommand.bind(this));
    this.render.emitter.subscribe('handleOperator', this.handleOperator.bind(this));
    this.render.emitter.subscribe('handleInput', this.handleInput.bind(this));
  }

  focus() { this.render.element.focus(); }

  onBlur() { this.focus(); }

  updateDisplay() {
    this.render.updateInput();
    this.render.updateResult();
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
        console.log('ans');
        break;
      default:
        break;
    }

    this.updateDisplay();
  }
}

export default CalculatorController;
