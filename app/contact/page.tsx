import type { Metadata } from 'next'
import { Phone, Mail, MessageCircle, Clock } from 'lucide-react'
import InquiryForm from '@/components/InquiryForm'
import ReviewProofStrip from '@/components/ReviewProofStrip'

export const metadata: Metadata = {
  title: 'Contact | Book Your Las Vegas VIP Experience',
  description:
    'Contact Nokturnal Lifestyle Concierge to plan your Las Vegas VIP experience. Call (702) 996-4884 or fill out our quick inquiry form. We respond within 30 minutes.',
}

const contactMethods = [
  {
    icon: Phone,
    title: 'Call or Text',
    value: '(702) 996-4884',
    sub: 'Fastest response',
    href: 'tel:+17029964884',
    color: 'text-gold-400',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: 'Message Us',
    sub: 'Chat in real time',
    href: 'https://wa.me/17023494456',
    color: 'text-green-400',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'sales@nokturnallifestyle.com',
    valueParts: ['sales@', 'nokturnallifestyle.com'],
    sub: 'For detailed inquiries',
    href: 'mailto:sales@nokturnallifestyle.com',
    color: 'text-blue-400',
  },
  {
    icon: Clock,
    title: 'Hours',
    value: '9am – Midnight',
    sub: '7 days a week',
    href: null,
    color: 'text-purple-400',
  },
]

const faqs = [
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking at least 1–2 weeks in advance for weekends. That said, we specialize in last-minute bookings — even same-day requests.',
  },
  {
    q: 'What is included in the personal VIP host?',
    a: 'Your host meets you at the hotel or venue, escorts your group through VIP entry, handles check-in at the table, stays through the night to handle any issues, and coordinates all transportation.',
  },
  {
    q: 'Do your prices include the cost of bottles?',
    a: 'Package pricing varies. Some packages include bottles; others list the venue minimum separately. We\'ll be fully transparent when we build your custom quote.',
  },
  {
    q: 'Do you work with large groups?',
    a: 'Yes! We handle groups from 2 to 100+ people. Larger groups often qualify for better table placement and pricing.',
  },
  {
    q: 'Can I build a fully custom itinerary?',
    a: 'Absolutely — that\'s our specialty. Call or fill out the form and our team will build something completely tailored to your group.',
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="section-eyebrow mb-4">Contact Us</div>
          <h1 className="font-display text-white font-bold mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Let's Plan Your Vegas Experience
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Fill out the form below or call us directly. Our team typically responds within 30 minutes
            during business hours.
          </p>
          <ReviewProofStrip centered className="mt-6" />
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-10 px-4">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
          {contactMethods.map(({ icon: Icon, title, value, valueParts, sub, href, color }) => (
            <div key={title} className="card-dark min-w-0 p-5 text-center">
              <div className={`${color} mb-3 flex justify-center`}>
                <Icon size={22} />
              </div>
              <div className="text-white/40 text-xs uppercase tracking-wider mb-1">{title}</div>
              {href ? (
                <a
                  href={href}
                  className={`${color} block min-w-0 text-sm font-semibold leading-tight transition-opacity hover:opacity-80`}
                >
                  {valueParts ? (
                    <>
                      <span className="block sm:hidden">Email Us</span>
                      <span className="hidden sm:block">{valueParts[0]}</span>
                      <span className="hidden break-all text-[0.72rem] sm:block sm:text-sm">{valueParts[1]}</span>
                    </>
                  ) : (
                    value
                  )}
                </a>
              ) : (
                <div className="text-white font-semibold text-sm">{value}</div>
              )}
              <div className="text-white/30 text-xs mt-1">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main form */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="card-dark p-8 sm:p-12">
            <h2 className="font-display text-white font-bold text-2xl mb-2">Request a Free Quote</h2>
            <p className="text-white/50 text-sm mb-8">No commitment required. We'll get back to you within 30 minutes.</p>
            <InquiryForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-night-800/40">
        <div className="max-w-3xl mx-auto">
          <div className="section-eyebrow mb-4 text-center">FAQ</div>
          <h2 className="font-display text-white font-bold text-2xl text-center mb-10">Common Questions</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="card-dark p-6">
                <h3 className="text-white font-semibold mb-2 text-sm">{q}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
