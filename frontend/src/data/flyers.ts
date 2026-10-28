export interface FlyerConfig {
  textureUrl: string
  /** Height on the pole, in scene units (pole spans -3.65..3.65). */
  y: number
  /** Angle around the pole, in radians. */
  angle: number
}

export const flyers: FlyerConfig[] = [
  { textureUrl: '/assets/flyer1.png', y: 1, angle: 0 },
  { textureUrl: '/assets/flyer2.jpg', y: 2, angle: (2 * Math.PI) / 3 },
  { textureUrl: '/assets/poster_k1.jpeg', y: -1, angle: Math.PI },
  { textureUrl: '/assets/poster_k2.jpeg', y: -3, angle: Math.PI / 2 },
]
