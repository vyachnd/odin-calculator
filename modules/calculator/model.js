/*
  2 + 3
  [[2, 3], fn()]

  -2 + 3
  [[[2, fn()], 3], fn()]

  -2 + -3
  [[[2, fn()], [3, fn()]], fn()]

  50 - 100%
  [[50, [50, 100, fn()]], fn()]

  50% - 100
  [[[1, 50, fn()], 100], fn()]

  [] => input 5
  [[5]] => input 0
  [[50]] => command PERCENT
  [[1, 50, fn()]] => command MINUS
  [[1, 50, fn()], -, fn()] => input 1
  [[1, 50, fn()], 1, fn()]

  ОТКАЗЫВАЕМСЯ ОТ ПАРСИНГА ВЫРАЖЕНИЯ
    - ЗАЙМЕТ СЛИШКОМ МНОГО ВРЕМЕНИ
    - НУЖНО БОЛЬШЕ ЗНАНИЙ В НАПРАВЛЕНИИ ПАРСИНГА, МАТЕМАТИКИ И ДРЕВА

  Будем просто исходить из ввода пользователя и преобразовывать его в дерево наверное

  - [ ] Написать рендер калькулятора без внутренних функций
*/

class Node {
  constructor(value, left, right, root) {
    this.value = value || null;
    this.left = left || null;
    this.right = right || null;
    this.root = root || null;
  }
}

class CalculatorModel {
  static operators = {
    'add': function (a, b) { return a + b; },
    'sub': function (a, b) { return a - b; },
    'mul': function (a, b) { return a * b; },
    'div': function (a, b) { return a / b; },
    'per': function (a, b) { return a * (b * 0.01); },
  };

  constructor() {
    this.node = null;
    this.currentNode = this.node;
    this.history = [];
    this.isOperator = false;
  }

  stringifyExpression(node = this.node) {
    if (!node) return '0';

    if (!node.left && !node.right) return node.value;

    const leftExpression = this.stringifyExpression(node.left) || '0';
    const rightExpression = this.stringifyExpression(node.right) || '0';
    let value = node.value;

    if (node.value === 'per') return `${rightExpression}%`;

    if (node.value === 'add') value = '+';
    if (node.value === 'sub') value = '-';
    if (node.value === 'mul') value = '*';
    if (node.value === 'div') value = '/';

    return `${leftExpression} ${value} ${rightExpression}`;
  }

  processInput(input) {
    if (!this.currentNode) {
      this.node = new Node(input);
      this.currentNode = this.node;
    } else {
      this.currentNode.value = input;
    }
  }

  processOperator(operator) {
    const operators = CalculatorModel.operators;

    if (!this.node) this.processInput('0');

    const newNode = new Node(operator);

    switch (operators[operator]) {
      case (operators.add):
      case (operators.sub):
      case (operators.mul):
      case (operators.div):
        this.isOperator = true;

        newNode.left = this.node;
        newNode.right = new Node('0');

        newNode.left.root = newNode;
        newNode.right.root = newNode;

        this.node = newNode;
        this.currentNode = newNode.right;
        break;
      case (operators.per):
        if (!this.currentNode.root) {
          newNode.left = new Node('1');
          newNode.right = this.node;
          this.node = newNode;
        } else {
          newNode.left = this.currentNode.root.left;
          newNode.right = new Node(this.currentNode.value);
          this.node.right = newNode;
        }

        newNode.left.root = newNode;
        newNode.right.root = newNode;

        this.currentNode = newNode.right;
        break;
      default:
        break;
    }
  }

  processRemove() {
    if (!this.node) return;

    let newValue = this.currentNode.value.slice(0, -1);

    if (this.currentNode.root) {
      if (this.currentNode.value === '') {
        this.node = this.currentNode.root.left;
        this.node.root = null;
        this.currentNode = this.node;
        newValue = this.currentNode.value;
        this.isOperator = false;
      }
      console.log(this.currentNode);
    } else {
      if (newValue === '') {
        this.node = null;
        this.currentNode = this.node;
      }
    }

    if (this.currentNode) this.currentNode.value = newValue;
  }

  solve(node = this.node) {
    if (!node) return 0;

    if (node.left && node.right) {
      const leftValue = this.solve(node.left) || '0';
      const rightValue = this.solve(node.right) || '0';

      if (node.value === 'div' && rightValue === 0) throw new Error('Division by zero');

      return +(CalculatorModel.operators[node.value](leftValue, rightValue).toFixed(4));
    } else {
      return +(parseFloat(node.value).toFixed(4));
    }
  }
}

export default CalculatorModel;
