"use client";

import { useCallback, useEffect } from "react";
import { Accidental, getAccidentalByName, getRandomNote, Note } from "./Note";
import RandomTrainer from "./RandomTrainer";
import useLocalStorage from "../hooks/useLocalStorage";
import { Chord, ChordType, getChordTypeByName, getRandomChord } from "./Chord";
import styles from "./noteTrainer.module.css";
import { MetronomeConfig } from "./MetronomeConfig";
import { DoublyLinkedList } from "./DoublyLinkedList";
import NoteCircle from "./NoteCircle";

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

  const [settingsOpen, setSettingsOpen] = useLocalStorage('NoteTrainer.settingsOpen', false);

  useEffect(() => {
    setSettingsOpen(screen.width > 414);
  }, []);

  return <div className={`${styles.mainPage} flex min-h-scnpx create-next-app@latestreen flex-col justify-between w-full`}>
    <h2>Note Trainer</h2>

    <section className={styles.content}>
      <details className={styles.settings} open={settingsOpen}>
        <summary>
          <h3>Settings</h3>
        </summary>

        <div className={styles.form}>
          <div>
            <h3>Accidentals</h3>
            <div className="flex">
              {Object.keys(Accidental).map((name) => {
                const accidental = getAccidentalByName(name);
                if (accidental === null) return null;
                return <div key={name} className="mr-2">
                  <label>
                    {name}&nbsp;
                    <input type="checkbox" name="accidentals" value={name} checked={enabledAccidentals[accidental]} onChange={(ev) => onAccidentalEnabledChange(ev, accidental)} />
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
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(ChordType).map((name) => {
                  const chordType = getChordTypeByName(name);
                  if (chordType === null) return null;
                  return <div key={name}>
                    <label>
                      C{chordType}&nbsp;
                      <input type="checkbox" name="chords" value={name} checked={enabledChords[chordType]} onChange={(ev) => onChordEnabledChange(ev, chordType)} />
                    </label>
                  </div>
                })}
              </div>
            </div> : null}
        </div>

        <MetronomeConfig beats={beats} bpm={bpm} setBeats={setBeats} setBpm={setBpm} />
      </details>

      <RandomTrainer generator={generator} beats={beats} bpm={bpm} renderItem={(note: DoublyLinkedList<Note | Chord>, index: number) =>
        <NoteCircle key={note.id} note={note.item} index={index} />
      } />
    </section>
  </div>;
}