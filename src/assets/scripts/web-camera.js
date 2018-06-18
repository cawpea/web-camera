class WebCamera {
  constructor ({$video, $canvas, $shot}) {
    this.$video = $video
    this.$canvas = $canvas
    this.$shot = $shot
    this.init()
  }
  init () {
    this.bindEvents()
    this.startCamera()
    this.context = this.$canvas.getContext('2d')
  }
  bindEvents () {
    this.$shot.addEventListener('click', () => this.takePhoto())
  }
  startCamera () {
    let localStream
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia
    window.URL = window.URL || window.webkitURL
    navigator.getUserMedia({video: true, audio: false}, stream => {
      console.log(stream)
      this.$video.srcObject = stream
    }, err => {
      console.error(err)
    })
  }
  takePhoto () {
    this.context.drawImage(this.$video, 0, 0, this.$canvas.width, this.$canvas.height)
  }
}

new WebCamera({
  $video: document.querySelector('.webcamera-video'),
  $canvas: document.querySelector('.webcamera-canvas'),
  $shot: document.querySelector('.webcamera-shot')
})