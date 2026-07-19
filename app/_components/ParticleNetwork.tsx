"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const particles: Particle[] = []
    const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000))
    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }
    particlesRef.current = particles

    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 160) {
          p.x -= dx * 0.008
          p.y -= dy * 0.008
        }

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(56,189,248,${p.opacity})`
        ctx!.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(56,189,248,${0.08 * (1 - dist / 140)})`
            ctx!.lineWidth = 0.6
            ctx!.stroke()
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [mouse])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
