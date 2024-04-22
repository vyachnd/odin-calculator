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
const calcualtorNote = new CreateElement('span', { class: ['app__note', 'ce-pos_bottom'] }, [
  'You can use your keyboard to type! To do this, click on this button',
  calculatorKeyboardBtn,
]);

calcualtor.render.emitter.subscribe('toggleKeyboard', (state) => {
  if (state) {
    calculatorKeyboardBtn.setSettings({ ...calculatorKeyboardBtn.settings, variant: 'secondary' });
  } else {
    calculatorKeyboardBtn.setSettings({ ...calculatorKeyboardBtn.settings, variant: null });
  }
});

app.mount(document.body, true);
app.updateChildren([
  new CEHeading({ icon: 'calculate', title: 'CALCULATOR', variant: 'warning' }),
  new CreateElement('div', { class: ['app__container', 'ce-pos_center'] }, [
    calcualtor.render,
    calcualtorNote,
  ]),
]);

calcualtor.toggleKeyboard();
calcualtor.focus();
