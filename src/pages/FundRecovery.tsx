import { useLanguage } from '../hooks/useLanguage'
import PermissionGuard from '../components/Common/PermissionGuard'
import NodeEarningsOverview from '../components/FundRecovery/NodeEarningsOverview'
import EarningsDetail from '../components/FundRecovery/EarningsDetail'

// ── Earnings Source Donut Chart ────────────────────────────────────────────────

interface Slice { labelZh: string; labelEn: string; pct: number; color: string; textColor: string; bg: string }

const slices: Slice[] = [
  { labelZh: 'AR 验证收益', labelEn: 'AR Validation', pct: 60, color: '#6366f1', textColor: 'text-indigo-600', bg: 'bg-indigo-50' },
  { labelZh: 'KYC 收益', labelEn: 'KYC Earnings', pct: 30, color: '#10b981', textColor: 'text-emerald-600', bg: 'bg-emerald-50' },
  { labelZh: '合规收益', labelEn: 'Compliance', pct: 10, color: '#f59e0b', textColor: 'text-amber-500', bg: 'bg-amber-50' },
]

function EarningsDonut({ lang }: { lang: string }) {
  const R = 52, cx = 70, cy = 70, strokeW = 20
  const circumf = 2 * Math.PI * R

  // Build cumulative offsets
  let cumulative = 0
  const arcs = slices.map(s => {
    const dashLen = (s.pct / 100) * circumf
    const dashOffset = circumf / 4 - cumulative * circumf   // start from top
    cumulative += s.pct / 100
    return { ...s, dashLen, dashOffset }
  })

  return (
    <div className="flex items-center gap-5">
      {/* SVG donut */}
      <svg viewBox="0 0 140 140" className="w-28 h-28 flex-shrink-0">
        {/* track */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f3f4f6" strokeWidth={strokeW} />
        {arcs.map((a, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke={a.color}
            strokeWidth={strokeW}
            strokeDasharray={`${a.dashLen} ${circumf - a.dashLen}`}
            strokeDashoffset={a.dashOffset}
            strokeLinecap="butt"
          />
        ))}
        {/* centre label */}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1f2937">100%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="10" fill="#9ca3af">
          {lang === 'zh' ? '收益来源' : 'Source'}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0`} style={{ background: s.color }} />
              <span className="text-sm text-gray-600 leading-tight">
                {lang === 'zh' ? s.labelZh : s.labelEn}
              </span>
            </div>
            <span className={`text-base font-bold ${s.textColor}`}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

function FundRecovery() {
  const { t, language } = useLanguage()

  return (
    <PermissionGuard
      permission="fundRecovery"
      fallback={
        <div className="p-6 min-h-[calc(100vh-4rem)]">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <i className="fas fa-exclamation-triangle text-yellow-600 text-3xl mb-3" />
            <p className="text-yellow-800 font-medium">
              {language === 'zh'
                ? '您没有权限访问此功能'
                : 'You do not have permission to access this feature'}
            </p>
          </div>
        </div>
      }
    >
      <div className="p-6 min-h-[calc(100vh-4rem)]">

        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            {t('fundRecovery.title')}
          </h2>
          <p className="text-base text-gray-500">
            {language === 'zh'
              ? '节点运营收益统计与分账明细'
              : 'Node operation earnings statistics & distribution detail'}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* Left (60%): stat cards + 30-day trend */}
          <div className="lg:col-span-3">
            <NodeEarningsOverview />
          </div>

          {/* Right (40%): earnings table + donut chart */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            <EarningsDetail />

            {/* Earnings source distribution donut */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-gray-800">
                  {language === 'zh' ? '收益来源分布' : 'Earnings Source Distribution'}
                </h4>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {language === 'zh' ? '模拟数据' : 'Demo data'}
                </span>
              </div>
              <EarningsDonut lang={language} />
            </div>

          </div>
        </div>

      </div>
    </PermissionGuard>
  )
}

export default FundRecovery
