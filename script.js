import Calculator from './modules/calculator/calculator.js';
import CreateElement from './modules/createElement.js';
import CEHeading from './modules/custom-elements/heading/heading.js';
import { CEButton, CEIcon } from './modules/custom-elements/init.js';

const app = new CreateElement('div', { id: 'app' });
const calcualtor = new Calculator();
const calculatorKeyboardBtn = new CEButton(
  [new CEIcon('keyboard', { opsz: 40 })],
  { size: 'sm', boxed: true, transparent: true },
  {},
  { click: [() => calcualtor.toggleKeyboard()] },
);

calcualtor.render.emitter.subscribe('toggleKeyboard', (state) => {
  if (state) {
    calculatorKeyboardBtn.setSettings({ ...calculatorKeyboardBtn.settings, variant: 'secondary' });
  } else {
    calculatorKeyboardBtn.setSettings({ ...calculatorKeyboardBtn.settings, variant: null });
  }
});

app.updateChildren([
  new CEHeading({ icon: 'calculate', title: 'CALCULATOR', variant: 'warning' }, { class: ['ce-pos_left', 'ce-pos_top'] }),
  calcualtor.render,
  new CreateElement('span', { class: ['app__note'] }, [
    'You can use your keyboard to type! To do this, click on this button',
    calculatorKeyboardBtn,
  ]),
]);

app.mount(document.body, true);

calcualtor.toggleKeyboard();
calcualtor.focus();
