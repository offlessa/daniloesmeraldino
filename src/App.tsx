import { Suspense, lazy, useEffect } from 'react'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Portfolio from './components/Portfolio'
import Process from './components/Process'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import DevNotice from './components/DevNotice'
import ProjectsPage from './pages/ProjectsPage'
import ProjectPage from './pages/ProjectPage'
import QuizPage from './pages/QuizPage'
import NotFoundPage from './pages/NotFoundPage'
import QuizCta from './components/QuizCta'
import Faq from './components/Faq'
import { INTRO_DELAY } from './constants/motion'
import { route, IS_HOME } from './route'
import { loadSiteData } from './data/store'
import { HAS_ADMIN_SESSION } from './admin/edit'

function Home() {
  // Vindo de outra página com /#secao: rola até ela quando a abertura terminar
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const t = setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }),
      INTRO_DELAY * 1000
    )
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="relative w-full overflow-hidden bg-white">
      <Hero />
      <Manifesto />
      <Portfolio />
      <Process />
      <QuizCta />
      <About />
      <Faq />
      <Testimonials />
      <Footer />
    </main>
  )
}

// O painel e a edição no site só são baixados por quem abre /admin ou tem login salvo
const AdminPage = lazy(() => import('./pages/AdminPage'))
const EditProvider = lazy(() => import('./admin/EditProvider'))

function App() {
  // Obras e fotos atualizadas pelo painel (o site abre com as do código e troca quando chegam)
  useEffect(() => {
    if (route.page !== 'admin') loadSiteData()
  }, [])

  if (route.page === 'admin')
    return (
      <Suspense fallback={null}>
        <AdminPage />
      </Suspense>
    )

  const site = (
    <>
      {IS_HOME && <Preloader />}
      <Navbar />
      {route.page === 'project' ? (
        <ProjectPage slug={route.slug} />
      ) : route.page === 'projects' ? (
        <ProjectsPage />
      ) : route.page === 'quiz' ? (
        <QuizPage />
      ) : route.page === 'notfound' ? (
        <NotFoundPage />
      ) : (
        <Home />
      )}
      <WhatsAppButton />
      <DevNotice />
    </>
  )

  // Visitantes: o site puro. Administrador logado: o mesmo site, com o modo edição por cima
  if (!HAS_ADMIN_SESSION) return site
  return (
    <Suspense fallback={site}>
      <EditProvider>{site}</EditProvider>
    </Suspense>
  )
}

export default App
