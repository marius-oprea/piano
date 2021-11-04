export default class OSMDHandler {
  osmd;
  playback;
  playbackTimeInterval;
  canPlayVoice;
  allNotes;

  playButtonId;
  stopButtonId;
  pauseButtonId;
  isTutorRunning;
  currentCursorNotes;

  constructor() {
    this.isTutorRunning = false;
    document.getElementById('startTutorId').addEventListener('click', () => {this.startTutor()});
    document.getElementById('stopTutorId').addEventListener('click', () => {this.stopTutor()});
    document.getElementById('playSheetId').addEventListener('click', (event) => {this.playScore(event)}, false);
    document.getElementById('stopSheetId').addEventListener('click', (event) => {this.stopScore()});
    document.getElementById('pauseSheetId').addEventListener('click', (event) => {this.pauseScore()});
    document.getElementById("files").addEventListener("change", (event) => {this.handleFileSelect(event)}, false);
    this.allNotes = [];
  }

  stopTutor() {
    this.isTutorRunning = false;
  }

  startTutor() {
    if (this.osmd) {
      this.isTutorRunning = true;

      document.addEventListener('noteOn', (event) => {
        console.log([ ...this.playback.pressedNotes.keys() ] );

        let difference = this.currentCursorNotes.filter(x => ![ ...this.playback.pressedNotes.keys() ].includes(x));
        if (difference.length === 0) {
          const cursor = this.osmd.cursor;
          cursor.next();
          this.currentCursorNotes = this.getVoices(cursor).map(item => item.note);
        }
      });
      document.addEventListener('noteOff', (event) => {
        console.log([ ...this.playback.pressedNotes.keys() ] );
      });

      const cursor = this.osmd.cursor;
      cursor.show();
      cursor.reset();

      let tutorialNotes = this.allNotes;
      console.log(tutorialNotes);


      this.currentCursorNotes = this.getVoices(cursor).map(item => item.note);
      console.log(this.currentCursorNotes);
    }
  }

  getCursorNotes() {

  }

  playScore() {
    console.log('PLAY SHEET');
    if (this.osmd) {
      const cursor = this.osmd.cursor;
      cursor.show();
      cursor.reset();    

      this.playTimeline();
      this.playAllNotes();
    }
  }
  
  stopScore() {
    if (this.osmd) {
    }
  }

  pauseScore() {
    if (this.osmd) {
    }
  }

  handleFileSelect(evt) {
    var maxOSMDDisplays = 10; // how many scores can be displayed at once (in a vertical layout)
    var files = evt.target.files; // FileList object
    var osmdDisplays = Math.min(files.length, maxOSMDDisplays);
  
    var output = [];
    for (var i=0, file = files[i]; i<osmdDisplays; i++) {
      output.push("<li><strong>", escape(file.name), "</strong> </li>");
      output.push("<div id='osmdCanvas" + i + "'/>");
    }
    document.getElementById("list").innerHTML = "<ul>" + output.join("") + "</ul>";
  
    for (var i=0, file = files[i]; i < osmdDisplays; i++) {
      if (!file.name.match('.*\.xml') && !file.name.match('.*\.musicxml') && false) {
        alert('You selected a non-xml file. Please select only music xml files.');
        continue;
      }

      console.log(this);
  
      var reader = new FileReader();
  
      reader.onload = (e) => {
          var osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmdCanvas", {
            // set options here
            backend: "svg",
            drawFromMeasureNumber: 1,
            drawUpToMeasureNumber: Number.MAX_SAFE_INTEGER // draw all measures, up to the end of the sample
          });
          osmd
            .load(e.target.result)
            .then(
              () => {
                this.osmd = osmd; // give access to osmd object in Browser console, e.g. for osmd.setOptions()
                this.osmd.render();
                // this.playMusicSheet();      
                this.proccessScore();
              }
            );
      };
      if (file.name.match('.*\.mxl')) {
        // have to read as binary, otherwise JSZip will throw ("corrupted zip: missing 37 bytes" or similar)
        reader.readAsBinaryString(file);
      } else {
        reader.readAsText(file);
      }
    }
  }

  proccessScore() {
    this.allNotes = [];
    this.allNotes = this.getAllNotes();
    console.log('score notes', this.allNotes);
  }
  
  playMusicSheet() {
    const cursor = this.osmd.cursor;
    cursor.show();
    cursor.reset();    

    setTimeout(() => {
      this.playTimeline();
      this.playAllNotes();  
    });
  }

  playAllNotes() {
    this.allNotes.forEach(item => {      
      setTimeout(() => {
        this.playback.playKey(item.note);
        setTimeout(() => {
          this.playback.stopKey(item.note);
        }, item.duration * 1000);
      }, item.startTime * 1000);
    });
  }

  playTimeline() {
    this.osmd.cursor.reset();
    this.osmd.cursor.show();

    const timeline = [...new Set(this.allNotes.map(item => item.startTime))];

    console.log(timeline);

    timeline.forEach(item => {
      setTimeout(() => {
        if (this.osmd?.cursor?.interator?.endReached) {
          this.osmd.cursor.reset();
        } else {
          this.osmd.cursor.next();
        }
      }, item * 1000);
    });
  }

  getAllNotes() {
    let notes;
    notes = [];

    while (!this.osmd.cursor.iterator.endReached) {
      let voiceNotes;
      voiceNotes = [];
      voiceNotes = this.getVoices(this.osmd.cursor);
      notes.push(...voiceNotes);
      this.osmd.cursor.iterator.moveToNext();
    }
    return notes;
  }

  getVoices(cursor) {
    let voicesNotes;
    voicesNotes = [];
    const voices = this.osmd.cursor.iterator.CurrentVoiceEntries;
    for (var i = 0; i < voices.length; i++) {
      const v = voices[i];
      const notes = v.notes;
      const bpm = 120;//getBPMAtMeasure(iterator.CurrentMeasureIndex);
      for (let j = 0; j < notes.length; j++) {
        const note = notes[j];
          // make sure our note is not silent
        if ((note != null) && (note.halfTone != 0)) {
            const currentNote = note.halfTone + 12;  // see issue #224
            const currentTime = cursor.iterator.currentTimeStamp.realValue * 4 * 60 / bpm;
            voicesNotes.push({
              "note": currentNote,
              "startTime": currentTime,
              "duration": note.length.realValue
            })
            /*
            this.allNotes.push({
              "note": currentNote,
              "startTime": currentTime,
              "duration": note.length.realValue
            })
            */
        }
      }
    }
    return voicesNotes;
  }
}
