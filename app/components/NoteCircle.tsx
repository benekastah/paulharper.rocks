import { Note } from "../util/notes";
import styles from "./noteCircle.module.css";

type Props = {
    note: Note,
    index: number,
};


export default function NoteCircle({note, index = 0}: Props) {
    return <div className={`${styles.noteCircle} ${styles['index-' + index]}`}>
        {note.toString()}
    </div>
}