import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Plus } from 'lucide-react'
import SectionHeader from './SectionHeader'
import FadeIn from './FadeIn'
import BrickWall from './BrickWall'
import { Txt, useSiteList } from '../admin/SiteContent'
import { useEdit } from '../admin/edit'

const steps = [
  {
    title: 'Consultoria',
    description: 'Escuta atenta, visita técnica e leitura do terreno para entender o que o projeto precisa ser.',
  },
  {
    title: 'Projeto',
    description: 'Arquitetura, projetos complementares e interiores desenvolvidos juntos, com apresentação 3D e aprovação na prefeitura.',
  },
  {
    title: 'Execução',
    description: 'Obra acompanhada pela mesma equipe que desenhou, com cronograma e controle de qualidade.',
  },
  {
    title: 'Entrega',
    description: 'Inspeção final, entrega formal e suporte pós-obra para que a casa siga como foi pensada.',
  },
]

// Tudo o que o estúdio entrega dentro de um mesmo acompanhamento
const deliverables = [
  {
    group: 'Projetos',
    items: [
      'Arquitetônico',
      'Estrutural',
      'Hidrossanitário',
      'Elétrico',
      'Comunicação',
      'Interiores',
      'Paisagismo',
    ],
  },
  {
    group: 'Acompanhamento',
    items: ['Aprovação na prefeitura', 'Curadoria', 'Acompanhamento de obra'],
  },
]

// O que cada projeto inclui (mesmos textos da proposta orçamentária). Item sem texto aqui não abre.
const DETAILS: Record<string, { items: string[]; note?: string }> = {
  arquitetonico: {
    items: [
      'Projeto arquitetônico com maquete eletrônica',
      'Planta baixa com layout e cotas',
      'Planta de cobertura',
      'Cortes',
      'Fachadas',
      'Detalhes executivos',
      'Definição de todos os materiais aplicados à obra',
      'Imagens ilustrativas',
    ],
  },
  estrutural: {
    items: [
      'Dimensionamento dos elementos estruturais: fundações*, vigas, pilares e lajes',
      'Detalhamento dos elementos estruturais: fundações*, vigas, pilares e lajes',
      'Cargas dos pilares',
      'Locação das fundações',
    ],
    note: '* As fundações são dimensionadas a partir do boletim de sondagem do terreno, elaborado de acordo com a NBR 6484/2001 e demais normas pertinentes.',
  },
  hidrossanitario: {
    items: [
      'Instalações de água fria',
      'Instalações de água quente',
      'Instalações de fossa, filtro e ligação à rede',
      'Instalações de água pluvial',
      'Detalhes',
    ],
  },
  eletrico: {
    items: [
      'Instalações elétricas de baixa tensão',
      'Ligação das máquinas externas e internas de climatização e dimensionamento dos BTUs',
      'Detalhes',
    ],
  },
  comunicacao: {
    items: ['Instalação de interfone, telefone, TV e internet', 'Detalhes'],
  },
  paisagismo: {
    items: ['Projeto de muro (opcional) e de todo o entorno do terreno: piscina, jardim, áreas externas e paisagismo'],
  },
  'acompanhamento-de-obra': {
    items: [
      'Assessoria nas contratações dos prestadores de serviço',
      'Visitas durante a obra',
      'Visitas em fornecedores',
    ],
  },
}

const detailKey = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')

/** Linha da etapa que se preenche quando a obra chega nela */
function StepLine({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const share = 1 / steps.length
  const scaleX = useTransform(progress, [index * share, (index + 1) * share], [0, 1])
  return (
    <motion.span
      aria-hidden
      className="absolute -top-px left-0 h-px w-full bg-olive origin-left"
      style={{ scaleX }}
    />
  )
}

/**
 * Itens de um grupo de entregas: um por linha (no modo edição, vira um campo com as linhas).
 * Os que têm descrição abrem ao clicar e mostram o que o projeto inclui.
 */
function DeliverableItems({ k, items }: { k: string; items: string[] }) {
  const { editing } = useEdit()
  const list = useSiteList(k, items)
  const [open, setOpen] = useState<string | null>(null)
  if (editing)
    return (
      <div className="border-b border-olive/25 py-4 text-[11px] tracking-[0.3em] uppercase text-olive leading-[2.6]">
        <Txt k={k} d={items.join('\n')} multiline />
      </div>
    )
  return (
    <>
      {list.map((item) => {
        const detail = DETAILS[detailKey(item)]
        if (!detail)
          return (
            <li key={item} className="border-b border-olive/25 py-4 text-[11px] tracking-[0.3em] uppercase text-olive">
              {item}
            </li>
          )
        const isOpen = open === item
        return (
          <li key={item} className="border-b border-olive/25">
            <button
              onClick={() => setOpen(isOpen ? null : item)}
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-4 py-4 text-left text-[11px] tracking-[0.3em] uppercase text-olive"
            >
              {item}
              <Plus
                className={`w-4 h-4 shrink-0 text-olive-light transition-transform duration-300 group-hover:text-olive ${isOpen ? 'rotate-45' : ''}`}
                strokeWidth={1.5}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="pb-5 space-y-1.5 text-sm leading-relaxed text-primary-600">
                    {detail.items.map((d) => (
                      <li key={d} className="flex gap-3">
                        <span className="mt-[0.6em] h-px w-3 shrink-0 bg-olive/40" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {detail.note && <p className="pb-5 -mt-2 text-xs leading-relaxed text-primary-500">{detail.note}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </>
  )
}

export default function Process() {
  const stepsRef = useRef<HTMLDivElement>(null)
  // 0 quando as etapas entram na tela, 1 quando a parede está inteira à vista
  const { scrollYProgress: progress } = useScroll({
    target: stepsRef,
    offset: ['start 75%', 'end 70%'],
  })

  return (
    <section id="process" className="relative py-32 lg:py-40 px-6 sm:px-10 lg:px-20 bg-sand-light">
      <SectionHeader
        label={<Txt k="process.label" d="Processo" />}
        title={<Txt k="process.title" d="Do projeto *à obra*" em="text-olive-light" />}
        className="mb-20 lg:mb-24"
      />

      {/* A obra acompanha a rolagem: cada etapa preenche sua linha e a parede sobe junto */}
      <div ref={stepsRef}>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {steps.map((step, i) => (
            <FadeIn key={step.title} className="relative border-t border-olive/25 pt-8" delay={i * 0.1}>
              <StepLine progress={progress} index={i} />
              <p className="font-serif italic text-olive-light text-lg">0{i + 1}</p>
              <h3 className="mt-2 font-serif text-3xl text-olive">
                <Txt k={`process.step${i}.title`} d={step.title} />
              </h3>
              <p className="mt-4 text-primary-600 leading-relaxed">
                <Txt k={`process.step${i}.text`} d={step.description} />
              </p>
            </FadeIn>
          ))}
        </div>

        <div className="mt-16 lg:mt-20">
          <BrickWall progress={progress} />
        </div>
      </div>

      <div className="mt-28 lg:mt-36 grid lg:grid-cols-12 gap-12 lg:gap-8">
        <FadeIn className="lg:col-span-4">
          <h3 className="font-serif text-3xl sm:text-4xl leading-tight text-olive">
            <Txt k="process.all.title" d="Todos os projetos *da sua obra*" em="text-olive-light" />
          </h3>
          <p className="mt-6 max-w-sm text-primary-600 leading-relaxed">
            <Txt
              k="process.all.text"
              d="Um só escritório cuida de cada disciplina, já compatibilizadas entre si — menos fornecedores para coordenar e nenhuma surpresa no canteiro."
            />
          </p>
        </FadeIn>

        <div className="lg:col-span-7 lg:col-start-6 grid sm:grid-cols-2 gap-12 sm:gap-10">
          {deliverables.map((d, gi) => (
            <FadeIn key={d.group} delay={0.1 + gi * 0.1}>
              <p className="text-[10px] tracking-[0.35em] uppercase text-olive-light">
                <Txt k={`process.group${gi}.title`} d={d.group} />
              </p>
              <ul className="mt-4 border-t border-olive/25">
                <DeliverableItems k={`process.group${gi}.items`} items={d.items} />
              </ul>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
