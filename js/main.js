//全局DOM元素与核心变量（统一管理）
let audio, playBtn, playIcon, prevBtn, nextBtn, loopBtn, volumeBtn;
let volumeSlider, speedText, timeSpan, progressFill, progressTrack, coverImg;
let mvBtn, playlistBtn, loopIcon;
let isPlaying = false;
let loopMode = 0;  //0-顺序， 1-单曲循环
let playlistContainer,playlistList;  //播放列表元素
let mvModal, mvClose, mvPlayer;  //mv播放元素
const musicList = [
    { name: '洛春赋', src: './mp3/music0.mp3', mv: './mp4/video0.mp4', cover: './images/record0.jpg', title: '洛春赋'},
    { name: '秋声慢', src: './mp3/music1.mp3', mv: './mp4/video1.mp4', cover: './images/record1.jpg', title: '秋声慢'},
    { name: '青衫渡', src: './mp3/music2.mp3', mv: './mp4/video2.mp4', cover: './images/record2.jpg', title: '青衫渡'},
    { name: '花丛中', src: './mp3/music3.mp3', mv: './mp4/video3.mp4', cover: './images/record3.jpg', title: '花丛中'}
];
let currentIndex = 0;
//页面加载入口
window.onload = initAudioPlayer;
//播放器主初始化函数
function initAudioPlayer() {
    getDOMElements();  //获取所有DOM元素
    initVolumeSlider();  //初始化音量滑块
    initPlayPause();  //初始化播放/暂停
    initVolumeControl();  //初始化音量控制
    initSpeedControl();  //倍速初始化函数
    initLoopMode();  //初始化循环模式
    initPrevNext();  //初始化上一首/下一首
    initProgressBar();  //初始化进度条更新
    initPlaylist();  //初始化播放列表
    initMVPlayer();  //初始化mv播放函数调用
    loadCurrentMusic();  //加载当前音乐
}
//1.统一获取DOM元素
function getDOMElements() {
    audio = document.getElementById('audio');
    playBtn = document.getElementById('playBtn');
    playIcon = document.getElementById('playIcon');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    loopBtn = document.getElementById('loopBtn');
    volumeBtn = document.getElementById('volumeBtn');
    volumeSlider = document.getElementById('volumeSlider');
    speedText = document.getElementById('speedText');
    timeSpan = document.getElementById('time');
    progressFill = document.getElementById('progressFill');
    progressTrack = document.getElementById('progressTrack');
    coverImg = document.getElementById('coverImg');
    mvBtn = document.getElementById('mvBtn');
    playlistBtn = document.getElementById('playlistBtn');
    loopIcon = document.getElementById('loopIcon');
    playlistBtn = document.getElementById('playlistBtn');
    playlistContainer = document.getElementById('playlistContainer');
    playlistList = document.getElementById('playlistList');
    //获取mv元素
    mvBtn = document.getElementById('mvBtn');
    mvModal = document.getElementById('mvModal');
    mvClose = document.querySelector('.mv-close');
    mvPlayer = document.getElementById('mvPlayer');
}
//2.加载当前索引的音乐
function loadCurrentMusic() {
    const currentMusic = musicList[currentIndex];
    audio.src = currentMusic.src;
    //更新封面和歌名
    coverImg.src = currentMusic.cover;
    coverImg.alt = currentMusic.title || currentMusic.name;
    songName.textContent = currentMusic.title || currentMusic.name;
    //切换音乐后重置进度条和时间显示
    progressFill.style.width = '0%';
    timeSpan.textContent = '00:00 / 00:00';
    //音频加载完成后自动播放（解决切歌不播放问题）
    audio.oncanplay = function() {
        if (isPlaying) {
            audio.play().catch(err => {
                playIcon.src = './images/继续播放.png';
                coverImg.style.animationPlayState = 'paused';
                isPlaying = false;
                console.log('需手动点击播放: ', err);
            });
        }
        audio.oncanplay = null;
    };
}
//3.播放/暂停功能模块
function initPlayPause() {
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playIcon.src = './images/继续播放.png';
            coverImg.style.animationPlayState = 'paused';
        } else {
            audio.play();
            playIcon.src = './images/暂停.png';
            coverImg.style.animationPlayState = 'running';
        }
        isPlaying = !isPlaying;
    });
}
//4.音量滑块初始化
function initVolumeSlider() {
    const initVolume = parseFloat(volumeSlider.value);
    const colorWidth = initVolume * 100 + '%';
    volumeSlider.style.background = `linear-gradient(to right, #00ff9d 0%, #00ff9d ${colorWidth}, #ccc ${colorWidth}, #ccc 100%)`;
    audio.volume = initVolume;
}
//5.音量控制功能模块
function initVolumeControl() {
    //滑块调节音量
    volumeSlider.addEventListener('input', () => {
        const volume = parseFloat(volumeSlider.value);
        audio.volume = volume;
        const colorWidth = volume * 100 + '%';
        volumeSlider.style.background = `linear-gradient(to right, #00ff9d 0%, #00ff9d ${colorWidth}, #ccc ${colorWidth}, #ccc 100%)`;
        volumeBtn.innerHTML = volume <= 0 ? '<img src="./images/静音.png" alt="静音">' : '<img src="./images/音量.png" alt="音量">';
    });
    //静音/恢复音量
    volumeBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        const volume = parseFloat(volumeSlider.value);
        volumeBtn.innerHTML = audio.muted || volume <= 0 ? '<img src="./images/静音.png" alt="静音">' : '<img src="./images/音量.png" alt="音量">';
        if (audio.muted) {
            volumeSlider.style.background = '#ccc';
        } else {

            const colorWidth = volume * 100 + '%';
            volumeSlider.style.background = `linear-gradient(to right, #00ff9d 0%, #00ff9d ${colorWidth}, #ccc ${colorWidth}, #ccc 100%)`;
        }
    });
}
//6.倍速调整功能模块
function initSpeedControl() {
    speedText.addEventListener('click', () => {
        const speeds = [0.5, 1, 1.5, 2];
        let currentSpeed = Math.round(audio.playbackRate * 10) / 10;
        let index = speeds.indexOf(currentSpeed);
        index = index === -1 ? 1 : (index + 1) % speeds.length;
        audio.playbackRate = speeds[index];
        speedText.textContent = `${speeds[index].toFixed(1)}X`;
    });
}
//7.循环模式切换功能模块
function initLoopMode() {
    const loopModes = [
        { mode: 'single', icon: './images/mode1.png'},  //单曲循环
        { mode: 'all', icon: './images/mode2.png'},  //列表循环
        { mode: 'none', icon: './images/mode3.png'}  //无循环
    ];
    let currentModeIndex = 1; 
    loopIcon.src = loopModes[currentModeIndex].icon;
    audio.loop = false;
    loopBtn.addEventListener('click', () => {
        currentModeIndex = (currentModeIndex + 1) % loopModes.length;
        loopIcon.src = loopModes[currentModeIndex].icon;
        switch(loopModes[currentModeIndex].mode) {
            case 'single': audio.loop = true;
                break;
            case 'all': audio.loop = false;
                break;
            case 'none': audio.loop = false;
                break;
        }
    });
}
//8.时间格式化函数
function formatAudioTime(seconds) {
    if (isNaN(seconds) || seconds === 0) {
        return '00:00';
    }
    return transTime(seconds);
}
//9.上一首/下一首功能模块
function initPrevNext() {
    //上一首逻辑
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + musicList.length) % musicList.length;
        loadCurrentMusic();
        //若处于播放状态，切换后自动播放
        if (isPlaying) {
            audio.play();
            playIcon.src = './images/暂停.png';
            coverImg.style.animationPlayState = 'running';
        }
    });
    //下一首逻辑
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % musicList.length;
        loadCurrentMusic();
        //若处于播放状态，切换后自动播放
        if (isPlaying) {
            audio.play();
            playIcon.src = './images/暂停.png';
            coverImg.style.animationPlayState = 'running';
        }
    });
    //音频播放结束自动切下一首（列表循环）
    audio.addEventListener('ended', () => {
        const loopModes = [
            { mode: 'single'},
            { mode: 'all'},
            { mode: 'none'}];
        let currentModeIndex = 1;
        //列表循环模式下自动切歌
        if (loopModes[currentModeIndex].mode === 'all') {
            currentIndex = (currentIndex + 1) % musicList.length;
            loadCurrentMusic();
            audio.play();
            isPlaying = true;
            playIcon.src = './images/暂停.png';
            coverImg.style.animationPlayState = 'running';
        }
    });
}
//10.进度条更新功能模块
function initProgressBar() {
    //实时更新进度条和时间显示
    audio.addEventListener('timeupdate', () => {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${isNaN(progressPercent) ? 0 : progressPercent}%`;
        //格式化并更新时间
        const currentTime = formatAudioTime(audio.currentTime);
        const totalTime = formatAudioTime(audio.duration);
        timeSpan.textContent = `${currentTime} / ${totalTime}`;
    });
    //点击进度条跳转播放位置
    progressTrack.addEventListener('click', (e) => {
        const barWidth = progressTrack.offsetWidth;
        const clickX = e.offsetX;
        const jumpTime = (clickX / barWidth) * audio.duration;
        audio.currentTime = jumpTime;
    });
}
//11.播放列表功能模块
function initPlaylist() {
    function renderPlaylist() {
        playlistList.innerHTML = '';
        musicList.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = item.title;
            if (index === currentIndex) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => {
                currentIndex = index;
                loadCurrentMusic();
                if (isPlaying) {
                    playIcon.src = './images/暂停.png';
                    coverImg.style.animationPlayState = 'running';
                }
                playlistContainer.style.display = 'none';
                renderPlaylist();
            });
            playlistList.appendChild(li);
        });
    }
    renderPlaylist();
    playlistBtn.addEventListener('click', () => {
        playlistContainer.style.display = playlistContainer.style.display === 'none' ? 'block' : 'none';
        renderPlaylist();
    });
}
//12.mv播放功能模块
function initMVPlayer() {
    //点击MV按钮播放当前歌曲的MV
    mvBtn.addEventListener('click', () => {
        const currentMusic = musicList[currentIndex];
        if (currentMusic.mv) {  //检查是否有mv地址
            mvPlayer.src = currentMusic.mv;  //设置mv视频源
            mvModal.style.display = 'flex'; //显示弹窗
            mvPlayer.play();  //自动播放mv
            //暂停音频播放，同步状态
            if (isPlaying) {
                audio.pause();
                playIcon.src = './images/继续播放.png';
                coverImg.style.animationPlayState = 'paused';
                isPlaying = false;
            }
        } else {
            alert('该歌曲暂无MV');
        }
    });
    //点击关闭按钮关闭mv弹窗
    mvClose.addEventListener('click', () => {
        mvModal.style.display = 'none';
        mvPlayer.pause();
        mvPlayer.src = '';
    });
    mvModal.addEventListener('click', (e) => {
        if (e.target === mvModal) {
            mvModal.style.display = 'none';
            mvPlayer.pause();
            mvPlayer.src = '';
        }
    });
}