import { Accidental, Note, getRandomNote } from "./Note";
import { selectRandom } from "./util";

export enum ChordType {
    Major = "",
    Minor = "m",
    Dominant7th = "7",
    Dominant7Flat5 = "7♭5",
    Dominant7Sharp5 = "7♯5",
    Major7 = "maj7",
    Minor7 = "min7",
    Ninth = "9",
    MajorNinth = "maj9",
    MinorNinth = "min9",
    Augmented = "aug",
    Diminished = "dim",
    NinthSharp5 = "9♯5",
    NinthFlat5 = "9♭5",
    Augmented9 = "aug9",
    Eleventh = "11",
    Thirteenth = "13",
    ThirteenFlat9 = "13♭9",
    Six9 = "6/9"
}

export function getChordTypeByName(name: string): ChordType | null {
    switch (name) {
        case "Major": return ChordType.Major;
        case "Minor": return ChordType.Minor;
        case "Dominant7th": return ChordType.Dominant7th;
        case "Dominant7Flat5": return ChordType.Dominant7Flat5;
        case "Dominant7Sharp5": return ChordType.Dominant7Sharp5;
        case "Major7": return ChordType.Major7;
        case "Minor7": return ChordType.Minor7;
        case "Ninth": return ChordType.Ninth;
        case "MajorNinth": return ChordType.MajorNinth;
        case "MinorNinth": return ChordType.MinorNinth;
        case "Augmented": return ChordType.Augmented;
        case "Diminished": return ChordType.Diminished;
        case "NinthSharp5": return ChordType.NinthSharp5;
        case "NinthFlat5": return ChordType.NinthFlat5;
        case "Augmented": return ChordType.Augmented;
        case "Eleventh": return ChordType.Eleventh;
        case "Thirteenth": return ChordType.Thirteenth;
        case "ThirteenFlat9": return ChordType.ThirteenFlat9;
        case "Six9": return ChordType.Six9;
    }
    return null;
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