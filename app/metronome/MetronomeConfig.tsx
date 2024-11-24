import React, { useCallback, useState } from "react";
import formStyles from '../forms.module.css';
import styles from './metronome.module.css';
import Input from "../components/Input";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";

const MIN_SPEED = 30;
const MAX_SPEED = 300;
const STEP_SIZE = 5;

type BPMInputProps = {id: string, value: number, onChange: (bpm: number) => void};

function BPMInput({id, value, onChange}: BPMInputProps) {
    const removeOne = useCallback(() => {
        onChange(value - 1);
    }, [value, onChange]);

    const addOne = useCallback(() => {
        onChange(value + 1);
    }, [value, onChange]);

    const onInput = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(ev.target.value));
    }, []);

    return <div className={`flex ${styles.bpmInput}`}>
        <button onClick={removeOne}><IoRemoveSharp /></button>
        <Input
            id={id} className="flex-grow"
            type="range" min={MIN_SPEED} max={MAX_SPEED} step={STEP_SIZE}
            value={value} onInput={onInput}
        />
        <button onClick={addOne}><IoAddSharp /></button>
    </div>;
}

type Props = {
    beats: number,
    setBeats: (beats: number) => void,
    bpm: number,
    setBpm: (bpm: number) => void
};

export function MetronomeConfig({beats, setBeats, bpm, setBpm}: Props) {
    const onBeatsChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setBeats(Number(ev.target.value)), [setBeats]);
    const onBpmChange = useCallback((bpm: number) => setBpm(bpm), [setBpm]);

    return <div className={`${styles.metronomeConfig} ${formStyles.form}`}>
        <div className={formStyles.inputRow}>
            <label htmlFor="beatsInput">Beats</label>
            <p className={formStyles.helptext}>The number of beats per measure.</p>
            <Input id="beatsInput" type="number" value={beats || ''} onInput={onBeatsChange} />
        </div>

        <div className={formStyles.inputRow}>
            <label htmlFor="bpmInput">BPM</label>
            <p className={formStyles.helptext}>How fast the tempo is in beats per minute.</p>
            <BPMInput id="bpmInput" value={bpm} onChange={onBpmChange} />
        </div>
    </div>;
}