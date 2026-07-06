import React from 'react'
import { AlertCircle } from 'lucide-react'

export interface NoiseAlertsData {
  noiseDetected: boolean
  noisePercentage: number
  recommendation: string
}

export default function NoiseAlert({ data }: { data?: NoiseAlertsData }) {
  if (!data || !data.noiseDetected) return null

  return (
    <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-card p-4 flex items-start gap-3 mb-4">
      <AlertCircle className="text-[#EF4444] shrink-0 mt-0.5" size={16} />
      <div>
        <h4 className="text-xs font-bold text-textPrimary uppercase tracking-wider">High Noise Alert</h4>
        <p className="text-xs text-textSecondary mt-1 leading-relaxed">
          {data.recommendation}
        </p>
      </div>
    </div>
  )
}
