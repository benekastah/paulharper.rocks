import React, { useCallback } from "react";
import styles from "./noteTrainer.module.css";

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
            <input id="beatsInput" type="number" value={beats} onInput={onBeatsChange} />
        </div>

        <div className={styles.inputRow}>
            <label htmlFor="bpmInput">BPM</label>
            <input id="bpmInput" type="number" value={bpm} onInput={onBpmChange} />
        </div>
    </div>;
}