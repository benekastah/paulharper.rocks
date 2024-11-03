import { useEffect, useRef } from "react";
import {Howl, Howler} from 'howler';

type Props = {
    play: boolean,
    beats: number,
    bpm: number,
    onHalfBeat?: (halfBeat: number) => void,
};


export default function Metronome({play, beats, bpm, onHalfBeat}: Props) {
    const worker = useRef<Worker | null>(null);
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
            worker.current.postMessage({name: 'START', bpm, beats});
        } else {
            worker.current.postMessage({name: 'STOP'});
        }
    }, [play, bpm, beats, onHalfBeat]);

    return <div/>;
}