import styles from "./privacy.module.css";

function HTMLDate({date}: {date: Date}) {
    var isoDate = date.toISOString().split('T')[0];
    return <time dateTime={isoDate}>{date.toLocaleDateString()}</time>;
}

export default function Privacy() {
    var effectiveDate = new Date("2025-08-17");
    var updatedDate = new Date("2025-08-17");

    return <article id={styles.privacy}>
        <header>
            <h1>Privacy Policy for Reprise Music Practice</h1>
            <p className={styles.muted}><strong>Effective Date:</strong> <HTMLDate date={effectiveDate} /></p>
        </header>

        <section>
            <p>
            Reprise Music Practice (“the App”, “we”, “us”) respects your
            privacy. This policy explains what information the App collects,
            how it is used, and your choices. </p>
        </section>

        <section>
            <h2>Information We Collect</h2>
            <p>The App uses Google Firebase services to automatically collect diagnostic and usage data:</p>
            <ul>
                <li><strong>Crash and Performance Data</strong> (via Firebase Crashlytics), which may include:
                device type and operating system version, app version, technical details about errors or crashes,
                and basic usage context when a crash occurred.
                </li>
                <li><strong>Usage Analytics</strong> (via Firebase Analytics), which may include:
                app open counts, screens/features used, general interaction data (e.g., taps, session length),
                device and platform information (e.g., model, OS version).
                </li>
            </ul>
            <p><strong>We do not collect personal identifiers</strong> such as your name, email address, or contact details through the App.</p>
        </section>

        <section>
            <h2>How We Use Information</h2>
            <ul>
                <li>Diagnose and fix bugs and crashes</li>
                <li>Understand how the App is used to improve features, usability, and performance</li>
            </ul>
            <p>We do not sell your data or use it for third-party advertising.</p>
        </section>

        <section>
            <h2>Third-Party Services</h2>
            <p>
            The App uses <strong>Google Firebase Analytics</strong> and <strong>Google Firebase Crashlytics</strong>.
            Data collected by these services is processed in accordance with{' '}
            <a href="https://policies.google.com/privacy" rel="noopener" target="_blank">Google’s Privacy Policy</a>.
            You can also find more information on Firebase's <a href="https://firebase.google.com/support/privacy" rel="noopener" target="_blank">Privacy and Security</a> page.
            </p>
        </section>

        <section>
            <h2>Data Retention</h2>
            <p>
            Crash and analytics data may be retained by Google for operational purposes.
            We access and use this data only to maintain and improve the App.
            </p>
        </section>

        <section>
            <h2>Your Choices</h2>
            <p>
                Crash reporting and analytics are <strong>enabled by default</strong> to help us
                quickly fix bugs and improve the App. However, you can easily disabe this
                feature at any time from the in-app settings.
            </p>
            <p>
                After changing this setting, you will need to <strong>restart the App</strong> for
                the change to take full effect. Until the restart, telemetry may continue to be
                sent. Once restarted, no new diagnostic or usage data will be collected or sent
                if you have opted out.
            </p>
            <p>
                Previously collected data may still be retained by Google for operational
                purposes in accordance with their policies.
            </p>
        </section>

        <section>
            <h2>Security</h2>
            <p>
            We take reasonable measures to protect the diagnostic and usage data we access. However, no method of transmission
            or storage is completely secure.
            </p>
        </section>

        <section>
            <h2>Changes to This Policy</h2>
            <p>
            We may update this Privacy Policy from time to time. Updates will be posted here with a revised effective date.
            </p>
        </section>

        <section>
            <h2>Contact Us</h2>
            <p>
            If you have questions about this Privacy Policy, please contact:<br />
            <strong>Paul Harper</strong><br />
            Email: <a href="mailto:paul@paulharper.rocks">paul@paulharper.rocks</a><br />
            Website: <a href="https://paulharper.rocks" target="_blank" rel="noopener">paulharper.rocks</a>
            </p>
        </section>

        <footer>
            <p className={styles.muted}>Last updated: <HTMLDate date={updatedDate} /></p>
        </footer>
    </article>
}
