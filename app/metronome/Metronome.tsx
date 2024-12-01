import WavEncoder from 'wav-encoder';
import { times } from 'lodash';
import { useEffect, useRef, useState } from "react";

import styles from './metronome.module.css';
import useWakeLock from '../hooks/useWakeLock';

const CANCELED = {CANCELED: true};

type Props = {
    play: boolean,
    beats: number,
    bpm: number,
    onHalfBeat?: (halfBeat: number) => void,
};

type AudioState = {
    beats: number,
    bpm: number,
    nodePromise: Promise<AudioBufferSourceNode>,
    timeoutId?: ReturnType<typeof setTimeout>,
};

type VisualState = {
    playStart: number,
    beats: number,
    bpm: number,
    halfBeatNumber: number,
    intervalId?: ReturnType<typeof setInterval>,
}

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

export default function Metronome({play, beats, bpm, onHalfBeat}: Props) {
    useWakeLock(play);

    const [halfBeatNumber, setHalfBeatNumber] = useState<number>(0);
    const [playStart, setPlayStart] = useState(-1);
    const startedClickTrackNode = useRef<AudioBufferSourceNode | null>(null);
    const audioState = useRef<AudioState | null>(null);
    const visualState = useRef<VisualState>({playStart, beats, bpm, halfBeatNumber});

    useEffect(function manageHalfBeatNumber() {
        const prevState = {...visualState.current};
        visualState.current = {bpm, beats, playStart, halfBeatNumber};

        const _setHalfBeatNumber = (n: number) => {
            if (halfBeatNumber !== n) {
                setHalfBeatNumber(n);
            }
            visualState.current.halfBeatNumber = n;
        };

        const _clearInterval = () => {
            if (prevState.intervalId) {
                clearInterval(prevState.intervalId);
            }
        };

        const getMsPerHalfBeat = () => {
            return (1 / (visualState.current.bpm / 60) * 1000) / 2;
        };

        const getHalfBeat = () => {
            const runtime = Date.now() - visualState.current.playStart;
            return Math.floor(runtime / getMsPerHalfBeat());
        }

        if (playStart >= 0) {
            if (prevState.playStart !== playStart) {
                _setHalfBeatNumber(0);
            }

            if (prevState.playStart !== playStart || prevState.bpm !== bpm || prevState.beats !== beats) {
                const fps = 60;
                _clearInterval();
                visualState.current.intervalId = setInterval(() => {
                    if (visualState.current.playStart >= 0) {
                        const halfBeat = getHalfBeat();
                        if (visualState.current.halfBeatNumber !== halfBeat) {
                            _setHalfBeatNumber(halfBeat);
                        }
                    } else {
                        _clearInterval();
                    }
                }, 1000 / fps);
            }
        } else {
            _setHalfBeatNumber(0);
        }
    }, [halfBeatNumber, setHalfBeatNumber, playStart, beats, bpm]);

    useEffect(function fireOnHalfBeat() {
        if (playStart > -1) {
            onHalfBeat && onHalfBeat(halfBeatNumber);
        }
    }, [halfBeatNumber, onHalfBeat, playStart])

    function clickTrackNodeIsPlaying() {
        return Boolean(startedClickTrackNode.current);
    }

    async function startClickTrack(): Promise<boolean> {
        const node = await audioState.current?.nodePromise;
        if (node && startedClickTrackNode.current !== node) {
            node.start(0);
            startedClickTrackNode.current = node;
            return true;
        }
        return false;
    }

    async function stopClickTrack(): Promise<boolean> {
        const node = await audioState.current?.nodePromise;
        if (node && startedClickTrackNode.current === node) {
            node.stop(0);
            return true;
        }
        startedClickTrackNode.current = null;
        return false;
    }

    useEffect(function buildAudioAndPlay() {
        const prevState: AudioState | null = audioState.current ? {...audioState.current} : null;

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
            if (!play || !prevState || (play && !clickTrackNodeIsPlaying())) {
                nodePromise = getClickTrackPromise(true);
            } else {
                nodePromise = getClickTrackPromise(false);
            }
            prevState?.nodePromise.then(node => node.disconnect());
            audioState.current = { beats, bpm, timeoutId, nodePromise };
        }

        if (play) {
            startClickTrack().then((started: boolean) => {
                if (started) {
                    setPlayStart(Date.now());
                }
            });
        } else {
            stopClickTrack().then(() => {
                setPlayStart(-1);
            });
        }

        return () => {
            canceled = true;
        }
    }, [play, beats, bpm, setPlayStart]);

    useEffect(function stopOnUnmount() {
        return () => {
            stopClickTrack().then(() => {
                setPlayStart(-1);
            });
        }
    }, []);

    return <div className={styles.metronome}>
        <p>{bpm}bpm</p>
        <ol className={`flex ${styles.beatList}`}>
            {times(beats, (i) =>
                <li key={i} className={`${styles.beat} ${i * 2 === halfBeatNumber % (beats * 2) ? styles.active : ''}`}>
                    {i + 1}
                </li>)}
        </ol>
    </div>;
}