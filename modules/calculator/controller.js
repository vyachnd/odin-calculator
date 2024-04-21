import CalculatorModel from './model.js';

class CalculatorController {
  constructor(model, render) {
    this.model = model;
    this.render = render;

    this.render.emitter.subscribe('handleCommand', this.handleCommand.bind(this));
    this.render.emitter.subscribe('handleOperator', this.handleOperator.bind(this));
    this.render.emitter.subscribe('handleInput', this.handleInput.bind(this));
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
    this.render.updateInput();
    if (this.model.isOperator) this.render.updateResult();
  }

  handleOperator(operator) {
    const operators = CalculatorModel.operators;

    if (!operators.hasOwnProperty(operator)) return;
    if (operator === 'per' && this.model.currentNode?.root?.value === 'per') return;
    if (this.model.isOperator && operator !== 'per') {
      this.render.updateResult();
      return;
    }

    this.model.processOperator(operator);
    this.render.updateInput();
    this.render.updateResult();
  }

  handleCommand(command) {
    if (command === 'remove') {
      this.model.processRemove();
    }

    this.render.updateInput();
    this.render.updateResult();
  }
}

export default CalculatorController;
