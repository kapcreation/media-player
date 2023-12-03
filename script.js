let player = null
const audioPlayer = document.getElementById("audio-player")
const videoPlayer = document.getElementById("video-player")
const players = [audioPlayer, videoPlayer]

const fileInput = document.getElementById("file-input")

const controls = document.querySelector(".controls")
const progressBar = document.querySelector(".progress-bar .slider")
const pauseBtn = document.querySelector(".controls .pause")

const volumeDisplay = document.querySelector(".controls .volume .value")

let volume = parseFloat(localStorage.getItem("volume")) || 0.5

let fileType = null


function playMedia() {
  const file = fileInput.files[0]

  if (!file) return

  fileType = file.type.split("/")[0]

  if (fileType != "audio" && fileType != "video") return

  const url = URL.createObjectURL(file)

  // if old player exists
  if (player) player.pause()

  switch (fileType) {
    case "audio":
      player = audioPlayer
      videoPlayer.style.display = 'none'
      break
    case "video":
      player = videoPlayer
      audioPlayer.style.display = 'none'
      break
    default:
      break
  }

  player.style.display = "block"
  player.src = url
  player.play()

  controls.style.display = "block"
  document.title = file.name + " - Media Player"
}

function pauseMedia() {
  const ended = player.currentTime >= player.duration - 0.1

  if (!ended) {
    player.paused ? player.play() : player.pause()   
  } else {
    player.currentTime = 0
    player.play()
  }

  updatePauseBtn()
}

function updatePauseBtn() {
  const ended = player.currentTime >= player.duration - 0.1
  if (!ended) {
    pauseBtn.innerHTML = player.paused ? `
      <i class="bi bi-play-fill"></i>
      <div class="tooltip-text">Play (k)</div>
    ` : `
      <i class="bi bi-pause-fill"></i>
      <div class="tooltip-text">Pause (k)</div>
    `
  } else {
    pauseBtn.innerHTML = `
      <i class="bi bi-arrow-counterclockwise"></i>
      <div class="tooltip-text">Replay (k)</div>
    `
  }
}

function increaseVolume(value) {
  if ((value > 0 && volume + value > 1) || (value < 0 && volume + value < 0)) return
  volume += value
  player.volume = volume
  localStorage.setItem("volume", volume.toString())
  updateVolumeDisplay()
}

function updateVolumeDisplay() {
  volumeDisplay.textContent = Math.round(volume * 100)
}

function updateProgressBar() {
  progressBar.min = 0
  progressBar.max = player.duration
  progressBar.value = player.currentTime
}

function seek(value) {
  player.currentTime = value
}



document.addEventListener("keydown", function(event) {

  if (event.key === 'k') pauseMedia()

  if (event.key === 'j' || event.key === 'ArrowLeft') player.currentTime -= 5
  if (event.key === 'l' || event.key === 'ArrowRight') player.currentTime += 5

  if (event.key === 'ArrowDown') increaseVolume(-0.05)
  if (event.key === 'ArrowUp') increaseVolume(0.05)
  
})



players.forEach(player => {
  player.addEventListener('loadedmetadata', function() {
    player.volume = volume
    updateVolumeDisplay()
  });
  player.addEventListener("timeupdate", updateProgressBar)
  player.addEventListener("ended", updatePauseBtn)
})