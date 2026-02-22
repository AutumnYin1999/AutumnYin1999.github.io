import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface DistributionDetail {
    bank: number
    audit: number
    cic: number
}

interface LedgerRecord {
    txId: string
    date: string
    arId: string
    financingAmount: number
    platformEarnings: number
    nodeTotalDistribution: number
    distributionDetail: DistributionDetail
    status: 'settled' | 'settling' | 'error'
}

const records: LedgerRecord[] = [
    { txId: 'TX-001', date: '2025-04-02', arId: 'AR-2025-021', financingAmount: 500000, platformEarnings: 5000, nodeTotalDistribution: 1800, distributionDetail: { bank: 500, audit: 1000, cic: 300 }, status: 'settled' },
    { txId: 'TX-002', date: '2025-04-01', arId: 'AR-2025-018', financingAmount: 1200000, platformEarnings: 12000, nodeTotalDistribution: 4200, distributionDetail: { bank: 1200, audit: 2000, cic: 1000 }, status: 'settled' },
    { txId: 'TX-003', date: '2025-03-31', arId: 'AR-2025-015', financingAmount: 800000, platformEarnings: 8000, nodeTotalDistribution: 2800, distributionDetail: { bank: 800, audit: 1500, cic: 500 }, status: 'settled' },
    { txId: 'TX-004', date: '2025-03-30', arId: 'AR-2025-012', financingAmount: 650000, platformEarnings: 6500, nodeTotalDistribution: 2275, distributionDetail: { bank: 650, audit: 1125, cic: 500 }, status: 'settled' },
    { txId: 'TX-005', date: '2025-03-29', arId: 'AR-2025-009', financingAmount: 950000, platformEarnings: 9500, nodeTotalDistribution: 3325, distributionDetail: { bank: 950, audit: 1875, cic: 500 }, status: 'settled' },
    { txId: 'TX-006', date: '2025-03-28', arId: 'AR-2025-006', financingAmount: 300000, platformEarnings: 3000, nodeTotalDistribution: 1050, distributionDetail: { bank: 300, audit: 500, cic: 250 }, status: 'error' },
    { txId: 'TX-007', date: '2025-03-27', arId: 'AR-2025-003', financingAmount: 1500000, platformEarnings: 15000, nodeTotalDistribution: 5250, distributionDetail: { bank: 1500, audit: 2750, cic: 1000 }, status: 'settling' },
    { txId: 'TX-008', date: '2025-03-26', arId: 'AR-2025-001', financingAmount: 700000, platformEarnings: 7000, nodeTotalDistribution: 2450, distributionDetail: { bank: 700, audit: 1250, cic: 500 }, status: 'settling' },
]

const fmt = (n: number) => 'HK$ ' + n.toLocaleString('en-US')

// ── Filter option types ─────────────────────────────────────────────────────
type TimeRange = 'today' | 'week' | 'month' | 'custom'
type NodeFilter = 'all' | 'hsbc' | 'kpmg' | 'cic'
type StatusFilter = 'all' | 'settled' | 'settling' | 'error'

const timeRangeOptions: { key: TimeRange; zh: string; en: string }[] = [
    { key: 'today', zh: '今日', en: 'Today' },
    { key: 'week', zh: '本周', en: 'This Week' },
    { key: 'month', zh: '本月', en: 'This Month' },
    { key: 'custom', zh: '自定义', en: 'Custom' },
]

const nodeOptions: { key: NodeFilter; zh: string; en: string }[] = [
    { key: 'all', zh: '全部节点', en: 'All Nodes' },
    { key: 'hsbc', zh: '汇丰银行', en: 'HSBC' },
    { key: 'kpmg', zh: '毕马威', en: 'KPMG' },
    { key: 'cic', zh: 'CIC', en: 'CIC' },
]

const statusOptions: { key: StatusFilter; zh: string; en: string }[] = [
    { key: 'all', zh: '全部', en: 'All' },
    { key: 'settled', zh: '已结算', en: 'Settled' },
    { key: 'settling', zh: '结算中', en: 'Settling' },
    { key: 'error', zh: '异常', en: 'Error' },
]

export default function LedgerTable() {
    const { language } = useLanguage()
    const zh = language === 'zh'
    const [selectedRecord, setSelectedRecord] = useState<LedgerRecord | null>(null)

    // ── Filter state ──
    const [timeRange, setTimeRange] = useState<TimeRange>('month')
    const [nodeFilter, setNodeFilter] = useState<NodeFilter>('all')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

    const getStatusBadge = (status: LedgerRecord['status']) => {
        switch (status) {
            case 'settled': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">✅ {zh ? '已结算' : 'Settled'}</span>
            case 'settling': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium bg-amber-50 text-amber-600">⏳ {zh ? '结算中' : 'Settling'}</span>
            case 'error': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium bg-red-50 text-red-600">❗ {zh ? '异常' : 'Error'}</span>
        }
    }

    // ── Apply status filter (demo-only; time & node are visual) ──
    const filteredRecords = records.filter(r => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false
        return true
    })

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">

            {/* ── Header ── */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
                <div>
                    <h4 className="text-base font-semibold text-gray-800">
                        {zh ? '全平台分账记录' : 'Platform Distribution Records'}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {zh ? '最近的融资业务及对应节点分账' : 'Latest financing & corresponding node distributions'}
                    </p>
                </div>
            </div>

            {/* ── Filter Bar ── */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center gap-4">

                {/* Time Range Pills */}
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 font-medium mr-1 flex items-center gap-1">
                        <i className="fas fa-calendar-alt text-xs" />
                        {zh ? '时间' : 'Time'}
                    </span>
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                        {timeRangeOptions.map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => setTimeRange(opt.key)}
                                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap
                                    ${timeRange === opt.key
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {zh ? opt.zh : opt.en}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-200 hidden sm:block" />

                {/* Node Dropdown */}
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <i className="fas fa-sitemap text-xs" />
                        {zh ? '节点' : 'Node'}
                    </span>
                    <div className="relative">
                        <select
                            value={nodeFilter}
                            onChange={e => setNodeFilter(e.target.value as NodeFilter)}
                            className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-7 text-xs font-medium text-gray-700 shadow-sm cursor-pointer hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                        >
                            {nodeOptions.map(opt => (
                                <option key={opt.key} value={opt.key}>
                                    {zh ? opt.zh : opt.en}
                                </option>
                            ))}
                        </select>
                        <i className="fas fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-200 hidden sm:block" />

                {/* Status Dropdown */}
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <i className="fas fa-flag text-xs" />
                        {zh ? '状态' : 'Status'}
                    </span>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value as StatusFilter)}
                            className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-7 text-xs font-medium text-gray-700 shadow-sm cursor-pointer hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.key} value={opt.key}>
                                    {zh ? opt.zh : opt.en}
                                </option>
                            ))}
                        </select>
                        <i className="fas fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Spacer + active filter indicator */}
                <div className="flex-1" />
                {(statusFilter !== 'all' || nodeFilter !== 'all' || timeRange !== 'month') && (
                    <button
                        onClick={() => { setTimeRange('month'); setNodeFilter('all'); setStatusFilter('all') }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
                    >
                        <i className="fas fa-undo text-xs" />
                        {zh ? '重置筛选' : 'Reset Filters'}
                    </button>
                )}
            </div>

            {/* ── Table ── */}
            <div className="flex-1 overflow-x-auto overflow-y-auto">
                <table className="w-full text-lg">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            {[
                                { zh: '交易ID', en: 'Tx ID' },
                                { zh: '时间', en: 'Date' },
                                { zh: '关联资产', en: 'AR ID' },
                                { zh: '融资金额', en: 'Financing Amt' },
                                { zh: '平台收益', en: 'Platform Earn' },
                                { zh: '节点分账总额', en: 'Node Total Dist.' },
                                { zh: '状态', en: 'Status' },
                                { zh: '明细', en: 'Details' },
                            ].map((col, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3 text-left text-base font-semibold text-gray-500 tracking-wide whitespace-nowrap"
                                >
                                    {zh ? col.zh : col.en}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredRecords.map((r, i) => (
                            <tr key={i} className="hover:bg-indigo-50/40 transition-colors group">
                                <td className="px-4 py-4 font-mono text-base font-medium text-gray-600 whitespace-nowrap">{r.txId}</td>
                                <td className="px-4 py-4 text-base text-gray-500 whitespace-nowrap">{r.date}</td>
                                <td className="px-4 py-4 font-mono text-base font-medium text-indigo-700 whitespace-nowrap">{r.arId}</td>
                                <td className="px-4 py-4 text-base text-gray-700 whitespace-nowrap">{fmt(r.financingAmount)}</td>
                                <td className="px-4 py-4 text-base font-semibold text-gray-700 whitespace-nowrap">{fmt(r.platformEarnings)}</td>
                                <td className="px-4 py-4 text-base font-bold text-indigo-600 whitespace-nowrap">{fmt(r.nodeTotalDistribution)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(r.status)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <button
                                        onClick={() => setSelectedRecord(r)}
                                        className="text-indigo-600 hover:text-indigo-800 text-base font-medium underline"
                                    >
                                        [{zh ? '查看' : 'View'}]
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Footer totals & Pagination ── */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-base text-gray-500">
                <span>{zh ? '共 1,245 笔记录' : '1,245 records total'}</span>

                {/* Pagination (Visual only) */}
                <div className="flex items-center gap-1.5">
                    <button className="px-2.5 py-1.5 rounded bg-white border border-gray-200 text-gray-400 cursor-not-allowed">
                        <i className="fas fa-chevron-left text-[10px]" />
                    </button>
                    <button className="px-3 py-1.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-600 font-medium">1</button>
                    <button className="px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">2</button>
                    <button className="px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">3</button>
                    <span className="px-1 text-gray-400">...</span>
                    <button className="px-3 py-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">156</button>
                    <button className="px-2.5 py-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        <i className="fas fa-chevron-right text-[10px]" />
                    </button>
                </div>

                <span className="font-semibold text-gray-700 whitespace-nowrap">
                    {zh ? '累计分账总额：' : 'Total Distributed: '}
                    <span className="text-emerald-600 text-lg">
                        HK$ 8,245,800
                    </span>
                </span>
            </div>

            {/* Modal for Details */}
            {selectedRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-base">
                                {zh ? '分账明细' : 'Distribution Details'} ({selectedRecord.txId})
                            </h3>
                            <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-base text-gray-500">{zh ? '银行节点' : 'Bank Node'}</span>
                                <span className="font-semibold text-gray-800 text-base">{fmt(selectedRecord.distributionDetail.bank)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-base text-gray-500">{zh ? '审计节点' : 'Audit Node'}</span>
                                <span className="font-semibold text-gray-800 text-base">{fmt(selectedRecord.distributionDetail.audit)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-base text-gray-500">{zh ? '合规节点(CIC)' : 'CIC Node'}</span>
                                <span className="font-semibold text-gray-800 text-base">{fmt(selectedRecord.distributionDetail.cic)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 mt-2 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                                <span className="text-base font-bold text-indigo-700">{zh ? '节点分账总额' : 'Total Distribution'}</span>
                                <span className="text-base font-bold text-indigo-700">{fmt(selectedRecord.nodeTotalDistribution)}</span>
                            </div>
                        </div>
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-right">
                            <button onClick={() => setSelectedRecord(null)} className="px-4 py-2 bg-white border border-gray-300 rounded text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                {zh ? '关闭' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
