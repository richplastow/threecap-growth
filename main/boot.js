import config from './config.js'
import scene from './scene.js'
import state from './state.js'
import tween from './tween.js'


export function boot() {

    //// Bind buttons to functions.
    document.querySelector('#restart-preview').addEventListener(
        'click', restartForPreview)
    document.querySelector('#recordpanel button').addEventListener(
        'mousedown', prepareCaptureui)

    ////
    scene.init()
    scene.render()
    restartForPreview()
}




//// Resets the scene state and zeros the timer.
function restart () {
    scene.clock.stop()
    tween.reset()
    scene.clock.start() // reset `clock.elapsedTime` to zero
}


//// Restarts the scene for development and previewing.
function restartForPreview (evt) {
    const { previewWidth, previewHeight, previewDuration, previewFps
      , pixelRatio } = config
    if ('preview' !== state.currMode) {
        state.currMode = 'preview'
        scene.copyPass.renderToScreen = true
        state.currFps = previewFps
        state.currDuration = previewDuration
        scene.renderer.setSize(previewWidth, previewHeight)
        scene.composer.setSize(previewWidth * pixelRatio, previewHeight * pixelRatio)
    }
    restart()
}


//// Restarts the scene for capture.
function restartForCapture () {
    const { captureWidth, captureHeight, captureDuration, captureFps
      , pixelRatio, showDuringCapture } = config
    if ('capture' !== state.currMode) {
        state.currMode = 'capture'
        scene.copyPass.renderToScreen = showDuringCapture
        state.currFps = captureFps
        state.currDuration = captureDuration
        scene.renderer.setSize(captureWidth, captureHeight)
        scene.composer.setSize(captureWidth * pixelRatio, captureHeight * pixelRatio)
    }
    restart()
}


////
function prepareCaptureui (e) {
    const captureui = scene.captureui
    restartForCapture()
    captureui.settings.framerate = config.captureFps
    captureui.settings.resolution = `${config.captureWidth}x${config.captureHeight}`
    captureui.settings.time = config.captureDuration / 1000 // convert ms to seconds
    const oldFilename = captureui.settings.filename
    captureui.settings.filename =
        oldFilename.split('.')[0] + '.' + captureui.settings.format
    document.querySelector('#cli-help').innerHTML =
        `mv $HOME/Downloads/'${captureui.settings.filename}' `
      + `'./${captureui.settings.filename}'; \n`
      + `./ffmpeg -i '${captureui.settings.filename}' `
      + `-r ${config.previewFps} -filter:v `
      + `"setpts=${config.captureFps / config.previewFps}*PTS" `
      + `'${oldFilename}-${config.previewFps}fps.${captureui.settings.format}'; \n`
      + `unlink '${captureui.settings.filename}'`
}
