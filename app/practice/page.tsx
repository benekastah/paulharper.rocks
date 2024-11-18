"use client";

import { useCallback, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

import styles from "./practice.module.css";
import formStyles from "../forms.module.css";
import { MetronomeConfig } from "../metronome/MetronomeConfig";
import Metronome from "../metronome/Metronome";
import Transport from "../transport/Transport";
import { IoAddSharp, IoTrashSharp } from "react-icons/io5";

type PracticeItem = {
    title: string,
    beats: number,
    bpm: number,
};

function getDefaultPracticeItem() {
    return {title: 'Title', beats: 4, bpm: 120};
}

type PracticeItemViewProps = {
    item: PracticeItem,
    setItem: (item: PracticeItem) => void,
}

function PracticeItemView({item, setItem}: PracticeItemViewProps) {
    const setBeats = useCallback((beats: number) => {
        setItem({...item, beats})
    }, [setItem, item]);

    const setBpm = useCallback((bpm: number) => {
        setItem({...item, bpm})
    }, [setItem, item]);

    const setTitle = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setItem({...item, title: ev.target.value});
    }, [setItem, item]);

    return <div className={styles.practiceItem}>
        <div className={`${formStyles.form} ${styles.titleForm}`}>
            <div className={formStyles.inputRow}>
                <label htmlFor="practiceItemTitle">Title</label>
                <p className={styles.helptext}>The title of the practice item</p>
                <input id="practiceItemTitle" type="text" value={item.title} onInput={setTitle} />
            </div>
        </div>
        <MetronomeConfig beats={item.beats} setBeats={setBeats} bpm={item.bpm} setBpm={setBpm} />
    </div>;
}

export default function Page() {
    const [practiceItems, setPracticeItems] = useLocalStorage<PracticeItem[]>('Practice.practiceItems', []);
    const [currentPracticeItem, setCurrentPracticeItem] = useState(0);
    const practiceItem: PracticeItem | undefined = practiceItems[currentPracticeItem];

    const [play, setPlay] = useState(false);

    const onPlay = useCallback(() => {
        setPlay(true);
    }, [setPlay]);

    const onPause = useCallback(() => {
        setPlay(false);
    }, [setPlay]);

    const setItem = useCallback((item: PracticeItem) => {
        const nextPracticeItems = [...practiceItems];
        nextPracticeItems[currentPracticeItem] = item;
        setPracticeItems(nextPracticeItems);
    }, [currentPracticeItem, practiceItems, setPracticeItems]);

    const removeItem = useCallback(() => {
        const nextPracticeItems = [...practiceItems];
        nextPracticeItems.splice(currentPracticeItem, 1);
        setPracticeItems(nextPracticeItems);
        if (nextPracticeItems.length >= currentPracticeItem) {
            setCurrentPracticeItem(nextPracticeItems.length - 1);
        }
    }, [currentPracticeItem, setCurrentPracticeItem, practiceItems, setPracticeItems]);

    const insertItem = useCallback(() => {
        const nextPracticeItems = [...practiceItems];
        nextPracticeItems.splice(currentPracticeItem + 1, 0, getDefaultPracticeItem());
        setPracticeItems(nextPracticeItems);
        setCurrentPracticeItem(currentPracticeItem + 1);
    }, [currentPracticeItem, setCurrentPracticeItem, practiceItems, setPracticeItems]);

    const onPreviousItem = useCallback(() => {
        setCurrentPracticeItem(currentPracticeItem - 1);
    }, [currentPracticeItem, setCurrentPracticeItem]);

    const onNextItem = useCallback(() => {
        setCurrentPracticeItem(currentPracticeItem + 1);
    }, [currentPracticeItem, setCurrentPracticeItem]);

    useEffect(() => {
        if (play && practiceItems.length === 0) {
            setPlay(false);
        }
    }, [play, setPlay, practiceItems]);

    return <div className={styles.practicePage}>
        <header>
            <h1>Practice</h1>
        </header>

        <ol className={`flex ${styles.practiceItems}`}>
            {practiceItems.map((practiceItem, idx) => {
                const isCurrent = idx === currentPracticeItem;
                return <li key={idx} className={isCurrent ? styles.current : ''}>
                    <button onClick={() => setCurrentPracticeItem(idx)}>
                        {isCurrent ?
                            <h2>{practiceItem.title}</h2> :
                            <h3>{practiceItem.title}</h3>}
                    </button>
                </li>;
            })}
        </ol>

        <div>
            {practiceItems.length === 0 ? <h2>There are no routines</h2> : null}
            <div className={styles.buttonToolbar}>
                <button onClick={insertItem}>
                    <IoAddSharp /> New routine
                </button>
                <button disabled={practiceItems.length === 0} onClick={removeItem}>
                    <IoTrashSharp /> Delete routine
                </button>
            </div>
        </div>

        {practiceItem ?
            <div className={styles.body}>
                <Transport play={play} onPause={onPause} onPlay={onPlay}
                    onSkipBack={currentPracticeItem > 0 ? onPreviousItem : undefined}
                    onSkipForward={currentPracticeItem < practiceItems.length - 1 ? onNextItem : undefined} />
                <Metronome play={play} beats={practiceItem?.beats} bpm={practiceItem?.bpm} />
                <PracticeItemView item={practiceItem} setItem={setItem} />
            </div> :
            null}
    </div>;
}