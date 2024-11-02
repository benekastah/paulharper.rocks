import { Chord } from "./Chord";
import { Note } from "./Note";
import styles from "./noteTrainer.module.css";

type Props = {
    note: Note | Chord,
    index: number,
};


export default function NoteCircle({note, index = 0}: Props) {
    return <div className={`${styles.noteCircle} ${styles['index-' + index]}`}>
        {note.toString()}
    </div>
}