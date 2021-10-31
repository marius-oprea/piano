export default class Playback {
  audioContext;
  oscillator;  // the single oscillator
  envelope;    // the envelope for the single oscillator
  attack;      // attack speed
  release;   // release speed
  portamento;  // portamento/glide speed
  activeNotes; // the stack of actively-pressed keys  
  pressedNotes;

  constructor() {
    this.pressedNotes = new Map();
  }

  initSynthesizer() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.attack = 0.05;
    this.release = 0.05;
    this.portamento = 0.05;
    this.activeNotes = [];

    this.playKey(60);
  }

	playNote(frequency, volume, duration) {
    var halfPeriod = 1/frequency/2;
    if (duration > halfPeriod) {
       duration -= duration % halfPeriod;
    }
    else {
      duration = halfPeriod;
    }

    var g = this.audioContext.createGain();
    var o = this.audioContext.createOscillator();
    o.connect(g);
    g.connect(this.audioContext.destination); // so you actually hear the output

    o.frequency.value = frequency;
    g.gain.value = volume;
    o.start(0);
    o.stop(this.audioContext.currentTime + duration);
	}

  // https://en.wikipedia.org/wiki/Piano_key_frequencies
  frequencyFromNoteNumber( note ) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  playKeyOldVersion(note) { 
    const osc = this.audioContext.createOscillator();
    const noteGainNode = this.audioContext.createGain();
    noteGainNode.connect(this.audioContext.destination);
    noteGainNode.gain.value = 0.5;
    osc.connect(noteGainNode);
    // osc.type = "triangle";
    osc.type = "square";
  
    osc.frequency.value = this.frequencyFromNoteNumber(note);
  
    this.pressedNotes.set(note, osc);
    this.pressedNotes.get(note).start();
  }

  playKey(note) {
    const osc = this.audioContext.createOscillator();
    const noteGainNode = this.audioContext.createGain();
    noteGainNode.connect(this.audioContext.destination);
  
    const zeroGain = 0.00001;
    const maxGain = 1;// 0.5;
    const sustainedGain = 0.01// 0.001;
  
    noteGainNode.gain.value = zeroGain;
  
    const setAttack = () =>
      noteGainNode.gain.exponentialRampToValueAtTime(
        maxGain,
        this.audioContext.currentTime + 0.01
      );
    const setDecay = () =>
      noteGainNode.gain.exponentialRampToValueAtTime(
        sustainedGain,
        this.audioContext.currentTime + 1
      );
    const setRelease = () =>
      noteGainNode.gain.exponentialRampToValueAtTime(
        zeroGain,
        this.audioContext.currentTime + 2
      );
  
    setAttack();
    setDecay();
    setRelease();
  
    osc.connect(noteGainNode);
    // osc.type = "triangle";
    osc.type = "square";
  
    osc.frequency.value = this.frequencyFromNoteNumber(note);
    
    this.pressedNotes.set(note, osc);
    this.pressedNotes.get(note).start();
  }

  stopKey(note) {  
    const osc = this.pressedNotes.get(note);
    
    if (osc) {
      osc.stop();  
      this.pressedNotes.delete(note);
    }
  }

  noteOn(noteNumber) {
    this.activeNotes.push( noteNumber );
    this.oscillator.frequency.cancelScheduledValues(0);    
    this.oscillator.type = 'square';

    this.oscillator.frequency.setTargetAtTime( this.frequencyFromNoteNumber(noteNumber), 0, this.portamento );
    this.envelope.gain.cancelScheduledValues(0);
    this.envelope.gain.setTargetAtTime(1.0, 0, this.attack);
  }

  noteOff(noteNumber) {
    var position = this.activeNotes.indexOf(noteNumber);
    if (position!=-1) {
      this.activeNotes.splice(position,1);
    }
    if (this.activeNotes.length==0) {  // shut off the envelope
      this.envelope.gain.cancelScheduledValues(0);
      this.envelope.gain.setTargetAtTime(0.0, 0, this.release );
    } else {
      this.oscillator.frequency.cancelScheduledValues(0);
      this.oscillator.frequency.setTargetAtTime( this.frequencyFromNoteNumber(this.activeNotes[this.activeNotes.length-1]), 0, this.portamento );
    }
  }
}