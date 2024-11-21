"use client";

import { useCallback, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

import styles from "./practice.module.css";
import formStyles from "../forms.module.css";
import { MetronomeConfig } from "../metronome/MetronomeConfig";
import Metronome from "../metronome/Metronome";
import Transport from "../transport/Transport";
import { IoAddSharp, IoTrashSharp } from "react-icons/io5";
import Input from "../components/Input";
import RoutineView, { Routine } from "./Routine";

type PracticeItem = {
    title: string,
    beats: number,
    bpm: number,
};

function getDefaultPracticeItem() {
    return {title: 'My exercise', beats: 4, bpm: 120};
}

function getPracticeItemId(idx: number, item: PracticeItem) {
    return `${idx}-${encodeURIComponent(item.title)}`
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
                <Input id="practiceItemTitle" type="text" value={item.title} onInput={setTitle} />
            </div>
        </div>
        <MetronomeConfig beats={item.beats} setBeats={setBeats} bpm={item.bpm} setBpm={setBpm} />
    </div>;
}

export default function Page() {
    const [title, setTitle] = useLocalStorage('Practice.routineTitle', 'Practice');
    const [exercises, setExercises] = useLocalStorage<PracticeItem[]>('Practice.practiceItems', []);
    const [currentPracticeItem, setCurrentPracticeItem] = useLocalStorage('Practice.currentPracticeItem', -1);

    const routine: Routine = {
        title, exercises
    };

    const setRoutine = useCallback((nextRoutine: Routine) => {
        setTitle(nextRoutine.title);
        setExercises(nextRoutine.exercises);
    }, [setTitle, setExercises]);

    return <RoutineView routine={routine} setRoutine={setRoutine} currentExercise={currentPracticeItem}
                setCurrentExercise={setCurrentPracticeItem} />;
}