import { useEffect, useRef, useState } from "react";
import { Howl } from 'howler';
import _ from 'lodash';

import styles from './metronome.module.css';
import MuteButton from "../note-trainer/MuteButton";

type Props = {
    play: boolean,
    beats: number,
    bpm: number,
    onHalfBeat?: (halfBeat: number) => void,
};

type WorkerState = {
    play: boolean,
    beats: number,
    bpm: number,
};

export default function Metronome({play, beats, bpm, onHalfBeat}: Props) {
    const worker = useRef<Worker | null>(null);
    const [workerState, setWorkerState] = useState<WorkerState>({play, beats, bpm});
    const [beatNumber, setBeatNumber] = useState<number>(0);
    const clickHi = useRef<Howl>(new Howl({
        src: ['click_hi.wav']
    }));
    const clickLo = useRef<Howl>(new Howl({
        src: ['click_lo.wav']
    }));

    useEffect(() => {
        if (worker.current === null) {
            worker.current = new Worker('metronome-worker.js');
        }

        return () => {
            worker.current?.terminate();
            worker.current = null;
        };
    }, []);

    useEffect(() => {
        function getNextWorkerState() {
            return { play, bpm, beats };
        }

        function startMetronome() {
            worker.current?.postMessage({ name: 'START', bpm, beats });
            setWorkerState(getNextWorkerState());
        }

        function stopMetronome() {
            worker.current?.postMessage({ name: 'STOP' });
            setWorkerState(getNextWorkerState());
        }

        const nextWorkerState = getNextWorkerState();

        if (!worker.current) throw new Error('unreachable');

        worker.current.onmessage = (ev) => {
            setBeatNumber(ev.data);
            const nextWorkerState = getNextWorkerState();
            // If bpm or beat have changed, restart the session
            if (!_.isEqual(workerState, nextWorkerState)) {
                startMetronome();
                return;
            }
            if (ev.data % 2 === 0) {
                if (ev.data === 0) {
                    clickHi.current.play();
                } else {
                    clickLo.current.play();
                }
            }
            if (onHalfBeat) onHalfBeat(ev.data);
        };

        if (!_.isEqual(workerState, nextWorkerState)) {
            if (play) {
                if (!workerState.play) {
                    startMetronome();
                }
            } else {
                stopMetronome();
            }
        }
    }, [play, bpm, beats, onHalfBeat, workerState, setWorkerState]);

    return <div className={`${styles.metronome} flex`}>
        {_.times(beats, (i) =>
            <div key={i} className={`${styles.beat} ${i * 2 === beatNumber ? styles.active : ''}`}>
                {i + 1}
            </div>)}
        <MuteButton />
    </div>;
}