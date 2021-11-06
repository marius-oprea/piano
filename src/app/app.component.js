import styles from './app.component.scss';
import * as MyTemplate from './app.component.html';

export class AppComponent extends HTMLElement {
  constructor() {
    console.log('AppComponent');
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});

    const t = MyTemplate;

    const style = document.createElement('style');

    console.log(styles);
    style.textContent = styles;

    const template = document.createElement('div');
    template.innerHTML = t.default;
    template.style.textContent = style;
    shadowRoot.appendChild(template);
    shadowRoot.appendChild(style);
  }
}
customElements.define('app-root', AppComponent);
