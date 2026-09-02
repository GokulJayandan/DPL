/**
 * HeroCollage — Slow vertical scrolling image collage (bottom → top)
 * Three staggered strips moving at ultra-slow speeds for cinematic depth.
 * Low opacity with radial gradient overlay so text remains 100% sharp and readable.
 */
const ITEMS = [
  { src: '/assets/collage/img1.jpg', aspect: 'aspect-wide' },     // Trophy celebration (16:9)
  { src: '/assets/collage/img5.jpg', aspect: 'aspect-tall' },     // Batsmen celebration (portrait)
  { src: '/assets/collage/img2.jpg', aspect: 'aspect-standard' }, // Purple team running (3:2)
  { src: '/assets/collage/img4.jpg', aspect: 'aspect-wide' },     // Shane Warne bowling (16:9)
  { src: '/assets/collage/img3.jpg', aspect: 'aspect-standard' }, // Bowler celebration (3:2)
]

const strip1 = [ITEMS[0], ITEMS[1], ITEMS[2], ITEMS[3], ITEMS[4]]
const strip2 = [ITEMS[3], ITEMS[2], ITEMS[4], ITEMS[0], ITEMS[1]]
const strip3 = [ITEMS[1], ITEMS[4], ITEMS[0], ITEMS[2], ITEMS[3]]

export default function HeroCollage() {
  return (
    <div className="hero-collage-wrapper" aria-hidden="true">
      {/* Dark overlay so text stays 100% readable */}
      <div className="hero-collage-overlay" />

      <div className="hero-collage-track">
        {/* Strip 1 */}
        <div className="collage-strip strip-1">
          <div className="collage-strip-inner">
            {[...strip1, ...strip1].map((item, i) => (
              <div key={`s1-${i}`} className={`collage-cell ${item.aspect}`}>
                <img src={item.src} alt="" draggable="false" loading="eager" />
              </div>
            ))}
          </div>
        </div>

        {/* Strip 2 */}
        <div className="collage-strip strip-2">
          <div className="collage-strip-inner">
            {[...strip2, ...strip2].map((item, i) => (
              <div key={`s2-${i}`} className={`collage-cell ${item.aspect}`}>
                <img src={item.src} alt="" draggable="false" loading="eager" />
              </div>
            ))}
          </div>
        </div>

        {/* Strip 3 */}
        <div className="collage-strip strip-3">
          <div className="collage-strip-inner">
            {[...strip3, ...strip3].map((item, i) => (
              <div key={`s3-${i}`} className={`collage-cell ${item.aspect}`}>
                <img src={item.src} alt="" draggable="false" loading="eager" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

