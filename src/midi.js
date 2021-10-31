import Sample from './sample.js'

export default class Midi {
	playback;
	midiAccess;
	sample;
	outputPortId;

	constructor() {
		this.sample = new Sample();
		navigator.requestMIDIAccess({ sysex: true })
			.then( (access) => {
				this.onMIDISuccess(access);				
			})
			.catch(error => {
				this.onMIDIFailure(error);
			});			
	}

	setPlaybackInstance(playbackInstance) {
		this.playback = playbackInstance;
	}

	onMIDISuccess( midiAccess ) {
		this.midiAccess = midiAccess;
		console.log(midiAccess);
						
		this.availableInputPorts(midiAccess);
		this.availableOutputPorts(midiAccess);
	}
	
	availableInputPorts(midiAccess) {
		const inputs = midiAccess.inputs;
		inputs.forEach( ( port, key ) => {
			port.onmidimessage = (event) => { this.onMIDIMessage(event) };
			port.onstatechange = (event) => { this.onStateChange(event) };
		});
	}
	
	availableOutputPorts(midiAccess) {
		const outputs = midiAccess.outputs;
		
		outputs.forEach( ( port, key ) => {
			port.onstatechange = (event) => { this.onStateChange(event) };
			this.sendNote(midiAccess, port.id, 60);
			this.outputPortId = port.id;
		});		
	}

	onMIDIFailure(error) {
		console.log(error);
	}

	onMIDIMessage( event ) {
		// Mask off the lower nibble (MIDI channel, which we don't care about)
		switch (event.data[0] & 0xf0) {
			// NOTE ON
			case 0x90:
				if (event.data[2]!=0) {  // if velocity != 0, this is a note-on message
					// this.playback.noteOn(event.data[1]);
					this.playback.playKey(event.data[1]);
					// this.sample.playNote(event.data[1])
					return;
				}
				// if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
			// NOTE OFF
			case 0x80:
				// this.playback.noteOff(event.data[1]);
				this.playback.stopKey(event.data[1]);
				// this.sample.releaseNote(event.data[1])
				return;
		}		
	}
	
	onStateChange(event) {
		console.log('onStateChange:', event);
	}

	startLoggingMIDIInput( midiAccess, indexOfPort ) {
		console.log(midiAccess.inputs);
	}		
	
	sendNote( midiAccess, portID, note ) {		
		// NOTE ON  = 0x90
		// NOTE OFF = 0x80

		var noteOnMessage = [0x90, note, 0x7f];    // note on, middle C, full velocity
		var output = midiAccess.outputs.get(portID);
		output.send( noteOnMessage );  //omitting the timestamp means send immediately.
		output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,  																																					// release velocity = 64, timestamp = now + 1000ms.
	}
}