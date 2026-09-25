import { Link } from 'wouter';
import { ArrowDownRight } from 'lucide-react';

export default function Process() {
  return (
    <div className="container-wide">
      <div className="page-header">
        <div className="eyebrow">Our approach / From idea to entrance</div>
        <h1>A considered way in.</h1>
        <p>Every memorable entrance begins with a point of view. Here is how a composition takes shape, and what happens after you approve yours.</p>
      </div>

      <section className="page-section border-top process-content">
        <div className="editorial-points">
          <div className="editorial-point">
            <span className="eyebrow">01 / Review</span>
            <div>
              <h2>Approve your design.</h2>
              <p>Review your palette, scale, services, and notes before approving. If you change a choice afterward, you will need to approve the updated design again. Approval is not an order or a reservation; the final review and checkout become available only when the offers are ready.</p>
            </div>
          </div>
          <div className="editorial-point">
            <span className="eyebrow">02 / When confirmed</span>
            <div>
              <h2>Plan the timing.</h2>
              <p>Your selected week is a preference, not a booked date. Add an event date in your notes if timing matters. Availability and scheduling will need confirmation before an installation or delivery.</p>
            </div>
          </div>
          <div className="editorial-point">
            <span className="eyebrow">03 / At your entry</span>
            <div>
              <h2>Choose how it arrives.</h2>
              <p>Custom installation means the display is styled at your entry. Delivery only leaves the arrangement to you. You can also request a monogram or post-season removal. Once details and pricing are confirmed, you can review your selection before secure checkout.</p>
            </div>
          </div>
        </div>
        <Link href="/?compose=1" className="primary-button editorial-return">Create your design <ArrowDownRight size={15} aria-hidden="true" /></Link>
      </section>
    </div>
  );
}