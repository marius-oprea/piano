import styles from './app.component.scss';
import * as template from './app.component.html';

export class AppComponent extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    const appComponentStyles = document.createElement('style');
    appComponentStyles.textContent = styles;

    const appComponentTemplate = document.createElement('div');
    appComponentTemplate.innerHTML = template.default;

    shadowRoot.appendChild(appComponentTemplate);
    shadowRoot.appendChild(appComponentStyles);
  }
}
customElements.define('app-root', AppComponent);
