import Midi from './src/midi.js'

class App {
  constructor() {
    console.log('App');
    const midi = new Midi();
  }
}

const app = new App();