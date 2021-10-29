export default class Playback {
  audio;
  context;
  oscillator;  // the single oscillator
  envelope;    // the envelope for the single oscillator
  attack;      // attack speed
  release;   // release speed
  portamento;  // portamento/glide speed
  activeNotes; // the stack of actively-pressed keys  

  constructor() {
    console.log('Playback');
  }

  initSynthesizer() {
    this.audio = new (window.AudioContext || window.webkitAudioContext)();
    this.context = new AudioContext();
    this.attack = 0.05;
    this.release = 0.05;
    this.portamento = 0.05;
    this.activeNotes = [];

    // set up the basic oscillator chain, muted to begin with.
    this.oscillator = this.context.createOscillator();
    this.oscillator.frequency.setValueAtTime(110, 0);
    this.envelope = this.context.createGain();
    this.oscillator.connect(this.envelope);
    this.envelope.connect(this.context.destination);
    this.envelope.gain.value = 0.0;  // Mute the sound
    this.oscillator.start(0);  // Go ahead and start up the oscillator  
    
    this.playNote(60, 1, 1);
  }

	playNote(frequency, volume, duration) {
    var halfPeriod = 1/frequency/2;
    if (duration > halfPeriod) {
       duration -= duration % halfPeriod;
    }
    else {
      duration = halfPeriod;
    }

    var g = this.audio.createGain();
    var o = this.audio.createOscillator();
    o.connect(g);
    g.connect(this.audio.destination); // so you actually hear the output

    o.frequency.value = frequency;
    g.gain.value = volume;
    o.start(0);
    o.stop(this.audio.currentTime + duration);
	}

  frequencyFromNoteNumber( note ) {
    return 440 * Math.pow(2,(note-69)/12);
  }

  noteOn(noteNumber) {
    this.activeNotes.push( noteNumber );
    this.oscillator.frequency.cancelScheduledValues(0);
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