import Head from 'next/head'
import { useState, useEffect } from 'react'
import { FIRM_NAME, FIRM_CNPJ, FIRM_PHONE } from '../lib/constants'

const WA_URL = 'https://wa.me/5521979522553?text=' + encodeURIComponent('Olá, gostaria de analisar meu contracheque.')

// ── SUBSTITUA pela URL de incorporação do seu Google Forms ──────────────────
// Abra seu formulário → Enviar → </> Incorporar → copie o src do iframe
const GOOGLE_FORMS_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeJ3pelL50ASsI0gzZko-691npUIvkIyTzwxWI3dUju9FGMNQ/viewform?embedded=true'
// ────────────────────────────────────────────────────────────────────────────

// Google Sheets — URL do Web App (Apps Script). Substitua após implantar.
const SHEETS_URL = ''

export default function Professores() {
  const [showExit, setShowExit] = useState(false)
  const [exitDismissed, setExitDismissed] = useState(false)

  // Form state
  const [formData, setFormData] = useState({ nome: '', telefone: '', email: '', situacao: '', mensagem: '' })
  const [formFile, setFormFile] = useState<File | null>(null)
  const [formSending, setFormSending] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitDismissed) setShowExit(true)
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [exitDismissed])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSending(true)
    setFormError('')

    // 1. Envia e-mail com anexo via FormSubmit
    const data = new FormData()
    Object.entries(formData).forEach(([k, v]) => data.append(k, v))
    if (formFile) data.append('contracheque', formFile)
    data.append('_subject', 'Nova solicitação — Análise de Contracheque')
    data.append('_captcha', 'false')

    try {
      const res = await fetch('https://formsubmit.co/ajax/documentos@rogeriaoliveira.com', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      })

      // 2. Salva na planilha Google Sheets (fire-and-forget)
      if (SHEETS_URL) {
        fetch(SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({ ...formData, arquivo: formFile?.name || '' }),
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => {})
      }

      if (res.ok) setFormSent(true)
      else setFormError('Erro ao enviar. Por favor tente novamente.')
    } catch {
      setFormError('Erro ao enviar. Verifique sua conexão e tente novamente.')
    } finally {
      setFormSending(false)
    }
  }

  return (
    <>
      <Head>
        <title>Advogada para Professores RJ | Análise Gratuita do Contracheque</title>
        <meta name="description" content="Professora ou professor do Estado do RJ? Identifique erros no piso salarial, triênios e Nova Escola. Análise jurídica gratuita do contracheque." />
        <meta name="keywords" content="advogado professores RJ, direitos professor RJ, piso salarial professor RJ, Nova Escola professores, triênios professor RJ" />
        <meta property="og:title" content="Análise Gratuita do Contracheque — Professores RJ" />
        <meta property="og:description" content="9 em cada 10 contracheques de professores do RJ têm erros. Descubra o que você tem direito a receber." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rogeriaoliveira.com/professores" />
      </Head>

      {/* Exit Intent Popup */}
      {showExit && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="font-title font-bold text-ink text-xl mb-2">
              Espera! Seu contracheque pode estar errado.
            </h3>
            <p className="font-body text-muted text-sm mb-6">
              Descubra em 2 minutos se seu piso está correto — sem sair de casa, sem compromisso.
            </p>
            <a href="#formulario" onClick={() => { setShowExit(false); setExitDismissed(true) }}
              className="block w-full bg-primary text-white font-subtitle font-bold py-3 rounded-xl mb-3 hover:bg-support transition-colors">
              Quero Verificar Agora
            </a>
            <button onClick={() => { setShowExit(false); setExitDismissed(true) }}
              className="text-muted text-sm hover:text-ink transition-colors">
              Não, prefiro perder meus direitos
            </button>
          </div>
        </div>
      )}

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary px-4 py-3
                      flex items-center justify-between gap-3 shadow-lg lg:hidden">
        <p className="font-subtitle text-white text-xs font-semibold leading-tight">
          Análise gratuita do seu contracheque
        </p>
        <a href="#formulario"
          className="flex-shrink-0 bg-white text-primary font-subtitle font-bold
                     text-xs px-4 py-2 rounded-full whitespace-nowrap">
          Analisar Agora
        </a>
      </div>

      <div className="flex flex-col min-h-screen overflow-x-hidden">

        {/* ── 1. HEADER ─────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 bg-ink shadow-[0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo.png" alt={FIRM_NAME} className="h-8 w-auto" />
            </a>
            <nav className="hidden md:flex items-center gap-6">
              {[['#direitos','Direitos'],['#aposentadoria','Aposentadoria'],['#autoridade','Quem Somos']].map(([href, label]) => (
                <a key={href} href={href}
                  className="font-subtitle text-sm text-white/70 hover:text-white transition-colors">
                  {label}
                </a>
              ))}
            </nav>
            <a href="#formulario"
              className="bg-primary hover:bg-support text-white font-subtitle font-bold
                         text-sm px-5 py-2.5 rounded-full transition-colors whitespace-nowrap">
              Avaliar meu Contracheque
            </a>
          </div>
        </header>

        <main>

          {/* ── 2. HERO ───────────────────────────────────────────────── */}
          <section className="bg-ink text-white pt-10 pb-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-title font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] mb-6 text-white">
                <span className="text-primary">Professor Estadual do RJ:</span>
                <br />
                <span className="text-primary">
                  Recupere seus Direitos e Garanta o Valor Real do seu Salário.
                </span>
              </h1>

              <p className="font-body text-white/75 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Identificamos erros frequentes no cálculo do Piso Nacional, triênios congelados
                e verbas nunca pagas. Recupere valores que o Estado deixou de depositar.
              </p>

              <a href="#formulario"
                className="inline-flex items-center gap-3 bg-primary hover:bg-support
                           text-white font-subtitle font-bold text-base px-8 py-4
                           rounded-full transition-colors shadow-button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth={0} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="currentColor"/>
                </svg>
                QUERO UMA ANÁLISE GRATUITA DO MEU CONTRACHEQUE
              </a>

              {/* Trust strip */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                {[
                  '🔒 Dados protegidos por LGPD',
                  '📱 Atendimento 100% remoto',
                ].map(item => (
                  <span key={item} className="font-subtitle text-xs text-white/60 tracking-wide">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ── 3. DIREITOS ───────────────────────────────────────────── */}
          <section id="direitos" className="py-20 px-4 sm:px-6 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <p className="font-subtitle text-xs font-semibold text-primary tracking-[0.15em]
                               uppercase flex items-center justify-center gap-2 mb-4">
                  <span className="w-6 h-px bg-primary" />
                  Seus Direitos
                  <span className="w-6 h-px bg-primary" />
                </p>
                <h2 className="font-title font-bold text-3xl sm:text-4xl text-ink mb-4">
                  Por que <span className="text-primary">9 em cada 10</span> contracheques
                  <br className="hidden sm:block" /> apresentam erros?
                </h2>
                <p className="font-body text-muted max-w-2xl mx-auto">
                  O sistema de pagamento do magistério é complexo. Erros acumulam por anos
                  e a maioria dos professores nunca recebe o que é de direito.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: '🎓',
                    title: 'Nova Escola',
                    desc: 'O Processo Nova Escola garante o pagamento de valores que foram suspensos indevidamente pelo estado para profissionais da educação. Se você trabalhava na rede estadual em 2002/2003, pode ter direito a receber essas diferenças com correção.',
                    tag: 'Muito comum',
                  },
                  {
                    icon: '📊',
                    title: 'Piso Nacional',
                    desc: 'O piso salarial nacional do magistério é reajustado anualmente. Descumprimentos acumulam valores retroativos que podem ser cobrados judicialmente.',
                    tag: 'Alto impacto',
                  },
                  {
                    icon: '📅',
                    title: 'Triênios e Licenças não Concedidas',
                    desc: 'Avanços automáticos por tempo de serviço frequentemente são ignorados ou calculados com base errada, reduzindo o salário real do professor.',
                    tag: 'Retroativo',
                  },
                  {
                    icon: '⏸️',
                    title: 'Congelamento da Pandemia',
                    desc: 'Progressões suspensas durante 2020–2022 geraram perdas que, em muitos casos, não foram compensadas. A Justiça tem reconhecido o direito à reposição.',
                    tag: 'Ação judicial',
                  },
                ].map(card => (
                  <div key={card.title}
                    className="bg-white border border-border rounded-2xl p-6
                               shadow-sm hover:shadow-md hover:-translate-y-0.5
                               transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center
                                      justify-center text-2xl flex-shrink-0">
                        {card.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-subtitle font-bold text-ink text-base">{card.title}</h3>
                          <span className="text-[10px] font-semibold bg-primary/15 text-primary
                                           px-2 py-0.5 rounded-full">{card.tag}</span>
                        </div>
                        <p className="font-body text-muted text-sm leading-relaxed">{card.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <a href="#formulario"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-support
                             text-white font-subtitle font-bold px-8 py-4 rounded-full
                             transition-colors shadow-button">
                  Verificar meu contracheque agora
                </a>
              </div>
            </div>
          </section>

          {/* ── 4. APOSENTADORIA ──────────────────────────────────────── */}
          <section id="aposentadoria" className="py-20 px-4 sm:px-6 bg-[#F8F4EA]">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                  <p className="font-subtitle text-xs font-semibold text-primary tracking-[0.15em]
                                 uppercase flex items-center justify-center lg:justify-start gap-2 mb-4">
                    <span className="w-6 h-px bg-primary" />
                    Planejamento Previdenciário
                  </p>
                  <h2 className="font-title font-bold text-3xl sm:text-4xl text-ink mb-4">
                    Sua aposentadoria não pode ser uma{' '}
                    <span className="text-primary">surpresa desagradável.</span>
                  </h2>
                  <p className="font-body text-muted text-base leading-relaxed mb-6">
                    Professoras e professores têm regras especiais de aposentadoria —
                    mas poucos sabem como aproveitá-las. Entender seu tempo de contribuição,
                    as regras de transição e os benefícios do magistério pode fazer a diferença
                    de anos na sua aposentadoria.
                  </p>
                  <ul className="space-y-3 mb-8 mx-auto lg:mx-0 w-fit">
                    {[
                      'Aposentadoria especial do magistério',
                      'Regras de transição da Reforma da Previdência',
                      'Contagem de tempo e averbação',
                      'Revisão de benefícios concedidos com erro',
                    ].map(item => (
                      <li key={item} className="flex items-center gap-3 font-body text-muted text-sm">
                        <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none"
                          stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#formulario"
                      className="inline-flex items-center gap-2 bg-ink hover:bg-ink/80
                                 text-white font-subtitle font-bold px-7 py-3.5 rounded-full
                                 transition-colors">
                      Simular minha aposentadoria
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '5 anos', label: 'a menos para se aposentar como professora' },
                    { value: '100%', label: 'de integralidade possível com planejamento' },
                    { value: '10+', label: 'anos atuando com professores do RJ' },
                    { value: '500+', label: 'casos resolvidos em direito do magistério' },
                  ].map(stat => (
                    <div key={stat.label}
                      className="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
                      <p className="font-title font-bold text-2xl text-primary mb-1">{stat.value}</p>
                      <p className="font-subtitle text-xs text-muted leading-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── 5. FORMULÁRIO ─────────────────────────────────────────── */}
          <section id="formulario" className="py-20 px-4 sm:px-6 bg-ink text-white">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-center mb-10">
                <p className="font-subtitle text-xs font-semibold text-primary tracking-[0.15em]
                               uppercase flex items-center justify-center gap-2 mb-4">
                  <span className="w-6 h-px bg-primary" />
                  Diagnóstico Gratuito
                  <span className="w-6 h-px bg-primary" />
                </p>
                <h2 className="font-title font-bold text-3xl sm:text-4xl mb-4 text-center">
                  Receba seu<br />
                  <span className="text-primary">Diagnóstico Jurídico Gratuito</span>
                </h2>
                <p className="font-body text-white/70 text-base max-w-xl mx-auto">
                  Preencha o formulário abaixo. Nossa equipe analisa seu caso e entra
                  em contato em até 24 horas.
                </p>
              </div>

              {/* Formulário Personalizado */}
              <div className="bg-white rounded-2xl shadow-xl p-8 text-left">
                {formSent ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-title font-bold text-ink text-2xl mb-3">Recebemos seu pedido!</h3>
                    <p className="font-body text-muted text-base">Nossa equipe vai analisar seu contracheque e entrar em contato em até 24 horas.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div className="grid sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block font-subtitle text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Nome completo *</label>
                        <input type="text" required value={formData.nome}
                          onChange={e => setFormData({ ...formData, nome: e.target.value })}
                          className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
                          placeholder="Seu nome completo" />
                      </div>
                      <div>
                        <label className="block font-subtitle text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">WhatsApp *</label>
                        <input type="tel" required value={formData.telefone}
                          onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                          className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
                          placeholder="(21) 99999-9999" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block font-subtitle text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">E-mail</label>
                        <input type="email" value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
                          placeholder="seu@email.com" />
                      </div>
                      <div>
                        <label className="block font-subtitle text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Situação *</label>
                        <select required value={formData.situacao}
                          onChange={e => setFormData({ ...formData, situacao: e.target.value })}
                          className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white">
                          <option value="">Selecione...</option>
                          <option value="Professor Ativo">Professor Ativo</option>
                          <option value="Professor Aposentado">Professor Aposentado</option>
                          <option value="Pensionista">Pensionista</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block font-subtitle text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Contracheque (PDF ou imagem)</label>
                      <div className="border-2 border-dashed border-border rounded-xl p-5 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" id="contracheque-upload"
                          onChange={e => setFormFile(e.target.files?.[0] || null)}
                          className="hidden" />
                        <label htmlFor="contracheque-upload" className="cursor-pointer block">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          {formFile ? (
                            <p className="font-subtitle text-sm text-primary font-semibold">{formFile.name}</p>
                          ) : (
                            <>
                              <p className="font-subtitle text-sm text-ink font-semibold">Clique para anexar seu contracheque</p>
                              <p className="font-body text-xs text-muted mt-1">PDF, JPG ou PNG · até 5MB</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block font-subtitle text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Descreva sua situação (opcional)</label>
                      <textarea rows={3} value={formData.mensagem}
                        onChange={e => setFormData({ ...formData, mensagem: e.target.value })}
                        className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                        placeholder="Ex: Sou professora há 15 anos e acredito que meu triênio não está sendo calculado corretamente..." />
                    </div>

                    {formError && (
                      <p className="text-red-500 text-sm mb-4 font-subtitle">{formError}</p>
                    )}

                    <button type="submit" disabled={formSending}
                      className="w-full bg-primary hover:bg-support text-white font-subtitle font-bold
                                 py-4 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base">
                      {formSending ? 'Enviando...' : 'QUERO MINHA ANÁLISE GRATUITA'}
                    </button>
                  </form>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 mt-6">
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none"
                  stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="font-subtitle text-white/50 text-xs">
                  Seus dados estão protegidos conforme a LGPD
                </p>
              </div>

            </div>
          </section>

          {/* ── 6. AUTORIDADE ─────────────────────────────────────────── */}
          <section id="autoridade" className="py-20 px-4 sm:px-6 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <p className="font-subtitle text-xs font-semibold text-primary tracking-[0.15em]
                               uppercase flex items-center justify-center gap-2 mb-4">
                  <span className="w-6 h-px bg-primary" />
                  Por que nos escolher
                  <span className="w-6 h-px bg-primary" />
                </p>
                <h2 className="font-title font-bold text-3xl sm:text-4xl text-ink mb-4">
                  Especialistas em <span className="text-primary">Direito do Magistério RJ</span>
                </h2>
                <p className="font-body text-muted max-w-2xl mx-auto">
                  Proteção Jurídica completa para o Professor do Estado: Da sala à Aposentadoria.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    icon: '⚖️',
                    title: 'Especialização Real',
                    desc: 'Atuação exclusiva com professores da rede pública. Conhecemos cada artigo do Estatuto do Magistério RJ.',
                  },
                  {
                    icon: '🏛️',
                    title: 'Experiência com o Estado',
                    desc: 'Centenas de ações ajuizadas contra o Estado do RJ. Sabemos onde estão os erros e como corrigi-los.',
                  },
                  {
                    icon: '📱',
                    title: 'Atendimento Remoto',
                    desc: 'Atendemos professores de todo o RJ sem que você precise sair de casa. Tudo pelo WhatsApp e e-mail.',
                  },
                ].map(item => (
                  <div key={item.title}
                    className="text-center p-6 rounded-2xl border border-border
                               hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center
                                    justify-center text-2xl mx-auto mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-subtitle font-bold text-ink text-base mb-2">{item.title}</h3>
                    <p className="font-body text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ── 7. FAQ ────────────────────────────────────────────────── */}
          <section className="py-20 px-4 sm:px-6 bg-[#F8F4EA]">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-title font-bold text-3xl sm:text-4xl text-ink mb-4">
                  Perguntas <span className="text-primary">Frequentes</span>
                </h2>
              </div>
              <div className="space-y-4">
                {[
                  {
                    q: 'Quanto tempo leva para receber os valores retroativos?',
                    a: 'Depende do caso. Ações administrativas podem resolver em 3 a 6 meses. Ações judiciais podem levar de 1 a 2 anos, mas os valores retroativos são calculados desde o início do erro — o que pode representar uma indenização significativa.',
                  },
                  {
                    q: 'Preciso ir ao escritório pessoalmente?',
                    a: 'Não. Atendemos 100% de forma remota pelo WhatsApp e e-mail. Você nos envia os documentos digitalizados e cuidamos de todo o processo. Professores de qualquer cidade do RJ podem nos contratar.',
                  },
                  {
                    q: 'Quanto custa a análise do contracheque?',
                    a: 'A análise inicial é totalmente gratuita. Só cobramos honorários se e quando você ganhar — e o valor é combinado de forma transparente antes de iniciarmos qualquer ação.',
                  },
                  {
                    q: 'Já estou aposentado, ainda tenho direito?',
                    a: 'Sim. Professores aposentados e pensionistas também têm direito a revisão de benefícios. Erros cometidos antes da aposentadoria podem gerar valores retroativos mesmo após a concessão do benefício.',
                  },
                ].map((item, i) => (
                  <FaqItem key={i} question={item.q} answer={item.a} />
                ))}
              </div>

              <div className="text-center mt-12">
                <a href="#formulario"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-support
                             text-white font-subtitle font-bold px-8 py-4 rounded-full
                             transition-colors shadow-button">
                  Ainda tem dúvidas? Fale conosco gratuitamente
                </a>
              </div>
            </div>
          </section>

        </main>

        {/* ── 8. FOOTER ─────────────────────────────────────────────── */}
        <footer className="bg-ink text-white py-10 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="text-center md:text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo.png" alt={FIRM_NAME} className="h-8 w-auto mx-auto md:mx-0 mb-2" />
                <p className="font-subtitle text-white/50 text-xs">
                  Especialistas em Direito do Magistério e Previdenciário
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="font-subtitle text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.523 5.851L.057 23.057a.75.75 0 00.886.886l5.206-1.466A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.706 9.706 0 01-4.952-1.357l-.355-.21-3.678 1.036 1.036-3.678-.21-.355A9.706 9.706 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                  </svg>
                  (21) 97952-2553
                </a>
                <a href="/" className="font-subtitle text-white/70 hover:text-white transition-colors">
                  Site Principal
                </a>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center
                            justify-between gap-3 text-xs font-subtitle text-white/40">
              <p>© 2025 {FIRM_NAME}. Todos os direitos reservados.</p>
              <div className="flex items-center gap-4">
                <p>CNPJ: {FIRM_CNPJ} · Inscrita na OAB/RJ</p>
                <a href="/privacidade" className="hover:text-white transition-colors whitespace-nowrap">
                  Política de Privacidade
                </a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left
                   hover:bg-brand-light transition-colors"
      >
        <span className="font-subtitle font-semibold text-ink text-sm sm:text-base pr-2">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="font-body text-muted text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}
