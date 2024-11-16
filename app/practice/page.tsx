"use client";

import { useCallback, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

import styles from "./practice.module.css";
import formStyles from "../forms.module.css";
import { MetronomeConfig } from "../metronome/MetronomeConfig";
import Metronome from "../metronome/Metronome";
import Transport from "../transport/Transport";
import { IoTrashBinSharp } from "react-icons/io5";

type PracticeItem = {
    title: string,
    beats: number,
    bpm: number,
};

function getDefaultPracticeItem() {
    return {title: 'Title', beats: 4, bpm: 120};
}

type PracticeItemViewProps = {
    play: boolean,
    item: PracticeItem,
    setItem: (item: PracticeItem) => void,
    removeItem: () => void,
    onPlay: () => void,
    onPause: () => void,
    onNextItem?: () => void,
    onPreviousItem?: () => void,
}

function PracticeItemView({play, item, setItem, removeItem, onPlay, onPause, onNextItem, onPreviousItem}: PracticeItemViewProps) {
    const setBeats = useCallback((beats: number) => {
        setItem({...item, beats})
    }, [setItem]);

    const setBpm = useCallback((bpm: number) => {
        setItem({...item, bpm})
    }, [setItem]);

    const setTitle = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setItem({...item, title: ev.target.value});
    }, [setItem]);

    return <div className={styles.practiceItem}>
        <button onClick={removeItem}>
            <IoTrashBinSharp />
        </button>
        <div className={styles.form}>
            <div className={formStyles.inputRow}>
                <label htmlFor="practiceItemTitle">Beats</label>
                <p className={formStyles.helptext}>The title of this practice item.</p>
                <input id="practiceItemTitle" type="text" value={item.title} onInput={setTitle} />
            </div>
        </div>
        <MetronomeConfig beats={item.beats} setBeats={setBeats} bpm={item.bpm} setBpm={setBpm} />
        <Metronome play={play} beats={item.beats} bpm={item.bpm} />
        <Transport play={play} onPlay={onPlay} onPause={onPause} onSkipBack={onPreviousItem} onSkipForward={onNextItem} />
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
    }, [currentPracticeItem, practiceItems, setPracticeItems]);

    const onPreviousItem = useCallback(() => {
        setCurrentPracticeItem(currentPracticeItem - 1);
    }, [currentPracticeItem, setCurrentPracticeItem]);

    const onNextItem = useCallback(() => {
        setCurrentPracticeItem(currentPracticeItem + 1);
    }, [currentPracticeItem, setCurrentPracticeItem]);

    // useEffect(() => {
    //     if (currentPracticeItem >= practiceItems.length) {
    //         setItem(getDefaultPracticeItem());
    //     }
    // }, [currentPracticeItem, setItem]);

    return <div className={styles.practicePage}>
        {practiceItems.length === 0 ?
            <>
                <p>There are no practice items.</p>
                <p><button>Create one</button></p>
            </> :
            <p>Viewing item {currentPracticeItem + 1} of {practiceItems.length}</p>
        }
        
        {practiceItem ?
            <PracticeItemView play={play} onPlay={onPlay} onPause={onPause} item={practiceItem}
                setItem={setItem} removeItem={removeItem}
                onNextItem={currentPracticeItem < practiceItems.length - 1 ? onNextItem : undefined}
                onPreviousItem={currentPracticeItem > 0 ? onPreviousItem : undefined} /> :
            null}
    </div>;
}