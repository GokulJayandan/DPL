/**
 * HeroCollage — Slow vertical scrolling image collage (bottom → top)
 * Two parallel strips moving at slightly different speeds for depth effect.
 * Low opacity so hero text reads clearly on top.
 */
const IMAGES = [
  '/assets/collage/img1.jpg',
  '/assets/collage/img2.jpg',
  '/assets/collage/img3.jpg',
  '/assets/collage/img4.jpg',
  '/assets/collage/img5.jpg',
]

// Split into two columns, duplicated for seamless infinite loop
const col1 = [IMAGES[0], IMAGES[2], IMAGES[4], IMAGES[1], IMAGES[3]]
const col2 = [IMAGES[3], IMAGES[1], IMAGES[0], IMAGES[4], IMAGES[2]]

export default function HeroCollage() {
  return (
    <div className="hero-collage-wrapper" aria-hidden="true">
      {/* Dark overlay so text stays readable */}
      <div className="hero-collage-overlay" />

      <div className="hero-collage-track">
        {/* Strip 1 — slightly faster */}
        <div className="collage-strip strip-1">
          <div className="collage-strip-inner">
            {[...col1, ...col1].map((src, i) => (
              <div key={`s1-${i}`} className="collage-cell">
                <img src={src} alt="" draggable="false" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Strip 2 — slightly slower */}
        <div className="collage-strip strip-2">
          <div className="collage-strip-inner">
            {[...col2, ...col2].map((src, i) => (
              <div key={`s2-${i}`} className="collage-cell">
                <img src={src} alt="" draggable="false" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Strip 3 — medium speed, offset start */}
        <div className="collage-strip strip-3">
          <div className="collage-strip-inner">
            {[...col1.slice(2), ...col2.slice(1), ...col1].map((src, i) => (
              <div key={`s3-${i}`} className="collage-cell">
                <img src={src} alt="" draggable="false" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
