import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'



const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const texture = new THREE.TextureLoader()
const bakedshadow = texture.load('/textures/bakedShadow.jpg')
const sampleshadow = texture.load('/textures/simpleShadow.jpg')



const gui = new GUI()

const ambient = new THREE.AmbientLight(0xffffff,0.5)
gui.add(ambient, 'intensity').min(0).max(3).step(0.001)

const directonal = new THREE.DirectionalLight(0xffffff,1)

directonal.position.set(2,2,-1)

directonal.shadow.camera.near = 1
directonal.shadow.camera.far = 6

directonal.shadow.camera.top = 2
directonal.shadow.camera.right = 2
directonal.shadow.camera.bottom = -2
directonal.shadow.camera.left = -2

gui.add(directonal.position, 'x').min(-5).max(5).step(0.001)
gui.add(directonal.position, 'y').min(-5).max(5).step(0.001)
gui.add(directonal.position, 'z').min(-5).max(5).step(0.001)


scene.add(directonal,ambient)
gui.add(directonal, 'intensity').min(0).max(5).step(0.001)

directonal.shadow.mapSize.width = 1024
directonal.shadow.mapSize.height = 1024

const directionalcamerahelper = new THREE.CameraHelper(directonal.shadow.camera)
scene.add(directionalcamerahelper)
directionalcamerahelper.visible = false

// gui.add(directionalcamerahelper, 'myBoolean')

directonal.castShadow = true

//sport ligh
const spotLight = new THREE.SpotLight(0xffffff,10,10,Math.PI * 0.3)
gui.add(spotLight,'intensity').min(0).max(20).step(0.001).name('SpotLight')
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.castShadow = true

spotLight.position.set(0,2,2)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)
spotLightCameraHelper.visible = false

//point light
const pointlight = new THREE.PointLight(0xffffff,0.3)

pointlight.castShadow = true

const size = {
    width : window.innerWidth,
    height : window.innerHeight
}


const material = new THREE.MeshStandardMaterial(
    {roughness : 0.5}
)
gui.add(material,"roughness").min(0).max(1).step(0.001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.receiveShadow = true  

material.side = THREE.DoubleSide
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
scene.add(sphere,plane)


const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial(
        {
            color: 0x000000,
            transparent: true,
            alphaMap: sampleshadow
        }
    )
)
sphereShadow.rotation.x = -Math.PI / 2
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphereShadow)

window.addEventListener('resize',()=>
{
    size.width = window.innerWidth
    size.height= window.innerHeight

    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    renderer.setSize(size.width , size.height)
})

const camera = new THREE.PerspectiveCamera(75,size.width / size.height)
camera.position.set(1,1,2)

const controls= new OrbitControls(camera,canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas : canvas
})
renderer.setSize(size.width , size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled = false

const clock = new THREE.Clock()

const tick = () =>{

    const ElapsedTime = clock.getElapsedTime()
    // camera.position.x = Math.sin(ElapsedTime)
    // camera.position.y = Math.cos(ElapsedTime)

    //update the sphere animation
    sphere.position.x = Math.cos(ElapsedTime) * 1.5
    sphere.position.z = Math.sin(ElapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(ElapsedTime * 3))


    //update theshadow to sphere
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y )* 0.3

    controls.update()
    requestAnimationFrame(tick)
    renderer.render(scene,camera)

}
tick()