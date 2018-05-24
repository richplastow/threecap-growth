//// SCENE

import config from  './config.js'
import data from '../data/total-international-tourist-arrivals.js'
import state from  './state.js'

const

    //// Objects for rendering.
    clock = new THREE.Clock()
  , scene = new THREE.Scene()
  , camera = new THREE.PerspectiveCamera(
        35, config.previewWidth/config.previewHeight, 0.1, 1000)
  , renderer = new THREE.WebGLRenderer({ antialias:true })
  , composer = new THREE.EffectComposer(renderer)
  , copyPass = new THREE.ShaderPass(THREE.CopyShader)
  , outlinePass = new THREE.OutlinePass(
        new THREE.Vector2(config.previewWidth, config.previewHeight), scene, camera)

    //// Object3Ds.
  // , globe = new THREE.Object3D() // dot-sprites are attached to this
  , earthGeometry = new THREE.SphereGeometry(99, 128, 128)
  , cloudGeometry = new THREE.SphereGeometry(100, 64, 64)
  , starGeometry  = new THREE.SphereGeometry(500, 12, 12)
  , sprites = []

    //// Lights.
  , ambientLight = new THREE.AmbientLight(0xaaaab0)
  , directionalLight = new THREE.DirectionalLight(0xcccc99, 0.5)

    //// Textures - for fast development:
  , earthMap = THREE.ImageUtils.loadTexture('images/512_earth_daymap.jpg')
  , earthBumpMap = THREE.ImageUtils.loadTexture('images/512_earth_normal_map.png')
  , earthSpecularMap = THREE.ImageUtils.loadTexture('images/512_earth_specular_map.png')
  , cloudMap = THREE.ImageUtils.loadTexture('images/1024_earth_clouds.jpg')
  , starMap = THREE.ImageUtils.loadTexture('images/1024_stars_milky_way.jpg')

    //// Textures - for final render with a fast GPU:
  // , earthMap = THREE.ImageUtils.loadTexture('images/2048_earth_daymap.jpg')
  // , earthBumpMap = THREE.ImageUtils.loadTexture('images/1024_earth_normal_map.png')
  // , earthSpecularMap = THREE.ImageUtils.loadTexture('images/1024_earth_specular_map.png')
  // , cloudMap = THREE.ImageUtils.loadTexture('images/2048_earth_clouds.jpg')
  // , starMap = THREE.ImageUtils.loadTexture('images/4096_stars_milky_way.jpg')

  , usualSpriteTexture = new THREE.CanvasTexture(
        document.getElementById('usual-sprite')
    )
  , firstTextSpriteTexture = new THREE.CanvasTexture(
        document.getElementById('first-text-sprite')
    )

    //// Materials.
  , earthMaterial = new THREE.MeshPhongMaterial({
        map: earthMap
      , bumpMap: earthBumpMap
      , bumpScale: 10
      , specularMap: earthSpecularMap
      , specular: new THREE.Color('grey')
    })
  , cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudMap
      , side: THREE.DoubleSide
      , opacity: 1.0
      , blending: THREE.AdditiveBlending
      , transparent: true
    })
  , starMaterial = new THREE.MeshBasicMaterial({
        map: starMap
      , side: THREE.BackSide
      , fog: false
    })
  , spriteMaterialTemplate = {
        map: usualSpriteTexture
      , blending: THREE.AdditiveBlending
      , depthTest: true
      , transparent: true
      , opacity: config.usualSpriteOpacityBeginEnd
      , fog: false

      //// Always in front
      // , depthWrite: false
      // , depthTest: false

    }
  , usualSpriteMaterial = new THREE.SpriteMaterial(
        Object.assign({}, spriteMaterialTemplate)
    )
  , firstTextSpriteMaterial = new THREE.SpriteMaterial({
        map: firstTextSpriteTexture
      , blending: THREE.AdditiveBlending
      , depthTest: true
      , transparent: true
      , opacity: config.usualSpriteOpacityBeginEnd
      , fog: false
    })

    //// Sprites.
  , firstTextSprite = new THREE.Sprite(firstTextSpriteMaterial)

    //// Meshes.
  , earthMesh = new THREE.Mesh(earthGeometry, earthMaterial)
  , cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
  , starMesh = new THREE.Mesh(starGeometry, starMaterial)

    //// Capture.
  , capture = new THREEcap({
        width: config.captureWidth
      , height: config.captureHeight
      , fps: config.captureFps
      , time: config.captureDuration / 1000 // convert ms to seconds
      , format: 'mp4'
      , composer: composer // faster than using a canvas
      , scriptbase: 'lib/threecap/'
    })
  , captureui = new THREEcapUI(capture)


scene.fog = new THREE.Fog(0x002060, -200, 800) // RT: rgb(0, 90, 83)



let module; export default module = {

    copyPass
  , renderer
  , composer
  , clock
  , camera
  , captureui

  , usualSpriteMaterial
  , firstTextSpriteMaterial
  , sprites
  , earthMesh
  , cloudMesh

    //// Sets up the scene - should be called only once.
  , init () {

        clock.stop()
        renderer.domElement.id = 'three-scene'
    	renderer.setPixelRatio(config.pixelRatio)
    	renderer.autoClear = false
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap
    	composer.addPass( new THREE.RenderPass(scene, camera) )
        outlinePass.selectedObjects = [earthMesh]
        outlinePass.edgeStrength = 0.5 // default is 3.0
        outlinePass.edgeGlow = 40 // default is 0.0
        outlinePass.edgeThickness = 5.0 // default is 1.0
        outlinePass.downSampleRatio = 1 // default is 2
        outlinePass.visibleEdgeColor.set('#104044')
        outlinePass.hiddenEdgeColor.set('#081044')
        composer.addPass(outlinePass)
    	// composer.addPass(rgbShiftPass)
    	composer.addPass(copyPass)
        scene.add(camera)
        scene.add(ambientLight)
    	directionalLight.position.set(-200,300,500)
        // earthMesh.receiveShadow = true
        // earthMaterial.shading = THREE.SmoothShading
        // earthMesh.renderDepth = 1e20
        earthMesh.rotation.z = -0.4
        cloudMesh.rotation.z = -0.4
        earthMesh.rotation.y = config.earthStartRotationY
        cloudMesh.rotation.y = config.earthStartRotationY
    	scene.add(directionalLight)
        // scene.add(globe)
        scene.add(earthMesh)
        scene.add(cloudMesh)
        scene.add(starMesh)
        document.body.appendChild(renderer.domElement)

        //// Add text sprites.
        firstTextSprite.position.set(110, -70, -7)
        firstTextSprite.scale.set(100, 100, 100)
        scene.add(firstTextSprite)

        ////
        let i = 0 // `i` is the ‘million-icon’ index
        for (const yearIndex in data) {
            const [ year, , delta ] = data[yearIndex]

            for (let j=0; j<delta; j++) {
                let y, z, sprite = new THREE.Sprite(usualSpriteMaterial)

                //// `i` up to 100
                if (100 > i) {
                    z = (i % 10) * -7 // effectively x
                    y = ~~(i / 10) * 7

                //// Odd `i`, up to 500, greater than 100
                } else if (500 > i && i % 2) {
                    z = ~~(i / 20) * 7 - 28
                    y = (i % 20) * 3.5 - 3.5

                //// Even `i`, up to 500, greater than 100
                } else if (500 > i) {
                    z = ~~(i / 20) * -7 - 35
                    y = (i % 20) * 3.5

                //// `i` greater than 500
                } else {
                    z = (i % 50) * -7 + 140
                    y = ~~(i / 50) * 7
                }

                sprite.position.set(110, y-20, z+32)
                sprite.scale.set(6, 6, 6)
                if (1950 === year)
                    sprite.showAtFraction = 0
                else if (2017 >= year)
                    sprite.showAtFraction =
                        0.25 // pause for 25% of the duration
                      + (yearIndex * 0.006) // when the year-text changes
                      + (
                            (0.006 / delta) // fraction of the year
                          * j // each ‘million-icon’ appears one-by-one
                        )
                else
                    sprite.showAtFraction =
                        0.35 // pause a bit at 2017
                      + (yearIndex * 0.006) // when the year-text changes
                      + (
                            (0.006 / delta) // fraction of the year
                          * j // each ‘million-icon’ appears one-by-one
                        )
                sprite.year = year
                sprite.visible = false
                sprites.push(sprite)
                scene.add(sprite)

                //// Increment the ‘million-icon’ index
                i++
            }
        }
    }

  , render () {
    	requestAnimationFrame(module.render)
    	const delta = clock.getDelta() // needed, to enable `clock.elapsedTime`
        const now = clock.elapsedTime
        if (state.prevNow === ~~now)
            if ('capture' === state.currMode) return // only render once a second
        else
            state.prevNow = ~~now // a new second!

        //// Show dots at the correct moment and update the year-text.
        const nowFraction = now / state.currDuration * 1000
        for (let i=0; i<sprites.length; i++) {
            const sprite = sprites[i]
            if (nowFraction > sprite.showAtFraction && ! sprite.visible) {
                sprite.visible = true
                if (state.firstText !== sprite.year) {
                    state.firstText = sprite.year
                    window.updateFirstText(sprite.year)
                    firstTextSpriteMaterial.map.needsUpdate = true
                }
            }
        }

        //// Rotate the Earth.
        if (1 > nowFraction) {
            earthMesh.rotation.y = config.earthStartRotationY + nowFraction
            cloudMesh.rotation.y = config.earthStartRotationY + nowFraction
        }

        TWEEN.update(now * 1000) // convert seconds to ms
    	renderer.clear()
    	composer.render()
    }


}
