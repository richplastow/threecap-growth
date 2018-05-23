//// CONFIGURATION AND CONSTANTS

const

    //// Dimensions, framerate, duration.
    previewWidth = 854
  , previewHeight = 480
  , previewFps = 25
  , previewDuration = 8000 // in ms

  , captureWidth = 1920
  , captureHeight = 1080
  , captureFps = 1
  , captureDuration = previewDuration * (previewFps / captureFps)

    //// Whether to render the animation during capture.
  , showDuringCapture = false




let module; export default module = {

    //// Dimensions, framerate, duration.
    previewDuration
  , previewWidth
  , previewHeight
  , previewFps

  , captureWidth
  , captureHeight
  , captureFps
  , captureDuration
  , pixelRatio: window.devicePixelRatio || 0

    //// Whether to render the animation during capture.
  , showDuringCapture


}
