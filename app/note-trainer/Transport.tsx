import { IoPlaySharp, IoPauseSharp, IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5";

import styles from './noteTrainer.module.css';
import { useEffect } from "react";


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

    return <div className={`flex ${styles.transport}`}>
        <button onClick={onSkipBack}>
            <IoPlaySkipBackSharp />
        </button>
        {play ?
            <button onClick={onPause}>
                <IoPauseSharp />
            </button> :
            <button onClick={onPlay}>
                <IoPlaySharp />
            </button>}
        <button onClick={onSkipForward}>
            <IoPlaySkipForwardSharp />
        </button>
    </div>
}