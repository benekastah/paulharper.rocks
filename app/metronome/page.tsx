import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Metronome from "./Metronome";
import Transport from "../transport/Transport";


export default function Page() {
    const [play, setPlay] = useState(false);

    const [beats, setBeats] = useLocalStorage('Metronome.beats', 6);
    const [bpm, setBpm] = useLocalStorage('Metronome.bpm', 60);

    return <div>
        <Transport play={play} onPlay={} onPause={} />
        <Metronome play={play} beats={beats} bpm={bpm} />
    </div>;
}