import { useEffect } from 'react'
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
import ProjectsPage from './pages/ProjectsPage'
import ProjectPage from './pages/ProjectPage'
import QuizPage from './pages/QuizPage'
import QuizCta from './components/QuizCta'
import { INTRO_DELAY } from './constants/motion'
import { route, IS_HOME } from './route'

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
      <Testimonials />
      <Footer />
    </main>
  )
}

function App() {
  return (
    <>
      {IS_HOME && <Preloader />}
      <Navbar />
      {route.page === 'project' ? (
        <ProjectPage slug={route.slug} />
      ) : route.page === 'projects' ? (
        <ProjectsPage />
      ) : route.page === 'quiz' ? (
        <QuizPage />
      ) : (
        <Home />
      )}
      <WhatsAppButton />
    </>
  )
}

export default App
