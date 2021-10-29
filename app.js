import Midi from './src/midi.js'
import SVG from './src/svg.js';
import File from './src/file.js'
import Playback from './src/playback.js';

class App {
  midi;

  constructor() {
    console.log('App');
    const svg = new SVG();
    const file = new File();
    this.midi = new Midi();

    file.uploadFile('fileUpload');
    file.downloadFile('fileDownload');

    this.listenForEvents('playId');
  }

  onClick(event) {
    console.log('click', event);
  }

  listenForEvents(playButtonId) {
    const playButton = document.getElementById(playButtonId);
    playButton.onclick = () => {
      const playback = new Playback();
      playback.initSynthesizer();

      console.log('playback instance', playback);
      this.midi.setPlaybackInstance(playback);
    };
  }  
}

const app = new App();