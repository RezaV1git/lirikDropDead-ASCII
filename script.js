const audio = document.getElementById('myAudio');
const asciiLyric = document.getElementById('asciiLyric');
const spotifyUI = document.getElementById('spotifyUI');
const waveform = document.getElementById('waveform');
const progressBar = document.getElementById('progressBar');

// Elemen untuk tahap video
const videoStage = document.getElementById('videoStage');
const videoAsciiContainer = document.getElementById('videoAscii');
const videoLyric = document.getElementById('videoLyric');
const bgVideo = document.getElementById('bgVideo');

// Elemen untuk tahap gambar
const imageStage = document.getElementById('imageStage');
const imageLyric = document.getElementById('imageLyric');
const imageCanvas = document.getElementById('imageCanvas');
const imgCtx = imageCanvas ? imageCanvas.getContext('2d') : null;

// Muat gambar ke dalam memori
const img1 = new Image();
img1.src = 'gambar1.jpg'; // Pastikan file ini ada

const img2 = new Image();
img2.src = 'gambar2.jpg'; // Pastikan file ini ada

// PERSIAPAN KANVAS UNTUK KONVERSI VIDEO KE ASCII BERWARNA
// 1. Canvas tersembunyi (Kecil) untuk membaca pixel dari video asli
const vCanvas = document.createElement('canvas');
const vCtx = vCanvas.getContext('2d', { willReadFrequently: true });
vCanvas.width = 90;  // Kerapatan kolom karakter (atur lebih besar untuk detail lebih tajam)
vCanvas.height = 70; // Kerapatan baris karakter

// 2. Canvas visual (Besar) untuk menggambar teks berwarna ke layar Anda tanpa lag
const drawCanvas = document.createElement('canvas');
drawCanvas.width = 720; 
drawCanvas.height = 540; 
videoAsciiContainer.appendChild(drawCanvas);
const drawCtx = drawCanvas.getContext('2d');

const timeline = [
    { time: 0.0,  text: "Drop Dead\nOlivia Rodrigo", showUI: false },
    { time: 7.0,  text: "",         showUI: false },
    { time: 8.2,  text: "One",       showUI: true },
    { time: 9.0,  text: "night",     showUI: true },
    { time: 9.6,  text: "I",        showUI: true },
    { time: 10.1,  text: "Was",  showUI: true },
    { time: 10.5, text: "Bored",      showUI: true },
    { time: 11.1, text: "in",      showUI: true },
    { time: 11.5, text: "Bed",      showUI: true },
    { time: 11.9, text: "And",      showUI: true },
    { time: 12.4, text: "Stalked",      showUI: true },
    { time: 12.9, text: "You",      showUI: true },
    { time: 13.4, text: "One",      showUI: true },
    { time: 13.9, text: "The",      showUI: true },
    { time: 14.5, text: "Internet",      showUI: true },
    { time: 16.0, text: "It's",      showUI: true },
    { time: 16.3, text: "Feminine",      showUI: true },
    { time: 17.1, text: "Intution",      showUI: true },
    { time: 19.1, text: "cause",      showUI: true },
    { time: 19.5, text: "I",      showUI: true },
    { time: 19.8, text: "Always",      showUI: true },
    { time: 20.1, text: "Had",      showUI: true },
    { time: 20.4, text: "a",      showUI: true },
    { time: 20.8, text: "Vision",      showUI: true },
    { time: 21.0, text: "Of",      showUI: true },
    { time: 21.3, text: "us",      showUI: true },
    { time: 21.8, text: "Standing",      showUI: true },
    { time: 22.4, text: "Like",      showUI: true },
    { time: 22.7, text: "This",      showUI: true },
    
    // --- TAHAP VIDEO MULAI DI SINI ---
    // Gunakan properti showVideo: true untuk mematikan UI Spotify dan lirik atas
    { time: 23.5, text: "All",   showUI: false, showVideo: true },
    { time: 23.7, text: "Pressed",        showUI: false, showVideo: true },
    { time: 24.2, text: "Up",        showUI: false, showVideo: true },
    { time: 24.4, text: "in",       showUI: false, showVideo: true },
    { time: 24.8, text: "The",  showUI: false, showVideo: true },
    { time: 25.3, text: "Bathroom",      showUI: false, showVideo: true },
    { time: 25.9, text: "Line",    showUI: false, showVideo: true },
    { time: 26.5, text: "You",    showUI: false, showVideo: true },
    { time: 26.9, text: "Lookin'",    showUI: false, showVideo: true },
    { time: 27.3, text: "Like",    showUI: false, showVideo: true },
    { time: 27.9, text: "An",    showUI: false, showVideo: true },
    { time: 28.2, text: "Angel",    showUI: false, showVideo: true },
    { time: 28.6, text: "On",    showUI: false, showVideo: true },
    { time: 28.9, text: "The",    showUI: false, showVideo: true },
    { time: 29.3, text: "Walls",    showUI: false, showVideo: true },
    { time: 29.6, text: "Of",    showUI: false, showVideo: true },
    { time: 29.9, text: "Versailes",    showUI: false, showVideo: true },
    { time: 30.5, text: "The",    showUI: false, showVideo: true },
    { time: 30.8, text: "Most",    showUI: false, showVideo: true },
    { time: 31.4, text: "Alive",    showUI: false, showVideo: true },
    { time: 31.9, text: "I've",    showUI: false, showVideo: true },
    { time: 32.4, text: "Ever",    showUI: false, showVideo: true },
    { time: 33.2, text: "Been",    showUI: false, showVideo: true },
    { time: 33.9, text: "But",    showUI: false, showVideo: true },
    { time: 34.4, text: "Kiss",    showUI: false, showVideo: true },
    { time: 34.7, text: "Me",    showUI: false, showVideo: true },
    { time: 35.2, text: "And",    showUI: false, showVideo: true },
    { time: 35.7, text: "I",    showUI: false, showVideo: true },
    { time: 36.0, text: "Might",    showUI: false, showVideo: true },

    // --- TAHAP GAMBAR ASCII MULAI DI SINI ---
    
    // 1. JEDA: Layar gelap sejenak setelah lirik "Might" selesai di detik 37.0
    { time: 37.0, text: "", showUI: false, showVideo: false, showImage: 0 },
    
    // 2. GAMBAR PERTAMA: Muncul di detik 38.0 dengan lirik/teks kustom di bawahnya
    { time: 38.0, text: "", showUI: false, showVideo: false, showImage: 1 },

    // 3. GAMBAR KEDUA: Muncul di detik 40.0 (ganti tulisan "Gambar 2" sesuai selera Anda)
    { time: 40.0, text: "", showUI: false, showVideo: false, showImage: 2 }
];

let currentEventIndex = -1;

function generateAscii(text, isOutline = false) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    canvas.width = 200; 
    canvas.height = 55;
    
    // Background biru sebagai chroma key
    ctx.fillStyle = "blue"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 20px 'Courier New', Impact, monospace";
    
    const lines = text.split('\n');
    
    if (isOutline) {
        // Outline Putih
        ctx.strokeStyle = "white"; 
        ctx.lineWidth = 5; 
        ctx.lineJoin = "round";    
        
        if (lines.length > 1) {
            ctx.strokeText(lines[0], canvas.width / 2, 20);
            ctx.strokeText(lines[1], canvas.width / 2, 40);
        } else {
            ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
        }

        // Isi Hitam
        ctx.fillStyle = "black"; 
        if (lines.length > 1) {
            ctx.fillText(lines[0], canvas.width / 2, 20);
            ctx.fillText(lines[1], canvas.width / 2, 40);
        } else {
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        }
    } else {
        // Teks lirik awal (Putih Solid)
        ctx.fillStyle = "white";
        if (lines.length > 1) {
            ctx.fillText(lines[0], canvas.width / 2, 20);
            ctx.fillText(lines[1], canvas.width / 2, 40);
        } else {
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        }
    }
    
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let result = "";
    
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const r = data[(y * canvas.width + x) * 4];      
            const b = data[(y * canvas.width + x) * 4 + 2];  
            
            if (isOutline) {
                if (r > 150) {
                    // Garis luar: M putih dengan latar belakang hitam pekat
                    result += "<span style='color: white; background-color: black; text-shadow: 0 0 2px white;'>M</span>";
                } else if (b < 100) {
                    // Isi huruf: M hitam dengan latar belakang hitam pekat (memblokir video)
                    result += "<span style='color: black; background-color: black;'>M</span>";
                } else {
                    // Luar kata: transparan agar video di sekitar teks tetap terlihat
                    result += "&nbsp;";
                }
            } else {
                if (r > 150) {
                    result += "M";
                } else {
                    result += "&nbsp;";
                }
            }
        }
        result += "<br>";
    }
    return result;
}

const totalWaveCols = 75;
const wavePhases = new Array(totalWaveCols).fill(0).map(() => Math.random() * Math.PI * 2);
const waveSpeeds = new Array(totalWaveCols).fill(0).map(() => 0.22 + Math.random() * 0.28);

function updateWaveform() {
    let r0 = "", r1 = "", r2 = "", r3 = "", r4 = "";
    const center = totalWaveCols / 2;

    for (let i = 0; i < totalWaveCols; i++) {
        const distance = Math.abs(i - center) / center;
        const envelope = 1 - Math.pow(distance, 1.5);
        wavePhases[i] += waveSpeeds[i];

        const wave = (Math.sin(wavePhases[i]) + 0.5 * Math.sin(wavePhases[i] * 2.3)) / 1.5;
        const level = (wave + 1) / 2; 

        const amplitude = envelope * level;

        if (amplitude > 0.75) {
            r0 += "b"; r1 += "b"; r2 += "b"; r3 += "b"; r4 += "b";
        } else if (amplitude > 0.5) {
            r0 += " "; r1 += "b"; r2 += "b"; r3 += "b"; r4 += " ";
        } else if (amplitude > 0.22) {
            r0 += " "; r1 += " "; r2 += "b"; r3 += " "; r4 += " ";
        } else {
            r0 += " "; r1 += " "; r2 += "."; r3 += " "; r4 += " ";
        }
    }

    waveform.innerHTML = r0 + "<br>" + r1 + "<br>" + r2 + "<br>" + r3 + "<br>" + r4;
    setTimeout(updateWaveform, 60);
}

function generateControlsAscii() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = 60;
    canvas.height = 9;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    const midY = canvas.height / 2;

    function triangleLeft(cx, size) {
        ctx.beginPath();
        ctx.moveTo(cx + size, midY - size);
        ctx.lineTo(cx - size, midY);
        ctx.lineTo(cx + size, midY + size);
        ctx.closePath();
        ctx.fill();
    }
    function triangleRight(cx, size) {
        ctx.beginPath();
        ctx.moveTo(cx - size, midY - size);
        ctx.lineTo(cx + size, midY);
        ctx.lineTo(cx - size, midY + size);
        ctx.closePath();
        ctx.fill();
    }

    ctx.fillRect(4, midY - 3.5, 1.2, 7);
    triangleLeft(11, 3);
    ctx.fillRect(26, midY - 3.5, 1.8, 7);
    ctx.fillRect(31, midY - 3.5, 1.8, 7);
    triangleRight(48, 3);
    ctx.fillRect(55, midY - 3.5, 1.2, 7);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let result = "";

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const alpha = data[(y * canvas.width + x) * 4];
            result += alpha > 128 ? "b" : "&nbsp;";
        }
        result += "<br>";
    }
    return result;
}

let controlsRendered = false;

function gameLoop() {
    // 1. PENDETEKSIAN WAKTU (Bagian yang sempat terhapus)
    const currentTime = audio.currentTime;
    let activeEvent = null;
    let activeIndex = -1;
    
    for (let i = 0; i < timeline.length; i++) {
        if (currentTime >= timeline[i].time) {
            activeEvent = timeline[i];
            activeIndex = i;
        }
    }

    // 2. MENGATUR PERGANTIAN SCENE/LIRIK
    if (activeEvent && activeIndex !== currentEventIndex) {
        currentEventIndex = activeIndex;

        if (activeEvent.showVideo) {
            // SCENE VIDEO
            document.getElementById('asciiLyric').style.display = "none";
            spotifyUI.style.display = "none";
            imageStage.style.display = "none";
            
            videoStage.style.display = "flex";
            videoLyric.innerHTML = generateAscii(activeEvent.text, true); 
            
            if (bgVideo.paused) bgVideo.play().catch(e => console.log(e));
            
        } else if (activeEvent.showImage > 0) {
            // SCENE GAMBAR
            document.getElementById('asciiLyric').style.display = "none";
            spotifyUI.style.display = "none";
            videoStage.style.display = "none";
            
            if (!bgVideo.paused) bgVideo.pause();

            imageStage.style.display = "flex";
            imageLyric.innerHTML = generateAscii(activeEvent.text, true);
            
        } else {
            // SCENE LIRIK TENGAH (Atau Jeda Gelap jika text = "")
            videoStage.style.display = "none";
            imageStage.style.display = "none";
            
            if (!bgVideo.paused) bgVideo.pause();

            if (activeEvent.text !== "") {
                document.getElementById('asciiLyric').style.display = "block";
                asciiLyric.innerHTML = generateAscii(activeEvent.text, false);
            } else {
                 document.getElementById('asciiLyric').style.display = "none";
            }

            if (activeEvent.showUI) {
                spotifyUI.style.display = "flex";
            } else {
                spotifyUI.style.display = "none";
                controlsRendered = false;
            }
        }
    }

    // 3. RENDER UI SPOTIFY (Bagian yang sempat terhapus)
    if (spotifyUI.style.display === "flex") {
        const totalLength = 85; 
        const percent = Math.min((currentTime / 42) * totalLength, totalLength); 
        const filled = Math.floor(percent);
        
        let barRow1 = "=".repeat(totalLength);
        let barRow2 = " ".repeat(filled) + "o" + " ".repeat(Math.max(0, totalLength - filled - 1));
        progressBar.innerHTML = barRow1 + "<br>" + barRow2;
        
        const controlsDiv = document.getElementById('playbackControls');
        if (controlsDiv && !controlsRendered) {
           controlsDiv.innerHTML = generateControlsAscii();
           controlsRendered = true;
        }
    }

    // 4. RENDER ANIMASI FRAME VIDEO ASCII (Bagian yang sempat terhapus)
    if (activeEvent && activeEvent.showVideo && !bgVideo.paused) {
        if (bgVideo.videoWidth > 0) {
            const ratio = bgVideo.videoHeight / bgVideo.videoWidth;
            
            drawCanvas.width = 1280; 
            drawCanvas.height = 1280 * ratio;
            vCanvas.width = 150; 
            vCanvas.height = 150 * ratio;
        }

        vCtx.drawImage(bgVideo, 0, 0, vCanvas.width, vCanvas.height);
        const frameData = vCtx.getImageData(0, 0, vCanvas.width, vCanvas.height).data;
        
        drawCtx.fillStyle = "black";
        drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
        
        const cellW = drawCanvas.width / vCanvas.width;
        const cellH = drawCanvas.height / vCanvas.height;

        drawCtx.font = `bold ${Math.floor(cellH * 1.1)}px monospace`;
        drawCtx.textAlign = "center";
        drawCtx.textBaseline = "middle";

        const chars = ["@", "%", "#", "*", "+", "=", "-", ":", ".", " "];

        for (let y = 0; y < vCanvas.height; y++) {
            for (let x = 0; x < vCanvas.width; x++) {
                let i = (y * vCanvas.width + x) * 4;
                let r = frameData[i];
                let g = frameData[i+1];
                let b = frameData[i+2];
                let brightness = (r + g + b) / 3;

                let charIdx = Math.floor((255 - brightness) / 255 * (chars.length - 1));
                let char = chars[Math.max(0, Math.min(charIdx, chars.length - 1))];

                if (char !== " ") {
                    drawCtx.fillStyle = `rgb(${r},${g},${b})`;
                    drawCtx.fillText(char, x * cellW + cellW/2, y * cellH + cellH/2);
                }
            }
        }
    }

    // 5. RENDER GAMBAR ASCII STATIS (Baru)
    if (activeEvent && activeEvent.showImage > 0 && imgCtx) {
        const currentImg = activeEvent.showImage === 1 ? img1 : img2;

        if (currentImg.complete && currentImg.naturalWidth > 0) {
            const ratio = currentImg.naturalHeight / currentImg.naturalWidth;
            
            imageCanvas.width = 1280; 
            imageCanvas.height = 1280 * ratio;
            
            vCanvas.width = 160; 
            vCanvas.height = 160 * ratio;

            vCtx.drawImage(currentImg, 0, 0, vCanvas.width, vCanvas.height);
            const imgData = vCtx.getImageData(0, 0, vCanvas.width, vCanvas.height).data;
            
            imgCtx.fillStyle = "black";
            imgCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);
            
            const cellW = imageCanvas.width / vCanvas.width;
            const cellH = imageCanvas.height / vCanvas.height;

            imgCtx.font = `bold ${Math.floor(cellH * 1.1)}px monospace`;
            imgCtx.textAlign = "center";
            imgCtx.textBaseline = "middle";

            const chars = ["@", "%", "#", "*", "+", "=", "-", ":", ".", " "];

            for (let y = 0; y < vCanvas.height; y++) {
                for (let x = 0; x < vCanvas.width; x++) {
                    let i = (y * vCanvas.width + x) * 4;
                    let r = imgData[i];
                    let g = imgData[i+1];
                    let b = imgData[i+2];
                    let brightness = (r + g + b) / 3;

                    let charIdx = Math.floor((255 - brightness) / 255 * (chars.length - 1));
                    let char = chars[Math.max(0, Math.min(charIdx, chars.length - 1))];

                    if (char !== " ") {
                        imgCtx.fillStyle = `rgb(${r},${g},${b})`;
                        imgCtx.fillText(char, x * cellW + cellW/2, y * cellH + cellH/2);
                    }
                }
            }
        }
    }

    requestAnimationFrame(gameLoop);
}

document.body.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().catch(err => alert("Pastikan lagu.mp3 ada di folder!"));
        updateWaveform();
        gameLoop();
    }
});