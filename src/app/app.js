import "../style.scss";

import Midi from './midi.js'
import SVG from './svg.js';
import File from './file.js'
import Playback from './playback.js';
import Keyboard from './keyboard.js';
import OSMDHandler from './osmd-handler.js';

export default class App extends HTMLElement {
  midi;
  osmdHandler;
  isMidiPlayback;
  showTutorKeys;

  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({mode: 'open'});

    const svg = new SVG();
    // const file = new File();
    this.midi = new Midi();
    this.osmdHandler = new OSMDHandler();
    this.osmdHandler.playButtonId = 'playSheetId';
    this.osmdHandler.stopButtonId = 'stopSheetId';
    this.osmdHandler.pauseButtonId = 'pauseSheetId';

    // file.uploadFile('fileUpload');
    // file.downloadFile('fileDownload');

    this.init();

    // Attach the created elements to the shadow dom
    // shadow.appendChild(style);
    // console.log(style.isConnected);
    // shadow.appendChild(wrapper);
    // wrapper.appendChild(icon);
    // wrapper.appendChild(info);    
  }

  init() {
    document.getElementById('connectId').addEventListener('click', event => {
      this.midi.connectToMIDI();
    });
    
    let clickedKey;

    const keyboard = new Keyboard();
    const keys = keyboard.keys;
    const playback = new Playback();
    playback.keyboard = keyboard;
    playback.initSynthesizer();
    this.midi.setPlaybackInstance(playback);
    this.osmdHandler.playback = playback;
    this.osmdHandler.keyboard = keyboard;

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
      this.isMidiPlayback = event.target.checked;
      if (this.midi) {
        this.midi.isPlaybackSound = this.isMidiPlayback;
      }
    });

    document.getElementById('showTutorKeysId').addEventListener('change', (event) => {
      this.showTutorKeys = event.target.checked;
      if (this.showTutorKeys) {
        this.osmdHandler.showTutorKeys = this.showTutorKeys;
      }
    });    
  }  
}

// Define the new element
customElements.define('app-root', App);