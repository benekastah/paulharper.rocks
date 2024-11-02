import { Accidental, Note, getRandomNote } from "./Note";
import { selectRandom } from "./util";

export enum ChordType {
    Major = "",
    Minor = "m",
}

export class Chord {
    root: Note;
    chordType: ChordType;

    constructor(root: Note, chordType: ChordType) {
        this.root = root;
        this.chordType = chordType;
    }
    
    toString() {
        return `${this.root}${this.chordType}`;
    }
}

export function getRandomChord(accidentals: Record<Accidental, boolean>, chordTypes: Record<ChordType, boolean>): Chord {
    const enabledChordTypes: ChordType[] = [];
    for (const key in chordTypes) {
        if (chordTypes[key as ChordType]) {
            enabledChordTypes.push(key as ChordType);
        }
    }
    if (!enabledChordTypes.length) {
        throw new Error('Must contain at least one enabled chord type');
    }

    const root = getRandomNote(accidentals);
    const chordType = selectRandom(enabledChordTypes);
    return new Chord(root, chordType);
}