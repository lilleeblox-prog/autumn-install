import { useEffect, useState } from 'react';
import { useSearch } from 'wouter';
import { consultationMessage, readConsultationChoices } from '../lib/consultation';

export default function Contact() {
  const search = useSearch();
  const [savedChoices] = useState(readConsultationChoices);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [space, setSpace] = useState('');
  const [timing, setTiming] = useState(savedChoices?.requestedWeek ?? '');
  const [message, setMessage] = useState(() => savedChoices ? consultationMessage(savedChoices) : '');

  useEffect(() => {
    if (new URLSearchParams(search).get('consultation') !== '1') return;
    const frame = requestAnimationFrame(() => {
      const section = document.getElementById('consultation-form');
      section?.scrollIntoView({ block: 'start' });
      section?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [search]);

  return (
    <div className="container-wide">
      <div className="page-header">
        <div className="eyebrow">The conversation / Begin here</div>
        <h1>Tell us about the space.</h1>
        <p>The doorway, the occasion, the feeling you want guests to have. The best compositions begin with a conversation.</p>
      </div>

      <section className="page-section border-top contact-layout">
        <section id="consultation-form" tabIndex={-1} className="consultation-form-slot" aria-labelledby="consultation-form-title">
            <span className="eyebrow">Further customization / Consultation required</span>
            <h3 id="consultation-form-title">Let’s talk about your idea.</h3>
            <p>Need a different scale, a particular palette, or a design for a unique space? A consultation lets us discuss what’s possible before confirming scope, pricing, or a date.</p>
             <div className="consultation-form-placeholder" aria-label="Consultation draft">
               <span className="eyebrow">Consultation draft / Not sent</span>
               <p>Review and edit your details here. Sending is unavailable in this preview; the Shopify consultation form will handle inquiries once it’s ready to go live.</p>
               {savedChoices && <p className="consultation-prefill-note" role="status">Your selected display details and requested week have been carried over. Your actual space and contact details are left for you to enter.</p>}
               <div className="consultation-draft-fields">
                 <label>Name<input type="text" autoComplete="name" value={name} onChange={event => setName(event.target.value)} placeholder="Your name" /></label>
                 <label>Email<input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Your email" /></label>
                 <label>Space or location<input type="text" value={space} onChange={event => setSpace(event.target.value)} placeholder="Porch, stoop, storefront…" /></label>
                 <label>Preferred timing or event date<input type="text" value={timing} onChange={event => setTiming(event.target.value)} placeholder="A preference, not a confirmed date" /></label>
                 <label className="consultation-draft-message">Your ideas and special requests<textarea rows={10} value={message} onChange={event => setMessage(event.target.value)} placeholder="Tell us what you have in mind…" /></label>
               </div>
               <button type="button" className="consultation-draft-button" disabled>Sending unavailable in preview</button>
            </div>
             <p className="consultation-form-footnote">Nothing entered here is submitted or saved as an inquiry. A consultation is not a confirmed booking, quote, or order.</p>
        </section>
      </section>
    </div>
  );
}