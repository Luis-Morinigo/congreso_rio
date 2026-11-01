import type { CSSProperties } from 'react'

interface CalcadaoProps {
  stone: string
  ground: string
  drift?: boolean
}

/** Banda de ondas del calçadão de Copacabana. Separa bloques de color; es decorativa. */
export function Calcadao({ stone, ground, drift = false }: CalcadaoProps) {
  const style = { '--stone': stone, '--ground': ground } as CSSProperties
  return <div aria-hidden="true" style={style} className={drift ? 'calcadao calcadao--drift' : 'calcadao'} />
}
