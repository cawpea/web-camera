class WebCamera {
  constructor ({$video, $canvas, $shot, $download}) {
    this.$video = $video
    this.$canvas = $canvas
    this.$shot = $shot
    this.$download = $download
    this.init()
  }
  init () {
    this.bindEvents()
    this.startCamera()
    this.context = this.$canvas.getContext('2d')
  }
  bindEvents () {
    if (this.$shot) {
      this.$shot.addEventListener('click', () => this.takePhoto())
    }
    if (this.$download) {
      this.$download.addEventListener('click', () => this.savePhoto())
    }
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
  savePhoto (fileName, imageType = 'image/jpeg') {
    if (!fileName) {
      const today = new Date()
      fileName = `photo_${today.getTime()}`
    }
    const base64 = this.$canvas.toDataURL(imageType)
    const blob = this.Base64toBlob(base64)
    const url = window.URL || window.webkitURL
    const dataUrl = url.createObjectURL(blob)
    const a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    a.href = dataUrl
    a.download = fileName
    a.click()
  }
  Base64toBlob (base64) {
    const tmp = base64.split(',')
    // base64データの文字列をデコード
    const data = atob(tmp[1])
    // data:image/png;base64からコンテンツタイプ（image/png）部分を取得
    const mime = tmp[0].split(':')[1].split(';')[0]
    //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
    const buf = new Uint8Array(data.length)
    for (let i = 0, len = data.length; i < len; i++) {
      buf[i] = data.charCodeAt(i)
    }
    // blobデータを作成
    const blob = new Blob([buf], {type: mime})
    return blob
  }
}

new WebCamera({
  $video: document.querySelector('.webcamera-video'),
  $canvas: document.querySelector('.webcamera-canvas'),
  $shot: document.querySelector('.webcamera-shot'),
  $download: document.querySelector('.webcamera-download')
})