import styles from './noteTrainer.module.css';
import { Howler } from 'howler';
import { IoVolumeHighSharp, IoVolumeMuteSharp } from "react-icons/io5";
import { useCallback, useEffect, useState } from "react";


export default function MuteButton() {
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        muted ? Howler.volume(0) : Howler.volume(1);
    }, [muted]);

    const onUnmute = useCallback(() => {
        setMuted(false);
    }, [setMuted]);

    const onMute = useCallback(() => {
        setMuted(true);
    }, [setMuted]);

    return muted ?
        <button onClick={onUnmute} className={styles.unmute}>
            <IoVolumeHighSharp />
        </button> :
        <button onClick={onMute} className={styles.mute}>
            <IoVolumeMuteSharp />
        </button>;
}