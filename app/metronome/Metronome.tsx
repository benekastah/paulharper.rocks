import { Howl } from 'howler';
import WavEncoder from 'wav-encoder';
import { isEqual, times } from 'lodash';
import { useCallback, useEffect, useRef, useState } from "react";

import styles from './metronome.module.css';
import MuteButton from "../components/MuteButton";

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

let AUDIO_CONTEXT: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (AUDIO_CONTEXT === null) {
        AUDIO_CONTEXT = new AudioContext();
    }
    return AUDIO_CONTEXT;
}

let AUDIO_BUFFER_CACHE: Record<string, AudioBuffer> = {};

async function loadAudio(url: string): Promise<AudioBuffer> {
    if (!(url in AUDIO_BUFFER_CACHE)) {
        const audioCtx = getAudioContext();
        const response = await fetch(url);
        const buf = await audioCtx.decodeAudioData(await response.arrayBuffer());
        AUDIO_BUFFER_CACHE[url] = buf;
    }
    return AUDIO_BUFFER_CACHE[url];
}

async function createLoopableMetronomeTrackURL(beats: number, bpm: number): Promise<string> {
    const [clickHiBuf, clickLoBuf] = await Promise.all([
        loadAudio('click_hi.wav'),
        loadAudio('click_lo.wav')
    ]);
    const sampleRate = clickHiBuf.sampleRate;

    const lengthInSeconds = (1 / (bpm / 60)) * beats;
    const lengthInSamples = lengthInSeconds * sampleRate;
    const samplesPerBeat = lengthInSamples / beats;

    const data: [Float32Array, Float32Array] = [
        new Float32Array(lengthInSamples),
        new Float32Array(lengthInSamples)
    ];

    for (let b = 0; b < beats; b++) {
        const startingSample = Math.round(b * samplesPerBeat);
        const clickBuf = b === 0 ? clickHiBuf : clickLoBuf;
        if (clickBuf.sampleRate !== sampleRate) {
            throw new Error('Invalid sample rate: ' + clickBuf.sampleRate);
        }
        if (clickBuf.numberOfChannels !== data.length) {
            throw new Error('Invalid number of channels: ' + clickBuf.numberOfChannels);
        }
        for (let c = 0; c < clickBuf.numberOfChannels; c++) {
            const channel = clickBuf.getChannelData(c);
            for (let s = 0; s < channel.length; s++) {
                data[c][startingSample + s] += channel[s];
            }
        }
    }

    const result = await WavEncoder.encode({sampleRate: sampleRate, channelData: data});
    const blob = new Blob([result], {type: 'audio/wav'});

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(reader.result);
            }
        };
    });
}

export default function Metronome({play, beats, bpm, onHalfBeat}: Props) {
    const wakeLockSentinel = useRef<WakeLockSentinel | null>(null);
    const [beatNumber, setBeatNumber] = useState<number>(0);

    const [dataUrl, setDataUrl] = useState<string | null>(null);
    const audioEl = useRef<HTMLAudioElement | null>(null);

    const loopIntervalId = useRef<ReturnType<typeof setInterval> | null>(null);
    const onLoop = useCallback(() => {
        if (loopIntervalId.current !== null) {
            clearInterval(loopIntervalId.current);
        }
        loopIntervalId.current = setInterval(() => {
            setBeatNumber(beatNumber + 1);
        }, (bpm / 60) * 1000)
    }, [bpm, beatNumber, setBeatNumber]);

    useEffect(() => {
        createLoopableMetronomeTrackURL(beats, bpm).then(
            (url: string) => setDataUrl(url),
            (error) => {
                console.error(error);
                return null;
            }
        );
    }, [beats, bpm, onLoop]);

    useEffect(() => {
        if (play) {
            if (!wakeLockSentinel.current) {
                if (!navigator.wakeLock) return;
                navigator.wakeLock.request('screen').then((wls) => {
                    wakeLockSentinel.current = wls;
                }).catch((err) => {
                    console.error(`Unable to suspend wake lock: ${err.name}, ${err.message}`);
                });
            }
        } else {
            wakeLockSentinel.current?.release();
            wakeLockSentinel.current = null;
        }
    }, [play]);

    useEffect(() => {
        if (!audioEl.current) {
            return;
        }
        if (play) {
            audioEl.current.play();
        } else {
            audioEl.current.pause();
            audioEl.current.currentTime = 0;
        }
    }, [play]);

    return <div className={styles.metronome}>
        <p>{bpm}bpm</p>
        <ol className={`flex ${styles.beatList}`}>
            {times(beats, (i) =>
                <li key={i} className={`${styles.beat} ${i * 2 === beatNumber ? styles.active : ''}`}>
                    {i + 1}
                </li>)}
            <li className={styles.muteButton}><MuteButton /></li>
        </ol>

        {dataUrl ? <audio ref={audioEl} src={dataUrl} loop preload="auto" /> : null}
    </div>;
}