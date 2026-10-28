import * as THREE from 'three'

const POLE_RADIUS = 1
const POLE_HEIGHT = 7.3
/** Slightly larger than the pole so flyers sit on its surface. */
const FLYER_RADIUS = 1.02
/** Each flyer wraps a quarter of the way around the pole. */
const FLYER_ARC = Math.PI / 2
const FLYER_WIDTH = FLYER_RADIUS * FLYER_ARC
/** Height used until the poster loads and reveals its real aspect ratio (letter paper). */
const DEFAULT_FLYER_HEIGHT = FLYER_WIDTH * (11 / 8.5)
/** Vertical band (centered on the pole's middle) that flyer centers are spread across. */
const FLYER_SPAN = 4.6
/** Gap between consecutive flyers, at most; fewer flyers bunch toward the middle. */
const MAX_FLYER_STEP = 0.8
/** Each later flyer sits a hair further out, so overlapping ones don't z-fight. */
const FLYER_LAYER_GAP = 0.004
/** Radial pop-out of the selected flyer. */
const SELECTED_SCALE = 1.06
const CAMERA_FOV = 45
const CAMERA_POSITION = new THREE.Vector3(0, 2, 10)
/** Half the width (scene units) the camera always keeps in view: pole, flyers, and a margin. */
const MIN_VISIBLE_HALF_WIDTH = 1.6

export interface PoleFlyer {
  id: string
  imageUrl: string
}

export interface PoleScene {
  setRotation(radians: number): void
  setSelected(id: string | null): void
  /** Id of the flyer under the given viewport point, if any. */
  pick(clientX: number, clientY: number): string | null
  dispose(): void
}

/** Renders the telephone pole with `flyers` stapled around it, filling `container`. */
export function createPoleScene(container: HTMLElement, flyers: PoleFlyer[]): PoleScene {
  const loader = new THREE.TextureLoader()
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100)

  // Transparent canvas: the container's CSS supplies the backdrop.
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  const render = () => renderer.render(scene, camera)

  const woodTexture = loader.load('/assets/wood-texture.jpg', render)
  woodTexture.colorSpace = THREE.SRGBColorSpace
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(POLE_RADIUS, POLE_RADIUS, POLE_HEIGHT, 64),
    new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.8, metalness: 0 })
  )
  scene.add(pole)

  const step = flyers.length > 1 ? Math.min(MAX_FLYER_STEP, FLYER_SPAN / (flyers.length - 1)) : 0
  const flyerMeshes = flyers.map((flyer, i) => {
    // Spiral down the pole, a quarter turn plus a little per flyer, so neighbors face
    // different ways and the pattern doesn't line up into four neat columns.
    const mesh = createFlyer(loader, flyer, FLYER_RADIUS + i * FLYER_LAYER_GAP, render)
    mesh.position.y = ((flyers.length - 1) / 2 - i) * step
    mesh.rotation.y = i * (FLYER_ARC + 0.35)
    pole.add(mesh)
    return mesh
  })

  scene.add(new THREE.AmbientLight(0xffffff, 1.5))
  const pointLight = new THREE.PointLight(0xffffff, 2, 20)
  pointLight.position.set(5, 5, 5)
  scene.add(pointLight)

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = container
    if (!width || !height) return
    camera.aspect = width / height
    // FOV is vertical, so on narrow canvases back the camera off until the flyers fit across.
    const fitDistance =
      MIN_VISIBLE_HALF_WIDTH / (Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2)) * camera.aspect)
    camera.position
      .copy(CAMERA_POSITION)
      .multiplyScalar(Math.max(1, fitDistance / CAMERA_POSITION.z))
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    render()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  return {
    setRotation(radians) {
      pole.rotation.y = radians
      render()
    },
    setSelected(id) {
      for (const mesh of flyerMeshes) {
        const scale = mesh.userData.id === id ? SELECTED_SCALE : 1
        mesh.scale.set(scale, 1, scale)
      }
      render()
    },
    pick(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      )
      raycaster.setFromCamera(pointer, camera)
      // Flyers are single-sided and the pole is in the list, so flyers on the far side
      // can't be hit through it. Posters still loading are hidden and skipped.
      const hit = raycaster
        .intersectObjects([pole, ...flyerMeshes], false)
        .find(({ object }) => object.visible)
      return (hit?.object.userData.id as string | undefined) ?? null
    },
    dispose() {
      resizeObserver.disconnect()
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        const material = object.material as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial
        object.geometry.dispose()
        material.map?.dispose()
        material.dispose()
      })
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}

function createFlyer(
  loader: THREE.TextureLoader,
  { id, imageUrl }: PoleFlyer,
  radius: number,
  render: () => void
) {
  const geometry = (height: number) =>
    new THREE.CylinderGeometry(radius, radius, height, 32, 1, true, 0, FLYER_ARC)

  const mesh = new THREE.Mesh(
    geometry(DEFAULT_FLYER_HEIGHT),
    new THREE.MeshBasicMaterial({ transparent: true })
  )
  mesh.visible = false
  mesh.userData.id = id

  const texture = loader.load(
    imageUrl,
    ({ image }) => {
      // Match the poster's own aspect ratio instead of stretching it to letter paper.
      const { width, height } = image as HTMLImageElement
      if (width && height) {
        mesh.geometry.dispose()
        mesh.geometry = geometry(FLYER_WIDTH * (height / width))
      }
      mesh.visible = true
      render()
    },
    undefined,
    (error) => console.error(`Failed to load flyer ${imageUrl}:`, error)
  )
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  mesh.material.map = texture
  return mesh
}
