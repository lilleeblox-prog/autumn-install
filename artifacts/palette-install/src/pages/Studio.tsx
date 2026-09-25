export default function Studio() {
  return (
    <div className="container-wide">
      <div className="page-header">
        <div className="eyebrow">The Studio</div>
        <h1>Architectural styling for the season.</h1>
        <p>We look at the doorway as part of the whole home. A seasonal display should feel considered in its colors, proportions, and placement.</p>
      </div>

      <section className="page-section border-top">
        <div className="studio-layout">
          <div>
            <h2>Thoughtful from the threshold out.</h2>
            <p>Height matters on a broad stair. A narrow stoop needs room to breathe. For a storefront, the display should welcome people without hiding the entrance. These are the practical details behind an intentional composition.</p>
            <p>Begin with the scale of your space, then choose a color story. Notes in your brief are the place to describe the architecture, an event date, or a particular detail you would like considered. Individual pumpkins and gourds may vary with the harvest.</p>
          </div>
          <div className="hero-image studio-image">
             <img src="/package-images/package-large.webp" alt="A large-scale seasonal entry display" style={{ objectPosition: 'center 65%' }} />
          </div>
        </div>
      </section>
    </div>
  );
}
