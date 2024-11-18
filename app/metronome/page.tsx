"use client";

import { useCallback, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Metronome from "./Metronome";
import Transport from "../transport/Transport";
import { MetronomeConfig } from "./MetronomeConfig";

import styles from './metronome.module.css';


export default function Page() {
    const [play, setPlay] = useState(false);

    const [beats, setBeats] = useLocalStorage('Metronome.beats', 4);
    const [bpm, setBpm] = useLocalStorage('Metronome.bpm', 120);

    const onPlay = useCallback(() => {
        setPlay(true);
    }, [setPlay]);

    const onPause = useCallback(() => {
        setPlay(false);
    }, [setPlay]);

    return <div className={styles.metronomePage}>
        <MetronomeConfig beats={beats} setBeats={setBeats} bpm={bpm} setBpm={setBpm} />
        <Metronome play={play} beats={beats} bpm={bpm} />
        <Transport play={play} onPlay={onPlay} onPause={onPause} hideDisabled />
    </div>;
}