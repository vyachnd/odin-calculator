import CalculatorController from './controller.js';
import CalculatorModel from './model.js';
import CalculatorRender from './render.js';

export default function Calculator() {
  const model = new CalculatorModel();
  const render = new CalculatorRender(model, {});
  const controller = new CalculatorController(model, render);

  return controller;
}
