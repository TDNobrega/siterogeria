import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'

const Contact: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contato | Rogéria Oliveira Advogada</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Layout>
        <main className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold">Contato</h1>
        </main>
      </Layout>
    </>
  )
}

export default Contact
