import Sample from './sample.js'

export default class Midi {
	// var midi = null;  // global MIDIAccess object	
	playback;
	midiAccess;
	sample;

	constructor() {
		console.log('Midi');
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
		console.log('midi playback instance', this.playback);
	}

	onMIDISuccess( midiAccess ) {
		this.midiAccess = midiAccess;
		console.log( "MIDI ready!" );
		// midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
		console.log(midiAccess);
		// listInputsAndOutputs(midiAccess);
		// startLoggingMIDIInput(midiAccess);
		// sendMiddleC(midiAccess, 0);
						
		this.availableInputPorts(midiAccess);
		this.availableOutputPorts(midiAccess);
	}
	
	availableInputPorts(midiAccess) {
		const inputs = midiAccess.inputs;
		// var numberOfMIDIInputs = inputs.size;
		
		console.log(inputs);

		// add each of the ports to a <select> box
		inputs.forEach( ( port, key ) => {
			//var opt = document.createElement("option");
			//opt.text = port.name;
			//document.getElementById("inputportselector").add(opt);
			console.log('input port: ', port);
			console.log('input key: ', key);
			
			port.onmidimessage = (event) => { this.onMIDIMessage(event) };
			port.onstatechange = (event) => { this.onStateChange(event) };
		});

		// or you could express in ECMAScript 6 as:
		// for (let input of inputs.values()) {
			// var opt = document.createElement("option");
			// opt.text = input.name;
			// document.getElementById("inputportselector").add(opt);
			// console.log(input.name);
		// }		
	}
	
	availableOutputPorts(midiAccess) {
		const outputs = midiAccess.outputs;
		console.log(outputs);
		
		outputs.forEach( ( port, key ) => {
			//var opt = document.createElement("option");
			//opt.text = port.name;
			//document.getElementById("inputportselector").add(opt);
			console.log('output port: ', port);
			console.log('output key: ', key);
			
			// port.onmidimessage = this.onMIDIMessage;
			port.onstatechange = (event) => { this.onStateChange(event) };
			
			console.log('port Id: ', port.id);
			this.sendMiddleC(midiAccess, port.id);
		});		
	}

	onMIDIFailure(error) {
		console.log(error);
	}


/*
	function listInputsAndOutputs( midiAccess ) {
		
		
		for (var input in midiAccess.inputs) {
			console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
				"' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
				"' version:'" + input.version + "'" );
		}

		for (var output in midiAccess.outputs) {
			console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
				"' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
				"' version:'" + output.version + "'" );
		}
	}
*/		
	onMIDIMessage( event ) {
		console.log('onMIDIMessage:', event);
		/*
		var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
		for (var i=0; i<event.data.length; i++) {
			str += "0x" + event.data[i].toString(16) + " ";
		}
		console.log( str );
		*/

      // Mask off the lower nibble (MIDI channel, which we don't care about)
      switch (event.data[0] & 0xf0) {
        case 0x90:
          if (event.data[2]!=0) {  // if velocity != 0, this is a note-on message
            // this.playback.noteOn(event.data[1]);
						this.sample.playNote(event.data[1])
            return;
          }
          // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
        case 0x80:
          // this.playback.noteOff(event.data[1]);
					this.sample.releaseNote(event.data[1])
          return;
      }		
	}
	
	onStateChange(event) {
		console.log('onStateChange:', event);
	}

	startLoggingMIDIInput( midiAccess, indexOfPort ) {
		console.log(midiAccess.inputs);
		// midiAccess.inputs.forEach( function(entry) {entry.value.onmidimessage = onMIDIMessage;});
	}		
	
	sendMiddleC( midiAccess, portID ) {
		console.log('portId', portID);
		
		var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
		var output = midiAccess.outputs.get(portID);
		output.send( noteOnMessage );  //omitting the timestamp means send immediately.
		output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,  																																					// release velocity = 64, timestamp = now + 1000ms.
	}	
}