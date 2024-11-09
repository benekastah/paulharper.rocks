import { Chord } from "./Chord";
import styles from "./noteTrainer.module.css";

type Props = {
    chord: Chord,
    index: number,
};


export default function ChordCircle({chord, index = 0}: Props) {
    return <div className={`${styles.chordCircle} ${styles['index-' + index]}`}>
        {chord.toString()}
    </div>
}