import { Chord } from "../util/chords";
import styles from "./noteCircle.module.css";

type Props = {
    chord: Chord,
    index: number,
};

export default function ChordCircle({chord, index = 0}: Props) {
    return <div className={`${styles.chordCircle} ${styles['index-' + index]}`}>
        {chord.toString()}
    </div>
}