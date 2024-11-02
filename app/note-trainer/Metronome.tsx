import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
    play: boolean,
    beats: number,
    bpm: number,
    onHalfBeat?: (halfBeat: number) => void,
};


export default function Metronome({play, beats, bpm, onHalfBeat}: Props) {
    const audioContext = useRef<AudioContext | null>(null);
    const clickHi = useRef<HTMLAudioElement | null>(null);
    const clickLo = useRef<HTMLAudioElement | null>(null);
    const trackHi = useRef<MediaElementAudioSourceNode | null>(null);
    const trackLo = useRef<MediaElementAudioSourceNode | null>(null);

    const worker = useRef<Worker | null>(null);

    useEffect(() => {
        if (audioContext.current === null) {
            audioContext.current = new (window.AudioContext || window.webkitAudioContext);
        }
        const ctx = audioContext.current;

        if ((!trackHi.current || !trackLo.current) && clickHi.current && clickLo.current) {
            trackHi.current = ctx.createMediaElementSource(clickHi.current);
            trackLo.current = ctx.createMediaElementSource(clickLo.current);
            trackHi.current.connect(ctx.destination);
            trackLo.current.connect(ctx.destination);
        }

        if (worker.current === null) {
            worker.current = new Worker('metronome-worker.js');
        }

        if (play) {
            worker.current.onmessage = (ev) => {
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }
                if (ev.data % 2 === 0) {
                    if (ev.data === 0) {
                        clickHi.current?.play();
                    } else {
                        clickLo.current?.play();
                    }
                }
                if (onHalfBeat) onHalfBeat(ev.data);
            };
            worker.current.postMessage({name: 'START', bpm, beats});
        } else {
            worker.current.postMessage({name: 'STOP'});
        }
    }, [play, bpm, beats, onHalfBeat]);

    return <div>
        <audio ref={clickHi} src="click_hi.wav" />
        <audio ref={clickLo} src="click_lo.wav" />
    </div>;
}