import { useState, FormEvent } from 'react'
import {
  WHATSAPP_URL,
  WHATSAPP_NUMBER,
  OFFICE_ADDRESS,
  GOOGLE_MAPS_URL,
  FIRM_PHONE,
  FIRM_EMAIL,
} from '../lib/constants'

interface FormData {
  name: string
  phone: string
  subject: string
  message: string
}

const subjects = [
  'Direito dos Professores',
  'Aposentadoria / INSS',
  'BPC / LOAS',
  'Auxílio-doença',
  'Revisão de Benefício',
  'Outro assunto',
]

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Build WhatsApp message with form data
    const text = encodeURIComponent(
      `Olá! Me chamo *${form.name}*.\n` +
      `📞 Telefone: ${form.phone}\n` +
      `📋 Assunto: ${form.subject}\n\n` +
      `💬 ${form.message}`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
    setSubmitted(true)
  }

  return (
    <section id="contato" className="section-padding bg-brand-light">
      <div className="container-max mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="eyebrow justify-center">Entre em Contato</p>
          <h2 className="section-title mb-4">
            Fale <span className="text-primary">Conosco</span>
          </h2>
          <div className="divider mx-auto mb-6" />
          <p className="section-subtitle max-w-2xl mx-auto">
            Estamos prontos para ouvir seu caso. O primeiro atendimento é sempre gratuito.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* ── Left: Info + Map ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Contact Cards */}
            <div className="card bg-white p-6 space-y-5">
              <h3 className="font-title text-xl font-bold text-ink">Informações de Contato</h3>

              {[
                {
                  icon: (
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.523 5.851L.057 23.057a.75.75 0 00.886.886l5.206-1.466A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.706 9.706 0 01-4.952-1.357l-.355-.21-3.678 1.036 1.036-3.678-.21-.355A9.706 9.706 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                    </svg>
                  ),
                  label: 'WhatsApp',
                  value: FIRM_PHONE,
                  href: WHATSAPP_URL,
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: 'E-mail',
                  value: FIRM_EMAIL,
                  href: `mailto:${FIRM_EMAIL}`,
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  label: 'Endereço',
                  value: OFFICE_ADDRESS,
                  href: GOOGLE_MAPS_URL,
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center
                                  justify-center flex-shrink-0 group-hover:bg-primary/10
                                  transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-subtitle text-xs text-muted mb-0.5">{item.label}</p>
                    <p className="font-body text-ink text-sm group-hover:text-primary
                                  transition-colors leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Google Maps button */}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir no Google Maps
            </a>

            {/* Hours */}
            <div className="card bg-white p-6">
              <h3 className="font-title text-lg font-bold text-ink mb-4">
                Horário de Atendimento
              </h3>
              <div className="space-y-2 font-body text-sm">
                {[
                  { day: 'Segunda a Sexta', hours: '10h às 18h' },
                  { day: 'Sábado e Domingo', hours: 'Fechado' },
                ].map((h) => (
                  <div key={h.day}
                    className="flex justify-between items-center py-2 border-b border-border
                               last:border-0">
                    <span className="text-muted">{h.day}</span>
                    <span className="font-semibold text-ink">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right: Form ── */}
          <div className="lg:col-span-3">
            <div className="card bg-white p-8 h-full">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-brand-light flex items-center
                                  justify-center text-4xl mb-6">
                    ✅
                  </div>
                  <h3 className="font-title text-2xl font-bold text-ink mb-3">
                    Mensagem Enviada!
                  </h3>
                  <p className="font-body text-muted max-w-sm">
                    Sua mensagem foi enviada via WhatsApp. Nossa equipe entrará em contato
                    em breve. Obrigada pelo contato!
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', subject: '', message: '' }) }}
                    className="btn-primary mt-8"
                  >
                    Enviar Nova Mensagem
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-title text-2xl font-bold text-ink mb-2">
                    Envie Sua Mensagem
                  </h3>
                  <p className="font-body text-muted text-sm mb-8">
                    Preencha o formulário e continue pelo WhatsApp para maior agilidade.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-subtitle text-sm font-semibold
                                          text-dark mb-1.5">
                          Nome completo *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Seu nome"
                          className="w-full border border-border rounded-xl px-4 py-3
                                     font-body text-sm text-ink placeholder-muted/60
                                     focus:outline-none focus:border-primary focus:ring-2
                                     focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block font-subtitle text-sm font-semibold
                                          text-dark mb-1.5">
                          WhatsApp / Telefone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="(21) 99999-9999"
                          className="w-full border border-border rounded-xl px-4 py-3
                                     font-body text-sm text-ink placeholder-muted/60
                                     focus:outline-none focus:border-primary focus:ring-2
                                     focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-subtitle text-sm font-semibold
                                        text-dark mb-1.5">
                        Assunto *
                      </label>
                      <select
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full border border-border rounded-xl px-4 py-3
                                   font-body text-sm text-dark focus:outline-none
                                   focus:border-primary focus:ring-2 focus:ring-primary/20
                                   transition-all bg-white"
                      >
                        <option value="">Selecione um assunto...</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-subtitle text-sm font-semibold
                                        text-dark mb-1.5">
                        Descreva brevemente seu caso *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Conte-nos sobre sua situação..."
                        className="w-full border border-border rounded-xl px-4 py-3
                                   font-body text-sm text-ink placeholder-muted/60
                                   focus:outline-none focus:border-primary focus:ring-2
                                   focus:ring-primary/20 transition-all resize-none"
                      />
                    </div>

                    <p className="font-body text-xs text-gray-400">
                      Ao enviar, você será direcionado ao WhatsApp com suas informações.
                      Seus dados são tratados com total sigilo e confidencialidade.
                    </p>

                    <button
                      type="submit"
                      className="btn-primary w-full justify-center"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.523 5.851L.057 23.057a.75.75 0 00.886.886l5.206-1.466A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.706 9.706 0 01-4.952-1.357l-.355-.21-3.678 1.036 1.036-3.678-.21-.355A9.706 9.706 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                      </svg>
                      Enviar pelo WhatsApp
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
