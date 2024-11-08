import { useEffect, useRef, useState } from "react";
import { Howl } from 'howler';
import _ from 'lodash';

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

        worker.current.onmessage = (ev) => {
            if (ev.data === 0) {
                const nextWorkerState = getNextWorkerState();
                // If we're on the first beat and bpm or beat have changed, restart the session
                if (!_.isEqual(workerState, nextWorkerState)) {
                    startMetronome();
                    return;
                }
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

    return <div/>;
}