---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

# Reel

<link rel="stylesheet" href="{{ '/assets/css/songs.css' | relative_url }}" />
<ul class="songs">
  {% for song in site.data.songs %}
    <li class="song">
      <header>
        <h2>{{ song.title }}</h2>
        <ul class="links">
          {% for link in song.links %}
            <li>
              <a target="_blank" href="{{ link.url }}">
                {% if link.icon == "spotify" %}
                  <img src="{{ '/assets/img/logos/spotify-100.png' | relative_url }}" width=30 height=30 alt="Spotify" />
                {% elsif link.icon == "apple_music" %}
                  <img src="{{ '/assets/img/logos/apple-music.svg' | relative_url }}" width=30 height=30 alt="Apple Music" />
                {% elsif link.icon == "youtube" %}
                  <img src="{{ '/assets/img/logos/youtube.png' | relative_url }}" width=30 height=30 alt="YouTube" />
                {% elsif link.icon == "soundcloud" %}
                  <img src="{{ '/assets/img/logos/soundcloud.jpg' | relative_url }}" width=30 height=30 alt="Soundcloud" />
                {% endif %}
              </a>
            </li>
          {% endfor %}
        </ul>
      </header>
      <p><em>{{ song.byline }}</em></p>
    </li>
  {% endfor %}
</ul>

# Services & Pricing

[Contact me](mailto:{{ site.email }}) to inquire about my services or if you have any other questions. I'd love to hear from you!

## Mixing

**Special: new clients get first mix free!**

$300 to mix a song. 3 revisions included, more can be negotiated if needed.

## Mastering

$30 to master a song. 3 revisions included, more can be negotiated if needed.

## Producing & Recording

[Contact me](mailto:{{ site.email }}) for pricing information.
