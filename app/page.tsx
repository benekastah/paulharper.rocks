import styles from "./home.module.css";

const EMAIL_ADDRESS = "paul@paulharper.rocks";

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
            <a target="_blank" href={youtubeUrl}>
              <img src="/img/logos/youtube.png" width={30} height={30} alt="YouTube" />
            </a> :
            null}
          {soundCloudUrl ?
            <a target="_blank" href={soundCloudUrl}>
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
      <section id={styles.reel}>
        <h2>Reel</h2>
        <ul className={styles.songs}>
          <Song
            title="Real Strange"
            byline="Written, produced, performed, recorded, and mixed by Paul Harper"
            spotifyUrl="https://open.spotify.com/track/1irezkQZjaQG8PlpupCfSW?si=8dc07e5ae1254a2f"
            appleMusicUrl="https://music.apple.com/us/album/real-strange/1789381927?i=1789381928"
            youtubeUrl="https://youtu.be/Cku5Z-kUX-s?si=h9nteUGlBDCX07sy"
          />
          <Song
            title="Pull Me out of My Head"
            byline="Written, produced, performed, recorded, and mixed by Paul Harper"
            spotifyUrl="https://open.spotify.com/track/56hDPnmknpGyJnL4Va723k?si=3224591ceb9346a2"
            appleMusicUrl="https://music.apple.com/us/album/pull-me-out-of-my-head/1789381927?i=1789381929"
            youtubeUrl="https://youtu.be/07XjT_NrVF4?si=eGuqYDCQGWelRd03"
          />
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

      <section id={styles.reprise}>
        <h2>Reprise Music Practice</h2>
        <h3>Coming Soon to the App Store!</h3>

        <p>Stay motivated, build lasting habits, and turn everyday practice into steady progress. With Reprise, every session brings you closer to mastering your craft.</p>

        <p><a href="/reprise">Learn more &raquo;</a></p>
      </section>
    </>
  );
}
