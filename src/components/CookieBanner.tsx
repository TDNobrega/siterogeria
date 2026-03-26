import Link from 'next/link'

interface Props {
  onAccept: () => void
  onReject: () => void
}

export default function CookieBanner({ onAccept, onReject }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] bg-ink border-t border-white/10 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0 mt-0.5">🍪</span>
          <p className="font-body text-white/80 text-sm leading-relaxed">
            Utilizamos cookies para melhorar sua experiência, analisar o tráfego e
            personalizar anúncios. Ao clicar em{' '}
            <strong className="text-white">"Aceitar"</strong>, você concorda com o uso de
            cookies conforme nossa{' '}
            <Link href="/privacidade"
              className="text-primary underline hover:text-support transition-colors">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onReject}
            className="font-subtitle text-sm text-white/60 hover:text-white
                       transition-colors px-4 py-2 rounded-full border border-white/20
                       hover:border-white/40 whitespace-nowrap"
          >
            Recusar
          </button>
          <button
            onClick={onAccept}
            className="font-subtitle text-sm font-bold bg-primary hover:bg-support
                       text-white px-5 py-2 rounded-full transition-colors whitespace-nowrap"
          >
            Aceitar Cookies
          </button>
        </div>
      </div>
    </div>
  )
}
