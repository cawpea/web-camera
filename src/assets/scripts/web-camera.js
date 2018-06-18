class WebCamera {
  constructor ({
    $video,
    $canvas,
    $shot,
    $save,
    $remove,
    $changeCamera
  }, options) {
    this.$video = $video
    this.$canvas = $canvas
    this.$shot = $shot
    this.$save = $save
    this.$remove = $remove
    this.$changeCamera = $changeCamera
    this.options = options
    this.init()
  }
  init () {
    this.setState('idle')
    this.bindEvents()
    this.startCamera()
    this.setScreenSize()
    this.context = this.$canvas.getContext('2d')
  }
  bindEvents () {
    if (this.$shot) {
      this.$shot.addEventListener('click', () => this.takePhoto())
    }
    if (this.$save) {
      this.$save.addEventListener('click', () => this.savePhoto())
    }
    if (this.$remove) {
      this.$remove.addEventListener('click', () => this.setState('idle'))
    }
    if (this.$changeCamera) {
      this.$changeCamera.addEventListener('click', () => this.startCamera(!this.useCameraFront))
    }
    window.addEventListener('resize', () => this.setScreenSize())
  }
  changeCamera (isFront) {
    if (isFront) {
      this.startCamera('user')
    } else {
      this.startCamera({exact: 'environment'})
    }
  }
  startCamera (isFront = false) {
    let localStream
    const windowSize = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia
    window.URL = window.URL || window.webkitURL
    navigator.getUserMedia({
      video: {
        facingMode: this.getFacingMode(isFront)
      },
      audio: false
    }, stream => {
      console.log(stream)
      this.$video.srcObject = stream
    }, err => {
      console.error(err)
      // リアカメラが使えない場合はフロントカメラを使用する
      this.startCamera(this.getFacingMode(true))
    })
    this.useCameraFront = isFront
  }
  getFacingMode (isFront) {
    return isFront ? 'user' : {exact: 'environment'}
  }
  takePhoto () {
    this.context.drawImage(this.$video, 0, 0, this.$canvas.width, this.$canvas.height)
    this.setState('shot')
  }
  setState (state) {
    switch (state) {
      case 'idle':
        this.$canvas.classList.remove('is-show')
        this.$shot.style.display = 'inline-block'
        this.$changeCamera.style.display = 'inline-block'
        this.$save.style.display = 'none'
        this.$remove.style.display = 'none'
        break
      case 'shot':
        this.$canvas.classList.add('is-show')
        this.$shot.style.display = 'none'
        this.$changeCamera.style.display = 'none'
        this.$save.style.display = 'none'
        this.$save.style.display = 'inline-block'
        this.$remove.style.display = 'inline-block'
        break
    }
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

    this.hidePhoto()
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
  setScreenSize () {
    const {screenSize} = this.options
    if (!screenSize || screenSize !== 'full') {
      return
    }
    const windowSize = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    this.$video.width = windowSize.width
    this.$video.height = windowSize.height
    this.$canvas.width = windowSize.width
    this.$canvas.height = windowSize.height
  }
}

new WebCamera({
  $video: document.querySelector('.webcamera-video'),
  $canvas: document.querySelector('.webcamera-canvas'),
  $shot: document.querySelector('.webcamera-shot'),
  $save: document.querySelector('.webcamera-save'),
  $remove: document.querySelector('.webcamera-remove'),
  $changeCamera: document.querySelector('.webcamera-change-camera')
}, {
  screenSize: 'full'
})
