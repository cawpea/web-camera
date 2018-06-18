class WebCamera {
  constructor ({$video}) {
    this.$video = $video
    this.init()
  }
  init () {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia
    window.URL = window.URL || window.webkitURL

    let localStream
    navigator.getUserMedia({video: true, audio: false}, stream => {
      console.log(stream)
      video.srcObject = stream
    }, err => {
      console.error(err)
    })
  }
}

new WebCamera({
  $video: document.querySelector('#video')
})