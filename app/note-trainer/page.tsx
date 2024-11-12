"use client";

import { ReactElement, useCallback, useEffect, useState } from "react";
import { Accidental, getAccidentalByName, getRandomNote, Note } from "./Note";
import RandomTrainer from "./RandomTrainer";
import useLocalStorage from "../hooks/useLocalStorage";
import { Chord, ChordType, getChordTypeByName, getRandomChord } from "./Chord";
import styles from "./noteTrainer.module.css";
import { MetronomeConfig } from "./MetronomeConfig";
import { DoublyLinkedList } from "./DoublyLinkedList";
import NoteCircle from "./NoteCircle";
import ChordCircle from "./ChordCircle";

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
    [ChordType.Dominant7th]: false,
    [ChordType.Dominant7Flat5]: false,
    [ChordType.Dominant7Sharp5]: false,
    [ChordType.Major7]: false,
    [ChordType.Minor7]: false,
    [ChordType.Ninth]: false,
    [ChordType.MajorNinth]: false,
    [ChordType.MinorNinth]: false,
    [ChordType.Augmented]: false,
    [ChordType.Diminished]: false,
    [ChordType.NinthSharp5]: false,
    [ChordType.NinthFlat5]: false,
    [ChordType.Augmented9]: false,
    [ChordType.Eleventh]: false,
    [ChordType.Thirteenth]: false,
    [ChordType.ThirteenFlat9]: false,
    [ChordType.Six9]: false,
  };
}

export default function Page() {
  const [play, setPlay] = useState(false);
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

  const noteGenerator = useCallback(
    () => getRandomNote(enabledAccidentals),
    [enabledAccidentals]);

  const chordGenerator = useCallback(
    () => getRandomChord(enabledAccidentals, enabledChords),
    [enabledAccidentals, enabledChords]);

  const [settingsOpen, setSettingsOpen] = useLocalStorage('NoteTrainer.settingsOpen', false);

  useEffect(() => {
    setSettingsOpen(screen.width >= 1000);
  }, []);

  const renderNoteCircle = useCallback((note: DoublyLinkedList<Note>, index: number) =>
    <NoteCircle key={note.id} note={note.item} index={index} />
  , []);

  const renderChordCircle = useCallback((note: DoublyLinkedList<Chord>, index: number) =>
    <ChordCircle key={note.id} chord={note.item} index={index} />
  , []);

  const randomGeneratorCommonProps = {
    beats, bpm, play, setPlay
  };

  return <div className={`${styles.mainPage} flex min-h-scnpx create-next-app@latestreen flex-col justify-between w-full`}>
    <h2>Note Trainer</h2>

    <section className={styles.content}>
      <details className={styles.settings} open={settingsOpen}>
        <summary>
          <h3>Settings</h3>
        </summary>

        <MetronomeConfig beats={beats} bpm={bpm} setBeats={setBeats} setBpm={setBpm} />

        <div className={styles.form}>
          <div>
            <h3>Accidentals</h3>
            <p className={styles.helptext}>Which accidentals to use when generating random notes.</p>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(Accidental).map((name) => {
                const accidental = getAccidentalByName(name);
                if (accidental === null) return null;
                return <div key={name}>
                  <label>
                    <input
                      type="checkbox" name="accidentals" value={name} checked={enabledAccidentals[accidental]}
                      onChange={(ev) => onAccidentalEnabledChange(ev, accidental)}
                    /> C{accidental}
                  </label>
                </div>;
              })}
            </div>
          </div>

          <div>
            <p className={styles.helptext}>Check this if you want to practice random chords.</p>
            <label><input type="checkbox" name="chordMode" checked={chordMode} onChange={(ev) => setChordMode(ev.target.checked)} />&nbsp;Use chord mode</label>
          </div>

          {chordMode ?
            <div>
              <h3>Chords</h3>
              <p className={styles.helptext}>Which chords types to use when generating random chords.</p>
              <div className="grid grid-cols-4 gap-4">
                {Object.keys(ChordType).map((name) => {
                  const chordType = getChordTypeByName(name);
                  if (chordType === null) return null;
                  return <div key={name}>
                    <label>
                      <input type="checkbox" name="chords" value={name} checked={enabledChords[chordType]} onChange={(ev) => onChordEnabledChange(ev, chordType)} />
                      &nbsp;C{chordType}
                    </label>
                  </div>;
                })}
              </div>
            </div> : null}
        </div>
      </details>

      {chordMode ?
        <RandomTrainer {...randomGeneratorCommonProps} generator={chordGenerator} renderItem={renderChordCircle} /> :
        <RandomTrainer {...randomGeneratorCommonProps} generator={noteGenerator} renderItem={renderNoteCircle} />
      }
    </section>
  </div>;
}