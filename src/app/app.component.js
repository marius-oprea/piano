import * as MyStyle from './app.component.scss';
import * as MyTemplate from './app.component.html';

export class AppComponent extends HTMLElement {
  constructor() {
    console.log('AppComponent');
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});

    const t = MyTemplate;
    const s = MyStyle;

    console.log(s.default);
    console.log(t.default);
    let template = document.createElement('div');
    template.innerHTML = t.default;
    template.style = s.default;
    shadowRoot.append(template);
  }
}
customElements.define('app-root', AppComponent);
