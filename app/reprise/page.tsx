import styles from "./reprise.module.css";

export default function Reprise() {
    return <article>
        <header>
            <h1>
                <img className={styles.light} width="75" height="75" src="/img/logos/reprise-light.png" />
                <img className={styles.dark} width="75" height="75" src="/img/logos/reprise-dark.png" />
                Reprise
            </h1>
            <p>Published <time datetime="2025-08-10">Sunday, August 10,
            2025</time>.</p>
        </header>

        <p>Practicing music should feel rewarding. But too often, it&apos;s messy —
        flipping between exercises, trying to remember your last tempo, or
        losing track of what you planned to play. I&apos;ve been there.</p>

        <p>
        I&apos;m Paul Harper — guitarist, multi-instrumentalist, solo app developer,
        and dad of two. Between family, work, and music, my practice time is
        precious. I wanted a tool that would help me make the most of it —
        simple, fast, and built for real musicians.
        </p>

        <p>That&apos;s why I made Reprise. It keeps your routines, tempos, and
        exercises in one place, so you can focus on playing — not fiddling
        with settings. Open the app, tap your next exercise, and play.
        That&apos;s it. With Reprise, you can:</p>

        <ul>
            <li>
                Create and save custom practice routines
            </li>
            <li>
                Jump between exercises with a single tap
            </li>
            <li>
                Have tempos automatically remembered for each exercise
            </li>
            <li>
                Keep practice flowing without breaking focus
            </li>
        </ul>

        <p>Reprise is available now for iPhone. I built it for myself, but I
        hope it helps you, too.</p>

        <p><strong>Don&apos;t just practice. Progress.</strong></p>

        <div id={styles.repriseScreenshot}>
            <img className={styles.light} width="350" height="auto"
                src="/img/reprise/1_basic_usage_light.png"
                alt="A screenshot of Reprise" />
            <img className={styles.dark} width="350" height="auto"
                src="/img/reprise/1_basic_usage_dark.png"
                alt="A screenshot of Reprise" />
        </div>
    </article>;
}
