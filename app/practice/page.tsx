"use client";

import { useCallback, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

import RoutineView, { Routine } from "./Routine";
import useQueryParam from "../hooks/useQueryParam";
import { IoAddSharp, IoTrashSharp } from "react-icons/io5";

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

    const removeRoutine = useCallback(() => {
        if (confirm("Are you sure you want to delete this routine?")) {
            const nextRoutines = [...routines];
            nextRoutines.splice(selectedRoutine, 1);
            setRoutines(nextRoutines);
            if (nextRoutines.length >= selectedRoutine) {
                setSelectedRoutine(nextRoutines.length - 1);
            }
        }
    }, [selectedRoutine, setSelectedRoutine, routines, setRoutines]);

    useEffect(() => {
        migrateLocalStorage(
            ['Practice.routineTitle', 'Practice.practiceItems', 'Practice.currentPracticeItem'],
            ([title, exercises, currentPracticeItem]) => {
                const nextRoutines = [{title, exercises}, ...routines];
                setRoutines(nextRoutines);
            });
    }, [routines, setRoutine, selectedRoutine]);

    return <div>
        {!routine ?
            <div>
                <header>
                    <h1>Routines</h1>

                    <div className={styles.buttonToolbar}>
                        <button onClick={insertRoutine}>
                            <IoAddSharp /> New routine
                        </button>
                        <button disabled={routines.length === 0} onClick={removeRoutine}>
                            <IoTrashSharp /> Delete routine
                        </button>
                    </div>

                    <ul>
                        {routines.map((routine, id) =>
                            <li key={id}>
                                <a href={`?routine=${id}`}>{routine.title}</a>
                            </li>
                        )}
                    </ul>

                </header>

                <section>
                    {!routines.length ? <h2>No routines yet</h2> : null}
                </section>
            </div> :
            <RoutineView
                routine={routine} setRoutine={setRoutine}
            />}
    </div>
}