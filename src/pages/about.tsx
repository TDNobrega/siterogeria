import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sobre | Rogéria Oliveira Advogada</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Layout>
        <main className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold">Sobre</h1>
        </main>
      </Layout>
    </>
  )
}

export default About
