import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Portfolio from './components/Portfolio'
import Process from './components/Process'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main className="relative w-full overflow-hidden bg-white">
        <Hero />
        <Manifesto />
        <Portfolio />
        <Process />
        <About />
        <Testimonials />
        <Footer />
      </main>
    </>
  )
}

export default App
