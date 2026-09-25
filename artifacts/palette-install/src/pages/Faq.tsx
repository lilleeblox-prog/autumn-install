import { useState } from 'react';
import { faqs } from '../lib/data';
import { Plus } from 'lucide-react';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container-wide">
      <div className="page-header">
        <div className="eyebrow">The particulars / Good to know</div>
        <h1>A few good questions.</h1>
        <p>Everything you may want to know about materials, timing, installation and what it means to approve a design.</p>
      </div>

      <section className="page-section faq-page-content">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div className={`faq-item ${openIndex === index ? 'open' : ''}`} key={index}>
              <button 
                className="faq-question" 
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
                data-testid={`button-faq-${index}`}
              >
                <span><small className="faq-number">{String(index + 1).padStart(2, '0')}</small>{faq.question}</span>
                <Plus size={24} className="faq-icon" />
              </button>
              <div className="faq-answer">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
