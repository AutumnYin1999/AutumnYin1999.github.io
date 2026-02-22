import { useLanguage } from '../hooks/useLanguage'
import PermissionGuard from '../components/Common/PermissionGuard'
import HistoryList from '../components/ABSPackaging/HistoryList'
import ValidationStats from '../components/ABSPackaging/ValidationStats'
import ABSHistory from '../components/ABSPackaging/ABSHistory'

// ── Interfaces kept for downstream component compatibility ─────────────────────

export interface AssetToken {
  id: string
  type: 'receivable' | 'inventory'
  faceValue: number
  riskRating: string
  daysRemaining?: number
  status?: string
  issuer: string
  quantity: number
}

export interface ABSProduct {
  id: string
  name: string
  type: 'receivable' | 'inventory' | 'mixed'
  totalSize: number
  createdAt: string
  seniorTranche: { amount: number; status: string }
  mezzanineTranche: { amount: number; status: string }
  juniorTranche: { amount: number; status: string }
  hash: string
}

export interface TrancheConfig {
  senior: number
  mezzanine: number
  junior: number
}

// ─────────────────────────────────────────────────────────────────────────────

function ABSPackaging() {
  const { language } = useLanguage()
  const zh = language === 'zh'

  const statsCards = [
    { icon: 'fa-check-double', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', label: { zh: '已完成审核总数', en: 'Total Validations' }, value: '1,245' },
    { icon: 'fa-id-card', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', label: { zh: '已完成 KYC 数量', en: 'KYC Completed' }, value: '568' },
    { icon: 'fa-file-invoice-dollar', iconBg: 'bg-green-50', iconColor: 'text-green-600', label: { zh: '已完成 AR 验证数量', en: 'AR Completed' }, value: '612' },
    { icon: 'fa-shield-halved', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', label: { zh: '已完成合规查询数量', en: 'Compliance Completed' }, value: '65' },
    { icon: 'fa-clock', iconBg: 'bg-orange-50', iconColor: 'text-orange-500', label: { zh: '平均审核耗时', en: 'Avg. Time' }, value: '2.3d' },
  ]

  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">

      {/* ── Top Stats Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statsCards.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
              <i className={`fas ${s.icon} ${s.iconColor}`} />
            </div>
            <div>
              <div className="text-sm text-gray-500 leading-tight">{zh ? s.label.zh : s.label.en}</div>
              <div className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main two-column area ── */}
      <PermissionGuard permission="absPackagingCreate">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

          {/* Left (60%): history table */}
          <div className="lg:col-span-6">
            <HistoryList />
          </div>

          {/* Right (40%): validation stats charts */}
          <div className="lg:col-span-4">
            <ValidationStats />
          </div>

        </div>
      </PermissionGuard>

      {/* NBFI: read-only view */}
      <PermissionGuard permission="absPackagingPurchase">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {zh ? '可购买的 ABS 产品' : 'Purchasable ABS Products'}
          </h3>
          <ABSHistory absProducts={[]} />
        </div>
      </PermissionGuard>

    </div>
  )
}

export default ABSPackaging
