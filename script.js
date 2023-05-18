const $ = document
    .querySelector
    .bind(document);
const $$ = document
    .querySelectorAll
    .bind(document);

const player = $('.player')
const cd = $('.cd')
const cdWidth = cd.offsetWidth;
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const btnPlay = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const rdmBtn = $('.btn-ramdom')
const rpBtn = $('.btn-repeat')
const playlist =$('.playlist')
const LinkMaster = 'https://raw.githubusercontent.com/KhoaDiemNguyen/Nghe-Nhac/master'
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamdom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Buồn thì cứ khóc đi',
            singer: 'Lynk Lee',
            path: '/Music/song1.mp3',
            image: `${LinkMaster}/CD/song1.png`
        }, {
            name: 'Cô gái bàn bên',

            singer: 'Đen ft Lynh Lee',
            path: './Music/song2.mp3',
            image: `${LinkMaster}/CD/song2.png`
        }, {
            name: 'Tát nước đầu đình',
            singer: 'Lynk Lee',
            path: '/Music/song3.mp3',
            image: '/CD/song3.png'
        }, {
            name: 'Hẹn ước từ hư vô',
            singer: 'Mỹ Tâm',
            path: '/Music/song4.mp3',
            image: '/CD/song4.png'
        }, {
            name: 'Thấy chưa',
            singer: 'Ngọt',
            path: '/Music/song5.mp3',
            image: '/CD/song5.png'
        }, {
            name: 'Xin lỗi',
            singer: 'Thắng',
            path: '/Music/song6.mp3',
            image: '/CD/song6.png'
        }
    ],

    // Render nhac
    render: function () {
        const htmls = this
            .songs
            .map((song, index) => {

                return `
      <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index} ">
      <div
          class="thumb"
          style="background-image: url('${song.image}');"></div>
      <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
      </div>
      <div class="option">
          <i class="fas fa-ellipsis-h"></i>
      </div>
  </div>
  `
            })
        playlist.innerHTML = htmls.join('\n')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        //play nhac
        btnPlay.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        };
        //next bai
        nextBtn.onclick = function () {
            if (_this.isRamdom) {
                _this.playRamdomsong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //prev bai
        prevBtn.onclick = function () {
            if (_this.isRamdom) {
                _this.playRamdomsong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // bat tat ramdom nhac
        rdmBtn.onclick = function (e) {
            _this.isRamdom = !_this
                .isRamdom
                rdmBtn
                .classList
                .toggle('active', _this.isRamdom)
        }
        //repeat nhac
        rpBtn.onclick = function (e) {
            _this.isRepeat = !_this
                .isRepeat
                rpBtn
                .classList
                .toggle('active', _this.isRepeat)
        }

        // repeat nhac va tu next bai
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()

            }
        }

        // dia cd quay
        const cdThumbanimate = cdThumb.animate([
            {
                transform: `rotate(360deg)`
            }
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbanimate.pause(),
        // khi song duoc play
        audio.onplay = function () {
            player
                .classList
                .add('playing')
            _this.isPlaying = true
            cdThumbanimate.play()
        },
        // khi song bi pause
        audio.onpause = function () {
            player
                .classList
                .remove('playing')
            _this.isPlaying = false
            cdThumbanimate.pause()
        },
        // khi tua
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        },
        // click vao playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {

                if( songNode){
                    _this.currentIndex= Number(songNode.dataset.index)
                    _this.loadCurrentsong()
                    _this.render()
                    audio.play()


                }
            }
          };
          


        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        },

        // xu li khi click play xu li phong to thu nho
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdwidth = cdWidth - scrollTop;
            cd.style.width = newCdwidth > 0
                ? newCdwidth + 'px'
                : 0
            cd.style.opacity = newCdwidth / cdWidth
        }

    },
    loadCurrentsong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentsong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentsong()
    },
    playRamdomsong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentsong()
    },
    scrollToActiveSong: function () {
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'end',
            }
            )
        },300)
    },
    start: function () {
        // Dinh nghia cac thuoc tinh choa app
        this.defineProperties()

        // Lang nghe su kien
        this.handleEvents()

        // Tai thong tin bai hat dau tien
        this.loadCurrentsong()

        //
        this.render()
    }
}
app.start()