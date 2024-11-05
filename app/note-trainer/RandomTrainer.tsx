import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import Metronome from "./Metronome";
import Transport from "./Transport";
import NoteCircle from "./NoteCircle";
import { DoublyLinkedList } from "./DoublyLinkedList";
import * as linkedList from "./DoublyLinkedList"
import styles from "./noteTrainer.module.css";

type Props<T> = {
    generator: () => T
    beats: number,
    bpm: number,
    renderItem: (item: DoublyLinkedList<T>, index: number) => ReactElement
};

export default function RandomTrainer<T>({ generator, beats, bpm, renderItem }: Props<T>) {
    const [play, setPlay] = useState(false);

    const initializeNotes = useCallback((notes: DoublyLinkedList<T> | null): DoublyLinkedList<T> => {
        if (notes === null) {
            notes = linkedList.create(generator());
        }
        if (!notes.head) {
            linkedList.prepend(notes, generator());
        }
        if (!notes.tail) {
            linkedList.append(notes, generator());
        }
        return notes;
    }, [generator]);

    const getCurrentItems = useCallback((notes: DoublyLinkedList<T>): DoublyLinkedList<T>[] => {
        return [
            linkedList.getOrGenerateNth(notes, -2, generator),
            linkedList.getOrGenerateNth(notes, -1, generator),
            linkedList.getOrGenerateNth(notes, 0, generator),
            linkedList.getOrGenerateNth(notes, 1, generator),
        ];
    }, [generator]);

    const getHead = useCallback((notes: DoublyLinkedList<T>): DoublyLinkedList<T> => {
        initializeNotes(notes);
        if (!notes.head || !notes.tail) throw new Error('unreachable');
        return notes.head;
    }, [initializeNotes]);

    const getTail = useCallback((notes: DoublyLinkedList<T>): DoublyLinkedList<T> => {
        initializeNotes(notes);
        if (!notes.head || !notes.tail) throw new Error('unreachable');
        return notes.tail;
    }, [initializeNotes]);

    const notes = useRef<DoublyLinkedList<T> | null>(null);
    const [currentNotes, setCurrentNotes] = useState<DoublyLinkedList<T>[]>([]);

    const [halfBeat, setHalfBeat] = useState(-1);

    useEffect(() => {
        notes.current = initializeNotes(null);
        setCurrentNotes(getCurrentItems(notes.current));
    }, [setCurrentNotes]);

    const onPlay = useCallback(() => {
        setPlay(true);
    }, [setPlay]);

    const onPause = useCallback(() => {
        setPlay(false);
    }, [setPlay]);

    const onSkipBack = useCallback(() => {
        if (notes.current === null) return;
        notes.current = getTail(notes.current);
        setCurrentNotes(getCurrentItems(notes.current));
    }, [setCurrentNotes, getTail, getCurrentItems]);

    const onSkipForward = useCallback(() => {
        if (notes.current === null) return;
        notes.current = getHead(notes.current);
        setCurrentNotes(getCurrentItems(notes.current));
    }, [setCurrentNotes, getHead, getCurrentItems]);

    const onHalfBeat = useCallback((halfBeat: number) => {
        if (halfBeat === 0) {
            onSkipForward();
        }
        setHalfBeat(halfBeat);
    }, [onSkipForward]);

    useEffect(() => {
        notes.current = initializeNotes(null);
        setCurrentNotes(getCurrentItems(notes.current));
    }, [initializeNotes, getCurrentItems, setCurrentNotes]);

    return (
        <div className={styles.randomTrainer}>
            <Metronome play={play} beats={beats} bpm={bpm} onHalfBeat={onHalfBeat} />
            <Transport play={play} onPlay={onPlay} onPause={onPause} onSkipBack={onSkipBack} onSkipForward={onSkipForward} />
            <p>
                Beat {halfBeat >= 0 ? (halfBeat / 2) + 1 : 1}
            </p>

            <section className={styles.noteCircles}>
                {currentNotes.map((note, i) => renderItem(note, i))}
            </section>
        </div>
    );
}