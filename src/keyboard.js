export default class Keyboard {
  keys;

  constructor() {
    this.initKeyboard();
  }

  getElementByNote(note) {
    return note && document.querySelector(`[note="${note}"]`);
  }

  initKeyboard() {
    this.keys = {
      // OCTAVE 0
      21: { element: this.getElementByNote("A0"), note: "A0"},
      22: { element: this.getElementByNote("A0#"), note: "A0#"},
      23: { element: this.getElementByNote("B0"), note: "B0" },

      // OCTAVE 1
      24: { element: this.getElementByNote("C1"), note: "C1"},
      25: { element: this.getElementByNote("C1#"), note: "C1#"},
      26: { element: this.getElementByNote("D1"), note: "D1"},
      27: { element: this.getElementByNote("D1#"), note: "D1#"},
      28: { element: this.getElementByNote("E1"), note: "E1"},
      29: { element: this.getElementByNote("F1"), note: "F1"},
      30: { element: this.getElementByNote("F1#"), note: "F1#"},
      31: { element: this.getElementByNote("G1"), note: "G1"},
      32: { element: this.getElementByNote("G1#"), note: "G1#"},
      33: { element: this.getElementByNote("A1"), note: "A1"},
      34: { element: this.getElementByNote("A1#"), note: "A1#"},
      35: { element: this.getElementByNote("B1"), note: "B1" },

      // OCTAVE 2
      36: { element: this.getElementByNote("C2"), note: "C2"},
      37: { element: this.getElementByNote("C2#"), note: "C2#"},
      38: { element: this.getElementByNote("D2"), note: "D2"},
      39: { element: this.getElementByNote("D2#"), note: "D2#"},
      40: { element: this.getElementByNote("E2"), note: "E2"},
      41: { element: this.getElementByNote("F2"), note: "F2"},
      42: { element: this.getElementByNote("F2#"), note: "F2#"},
      43: { element: this.getElementByNote("G2"), note: "G2"},
      44: { element: this.getElementByNote("G2#"), note: "G2#"},
      45: { element: this.getElementByNote("A2"), note: "A2"},
      46: { element: this.getElementByNote("A2#"), note: "A2#"},
      47: { element: this.getElementByNote("B2"), note: "B2" },

      // OCTAVE 3
      48: { element: this.getElementByNote("C3"), note: "C3"},
      49: { element: this.getElementByNote("C3#"), note: "C3#"},
      50: { element: this.getElementByNote("D3"), note: "D3"},
      51: { element: this.getElementByNote("D3#"), note: "D3#"},
      52: { element: this.getElementByNote("E3"), note: "E3"},
      53: { element: this.getElementByNote("F3"), note: "F3"},
      54: { element: this.getElementByNote("F3#"), note: "F3#"},
      55: { element: this.getElementByNote("G3"), note: "G3"},
      56: { element: this.getElementByNote("G3#"), note: "G3#"},
      57: { element: this.getElementByNote("A3"), note: "A3"},
      58: { element: this.getElementByNote("A3#"), note: "A3#"},
      59: { element: this.getElementByNote("B3"), note: "B3" },

      // OCTAVE 4
      60: { element: this.getElementByNote("C4"), note: "C4"},
      61: { element: this.getElementByNote("C4#"), note: "C4#"},
      62: { element: this.getElementByNote("D4"), note: "D4"},
      63: { element: this.getElementByNote("D4#"), note: "D4#"},
      64: { element: this.getElementByNote("E4"), note: "E4"},
      65: { element: this.getElementByNote("F4"), note: "F4"},
      66: { element: this.getElementByNote("F4#"), note: "F4#"},
      67: { element: this.getElementByNote("G4"), note: "G4"},
      68: { element: this.getElementByNote("G4#"), note: "G4#"},
      69: { element: this.getElementByNote("A4"), note: "A4"},
      70: { element: this.getElementByNote("A4#"), note: "A4#"},
      71: { element: this.getElementByNote("B4"), note: "B4"},

      // OCTAVE 5
      72: { element: this.getElementByNote("C5"), note: "C5"},
      73: { element: this.getElementByNote("C5#"), note: "C5#"},
      74: { element: this.getElementByNote("D5"), note: "D5"},
      75: { element: this.getElementByNote("D5#"), note: "D5#"},
      76: { element: this.getElementByNote("E5"), note: "E5"},
      77: { element: this.getElementByNote("F5"), note: "F5"},
      78: { element: this.getElementByNote("F5#"), note: "F5#"},
      79: { element: this.getElementByNote("G5"), note: "G5"},
      80: { element: this.getElementByNote("G5#"), note: "G5#"},
      81: { element: this.getElementByNote("A5"), note: "A5"},
      82: { element: this.getElementByNote("A5#"), note: "A5#"},
      83: { element: this.getElementByNote("B5"), note: "B5"},

      // OCTAVE 6
      84: { element: this.getElementByNote("C6"), note: "C6"},
      85: { element: this.getElementByNote("C6#"), note: "C6#"},
      86: { element: this.getElementByNote("D6"), note: "D6"},
      87: { element: this.getElementByNote("D6#"), note: "D6#"},
      88: { element: this.getElementByNote("E6"), note: "E6"},
      89: { element: this.getElementByNote("F6"), note: "F6"},
      90: { element: this.getElementByNote("F6#"), note: "F6#"},
      91: { element: this.getElementByNote("G6"), note: "G6"},
      92: { element: this.getElementByNote("G6#"), note: "G6#"},
      93: { element: this.getElementByNote("A6"), note: "A6"},
      94: { element: this.getElementByNote("A6#"), note: "A6#"},
      95: { element: this.getElementByNote("B6"), note: "B6"},

      // OCTAVE 7
      96: { element: this.getElementByNote("C7"), note: "C7"},
      97: { element: this.getElementByNote("C7#"), note: "C7#"},
      98: { element: this.getElementByNote("D7"), note: "D7"},
      99: { element: this.getElementByNote("D7#"), note: "D7#"},
      100: { element: this.getElementByNote("E7"), note: "E7"},
      101: { element: this.getElementByNote("F7"), note: "F7"},
      102: { element: this.getElementByNote("F7#"), note: "F7#"},
      103: { element: this.getElementByNote("G7"), note: "G7"},
      104: { element: this.getElementByNote("G7#"), note: "G7#"},
      105: { element: this.getElementByNote("A7"), note: "A7"},
      106: { element: this.getElementByNote("A7#"), note: "A7#"},
      107: { element: this.getElementByNote("B7"), note: "B7"},

      // OCTAVE 8
      108: { element: this.getElementByNote("C8"), note: "C8"},
    };
  }

  getKeys() {
    return this.keys;
  }
}