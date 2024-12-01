import { Howl } from 'howler';
import WavEncoder from 'wav-encoder';
import { isEqual, times } from 'lodash';
import { useCallback, useEffect, useRef, useState } from "react";

import styles from './metronome.module.css';
import MuteButton from "../components/MuteButton";
import useWakeLock from '../hooks/useWakeLock';

const CANCELED = {CANCELED: true};

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

    const audioCtx = getAudioContext();
    const result = await WavEncoder.encode({sampleRate: sampleRate, channelData: data});
    const source = audioCtx.createBufferSource();
    source.buffer = await audioCtx.decodeAudioData(result);
    source.loop = true;

    source.connect(audioCtx.destination);

    return source;
}

type State = {
    beats: number,
    bpm: number,
    nodePromise: Promise<AudioBufferSourceNode>,
    timeoutId?: ReturnType<typeof setTimeout>,
};

export default function Metronome({play, beats, bpm, onHalfBeat}: Props) {
    useWakeLock(play);

    const [beatNumber, setBeatNumber] = useState<number>(0);
    const startedClickTrackNode = useRef<AudioBufferSourceNode | null>(null);
    const state = useRef<State | null>(null);

    useEffect(() => {
        const msPerHalfBeat = ((1 / (bpm / 60)) * 1000) / 2;
        if (play) {
            const intervalId = setInterval(() => {
                setBeatNumber((beatNumber + 1) % (beats * 2));
            }, msPerHalfBeat);
            return () => {
                clearInterval(intervalId);
            }
        } else {
            if (beatNumber) {
                setBeatNumber(0);
            }
        }
    });

    function isPlaying() {
        return Boolean(startedClickTrackNode.current);
    }

    async function startClickTrack() {
        const node = await state.current?.nodePromise;
        if (node && startedClickTrackNode.current !== node) {
            node.start(0);
            startedClickTrackNode.current = node;
        }
    }

    async function stopClickTrack() {
        const node = await state.current?.nodePromise;
        if (node && startedClickTrackNode.current === node) {
            node.stop(0);
        }
        startedClickTrackNode.current = null;
    }

    useEffect(function buildAudioAndPlay() {
        const prevState: State | null = state.current ? {...state.current} : null;

        let canceled = false;
        let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
        let nodePromise: Promise<AudioBufferSourceNode> | void;

        function _clearTimeout() {
            if (prevState?.timeoutId) {
                clearTimeout(prevState.timeoutId);
            }
        }

        function getClickTrackPromise(now: boolean = false): Promise<AudioBufferSourceNode> {
            return new Promise<AudioBufferSourceNode>(function (resolve, reject) {
                _clearTimeout();
                const action = () => {
                    if (canceled) {
                        reject(CANCELED);
                        return;
                    }
                    createLoopableMetronomeSourceNode(beats, bpm).then((node) => {
                        if (canceled) {
                            reject(CANCELED);
                        } else {
                            prevState?.nodePromise.then(node => {
                                node.disconnect();
                            });
                            resolve(node);
                        } 
                    }, reject);
                };
                if (now) {
                    action();
                } else {
                    timeoutId = setTimeout(action, 300);
                }
            });
        }

        if (bpm !== prevState?.bpm || beats !== prevState?.beats || !play) {
            if (!play || !prevState || (play && !isPlaying())) {
                nodePromise = getClickTrackPromise(true);
            } else {
                nodePromise = getClickTrackPromise(false);
            }
            prevState?.nodePromise.then(node => node.disconnect());
            state.current = { beats, bpm, timeoutId, nodePromise };
        }

        if (play) {
            startClickTrack();
        } else {
            stopClickTrack();
        }

        return () => {
            canceled = true;
        }
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