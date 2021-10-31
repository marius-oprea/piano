import Midi from './src/midi.js'
import SVG from './src/svg.js';
import File from './src/file.js'
import Playback from './src/playback.js';
import Keyboard from './src/keyboard.js';

class App {
  midi;
  isMidiPlayback;

  constructor() {
    const svg = new SVG();
    const file = new File();
    this.midi = new Midi();

    file.uploadFile('fileUpload');
    file.downloadFile('fileDownload');

    this.listenForEvents('playId');
  }

  listenForEvents(playButtonId) {
    const playButton = document.getElementById(playButtonId);
    let clickedKey;

    playButton.onclick = () => {
      const playback = new Playback();
      playback.initSynthesizer();
      this.midi.setPlaybackInstance(playback);
      const keyboard = new Keyboard();
      const keys = keyboard.keys;
  
      for (const [key, { element }] of Object.entries(keyboard.getKeys())) {
        if (element !== undefined) {
          element.addEventListener("mousedown", () => {
            if (this.isMidiPlayback) {
              this.midi.sendNote(this.midi.midiAccess, this.midi.outputPortId, key);
            } else {
              playback.playKey(key);
            }
            keys[key].element.classList.add("pressed");
            clickedKey = key;
          });
        }
      }
      
      document.getElementById('keyboard').addEventListener("mouseup", () => {
        if (this.isMidiPlayback) {
        } else {
          playback.stopKey(clickedKey);
        }
        keys[clickedKey].element.classList.remove("pressed");
      });

      document.getElementById('isMidiId').addEventListener('change', (event) => {
        console.log(event.target.checked);
        this.isMidiPlayback = event.target.checked;
      });
    };    
  }  
}

const app = new App();