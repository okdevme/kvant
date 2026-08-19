'use client'
import type { ReactNode } from 'react'
import { useElementBounding } from '@reactuses/core'
import { animate, createTimeline, stagger, waapi } from 'animejs'
import { useTheme } from 'fumadocs-ui/provider/base'
import { useEffect, useRef } from 'react'
import WaveArcs from '../wave-arcs'

export interface HeroAnimationProps {
  children?: ReactNode
}

export function HeroAnimation({ children }: HeroAnimationProps) {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== 'light'

  const containerRef = useRef<HTMLDivElement>(null)
  const containerPos = useElementBounding(containerRef)
  const iconRef = useRef<HTMLDivElement>(null)
  const iconPos = useElementBounding(iconRef)

  const lineCount = 50
  const lineLengthsRef = useRef<{ value: number }[] | null>(null)
  useEffect(() => {
    lineLengthsRef.current = Array.from({ length: lineCount }, () => ({ value: 0 }))

    const tl = createTimeline()
      .sync(animate(lineLengthsRef.current!, {
        value: 1,
        duration: 1000,
        ease: 'inOutSine',
        delay: stagger(50, { reversed: true }),
      }), 0)
      .sync(waapi.animate('.anim-icon', {
        scale: [1.3, 1],
        opacity: [0, 1],
        duration: 900,
        ease: 'outBack(3)',
      }), 400)
      .sync(waapi.animate('.anim-supporter', {
        opacity: { from: 0, to: 1, ease: 'outExpo' },
        y: { from: stagger([-3, -10]) },
        duration: 700,
        ease: 'outExpo',
        delay: stagger(100),
      }), '<-=200')

    return () => void tl.cancel()
  }, [])

  return (
    <>
      <div ref={containerRef} className="pointer-events-none absolute -z-10 -top-14 left-0 w-full h-[calc(100%+var(--spacing)*14)]">
        <WaveArcs
          alpha
          backgroundColor="transparent"
          lineColor={dark ? '#dce0df' : '#231f20'}
          lineLength={i => lineLengthsRef.current?.[i]?.value ?? 1}
          offset={{ y: iconPos.y + iconPos.height / 2 - containerPos.y }}
        />
      </div>

      <div ref={iconRef} className="relative z-10 isolate contain-layout opacity-0 anim-icon">
        <div className="absolute -z-1 top-1/2 left-1/2 -translate-1/2 size-128 pointer-events-none bg-radial-[at_50%_50%] from-fd-background from-15% to-transparent to-40%" />
        {children}
      </div>
    </>
  )
}
