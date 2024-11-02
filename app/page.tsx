import styles from "./home.module.css";

const EMAIL_ADDRESS = "me@paulharper.rocks";

type SongProps = {
  title: string,
  byline: string,
  spotifyUrl?: string,
  appleMusicUrl?: string,
  youtubeUrl?: string,
  soundCloudUrl?: string,
};

function Song({title, byline, spotifyUrl, appleMusicUrl, youtubeUrl, soundCloudUrl}: SongProps) {
  return <li className={styles.song}>
    <header>
      <h3 className="flex-grow">{title}</h3>
      <ul className={`${styles.links} flex flex-row`}>
        <li>
          {spotifyUrl ?
            <a target="_blank" href={spotifyUrl}>
              <img src="/img/logos/spotify-100.png" width={30} height={30} alt="Spotify" />
            </a> :
            null}
          {appleMusicUrl ?
            <a target="_blank" href={appleMusicUrl}>
              <img src="/img/logos/apple-music.svg" width={30} height={30} alt="Apple Music" />
            </a> :
            null}
          {youtubeUrl ?
            <a target="_blank" href={appleMusicUrl}>
              <img src="/img/logos/youtube.png" width={30} height={30} alt="YouTube" />
            </a> :
            null}
          {soundCloudUrl ?
            <a target="_blank" href={appleMusicUrl}>
              <img src="/img/logos/soundcloud.jpg" width={30} height={30} alt="SoundCloud" />
            </a> :
            null}
        </li>
      </ul>
    </header>
    <p><em>{byline}</em></p>
  </li>
}


export default function Home() {
  return (
    <>
      <section>
        <h2>Reel</h2>
        <ul className={styles.songs}>
          <Song
            title="Go Your Way"
            byline="Written, produced, performed, recorded, and mixed by Paul Harper"
            spotifyUrl="https://open.spotify.com/track/1xIDgCfUdWjJ3cFhbxHIIL?si=568d871e707c47d5"
            appleMusicUrl="https://music.apple.com/us/album/go-your-way/1690266709?i=1690266710"
            youtubeUrl="https://youtu.be/rBuoHSqZUDk?si=M468LbGz3z6tnYBl"
          />
          <Song
            title="Assembly Line"
            byline="Written, produced, performed, mixed, and mastered by Paul Harper"
            soundCloudUrl="https://soundcloud.com/meat-interactive/assembly-line?si=7c4ae3b665c247cbb08ced287272f262&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
          />
        </ul>
      </section>

      <section>
        <h2>Services & Pricing</h2>

        <p><a href={`mailto:${EMAIL_ADDRESS}`}>Contact me</a> to inquire about
        my services or if you have any other questions. I&apos;d love to hear from
        you!</p>

        <h3>Mixing</h3>

        <p><strong>Special: new clients get first mix free!</strong></p>

        <p>$300 to mix a song. 3 revisions included, more can be negotiated if needed.</p>

        <h3>Mastering</h3>

        <p>$30 to master a song. 3 revisions included, more can be negotiated if needed.</p>

        <h3>Producing & Recording</h3>

        <p><a href={`mailto:${EMAIL_ADDRESS}`}>Contact me</a> for pricing information.</p>
      </section>
    </>
  );
}
