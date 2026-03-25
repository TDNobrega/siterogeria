import { useState, useEffect } from 'react'
import { WHATSAPP_URL } from '../lib/constants'

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    // Show after short delay
    const show = setTimeout(() => setVisible(true), 1500)
    // Stop pulse after 6 seconds
    const stopPulse = setTimeout(() => setPulse(false), 6000)
    return () => { clearTimeout(show); clearTimeout(stopPulse) }
  }, [])

  if (!visible) return null

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3"
    >
      {/* Tooltip */}
      <span className="hidden sm:block bg-ink text-white font-subtitle font-semibold text-sm
                       px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100
                       transition-opacity duration-200 whitespace-nowrap">
        Fale com um advogado
      </span>

      {/* Button */}
      <div className="relative">
        {/* Pulse rings */}
        {pulse && (
          <>
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping
                             opacity-75" />
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping
                             opacity-50 animation-delay-150" />
          </>
        )}
        <div className="relative w-16 h-16 rounded-full bg-green-500 hover:bg-green-600
                        shadow-lg shadow-green-500/40 hover:shadow-green-500/60
                        flex items-center justify-center transition-all duration-300
                        hover:scale-110">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.523 5.851L.057 23.057a.75.75 0 00.886.886l5.206-1.466A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.706 9.706 0 01-4.952-1.357l-.355-.21-3.678 1.036 1.036-3.678-.21-.355A9.706 9.706 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
          </svg>
        </div>
      </div>
    </a>
  )
}
