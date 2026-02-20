import { useMemo } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

// ── helpers ───────────────────────────────────────────────────────────────────

function generateDailyData() {
    const data: { date: string; count: number }[] = []
    const now = new Date(2026, 1, 20) // 2026-02-20 (fixed reference)
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        const label = `${d.getMonth() + 1}/${d.getDate()}`
        const count = Math.round(30 + Math.random() * 25)
        data.push({ date: label, count })
    }
    return data
}

// Simple SVG line chart
function LineChart({ data }: { data: { date: string; count: number }[] }) {
    const W = 420, H = 160, PAD = { t: 10, r: 10, b: 30, l: 35 }
    const innerW = W - PAD.l - PAD.r
    const innerH = H - PAD.t - PAD.b

    const maxVal = Math.max(...data.map(d => d.count))
    const minVal = Math.min(...data.map(d => d.count))

    const xScale = (i: number) => PAD.l + (i / (data.length - 1)) * innerW
    const yScale = (v: number) => PAD.t + innerH - ((v - minVal) / (maxVal - minVal || 1)) * innerH

    const pathD = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.count)}`).join(' ')

    // show every 5th label
    const labelIndices = data.map((_, i) => i).filter(i => i % 5 === 0 || i === data.length - 1)

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {/* Y grid */}
            {[0, 0.5, 1].map(t => {
                const y = PAD.t + (1 - t) * innerH
                const val = Math.round(minVal + t * (maxVal - minVal))
                return (
                    <g key={t}>
                        <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                        <text x={PAD.l - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{val}</text>
                    </g>
                )
            })}

            {/* Area fill */}
            <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={`${pathD} L ${xScale(data.length - 1)} ${PAD.t + innerH} L ${xScale(0)} ${PAD.t + innerH} Z`}
                fill="url(#areaGrad)"
            />

            {/* Line */}
            <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

            {/* X labels */}
            {labelIndices.map(i => (
                <text key={i} x={xScale(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#9ca3af">
                    {data[i].date}
                </text>
            ))}
        </svg>
    )
}

// Simple SVG pie/donut chart
function DonutChart({ passed, rejected, lang }: { passed: number; rejected: number; lang: string }) {
    const total = passed + rejected
    const passedPct = total ? passed / total : 0
    const R = 56, cx = 80, cy = 80, stroke = 16

    function arc(pct: number, offset: number, color: string) {
        const circumf = 2 * Math.PI * R
        return (
            <circle
                cx={cx} cy={cy} r={R}
                fill="none"
                stroke={color}
                strokeWidth={stroke}
                strokeDasharray={`${pct * circumf} ${circumf}`}
                strokeDashoffset={-offset * circumf + circumf / 4}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
        )
    }

    return (
        <div className="flex items-center gap-6">
            <svg viewBox="0 0 160 160" className="w-36 h-36 flex-shrink-0">
                {arc(1 - passedPct, passedPct, '#fca5a5')}
                {arc(passedPct, 0, '#6ee7b7')}
                <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1f2937">
                    {Math.round(passedPct * 100)}%
                </text>
                <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#6b7280">
                    {lang === 'zh' ? '通过率' : 'Pass Rate'}
                </text>
            </svg>
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-300 inline-block" />
                    <span className="text-gray-600">{lang === 'zh' ? '通过' : 'Passed'}</span>
                    <span className="font-bold text-gray-900 ml-auto pl-4">{passed.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-300 inline-block" />
                    <span className="text-gray-600">{lang === 'zh' ? '拒绝' : 'Rejected'}</span>
                    <span className="font-bold text-gray-900 ml-auto pl-4">{rejected.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-300 inline-block" />
                    <span className="text-gray-600">{lang === 'zh' ? '合计' : 'Total'}</span>
                    <span className="font-bold text-gray-900 ml-auto pl-4">{total.toLocaleString()}</span>
                </div>
            </div>
        </div>
    )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ValidationStats() {
    const { language } = useLanguage()
    const zh = language === 'zh'

    const dailyData = useMemo(() => generateDailyData(), [])

    const miniCards = [
        {
            icon: 'fa-check-circle',
            iconColor: 'text-indigo-500',
            bg: 'bg-indigo-50',
            label: zh ? '今日已完成' : 'Completed Today',
            value: '42',
        },
        {
            icon: 'fa-chart-line',
            iconColor: 'text-emerald-500',
            bg: 'bg-emerald-50',
            label: zh ? '本周趋势' : 'Weekly Trend',
            value: '↑ 8.3%',
        },
        {
            icon: 'fa-hourglass-half',
            iconColor: 'text-orange-400',
            bg: 'bg-orange-50',
            label: zh ? '待审核' : 'Pending',
            value: '17',
        },
    ]

    return (
        <div className="flex flex-col gap-5 h-full">

            {/* Mini stat cards */}
            <div className="grid grid-cols-3 gap-3">
                {miniCards.map((c, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col items-center text-center gap-1">
                        <div className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center`}>
                            <i className={`fas ${c.icon} ${c.iconColor} text-sm`} />
                        </div>
                        <div className="text-[11px] text-gray-500 leading-tight">{c.label}</div>
                        <div className="text-base font-bold text-gray-900">{c.value}</div>
                    </div>
                ))}
            </div>

            {/* Line chart: 30-day daily completions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex-1">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-800">
                        {zh ? '近30天每日审核完成量' : 'Daily Reviews – Last 30 Days'}
                    </h4>
                    <span className="text-xs text-gray-400">
                        {zh ? '单位：笔' : 'unit: reviews'}
                    </span>
                </div>
                <LineChart data={dailyData} />
            </div>

            {/* Pie/Donut chart: pass vs reject */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-4">
                    {zh ? '审核结果分布' : 'Review Result Distribution'}
                </h4>
                <DonutChart passed={1180} rejected={65} lang={language} />
            </div>

        </div>
    )
}
