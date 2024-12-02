import { useCallback, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

import styles from "./practice.module.css";
import formStyles from "../forms.module.css";
import { MetronomeConfig } from "../metronome/MetronomeConfig";
import Metronome from "../metronome/Metronome";
import Transport from "../transport/Transport";
import { IoAddSharp, IoTrashSharp } from "react-icons/io5";
import Input from "../components/Input";
import useQueryParam from "../hooks/useQueryParam";

export type Exercise = {
    title: string,
    beats: number,
    bpm: number,
};

function getDefaultExercise() {
    return {title: 'My exercise', beats: 4, bpm: 120};
}

function getExerciseId(idx: number, item: Exercise) {
    return `${idx}-${encodeURIComponent(item.title)}`
}

type ExerciseViewProps = {
    item: Exercise,
    setItem: (item: Exercise) => void,
}

function ExerciseView({item, setItem}: ExerciseViewProps) {
    const setBeats = useCallback((beats: number) => {
        setItem({...item, beats})
    }, [setItem, item]);

    const setBpm = useCallback((bpm: number) => {
        setItem({...item, bpm})
    }, [setItem, item]);

    const setTitle = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setItem({...item, title: ev.target.value});
    }, [setItem, item]);

    return <div className={styles.exercise}>
        <div className={`${formStyles.form} ${styles.titleForm}`}>
            <div className={formStyles.inputRow}>
                <label htmlFor="exerciseTitle">Title</label>
                <p className={styles.helptext}>The title of the practice item</p>
                <Input id="exerciseTitle" type="text" value={item.title} onInput={setTitle} />
            </div>
        </div>
        <MetronomeConfig beats={item.beats} setBeats={setBeats} bpm={item.bpm} setBpm={setBpm} />
    </div>;
}

export type Routine = {
    title: string,
    exercises: Exercise[],
}

type RoutineViewProps = {
    routine: Routine,
    setRoutine: (routine: Routine) => void,
    onCloseRoutine: () => void,
};

export default function RoutineView({routine, setRoutine, onCloseRoutine}: RoutineViewProps) {
    const [currentExercise, setCurrentExercise] = useQueryParam<number>('exercise', -1);

    const title = routine.title;
    const setTitle = useCallback((title: string) => {
        const nextRoutine = {...routine, title};
        setRoutine(nextRoutine);
    }, [routine, setRoutine]);

    const exercises = routine.exercises;
    const setExercises = useCallback((exercises: Exercise[]) => {
        const nextRoutine = {...routine, exercises};
        setRoutine(nextRoutine);
    }, [routine, setRoutine]);

    const exercise: Exercise | undefined = exercises[currentExercise];

    const [play, setPlay] = useState(false);

    const onPlay = useCallback(() => {
        setPlay(true);
    }, [setPlay]);

    const onPause = useCallback(() => {
        setPlay(false);
    }, [setPlay]);

    const setItem = useCallback((item: Exercise) => {
        const nextExercises = [...exercises];
        nextExercises[currentExercise] = item;
        setExercises(nextExercises);
    }, [currentExercise, exercises, setExercises]);

    const removeItem = useCallback(() => {
        if (confirm("Are you sure you want to delete this exercise?")) {
            const nextExercises = [...exercises];
            nextExercises.splice(currentExercise, 1);
            setExercises(nextExercises);
            if (nextExercises.length >= currentExercise) {
                setCurrentExercise(nextExercises.length - 1);
            }
        }
    }, [currentExercise, setCurrentExercise, exercises, setExercises]);

    const insertItem = useCallback(() => {
        const nextExercises = [...exercises];
        nextExercises.splice(currentExercise + 1, 0, getDefaultExercise());
        setExercises(nextExercises);
        setCurrentExercise(currentExercise + 1);
    }, [currentExercise, setCurrentExercise, exercises, setExercises]);

    const onPreviousItem = useCallback(() => {
        setCurrentExercise(currentExercise - 1);
    }, [currentExercise, setCurrentExercise]);

    const onNextItem = useCallback(() => {
        setCurrentExercise(currentExercise + 1);
    }, [currentExercise, setCurrentExercise]);

    useEffect(function stopPlayingIfLastExerciseDeleted() {
        if (play && exercises.length === 0) {
            setPlay(false);
        }
    }, [play, setPlay, exercises]);

    useEffect(function scrollToExerciseTitle() {
        if (!exercise) return;
        const exerciseId = getExerciseId(currentExercise, exercise);
        const exerciseEl = document.getElementById(exerciseId)
        if (exerciseEl) {
            const parentEl = exerciseEl.parentElement;
            parentEl?.scroll(exerciseEl.offsetLeft, 0);
        }
    }, [currentExercise, exercises, exercise]);

    useEffect(function keepCurrentExerciseInBounds() {
        if (exercises.length) {
            const min = 0;
            const max = exercises.length - 1;
            if (currentExercise < min) {
                setCurrentExercise(min, true)
            } else if (currentExercise > max) {
                setCurrentExercise(max, true);
            }
        } else {
            const expectedCurrentExercise = -1;
            if (currentExercise !== expectedCurrentExercise) {
                setCurrentExercise(expectedCurrentExercise, true);
            }
        }
    }, [currentExercise, setCurrentExercise, exercises]);

    const backToRoutinesOnClick = useCallback((ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        onCloseRoutine();
    }, [onCloseRoutine]);

    return <div className={styles.practicePage}>
        <header>
            <a href="?" onClick={backToRoutinesOnClick}>Back to routines</a>
            <h1><Input type="text" value={title} onChange={(ev) => setTitle(ev.target.value)} /></h1>
        </header>

        <header>
            <div className={styles.buttonToolbar}>
                <button onClick={insertItem}>
                    <IoAddSharp /> New exercise
                </button>
                <button disabled={exercises.length === 0} onClick={removeItem}>
                    <IoTrashSharp /> Delete exercise
                </button>
            </div>

            <ol className={`flex ${styles.exercises}`}>
                {exercises.map((exercise, idx) => {
                    const isCurrent = idx === currentExercise;
                    const id = getExerciseId(idx, exercise);
                    return <li id={id} key={id} className="mr-4">
                        <button onClick={() => setCurrentExercise(idx)}>
                            {isCurrent ?
                                <h2>{exercise.title}</h2> :
                                <h3>{exercise.title}</h3>}
                        </button>
                    </li>;
                })}
            </ol>

            {exercises.length === 0 ? <h2>There are no exercises</h2> : null}
        </header>

        {exercise ?
            <div className={styles.body}>
                <Transport play={play} onPause={onPause} onPlay={onPlay}
                    onSkipBack={currentExercise > 0 ? onPreviousItem : undefined}
                    onSkipForward={currentExercise < exercises.length - 1 ? onNextItem : undefined} />
                <Metronome play={play} beats={exercise.beats} bpm={exercise.bpm} />
                <ExerciseView item={exercise} setItem={setItem} />
            </div> :
            null}
    </div>;
}