import { useGameStore } from '@/store/useGameStore'
import { caseSources, type CaseSource } from '@/data/gameData'
import { X, Coins, AlertTriangle, TrendingUp } from 'lucide-react'

export default function SourceSelector() {
  const showSourceSelector = useGameStore(s => s.showSourceSelector)
  const closeSourceSelector = useGameStore(s => s.closeSourceSelector)
  const generateNewCase = useGameStore(s => s.generateNewCase)
  const playerCoins = useGameStore(s => s.player.coins)

  if (!showSourceSelector) return null

  function handleSelect(source: CaseSource) {
    generateNewCase(source)
  }

  const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    cyan: {
      bg: 'bg-cyan-900/20',
      border: 'border-cyan-700/40 hover:border-cyan-500/50',
      text: 'text-cyan-300',
      badge: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/30',
    },
    red: {
      bg: 'bg-red-900/20',
      border: 'border-red-700/40 hover:border-red-500/50',
      text: 'text-red-300',
      badge: 'bg-red-900/40 text-red-300 border-red-700/30',
    },
    purple: {
      bg: 'bg-purple-900/20',
      border: 'border-purple-700/40 hover:border-purple-500/50',
      text: 'text-purple-300',
      badge: 'bg-purple-900/40 text-purple-300 border-purple-700/30',
    },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSourceSelector} />
      <div className="relative z-10 bg-gray-900 border border-cyan-700/30 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl shadow-cyan-900/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg text-cyan-300 tracking-wider">
              定向接诊
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">选择病例来源，不同来源有不同的接诊费和奖励倍率</p>
          </div>
          <button
            onClick={closeSourceSelector}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {caseSources.map(source => {
            const colors = colorMap[source.color] || colorMap.cyan
            const canAfford = playerCoins >= source.receptionFee
            const urgencyLabels = source.urgencyRange
              .map(u => u === 'low' ? '轻微' : u === 'medium' ? '一般' : '紧急')
              .join(' / ')

            return (
              <button
                key={source.id}
                onClick={() => canAfford && handleSelect(source.id)}
                disabled={!canAfford}
                className={`
                  w-full text-left rounded-xl p-4 transition-all duration-200 relative overflow-hidden
                  ${colors.bg} border ${colors.border}
                  ${canAfford ? 'hover:scale-[1.02] cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                `}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{source.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-display text-base ${colors.text} tracking-wide`}>
                        {source.name}
                      </h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${colors.badge}`}>
                        <TrendingUp className="w-2.5 h-2.5" />
                        ×{source.rewardMultiplier}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{source.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-800/60 px-2 py-0.5 rounded">
                        紧急度: {urgencyLabels}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-800/60 px-2 py-0.5 rounded">
                        干扰率: {Math.round(source.interferenceChance * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className={`inline-flex items-center gap-1 text-sm ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                      <Coins className="w-3.5 h-3.5" />
                      {source.receptionFee} ⬡
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">接诊费</div>
                    {!canAfford && (
                      <div className="inline-flex items-center gap-0.5 text-[10px] text-red-400 mt-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        星币不足
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-800/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Coins className="w-3.5 h-3.5 text-yellow-500" />
            当前星币: <span className="text-yellow-400 font-medium">{playerCoins}</span>
          </div>
          <button
            onClick={closeSourceSelector}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
