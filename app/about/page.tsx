import styles from "./about.module.css";

export default function About() {
    return <>
        <img className={styles.heroImage} src="/img/paul_guitar.jpg" alt="Paul playing guitar" />
        <p>
            I've always loved music, and from a young age I wanted to make my
            own. At age 12 I got my first guitar and I've been loving it ever
            since. By age 15 I was recording my own tracks with a crappy little
            microphone and the open-source DAW Audacity.
        </p>

        <p>
            I've upgraded my tools since then, but my fundamental goal remains
            the same: to make great tunes and have fun doing it.  I work in a
            variety of genres, including folk, country, alt rock, classic rock,
            punk rock, electronic, and more. Let's bring your sonic vision to
            life together!
        </p>
    </>;
}