import React, { useCallback } from "react";
import styles from '../forms.module.css';

type Props = {
    beats: number,
    setBeats: (beats: number) => void,
    bpm: number,
    setBpm: (bpm: number) => void
};

export function MetronomeConfig({beats, setBeats, bpm, setBpm}: Props) {
    const onBeatsChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setBeats(Number(ev.target.value)), [setBeats]);
    const onBpmChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setBpm(Number(ev.target.value)), [setBpm]);

    return <div className={styles.form}>
        <div className={styles.inputRow}>
            <label htmlFor="beatsInput">Beats</label>
            <p className={styles.helptext}>The number of beats per measure.</p>
            <input id="beatsInput" type="number" value={beats || ''} onInput={onBeatsChange} />
        </div>

        <div className={styles.inputRow}>
            <label htmlFor="bpmInput">BPM</label>
            <p className={styles.helptext}>How fast the tempo is in beats per minute.</p>
            <input id="bpmInput" type="number" value={bpm || ''} onInput={onBpmChange} />
        </div>
    </div>;
}