import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);

  // Liste des musiques
  const playlist = [
    {
      title: "Enjoying beats",
      file: "/music/music1.wav"
    },
    {
      title: "Calm Factory",
      file: "/music/music2.wav"
    },
    {
      title: "Desert Winds",
      file: "/music/music3.wav"
    },
    {
      title: "Automation Flow",
      file: "/music/music4.ogg"
    },
    {
      title: "rhythm Flow",
      file: "/music/music5.wav"
    },
    {
      title: "Factory never sleeps",
      file: "/music/FactoryNeverSleeps.mp3"
    }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    const next = (currentSong + 1) % playlist.length;
    setCurrentSong(next);
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const prevSong = () => {
    const prev = (currentSong - 1 + playlist.length) % playlist.length;
    setCurrentSong(prev);
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const handleSongEnd = () => {
    nextSong();
  };

  // 🎨 NOUVEAUX COMPOSANTS D'ICÔNES STYLÉS
  const PlayIcon = () => (
    <svg viewBox="0 0 24 24" className="control-icon">
      <path fill="currentColor" d="M8 5v14l11-7z"/>
    </svg>
  );

  const PauseIcon = () => (
    <svg viewBox="0 0 24 24" className="control-icon">
      <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  );

  const NextIcon = () => (
    <svg viewBox="0 0 24 24" className="control-icon">
      <path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
    </svg>
  );

  const PrevIcon = () => (
    <svg viewBox="0 0 24 24" className="control-icon">
      <path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
    </svg>
  );

  const VolumeIcon = () => (
    <svg viewBox="0 0 24 24" className="volume-icon">
      <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  );

  const MusicNoteIcon = () => (
    <svg viewBox="0 0 24 24" className="music-note-icon">
      <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
  );

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={playlist[currentSong]?.file}
        onEnded={handleSongEnd}
        preload="metadata"
      />
      
      <div 
        className="music-widget"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Mini player toujours visible */}
        <div className="mini-player">
          <button 
            onClick={togglePlay}
            className="play-button styled-button"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className="song-info">
            <div className="song-header">
              <MusicNoteIcon />
              <span className="song-title">
                {playlist[currentSong]?.title || 'No Music'}
              </span>
            </div>
            <div className="song-counter">
              {currentSong + 1} / {playlist.length}
            </div>
          </div>
        </div>

        {/* Contrôles étendus au survol */}
        {showControls && (
          <div className="extended-controls">
            <div className="playback-controls">
              <button onClick={prevSong} className="control-btn styled-control">
                <PrevIcon />
              </button>
              <button onClick={togglePlay} className="control-btn main-play styled-control">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button onClick={nextSong} className="control-btn styled-control">
                <NextIcon />
              </button>
            </div>
            
            <div className="volume-control">
              <VolumeIcon />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="volume-slider styled-slider"
              />
              <span className="volume-percent">{Math.round(volume * 100)}%</span>
            </div>
            
            <div className="playlist">
              <div className="playlist-header">
                <span>🎵 Playlist</span>
              </div>
              {playlist.map((song, index) => (
                <div
                  key={index}
                  className={`playlist-item ${index === currentSong ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentSong(index);
                    if (isPlaying) {
                      setTimeout(() => audioRef.current?.play(), 100);
                    }
                  }}
                >
                  <div className="playlist-item-content">
                    <span className="track-number">{index + 1}</span>
                    <span className="track-title">{song.title}</span>
                    {index === currentSong && isPlaying && (
                      <div className="playing-indicator">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
