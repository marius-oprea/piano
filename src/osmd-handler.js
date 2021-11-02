export default class OSMDHandler {
  osmd;
  playback;
  playbackTimeInterval;
  canPlayVoice;
  allNotes;

  constructor() {
    document.getElementById("files").addEventListener("change", (event) => {this.handleFileSelect(event)}, false);
    this.allNotes = [];
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
                this.playMusicSheet();        
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
  
  playMusicSheet() {
    this.allNotes = [];
    const cursor = this.osmd.cursor;
    cursor.show();
    cursor.reset();
    
    this.getAllNotes();
    this.playTimeline();
    this.playAllNotes();
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
    while(!this.osmd.cursor.iterator.endReached) {
      this.getVoices(this.osmd.cursor);
      this.osmd.cursor.iterator.moveToNext();
    }
  }

  getVoices(cursor) {
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
            
            this.allNotes.push({
              "note": currentNote,
              "startTime": currentTime,
              "duration": note.length.realValue
            })
        }
      }
    }
  }
}
