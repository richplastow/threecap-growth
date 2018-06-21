//// TWEEN
import config from './config.js'
import scene from './scene.js'
import state from './state.js'


const tweenDefs = [




    //// CAMERA

    { // camera position’s altitude SUITCASE
        beginState: { alt:200 }//was 300
      , currState:  { }
      , endState:   { alt:350 }//was 600
      , beginFrac:  0.05
      , endFrac:    0.5
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.InOut
      , onReset:    function (def) {

            //// Start the audio, if it’s not playing
            if ('playing' !== state.audio) {
                state.audio = 'playing'
                scene.$audio.play(0)
            }

            for (let i=0; i<scene.sprites.length; i++)
                scene.sprites[i].visible = false
            window.updateFirstText('1950')
            window.updateSecondText('1950')
            scene.firstTextSpriteMaterial.map.needsUpdate = true
            scene.earthMesh.rotation.y = config.earthStartRotationY
            scene.cloudMesh.rotation.y = config.earthStartRotationY
            // state.cameraCurrent.position.lat = tweenDefs[1].beginState.lat
            // state.cameraCurrent.position.lon = tweenDefs[1].beginState.lon
            state.cameraCurrent.position.lat = 0
            state.cameraCurrent.position.lon = 0
            state.cameraCurrent.position.alt = tweenDefs[0].beginState.alt
            const y = tweenDefs[1].beginState.y
            state.cameraCurrent.position.y = y
            setPositionUsingLla(
                scene.camera
              , state.cameraCurrent.position.lat
              , state.cameraCurrent.position.lon
              , state.cameraCurrent.position.alt
            )
            scene.camera.position.y = y // ...and z with negative y
            scene.camera.lookAt(0,y,0)
        }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.alt = def.currState.alt
        } }
    }
  , { // camera’s y-position SUITCASE
        beginState: { y:-45 }//was 0
      , currState:  {}
      , endState:   { y:0 }//was 80
      , beginFrac:  0.05
      , endFrac:    0.5
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.InOut
      , onReset:    function (def) { }
      , onUpdate:   function (def) { return function () {
            const y = def.currState.y
            state.cameraCurrent.position.y = y
            setPositionUsingLla(
                scene.camera
              , state.cameraCurrent.position.lat
              , state.cameraCurrent.position.lon
              , state.cameraCurrent.position.alt
            )
            scene.camera.position.y = y // ...and z with negative y
            scene.camera.lookAt(0,y,0)
        } }
    }

  , { // camera position’s altitude PLANE AND SHIP
        beginState: { alt:350 }
      , currState:  { }
      , endState:   { alt:450 }
      , beginFrac:  0.55
      , endFrac:    0.85
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.InOut
      , onReset:    function (def) { }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.alt = def.currState.alt
            setPositionUsingLla(
                scene.camera
              , state.cameraCurrent.position.lat
              , state.cameraCurrent.position.lon
              , state.cameraCurrent.position.alt
            )
        } }
    }



    //// TEXT

  , { // first-text-sprite’s opacity BEGIN
        beginState: { opacity:0 }
      , currState:  {}
      , endState:   { opacity:1 }
      , beginFrac:  0.025
      , endFrac:    0.075
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) {
            scene.firstTextSpriteMaterial.opacity = 0
        }
      , onUpdate:   function (def) { return function () {
            scene.firstTextSpriteMaterial.opacity = def.currState.opacity
        } }
    }
  , { // first-text-sprite’s opacity END
        beginState: { opacity:1 }
      , currState:  {}
      , endState:   { opacity:0 }
      , beginFrac:  0.525
      , endFrac:    0.575
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) {}
      , onUpdate:   function (def) { return function () {
            scene.firstTextSpriteMaterial.opacity = def.currState.opacity
        } }
    }
  , { // second-text-sprite’s opacity BEGIN
        beginState: { opacity:0 }
      , currState:  {}
      , endState:   { opacity:1 }
      , beginFrac:  0.6
      , endFrac:    0.65
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) {
            scene.secondTextSpriteMaterial.opacity = 0
        }
      , onUpdate:   function (def) { return function () {
            scene.secondTextSpriteMaterial.opacity = def.currState.opacity
        } }
    }
  , { // second-text-sprite’s opacity END
        beginState: { opacity:1 }
      , currState:  {}
      , endState:   { opacity:0 }
      , beginFrac:  0.9
      , endFrac:    0.95
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) {}
      , onUpdate:   function (def) { return function () {
            scene.secondTextSpriteMaterial.opacity = def.currState.opacity
        } }
    }




    //// ICONS

  , { // suitcase-sprite’s opacity BEGIN
        beginState: { opacity:0 }
      , currState:  {}
      , endState:   { opacity:1 }
      , beginFrac:  0.05
      , endFrac:    0.1
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) {
            scene.suitcaseSpriteMaterial.opacity = 0
        }
      , onUpdate:   function (def) { return function () {
            scene.suitcaseSpriteMaterial.opacity = def.currState.opacity
        } }
    }

  , { // suitcase-sprite’s opacity END
        beginState: { opacity:1 }
      , currState:  {}
      , endState:   { opacity:0 }
      , beginFrac:  0.53
      , endFrac:    0.57
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) { }
      , onUpdate:   function (def) { return function () {
            scene.suitcaseSpriteMaterial.opacity = def.currState.opacity
        } }
    }

  , { // plane-sprite’s opacity BEGIN
        beginState: { opacity:0 }
      , currState:  {}
      , endState:   { opacity:1 }
      , beginFrac:  0.625
      , endFrac:    0.675
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) {
            scene.planeSpriteMaterial.opacity = 0
        }
      , onUpdate:   function (def) { return function () {
            scene.planeSpriteMaterial.opacity = def.currState.opacity
        } }
    }

  , { // plane-sprite’s opacity END
        beginState: { opacity:1 }
      , currState:  {}
      , endState:   { opacity:0 }
      , beginFrac:  0.905
      , endFrac:    0.945
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) { }
      , onUpdate:   function (def) { return function () {
            scene.planeSpriteMaterial.opacity = def.currState.opacity
        } }
    }




]




let module; export default module = {

    //// Delete all existing tweens, and create a fresh new set.
    reset () {

        //// Stop and remove all tweens.
        tweenDefs.forEach( def => { if (def.tween) def.tween.stop() })
        TWEEN.removeAll()

        ////
        for (let i=0; i<tweenDefs.length; i++) {
            const def = tweenDefs[i]
            def.onReset(def)
            def.currState = Object.assign({}, def.beginState)
            def.tween =
                new TWEEN.Tween(def.currState)
                   .to(def.endState, (def.endFrac-def.beginFrac) * state.currDuration)
                   .easing(def.easing)
                   .onUpdate( def.onUpdate(def) )
                   .start(def.beginFrac * state.currDuration)
        }
    }

}




function setPositionUsingLla (object3d, lat, lon, alt) {
    const cosLat = Math.cos(lat * Math.PI / 180)
    const sinLat = Math.sin(lat * Math.PI / 180)
    const cosLon = Math.cos(lon * Math.PI / 180)
    const sinLon = Math.sin(lon * Math.PI / 180)
    const x = alt * cosLat * cosLon
    const y = alt * cosLat * sinLon
    const z = alt * sinLat
    object3d.position.x = x
    object3d.position.y = z // for correct THREE.js coords, swap y with z...
    object3d.position.z = - y // ...and z with negative y
}
