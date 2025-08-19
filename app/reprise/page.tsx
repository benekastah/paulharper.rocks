import styles from "./reprise.module.css";

export default function Reprise() {
    var logoSize = 100;
    var screenshotWidth = 270;
    return <article id={styles.repriseArticle}>
        <header>
            <div id={styles.repriseLogo}>
                <img className={styles.light} width={logoSize} height={logoSize}
                     src="/img/logos/reprise-light.png" alt="Reprise Music Practice logo" />
                <img className={styles.dark} width={logoSize} height={logoSize}
                     src="/img/logos/reprise-dark.png" alt="Reprise Music Practice logo" />
            </div>
            <h1>
                Reprise - Coming Soon!
            </h1>
            <p>Published <time dateTime="2025-08-10">Sunday, August 10,
            2025</time>.</p>

            <div className={styles.clearBoth} />
        </header>

        <div id={styles.repriseScreenshot}>
            <img className={styles.light} width={screenshotWidth} height="auto"
                 src="/img/reprise/1_basic_usage_light.png"
                 alt="A screenshot of Reprise" />
            <img className={styles.dark} width={screenshotWidth} height="auto"
                 src="/img/reprise/1_basic_usage_dark.png"
                 alt="A screenshot of Reprise" />
        </div>

        <center><strong>Don&apos;t just practice. Progress.</strong></center>

        <p>
        Practicing music should feel rewarding. But too often, it&apos;s messy —
        juggling different exercises, trying to remember your last tempo, or
        losing track of what you planned to play. I&apos;ve been there.</p>

        <p>
        I&apos;m a guitarist, solo app developer, and dad of two. Between
        family, work, and music, my practice time is precious. I wanted a tool
        that would help me make the most of it — simple, fast, and built for
        players at every level.</p>

        <p>
        That&apos;s why I made Reprise. It keeps your routines, tempos, and
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

        <p>Reprise will soon be available for iPhone. I built it for myself,
        but I hope it helps you, too.</p>

        <p><small><a href="/reprise/privacy">Privacy policy</a></small></p>
    </article>;
}
