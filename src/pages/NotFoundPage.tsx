import BrickLoader from '../components/BrickLoader'
import Footer from '../components/Footer'
import { projectsUrl } from '../data/projects'
import { QUIZ_PATH } from '../route'

/** Endereço que não existe (a Vercel responde com o código 404 e este conteúdo) */
export default function NotFoundPage() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center bg-white">
        <BrickLoader className="w-28 mb-10" />
        <p className="text-[11px] tracking-[0.35em] uppercase text-olive-light">Erro 404</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl text-olive">
          Esta página <em className="text-olive-light">ainda está em obra</em>
        </h1>
        <p className="mt-5 max-w-md text-primary-600 leading-relaxed">
          O endereço que você procurou não existe ou mudou de lugar. Que tal ver os nossos projetos?
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={projectsUrl()}
            className="bg-olive px-8 py-4 text-[11px] tracking-[0.3em] uppercase text-sand-light hover:bg-olive-dark transition-colors"
          >
            Ver projetos
          </a>
          <a
            href="/"
            className="border border-olive/30 px-8 py-4 text-[11px] tracking-[0.3em] uppercase text-olive hover:border-olive transition-colors"
          >
            Página inicial
          </a>
        </div>
        <a href={QUIZ_PATH} className="mt-8 link-underline text-[10px] tracking-[0.3em] uppercase text-olive">
          Descubra qual casa combina com você
        </a>
      </main>
      <Footer />
    </>
  )
}
