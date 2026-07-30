import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  }

  return (
    <div className="min-h-[100dvh]">
      <Navigation />

      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.15 } } }}
            className="mb-16 space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-primary">
                Get in touch
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-serif font-medium leading-[1.05] tracking-tight max-w-xl"
            >
              We'd love to hear from you.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground leading-relaxed max-w-lg"
            >
              Questions about our service, availability in your neighborhood, or anything else — reach out and we'll get back to you promptly.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16"
          >
            {/* Left — contact details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-2">
                <p className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-muted-foreground">Service area</p>
                <p className="text-foreground leading-relaxed">Tennessee — Franklin, Brentwood, Belle Meade, and surrounding neighborhoods.</p>
              </div>
              <div className="space-y-2">
                <p className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-muted-foreground">Season</p>
                <p className="text-foreground leading-relaxed">Fall 2026 is currently accepting new addresses. Winter and Summer services are coming soon.</p>
              </div>
              <div className="space-y-2">
                <p className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-muted-foreground">Response time</p>
                <p className="text-foreground leading-relaxed">We reply within one business day.</p>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border p-8 md:p-10">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="py-8 space-y-3"
                  >
                    <h3 className="text-2xl font-serif font-medium">Message received.</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Thank you for reaching out. We'll be in touch within one business day.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Name</label>
                        <input
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Jane Smith"
                          className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="jane@example.com"
                          className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="(615) 555-0100"
                        className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Message</label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us about your home, neighborhood, or any questions you have."
                        rows={5}
                        className="w-full resize-none border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      className="font-mono text-[0.78rem] tracking-[0.08em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-[14px] transition-colors"
                    >
                      Send message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border py-12 mt-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center text-sm text-muted-foreground">
          <p>© 2026 Made to Welcome. Seasonal décor delivery &amp; installation.</p>
        </div>
      </footer>
    </div>
  );
}
