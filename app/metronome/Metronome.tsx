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

async function createLoopableMetronomeSourceNode(beats: number, bpm: number): Promise<AudioBufferSourceNode> {
    const [clickHiBuf, clickLoBuf] = await Promise.all([
        loadAudio('click_hi.wav'),
        loadAudio('click_lo.wav')
    ]);
    const sampleRate = clickHiBuf.sampleRate;

    const lengthInSeconds = (1 / (bpm / 60)) * beats;
    const lengthInSamples = lengthInSeconds * sampleRate;
    const samplesPerBeat = lengthInSamples / beats;

    const data: [Float32Array, Float32Array] = generateData();

    const audioCtx = getAudioContext();
    const result = await WavEncoder.encode({sampleRate: sampleRate, channelData: data});
    const source = audioCtx.createBufferSource();
    source.buffer = await audioCtx.decodeAudioData(result);
    source.loop = true;

    source.connect(audioCtx.destination);
    audioCtx.state

    return source;

    function generateData() {
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
        return data;
    }
}

export default function Metronome({play, beats, bpm, onHalfBeat}: Props) {
    const wakeLockSentinel = useRef<WakeLockSentinel | null>(null);
    const [beatNumber, setBeatNumber] = useState<number>(0);

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

    const clickTrackNode = useRef<AudioBufferSourceNode | null>(null);
    const startedClickTrackNode = useRef<AudioBufferSourceNode | null>(null);

    function startClickTrack() {
        if (startedClickTrackNode.current !== clickTrackNode.current) {
            clickTrackNode.current?.start(0);
            startedClickTrackNode.current = clickTrackNode.current;
        }
    }

    function stopClickTrack() {
        if (startedClickTrackNode.current === clickTrackNode.current) {
            clickTrackNode.current?.stop(0);
        }
    }

    useEffect(() => {
        let canceled = false;

        createLoopableMetronomeSourceNode(beats, bpm).then((sourceNode) => {
            if (canceled) return;
            clickTrackNode.current = sourceNode;
            if (play) {
                startClickTrack();
            }
        });

        return () => {
            canceled = true;
            if (play) {
                stopClickTrack();
            }
        };
    }, [play, beats, bpm]);

    return <div className={styles.metronome}>
        <p>{bpm}bpm</p>
        <ol className={`flex ${styles.beatList}`}>
            {times(beats, (i) =>
                <li key={i} className={`${styles.beat} ${i * 2 === beatNumber ? styles.active : ''}`}>
                    {i + 1}
                </li>)}
            <li className={styles.muteButton}><MuteButton /></li>
        </ol>
    </div>;
}