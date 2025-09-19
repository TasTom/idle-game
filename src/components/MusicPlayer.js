import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);

  // Liste des musiques
  const playlist = [
    { title: "Enjoying beats", file: "/music/music1.wav" },
    { title: "Calm Factory", file: "/music/music2.wav" },
    { title: "Desert Winds", file: "/music/music3.wav" },
    { title: "Automation Flow", file: "/music/music4.ogg" },
    { title: "Rhythm Flow", file: "/music/music5.wav" },
    { title: "Factory Never Sleeps", file: "/music/FactoryNeverSleeps.mp3" }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      }
    }
  };

  const nextSong = (e) => {
    e.stopPropagation();
    const next = (currentSong + 1) % playlist.length;
    setCurrentSong(next);
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => setIsPlaying(false));
        }
      }, 100);
    }
  };

  const prevSong = (e) => {
    e.stopPropagation();
    const prev = (currentSong - 1 + playlist.length) % playlist.length;
    setCurrentSong(prev);
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => setIsPlaying(false));
        }
      }, 100);
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  // Fermer les contrôles en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.music-player-compact')) {
        setShowControls(false);
      }
    };

    if (showControls) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [showControls]);

  const selectSong = (index, e) => {
    e.stopPropagation();
    setCurrentSong(index);
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => setIsPlaying(false));
        }
      }, 100);
    }
  };

  // Icônes SVG compactes
  const PlayIcon = () => (
    <svg viewBox="0 0 24 24" className="music-icon">
      <path fill="currentColor" d="M8 5v14l11-7z"/>
    </svg>
  );

  const PauseIcon = () => (
    <svg viewBox="0 0 24 24" className="music-icon">
      <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  );

  const NextIcon = () => (
    <svg viewBox="0 0 24 24" className="music-icon">
      <path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
    </svg>
  );

  const PrevIcon = () => (
    <svg viewBox="0 0 24 24" className="music-icon">
      <path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
    </svg>
  );

  const VolumeIcon = () => (
    <svg viewBox="0 0 24 24" className="music-icon">
      <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm7 3c0-1.77 1.02-3.29 2.5-4.03v8.05C11.02 15.29 10 13.77 10 12z"/>
    </svg>
  );

  const MusicNoteIcon = () => (
    <svg viewBox="0 0 24 24" className="music-note-icon">
      <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
  );

  return (
    <div className="music-player-compact">
      <audio
        ref={audioRef}
        src={playlist[currentSong]?.file}
        onEnded={nextSong}
        preload="metadata"
        crossOrigin="anonymous"
      />
      
      <div className="music-widget-compact" onClick={toggleControls}>
        {/* Indicateur de lecture */}
        <div className="play-indicator">
          {isPlaying ? (
            <div className="wave-animation">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
            </div>
          ) : (
            <MusicNoteIcon />
          )}
        </div>

        {/* Info chanson */}
        <div className="song-info-compact">
          <div className="song-title-compact">
            {playlist[currentSong]?.title || 'No Music'}
          </div>
          <div className="song-counter-compact">
            {currentSong + 1}/{playlist.length}
          </div>
        </div>

        {/* Contrôles rapides */}
        <div className="quick-controls">
          <button onClick={togglePlay} className="play-btn-compact">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      </div>

      {/* Dropdown des contrôles étendus */}
      {showControls && (
        <div className="music-dropdown">
          <div className="dropdown-header">
            <MusicNoteIcon />
            <span>Music Player</span>
          </div>

          <div className="current-song">
            <div className="song-title-full">{playlist[currentSong]?.title}</div>
            <div className="song-progress">{currentSong + 1} / {playlist.length}</div>
          </div>

          <div className="playback-controls-compact">
            <button onClick={prevSong} className="control-btn">
              <PrevIcon />
            </button>
            <button onClick={togglePlay} className="control-btn play-main">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={nextSong} className="control-btn">
              <NextIcon />
            </button>
          </div>

          <div className="volume-section">
            <VolumeIcon />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider-compact"
            />
            <span className="volume-display">{Math.round(volume * 100)}%</span>
          </div>

          <div className="playlist-compact">
            <div className="playlist-title">🎵 Playlist</div>
            <div className="playlist-items">
              {playlist.map((song, index) => (
                <div
                  key={index}
                  className={`playlist-item-compact ${index === currentSong ? 'active' : ''}`}
                  onClick={(e) => selectSong(index, e)}
                >
                  <span className="track-num">{index + 1}</span>
                  <span className="track-name">{song.title}</span>
                  {index === currentSong && isPlaying && (
                    <div className="playing-indicator-small">♪</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
