import {selectRandom} from './util';

export enum NoteName {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
}

export const allNoteNames: NoteName[] = [NoteName.A, NoteName.B, NoteName.C, NoteName.D, NoteName.E , NoteName.F, NoteName.G];

export enum Accidental {
    Sharp = "♯",
    Natural = "♮",
    Flat = "♭",
    None =  "",
}

export const allAccidentals: Accidental[] = [Accidental.Sharp, Accidental.Flat, Accidental.Natural, Accidental.None];

export class Note {
    name: NoteName;
    accidental: Accidental;

    constructor(name: NoteName, accidental: Accidental) {
        this.name = name;
        this.accidental = accidental;
    }

    toString() {
        return `${this.name}${this.accidental}`;
    }
}


export function getRandomNote(accidentals: Record<Accidental, boolean>): Note {
    const enabledAccidentals: Accidental[] = [];
    for (const key in accidentals) {
        if (accidentals[key as Accidental]) {
            enabledAccidentals.push(key as Accidental);
        }
    }
    if (!enabledAccidentals.length) {
        throw new Error('Must contain at least one enabled accidental');
    }
    return new Note(selectRandom(allNoteNames), selectRandom(enabledAccidentals));
}