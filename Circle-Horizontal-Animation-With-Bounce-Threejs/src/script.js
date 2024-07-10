import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2, -1)
scene.add(ambientLight, directionalLight)

/**
 * Objects
 */
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial()
)
plane.rotation.x = - Math.PI / 2
plane.position.y = - 0.5

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial()
)
scene.add(plane, sphere)

//textures
const sphereShadow = textureLoader.load('textures/simpleShadow.jpg')

/**
 * Size
 */
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
camera.position.set(3, 2, 4)
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(size.width, size.height)
renderer.shadowMap.enabled = true

/**
 * Shadows
 */
directionalLight.castShadow = true
plane.receiveShadow = true
sphere.castShadow = true

directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

/**
 * Time
 */
const clock = new THREE.Clock()

/**
 * Animate
 */
const tick = () => {

    //time
    const elapsedTime = clock.getElapsedTime()

    //Animate sphere
    sphere.position.x = Math.sin(elapsedTime) * 1.5
    sphere.position.z = Math.cos(elapsedTime) * 1.5

    //For the bounce
    sphere.position.y = Math.abs(Math.sin(elapsedTime)) * 1.5

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)

}
tick()