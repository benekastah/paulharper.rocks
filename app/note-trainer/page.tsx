"use client";

import { useCallback } from "react";
import { Accidental, allAccidentals, getRandomNote } from "./Note";
import RandomTrainer from "./RandomTrainer";
import useLocalStorage from "../hooks/useLocalStorage";
import { ChordType, getRandomChord } from "./Chord";
import styles from "./noteTrainer.module.css";
import { MetronomeConfig } from "./MetronomeConfig";

function getDefaultEnabledAccidentals(): Record<Accidental, boolean> {
  return {
    [Accidental.Natural]: true,
    [Accidental.Sharp]: true,
    [Accidental.Flat]: true,
    [Accidental.None]: true,
  };
}

function getDefaultEnabledChords(): Record<ChordType, boolean> {
  return {
    [ChordType.Major]: true,
    [ChordType.Minor]: true,
  };
}

export default function Page() {
  const [chordMode, setChordMode] = useLocalStorage<boolean>('NoteTrainer.chordMode', false);

  const [beats, setBeats] = useLocalStorage('NoteTrainer.beats', 6);
  const [bpm, setBpm] = useLocalStorage('NoteTrainer.bpm', 60);

  const [enabledAccidentals, setEnabledAccidentals] = useLocalStorage<Record<Accidental, boolean>>(
    'NoteTrainer.enabledAccidentals', getDefaultEnabledAccidentals())
  const [enabledChords, setEnabledChords] = useLocalStorage<Record<ChordType, boolean>>(
    'NoteTrainer.enabledChords', getDefaultEnabledChords());

  const onAccidentalEnabledChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>, name: Accidental) => {
    const newEnabledAccidentals = { ...enabledAccidentals, [name]: ev.target.checked };
    if (!Object.values(newEnabledAccidentals).some(Boolean)) {
      return;
    }
    setEnabledAccidentals(newEnabledAccidentals);
  }, [enabledAccidentals, setEnabledAccidentals]);

  const onChordEnabledChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>, name: ChordType) => {
    const newEnabledChords = { ...enabledChords, [name]: ev.target.checked };
    if (!Object.values(newEnabledChords).some(Boolean)) {
      return;
    }
    setEnabledChords(newEnabledChords);
  }, [enabledChords, setEnabledChords]);

  const generator = useCallback(() => chordMode ? 
    getRandomChord(enabledAccidentals, enabledChords) :
    getRandomNote(enabledAccidentals), [chordMode, enabledAccidentals, enabledChords]);

  return <div className="flex min-h-scnpx create-next-app@latestreen flex-col justify-between w-full">
    <h2>Note Trainer</h2>

    <section className={styles.content}>
      <div className={styles.settings}>
        <div className={styles.form}>
          <div>
            <h3>Accidentals</h3>
            <div className="flex">
              {Object.keys(Accidental).map((name) => {
                return <div key={name} className="mr-2">
                  <label>
                    {name}&nbsp;
                    <input type="checkbox" name="accidentals" value={name} checked={enabledAccidentals[Accidental[name]]} onChange={(ev) => onAccidentalEnabledChange(ev, Accidental[name])} />
                  </label>
                </div>;
              })}
            </div>
          </div>

          <div>
            <label>Use chord mode <input type="checkbox" name="chordMode" checked={chordMode} onChange={(ev) => setChordMode(ev.target.checked)} /></label>
          </div>

          {chordMode ?
            <div>
              <h3>Chords</h3>
              <div className="flex">
                {Object.keys(ChordType).map((name) =>
                  <div key={name} className="mr-2">
                    <label>
                      {name}&nbsp;
                      <input type="checkbox" name="chords" value={name} checked={enabledChords[ChordType[name]]} onChange={(ev) => onChordEnabledChange(ev, ChordType[name])} />
                    </label>
                  </div>
                )}
              </div>
            </div> : null}
        </div>

        <MetronomeConfig beats={beats} bpm={bpm} setBeats={setBeats} setBpm={setBpm} />
      </div>

      <RandomTrainer generator={generator} beats={beats} bpm={bpm} />
    </section>
  </div>;
}