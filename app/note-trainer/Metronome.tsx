import { useEffect, useRef, useState } from "react";
import {Howl, Howler} from 'howler';

type Props = {
    play: boolean,
    beats: number,
    bpm: number,
    onHalfBeat?: (halfBeat: number) => void,
};

export default function Metronome({play, beats, bpm, onHalfBeat}: Props) {
    const worker = useRef<Worker | null>(null);
    const [isStarted, setIsStarted] = useState(false);
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

        if (play) {
            worker.current.onmessage = (ev) => {
                if (ev.data % 2 === 0) {
                    if (ev.data === 0) {
                        clickHi.current.play();
                    } else {
                        clickLo.current.play();
                    }
                }
                if (onHalfBeat) onHalfBeat(ev.data);
            };
            if (!isStarted) {
                worker.current.postMessage({name: 'START', bpm, beats});
                setIsStarted(true);
            }
        } else {
            if (isStarted) {
                worker.current.postMessage({name: 'STOP'});
                setIsStarted(false);
            }
        }
    }, [play, bpm, beats, onHalfBeat, isStarted, setIsStarted]);

    return <div/>;
}