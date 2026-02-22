import { useMemo } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

// ── Static data ────────────────────────────────────────────────────────────────

interface StatCard {
    icon: string
    iconBg: string
    iconColor: string
    labelZh: string
    labelEn: string
    value: string
    change: string
    changeUp: boolean
}

const cards: StatCard[] = [
    {
        icon: 'fa-coins',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        labelZh: '累计分账总额',
        labelEn: 'Total Distributed',
        value: 'HK$ 8,245,800',
        change: '↑ 5.2%',
        changeUp: true,
    },
    {
        icon: 'fa-calendar-check',
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        labelZh: '本月分账',
        labelEn: 'Distributed This Month',
        value: 'HK$ 342,500',
        change: '↑ 3.1%',
        changeUp: true,
    },
    {
        icon: 'fa-clock',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        labelZh: '待结算金额',
        labelEn: 'Pending Settlement',
        value: 'HK$ 28,200',
        change: '↓ 1.2%',
        changeUp: false,
    },
    {
        icon: 'fa-file-invoice-dollar',
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
        labelZh: '分账笔数',
        labelEn: 'Distribution Count',
        value: '1,245 笔',
        change: '↑ 8.4%',
        changeUp: true,
    },
    {
        icon: 'fa-chart-line',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        labelZh: '节点平均收益',
        labelEn: 'Avg Node Earnings',
        value: 'HK$ 916,200',
        change: '↑ 4.5%',
        changeUp: true,
    },
]

// Seeded pseudo-random 30-day data (deterministic so no flicker on re-render)
function seededRandom(seed: number) {
    let s = seed
    return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff
        return (s >>> 0) / 0xffffffff
    }
}

function generate30DayData() {
    const rand = seededRandom(42)
    const data: { day: number; value: number }[] = []
    let base = 120000
    for (let i = 1; i <= 30; i++) {
        base += (rand() - 0.45) * 12000
        data.push({ day: i, value: Math.round(Math.max(80000, base)) })
    }
    return data
}

// ── 30-day SVG line chart ──────────────────────────────────────────────────────

function ThirtyDayLineChart({ lang }: { lang: string }) {
    const data = useMemo(() => generate30DayData(), [])

    const W = 500, H = 180
    const PAD = { t: 16, r: 12, b: 32, l: 54 }
    const innerW = W - PAD.l - PAD.r
    const innerH = H - PAD.t - PAD.b

    const values = data.map(d => d.value)
    const minVal = Math.min(...values)
    const maxVal = Math.max(...values)
    const range = maxVal - minVal || 1

    const xScale = (i: number) => PAD.l + (i / (data.length - 1)) * innerW
    const yScale = (v: number) => PAD.t + innerH - ((v - minVal) / range) * innerH

    const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.value)}`).join(' ')
    const areaPath = `${linePath} L ${xScale(data.length - 1)} ${PAD.t + innerH} L ${xScale(0)} ${PAD.t + innerH} Z`

    // Y-axis tick values
    const yTicks = [minVal, Math.round(minVal + range / 2), maxVal]

    // X-axis labels every 5 days
    const xLabels = data.filter((_, i) => i === 0 || (i + 1) % 5 === 0)

    return (
        <div className="relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span
                    className="text-gray-200 font-bold text-sm rotate-[-20deg] tracking-widest"
                    style={{ fontSize: '11px', letterSpacing: '0.15em' }}
                >
                    {lang === 'zh' ? '模拟数据仅供演示' : 'SIMULATED DATA – DEMO ONLY'}
                </span>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
                <defs>
                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                {/* Background */}
                <rect x={PAD.l} y={PAD.t} width={innerW} height={innerH} fill="#f9fafb" rx="4" />

                {/* Y grid lines + labels */}
                {yTicks.map((v, i) => {
                    const y = yScale(v)
                    return (
                        <g key={i}>
                            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
                            <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
                                {v.toLocaleString()}
                            </text>
                        </g>
                    )
                })}

                {/* Area fill */}
                <path d={areaPath} fill="url(#earnGrad)" />

                {/* Line */}
                <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

                {/* Dots at every 5th point */}
                {data.filter((_, i) => i === 0 || (i + 1) % 5 === 0 || i === data.length - 1).map((d, i) => (
                    <circle key={i} cx={xScale(data.indexOf(d))} cy={yScale(d.value)} r="3" fill="#6366f1" stroke="white" strokeWidth="1.5" />
                ))}

                {/* X-axis labels */}
                {xLabels.map((d) => {
                    const idx = data.indexOf(d)
                    return (
                        <text key={d.day} x={xScale(idx)} y={H - 8} textAnchor="middle" fontSize="9" fill="#9ca3af">
                            {lang === 'zh' ? `${d.day}日` : `D${d.day}`}
                        </text>
                    )
                })}

                {/* Axis lines */}
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + innerH} stroke="#d1d5db" strokeWidth="1" />
                <line x1={PAD.l} y1={PAD.t + innerH} x2={W - PAD.r} y2={PAD.t + innerH} stroke="#d1d5db" strokeWidth="1" />
            </svg>
        </div>
    )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function LedgerStatCards() {
    const { language } = useLanguage()
    const zh = language === 'zh'

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {cards.map((c, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
                    {/* icon + label */}
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <i className={`fas ${c.icon} ${c.iconColor} text-base`} />
                        </div>
                        <span className="text-sm text-gray-500 leading-tight">
                            {zh ? c.labelZh : c.labelEn}
                        </span>
                    </div>

                    {/* value */}
                    <div className="text-2xl font-bold text-gray-900 leading-none">
                        {c.value}
                    </div>

                    {/* change badge */}
                    <div className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full w-fit
              ${c.changeUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {c.change}
                        <span className="text-gray-400 font-normal">{zh ? ' 环比' : ' MoM'}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export function LedgerTrendChart() {
    const { language } = useLanguage()
    const zh = language === 'zh'

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-full flex flex-col justify-center">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <h4 className="text-base font-semibold text-gray-800">
                    {zh ? '平台分账趋势（近30天）' : 'Platform Distribution Trend (Last 30 Days)'}
                </h4>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {zh ? '模拟数据仅供演示' : 'Simulated data – demo only'}
                </span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
                {zh ? '单位：港元 / 天' : 'unit: HK$ / day'}
            </p>

            {/* Chart */}
            <ThirtyDayLineChart lang={language} />
        </div>
    )
}
