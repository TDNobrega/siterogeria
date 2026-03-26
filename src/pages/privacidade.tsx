import Head from 'next/head'
import Link from 'next/link'
import { FIRM_NAME, FIRM_EMAIL, FIRM_CNPJ } from '../lib/constants'

export default function Privacidade() {
  return (
    <>
      <Head>
        <title>Política de Privacidade — {FIRM_NAME}</title>
        <meta name="description" content="Política de Privacidade e Cookies do escritório Rogéria Oliveira Advogada. Saiba como seus dados são coletados, usados e protegidos." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rogeriaoliveira.com/privacidade" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header simples */}
        <header className="bg-ink py-5 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo.png" alt={FIRM_NAME} className="h-8 w-auto" />
            </Link>
            <Link href="/"
              className="font-subtitle text-sm text-white/70 hover:text-white transition-colors">
              ← Voltar ao site
            </Link>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <h1 className="font-title font-bold text-3xl sm:text-4xl text-ink mb-3">
            Política de Privacidade e Cookies
          </h1>
          <p className="font-body text-muted text-sm mb-10">
            Última atualização: 26 de março de 2026
          </p>

          <div className="prose prose-lg max-w-none font-body text-ink/80 space-y-10">

            {/* 1 */}
            <section>
              <h2 className="font-title font-bold text-xl text-ink mb-3">1. Quem somos</h2>
              <p>
                <strong>{FIRM_NAME}</strong>, inscrita no CNPJ sob o n.º {FIRM_CNPJ} e na
                OAB/RJ, é responsável pelo tratamento dos dados pessoais coletados neste
                site (<strong>rogeriaoliveira.com</strong>) e na landing page
                (<strong>rogeriaoliveira.com/professores</strong>).
              </p>
              <p className="mt-2">
                Para exercer seus direitos ou tirar dúvidas, entre em contato pelo e-mail:{' '}
                <a href={`mailto:${FIRM_EMAIL}`}
                  className="text-primary hover:underline">{FIRM_EMAIL}</a>.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="font-title font-bold text-xl text-ink mb-3">2. Dados que coletamos</h2>
              <p>Coletamos os seguintes dados pessoais:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  <strong>Formulário de contato (Google Forms):</strong> nome, e-mail,
                  telefone e informações sobre sua situação jurídica, fornecidos
                  voluntariamente por você.
                </li>
                <li>
                  <strong>WhatsApp:</strong> mensagens trocadas diretamente com o escritório.
                </li>
                <li>
                  <strong>Dados de navegação (cookies):</strong> endereço IP anonimizado,
                  páginas visitadas, tempo de permanência, dispositivo e navegador — coletados
                  apenas com seu consentimento.
                </li>
                <li>
                  <strong>Dados de anúncios:</strong> interações com anúncios (cliques,
                  visualizações) via Google Ads e Meta Ads — coletados apenas com consentimento.
                </li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="font-title font-bold text-xl text-ink mb-3">3. Para que usamos seus dados</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Responder às suas solicitações e prestar serviços advocatícios.</li>
                <li>Analisar o tráfego do site para melhoria contínua (Google Analytics).</li>
                <li>Exibir anúncios relevantes a potenciais clientes (Google Ads, Meta Ads).</li>
                <li>Cumprir obrigações legais e regulatórias.</li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="font-title font-bold text-xl text-ink mb-3">4. Base legal (LGPD — Lei 13.709/2018)</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Consentimento (Art. 7º, I):</strong> para cookies analíticos e
                  de publicidade, obtido por meio do banner de cookies ao visitar o site.
                </li>
                <li>
                  <strong>Execução de contrato (Art. 7º, V):</strong> para atender sua
                  solicitação de consulta jurídica.
                </li>
                <li>
                  <strong>Legítimo interesse (Art. 7º, IX):</strong> para segurança do site
                  e prevenção a fraudes.
                </li>
                <li>
                  <strong>Obrigação legal (Art. 7º, II):</strong> para cumprimento de
                  normas do Estatuto da OAB.
                </li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="font-title font-bold text-xl text-ink mb-3">5. Compartilhamento de dados</h2>
              <p>
                Seus dados podem ser compartilhados com os seguintes terceiros,
                sempre nos limites necessários:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  <strong>Google LLC:</strong> Google Forms (armazenamento de respostas),
                  Google Analytics (análise de tráfego) e Google Ads (publicidade). Política:{' '}
                  <a href="https://policies.google.com/privacy" target="_blank"
                    rel="noopener noreferrer" className="text-primary hover:underline">
                    policies.google.com/privacy
                  </a>
                </li>
                <li>
                  <strong>Meta Platforms, Inc.:</strong> Meta Pixel para rastreamento de
                  conversões de anúncios no Facebook e Instagram. Política:{' '}
                  <a href="https://www.facebook.com/privacy/policy/" target="_blank"
                    rel="noopener noreferrer" className="text-primary hover:underline">
                    facebook.com/privacy/policy
                  </a>
                </li>
                <li>
                  <strong>WhatsApp LLC:</strong> mensagens enviadas pelo botão de contato.
                </li>
                <li>
                  <strong>Vercel Inc.:</strong> hospedagem do site (servidores nos EUA,
                  com cláusulas contratuais padrão).
                </li>
              </ul>
              <p className="mt-3">
                Não vendemos, alugamos ou comercializamos seus dados pessoais a terceiros.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="font-title font-bold text-xl text-ink mb-3">6. Cookies</h2>
              <p>Utilizamos os seguintes tipos de cookies:</p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 font-subtitle font-semibold text-ink">Tipo</th>
                      <th className="text-left px-4 py-3 font-subtitle font-semibold text-ink">Finalidade</th>
                      <th className="text-left px-4 py-3 font-subtitle font-semibold text-ink">Consentimento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-semibold">Essenciais</td>
                      <td className="px-4 py-3">Funcionamento do site, preferência de cookies</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">Automático</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold">Analíticos</td>
                      <td className="px-4 py-3">Google Analytics — mede visitas e comportamento</td>
                      <td className="px-4 py-3 text-primary font-semibold">Necessário</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold">Publicidade</td>
                      <td className="px-4 py-3">Google Ads e Meta Pixel — rastreamento de conversões</td>
                      <td className="px-4 py-3 text-primary font-semibold">Necessário</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                Você pode retirar seu consentimento a qualquer momento limpando os cookies
                do navegador ou clicando em "Recusar" no banner de cookies ao recarregar
                a página.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="font-title font-bold text-xl text-ink mb-3">7. Por quanto tempo guardamos seus dados</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dados de consulta jurídica:</strong> pelo prazo prescricional de 5 anos após o encerramento do atendimento.</li>
                <li><strong>Dados de análise (cookies analíticos):</strong> até 26 meses, conforme padrão do Google Analytics.</li>
                <li><strong>Dados de publicidade:</strong> até 180 dias, conforme políticas do Google e Meta.</li>
                <li><strong>Preferência de cookies:</strong> 12 meses no seu navegador.</li>
              </ul>
            </section>

            {/* 8 */}
            <section>
              <h2 className="font-title font-bold text-xl text-ink mb-3">8. Seus direitos (LGPD)</h2>
              <p>Como titular de dados, você tem direito a:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Acesso:</strong> saber quais dados temos sobre você.</li>
                <li><strong>Correção:</strong> corrigir dados incompletos ou desatualizados.</li>
                <li><strong>Exclusão:</strong> solicitar a exclusão dos seus dados.</li>
                <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado.</li>
                <li><strong>Revogação do consentimento:</strong> retirar o consentimento a qualquer momento.</li>
                <li><strong>Oposição:</strong> opor-se ao tratamento baseado em legítimo interesse.</li>
              </ul>
              <p className="mt-3">
                Para exercer qualquer desses direitos, envie um e-mail para{' '}
                <a href={`mailto:${FIRM_EMAIL}`}
                  className="text-primary hover:underline">{FIRM_EMAIL}</a>{' '}
                com o assunto "Direitos LGPD". Responderemos em até 15 dias úteis.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="font-title font-bold text-xl text-ink mb-3">9. Segurança</h2>
              <p>
                Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
                protocolo HTTPS (TLS), headers de segurança (HSTS, X-Frame-Options,
                Content-Type nosniff), acesso restrito a dados e servidores com certificação
                de segurança.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="font-title font-bold text-xl text-ink mb-3">10. Alterações nesta política</h2>
              <p>
                Esta Política de Privacidade pode ser atualizada periodicamente. A data de
                "Última atualização" no topo desta página indica quando ocorreu a revisão mais
                recente. Recomendamos que você a consulte regularmente.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="font-title font-bold text-xl text-ink mb-3">11. Contato e reclamações</h2>
              <p>
                Para dúvidas, solicitações ou reclamações sobre o tratamento de dados pessoais:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li><strong>E-mail:</strong>{' '}
                  <a href={`mailto:${FIRM_EMAIL}`}
                    className="text-primary hover:underline">{FIRM_EMAIL}</a>
                </li>
                <li><strong>Responsável:</strong> {FIRM_NAME}</li>
                <li><strong>CNPJ:</strong> {FIRM_CNPJ}</li>
              </ul>
              <p className="mt-3">
                Você também pode apresentar reclamação à{' '}
                <a href="https://www.gov.br/anpd/pt-br" target="_blank"
                  rel="noopener noreferrer" className="text-primary hover:underline">
                  Autoridade Nacional de Proteção de Dados (ANPD)
                </a>.
              </p>
            </section>

          </div>
        </main>

        {/* Footer simples */}
        <footer className="bg-ink text-white py-6 px-4 sm:px-6 mt-10">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center
                          justify-between gap-3 text-xs font-subtitle text-white/40">
            <p>© 2025 {FIRM_NAME}. Todos os direitos reservados.</p>
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              Voltar ao site principal
            </Link>
          </div>
        </footer>
      </div>
    </>
  )
}
