'use client'

import { motion } from 'framer-motion'

interface SEOScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
}

export function SEOScoreRing({ score, size = 120, strokeWidth = 8, showLabel = true }: SEOScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444'
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Bon' : score >= 40 ? 'Moyen' : 'Faible'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
        </div>
      )}
    </div>
  )
}

interface SEOScoreBadgeProps {
  score: number
  className?: string
}

export function SEOScoreBadge({ score, className = '' }: SEOScoreBadgeProps) {
  const color = score >= 80 ? 'bg-chart-5/10 text-chart-5' : score >= 60 ? 'bg-chart-4/10 text-chart-4' : score >= 40 ? 'bg-orange-500/10 text-orange-500' : 'bg-destructive/10 text-destructive'
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Bon' : score >= 40 ? 'Moyen' : 'Faible'

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${color} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'currentColor' }} />
      {score}/100 · {label}
    </span>
  )
}
