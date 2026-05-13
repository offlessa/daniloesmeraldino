import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Authority from './components/Authority'
import Portfolio from './components/Portfolio'
import Process from './components/Process'
import About from './components/About'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  return (
    <div className="w-full overflow-hidden">
      <Navbar />
      <Hero />
      <Authority />
      <Portfolio />
      <Process />
      <About />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
