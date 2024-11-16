import { IoPlaySharp, IoPauseSharp, IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5";

import styles from './noteTrainer.module.css';
import { useCallback, useEffect } from "react";
import React from "react";


type Props = {
    play: boolean,
    onSkipBack: () => void,
    onPlay: () => void,
    onPause: () => void,
    onSkipForward: () => void,
};


export default function Transport({play, onSkipBack, onPlay, onPause, onSkipForward}: Props) {
    useEffect(() => {
        function onKeyup(this: Document, ev: KeyboardEvent) {
            if (ev.key === " ") {
                play ? onPause() : onPlay();
            } else if (ev.key === "ArrowRight") {
                onSkipForward();
            } else if (ev.key === "ArrowLeft") {
                onSkipBack();
            }
        }

        document.addEventListener('keyup', onKeyup);

        return () => document.removeEventListener('keyup', onKeyup);
    }, [play, onPlay, onPause]);

    const preventDefault: React.KeyboardEventHandler<HTMLButtonElement> = useCallback(
        (ev) => ev.preventDefault(), []);

    return <div className={`flex ${styles.transport}`}>
        <button onClick={onSkipBack} onKeyUp={preventDefault}>
            <IoPlaySkipBackSharp />
        </button>
        {play ?
            <button onClick={onPause} onKeyUp={preventDefault}>
                <IoPauseSharp />
            </button> :
            <button onClick={onPlay} onKeyUp={preventDefault}>
                <IoPlaySharp />
            </button>}
        <button onClick={onSkipForward} onKeyUp={preventDefault}>
            <IoPlaySkipForwardSharp />
        </button>
    </div>
}