import Midi from './src/midi.js'
import SVG from './src/svg.js';
import File from './src/file.js'
import Playback from './src/playback.js';
import Keyboard from './src/keyboard.js';

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
    let clickedKey;

    playButton.onclick = () => {
      const playback = new Playback();
      playback.initSynthesizer();

      console.log('playback instance', playback);
      this.midi.setPlaybackInstance(playback);


      const keyboard = new Keyboard();
      const keys = keyboard.keys;
  
      for (const [key, { element }] of Object.entries(keyboard.getKeys())) {
        console.log(`key ${key} element ${element}`);
        if (element !== undefined) {
          console.log('', element);
          element.addEventListener("mousedown", () => {
            playback.playKey(key);
            keys[key].element.classList.add("pressed");
            clickedKey = key;
          });
        }
      }
      
      document.addEventListener("mouseup", () => {
        playback.stopKey(clickedKey);
        keys[clickedKey].element.classList.remove("pressed");
      });      
    };    
  }  
}

const app = new App();