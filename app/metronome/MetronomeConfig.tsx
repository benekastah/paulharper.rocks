import React, { useCallback } from "react";
import formStyles from '../forms.module.css';
import styles from './metronome.module.css';
import Input from "../components/Input";

type Props = {
    beats: number,
    setBeats: (beats: number) => void,
    bpm: number,
    setBpm: (bpm: number) => void
};

export function MetronomeConfig({beats, setBeats, bpm, setBpm}: Props) {
    const onBeatsChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setBeats(Number(ev.target.value)), [setBeats]);
    const onBpmChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setBpm(Number(ev.target.value)), [setBpm]);

    return <div className={`${styles.metronomeConfig} ${formStyles.form}`}>
        <div className={formStyles.inputRow}>
            <label htmlFor="beatsInput">Beats</label>
            <p className={formStyles.helptext}>The number of beats per measure.</p>
            <Input id="beatsInput" type="number" value={beats || ''} onInput={onBeatsChange} />
        </div>

        <div className={formStyles.inputRow}>
            <label htmlFor="bpmInput">BPM</label>
            <p className={formStyles.helptext}>How fast the tempo is in beats per minute.</p>
            <Input id="bpmInput" type="number" value={bpm || ''} onInput={onBpmChange} />
        </div>
    </div>;
}