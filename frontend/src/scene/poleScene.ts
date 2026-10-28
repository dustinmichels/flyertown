import * as THREE from 'three'
import type { FlyerConfig } from '../data/flyers'

const POLE_RADIUS = 1
const POLE_HEIGHT = 7.3
/** Slightly larger than the pole so flyers sit on its surface. */
const FLYER_RADIUS = 1.02
/** Letter-paper aspect when wrapped 90° around the pole. */
const FLYER_HEIGHT = 1.8
const FLYER_ARC = Math.PI / 2

export interface PoleScene {
  setRotation(radians: number): void
  dispose(): void
}

/** Renders the telephone pole with its flyers into `container`, sized to the window. */
export function createPoleScene(container: HTMLElement, flyers: FlyerConfig[]): PoleScene {
  const loader = new THREE.TextureLoader()

  const scene = new THREE.Scene()
  scene.background = loader.load('/assets/background.jpg')

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 2, 10)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(POLE_RADIUS, POLE_RADIUS, POLE_HEIGHT, 64),
    new THREE.MeshStandardMaterial({
      map: loader.load('/assets/wood-texture.jpg'),
      roughness: 0.8,
      metalness: 0,
    })
  )
  for (const flyer of flyers) pole.add(createFlyer(loader, flyer))
  scene.add(pole)

  scene.add(new THREE.AmbientLight(0xffffff, 1.5))
  const pointLight = new THREE.PointLight(0xffffff, 2, 20)
  pointLight.position.set(5, 5, 5)
  scene.add(pointLight)

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onResize)
  renderer.setAnimationLoop(() => renderer.render(scene, camera))

  return {
    setRotation(radians) {
      pole.rotation.y = radians
    },
    dispose() {
      renderer.setAnimationLoop(null)
      window.removeEventListener('resize', onResize)
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        const material = object.material as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial
        object.geometry.dispose()
        material.map?.dispose()
        material.dispose()
      })
      ;(scene.background as THREE.Texture).dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}

function createFlyer(loader: THREE.TextureLoader, { textureUrl, y, angle }: FlyerConfig) {
  const texture = loader.load(textureUrl, undefined, undefined, (error) =>
    console.error(`Failed to load flyer texture ${textureUrl}:`, error)
  )
  const flyer = new THREE.Mesh(
    new THREE.CylinderGeometry(FLYER_RADIUS, FLYER_RADIUS, FLYER_HEIGHT, 32, 1, true, 0, FLYER_ARC),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
  )
  flyer.position.y = y
  flyer.rotation.y = angle
  return flyer
}
