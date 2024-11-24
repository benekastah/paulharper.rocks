"use client";

import { useCallback, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

import RoutineView, { Routine } from "./Routine";
import useQueryParam from "../hooks/useQueryParam";
import { IoAddSharp, IoCreateSharp, IoTrashSharp } from "react-icons/io5";

import styles from './practice.module.css';

function getDefaultRoutine() {
    return { title: 'My Routine', exercises: [] };
}

function migrateLocalStorage(keys: string[], action: (values: any[]) => void) {
    if (!localStorage) return;

    const values = [];
    for (const key of keys) {
        try {
            const localValue = localStorage.getItem(key);
            if (localValue == null) return;
            values.push(JSON.parse(localValue));
        } catch (e) {
            console.error('Migration failure: ', e);
            return;
        }
    }
    for (const key of keys) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Migration failure: ', e);
            return;
        }
    }

    action(values);
}

export default function Page() {
    const [routines, setRoutines] = useLocalStorage<Routine[]>('Practice.routines', []);
    const [selectedRoutine, setSelectedRoutine] = useQueryParam<number>('routine', -1);

    const [editMode, setEditMode] = useState(false);
    const toggleEditMode = useCallback(() => {
        return setEditMode(!editMode);
    }, [editMode, setEditMode]);

    const routine: Routine | undefined = routines[selectedRoutine];

    const setRoutine = useCallback((routine: Routine) => {
        const nextRoutines = [...routines];
        nextRoutines[selectedRoutine] = routine;
        setRoutines(nextRoutines);
    }, [routines, setRoutines, selectedRoutine]);

    const insertRoutine = useCallback(() => {
        const nextRoutines = [...routines];
        nextRoutines.splice(selectedRoutine + 1, 0, getDefaultRoutine())
        setRoutines(nextRoutines);
    }, [routines, setRoutines, selectedRoutine]);

    const removeRoutine = useCallback((idx: number) => {
        const toDelete = routines[idx];
        if (toDelete && confirm(`Are you sure you want to delete the routine "${toDelete.title}"?`)) {
            const nextRoutines = [...routines];
            nextRoutines.splice(idx, 1);
            setRoutines(nextRoutines);
        }
    }, [routines, setRoutines]);

    useEffect(() => {
        migrateLocalStorage(
            ['Practice.routineTitle', 'Practice.practiceItems', 'Practice.currentPracticeItem'],
            ([title, exercises, currentPracticeItem]) => {
                const nextRoutines = [{title, exercises}, ...routines];
                setRoutines(nextRoutines);
            });
    }, [routines, setRoutine, selectedRoutine, setRoutines]);

    useEffect(() => {
        if (routines.length === 0 && editMode) {
            setEditMode(false);
        }
    }, [editMode, setEditMode, routines]);

    if (routine) {
        return <RoutineView routine={routine} setRoutine={setRoutine} />;
    }

    return <div className={styles.routinesPage}>
        <header>
            <h1>Routines</h1>

            <div className={`${styles.buttonToolbar} flex`}>
                <button className="flex-grow text-left" onClick={insertRoutine}>
                    <IoAddSharp /> New routine
                </button>
                <button onClick={toggleEditMode}>
                    <IoCreateSharp />
                    {editMode ? 'Stop edit' : 'Edit'}
                </button>
            </div>
        </header>

        <section className="mt-4">
            {!routines.length ?
                <h2>No routines yet</h2> :
                null}

            <ul className={styles.routines}>
                {routines.map((routine, id) =>
                    <li key={id} className="flex m-4">
                        <a className="flex-grow" href={`?routine=${id}`}>{routine.title}</a>
                        {editMode ? <button onClick={() => removeRoutine(id)}><IoTrashSharp /></button> : null}
                    </li>
                )}
            </ul>
        </section>
    </div>
}