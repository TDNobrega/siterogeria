import Head from 'next/head'
import { useState, useEffect } from 'react'
import { FIRM_NAME, FIRM_CNPJ, FIRM_PHONE } from '../lib/constants'

const WA_URL = 'https://wa.me/5521969401414?text=' + encodeURIComponent('Olá, gostaria de analisar meu contracheque.')

// ── SUBSTITUA pela URL de incorporação do seu Google Forms ──────────────────
// Abra seu formulário → Enviar → </> Incorporar → copie o src do iframe
const GOOGLE_FORMS_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeJ3pelL50ASsI0gzZko-691npUIvkIyTzwxWI3dUju9FGMNQ/viewform?embedded=true'
// ────────────────────────────────────────────────────────────────────────────

export default function Professores() {
  const [showExit, setShowExit] = useState(false)
  const [exitDismissed, setExitDismissed] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitDismissed) setShowExit(true)
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [exitDismissed])

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
              <h1 className="font-title font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] mb-6">
                Professor do Estado do RJ:{' '}
                <span className="text-primary">
                  O que você recebe hoje condiz com a Lei e com a sua carreira?
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
                    desc: 'A progressão por mérito e formação muitas vezes não é calculada corretamente, gerando diferenças salariais significativas ao longo da carreira.',
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
                    title: 'Triênios e Interníveis',
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

              {/* Google Forms Embed */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src={GOOGLE_FORMS_URL}
                  width="100%"
                  height="900"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Formulário de Análise Gratuita"
                  className="w-full"
                >
                  Carregando formulário…
                </iframe>
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
                  Não somos um escritório generalista. Cada detalhe do estatuto do magistério
                  do Estado do Rio de Janeiro é do nosso domínio.
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

              {/* Depoimento destaque */}
              <div className="bg-[#F8F4EA] rounded-2xl border border-secondary/30 p-8 text-center max-w-2xl mx-auto">
                <svg className="w-8 h-8 text-primary mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="font-body text-muted text-base leading-relaxed italic mb-6">
                  "Eu não sabia que recebia R$ 800 a menos por mês por causa da Nova Escola.
                  O escritório identificou o erro e em 8 meses recebi tudo retroativo. Só lamento
                  não ter procurado antes."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center
                                  justify-center text-white font-bold text-sm flex-shrink-0">
                    A
                  </div>
                  <div className="text-left">
                    <p className="font-subtitle font-semibold text-ink text-sm">Ana Paula R.</p>
                    <p className="font-body text-muted text-xs">Professora Estadual — Rio de Janeiro</p>
                  </div>
                  <div className="flex gap-0.5 ml-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
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
                    q: 'O que é a Nova Escola e por que afeta meu salário?',
                    a: 'A Nova Escola é o plano de cargos e salários dos professores estaduais do RJ. Ele define progressões por formação e mérito. Erros no enquadramento são comuns e podem representar centenas de reais a menos por mês durante anos.',
                  },
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
                  {FIRM_PHONE}
                </a>
                <a href="/" className="font-subtitle text-white/70 hover:text-white transition-colors">
                  Site Principal
                </a>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center
                            justify-between gap-3 text-xs font-subtitle text-white/40">
              <p>© 2025 {FIRM_NAME}. Todos os direitos reservados.</p>
              <p>CNPJ: {FIRM_CNPJ} · Inscrita na OAB/RJ</p>
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
