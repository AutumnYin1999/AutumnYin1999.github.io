import { useLanguage } from '../../hooks/useLanguage'

interface EarningsRecord {
    date: string
    arId: string
    financingAmount: number
    earningsAmount: number
    status: 'settled' | 'settling'
}

const records: EarningsRecord[] = [
    { date: '2025-04-02', arId: 'AR-2025-021', financingAmount: 500000, earningsAmount: 500, status: 'settled' },
    { date: '2025-04-01', arId: 'AR-2025-018', financingAmount: 1200000, earningsAmount: 1200, status: 'settled' },
    { date: '2025-03-31', arId: 'AR-2025-015', financingAmount: 800000, earningsAmount: 800, status: 'settled' },
    { date: '2025-03-30', arId: 'AR-2025-012', financingAmount: 650000, earningsAmount: 650, status: 'settled' },
    { date: '2025-03-29', arId: 'AR-2025-009', financingAmount: 950000, earningsAmount: 950, status: 'settled' },
    { date: '2025-03-28', arId: 'AR-2025-006', financingAmount: 300000, earningsAmount: 300, status: 'settled' },
    { date: '2025-03-27', arId: 'AR-2025-003', financingAmount: 1500000, earningsAmount: 1500, status: 'settling' },
    { date: '2025-03-26', arId: 'AR-2025-001', financingAmount: 700000, earningsAmount: 700, status: 'settling' },
]

const fmt = (n: number) =>
    'HK$ ' + n.toLocaleString('en-US')

export default function EarningsDetail() {
    const { language } = useLanguage()
    const zh = language === 'zh'

    const totalSettled = records
        .filter(r => r.status === 'settled')
        .reduce((s, r) => s + r.earningsAmount, 0)

    const totalPending = records
        .filter(r => r.status === 'settling')
        .reduce((s, r) => s + r.earningsAmount, 0)

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">

            {/* ── Header ── */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h4 className="text-base font-semibold text-gray-800">
                        {zh ? '收益分账明细' : 'Earnings Distribution Detail'}
                    </h4>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {zh ? '最近8笔分账记录' : 'Latest 8 distribution records'}
                    </p>
                </div>
                {/* summary pills */}
                <div className="flex items-center gap-2 text-sm flex-shrink-0">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        ✅ {fmt(totalSettled)}
                    </span>
                    <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                        ⏳ {fmt(totalPending)}
                    </span>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            {[
                                { zh: '时间', en: 'Date' },
                                { zh: 'AR ID', en: 'AR ID' },
                                { zh: '融资金额', en: 'Financing Amt' },
                                { zh: '收益金额', en: 'Earnings' },
                                { zh: '状态', en: 'Status' },
                            ].map((col, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-2.5 text-left text-sm font-semibold text-gray-500 tracking-wide whitespace-nowrap"
                                >
                                    {zh ? col.zh : col.en}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {records.map((r, i) => (
                            <tr key={i} className="hover:bg-indigo-50/40 transition-colors group">

                                {/* Date */}
                                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                    {r.date}
                                </td>

                                {/* AR ID */}
                                <td className="px-4 py-3 font-mono text-sm font-medium text-indigo-700 whitespace-nowrap">
                                    {r.arId}
                                </td>

                                {/* Financing Amount */}
                                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                    {fmt(r.financingAmount)}
                                </td>

                                {/* Earnings Amount */}
                                <td className="px-4 py-3 text-sm font-semibold text-emerald-700 whitespace-nowrap">
                                    {fmt(r.earningsAmount)}
                                </td>

                                {/* Status badge */}
                                <td className="px-4 py-3">
                                    {r.status === 'settled' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
                                            ✅ {zh ? '已结算' : 'Settled'}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium bg-amber-50 text-amber-600">
                                            ⏳ {zh ? '结算中' : 'Settling'}
                                        </span>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Footer totals ── */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl flex items-center justify-between text-sm text-gray-500">
                <span>{zh ? `共 ${records.length} 笔记录` : `${records.length} records total`}</span>
                <span className="font-semibold text-gray-700">
                    {zh ? '累计收益：' : 'Total Earnings: '}
                    <span className="text-emerald-600 text-lg">
                        {fmt(records.reduce((s, r) => s + r.earningsAmount, 0))}
                    </span>
                </span>
            </div>

        </div>
    )
}
