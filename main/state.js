//// STATE
import config from  './config.js'

let module; export default module = {

    prevNow: null
  , currMode: null // `null` to init, 'preview' or 'capture' after that
  , currFps: config.fps
  , currDuration: config.duration
  , cameraCurrent: {
        position: {
            lat: 0
          , lon: 0
          , alt: 0
        }
    }
}
