// ==UserScript==
// @name         FUCK html audio
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract and play audio with a button using HLS.js
// @author       GPT4
// @match        file:///*/*.html
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/hls.js@latest
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
      button.play-button {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
      }
    `);

    function playAudio() {
        let audioElement = document.querySelector('audio[data-savepage-src]');
        if (audioElement) {
            let audioSrc = audioElement.getAttribute('data-savepage-src');

            let audioPlayer = document.createElement('audio');
            audioPlayer.id = 'audio-player';
            audioPlayer.style.position = 'fixed';
            audioPlayer.style.top = '50px';
            audioPlayer.style.right = '10px';
            audioPlayer.style.zIndex = '10000';
            audioPlayer.controls = true;

            if (Hls.isSupported()) {
                let hls = new Hls();
                hls.loadSource(audioSrc);
                hls.attachMedia(audioPlayer);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    audioPlayer.play();
                });
            } else if (audioPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                audioPlayer.src = audioSrc;
                audioPlayer.addEventListener('loadedmetadata', () => {
                    audioPlayer.play();
                });
            }
            document.body.appendChild(audioPlayer);
        }
    }

    let playButton = document.createElement('button');
    playButton.textContent = 'Play Audio';
    playButton.className = 'play-button';
    playButton.addEventListener('click', playAudio);

    document.body.appendChild(playButton);
})();
