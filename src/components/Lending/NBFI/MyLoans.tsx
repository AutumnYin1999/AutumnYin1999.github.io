import { useState } from 'react'
import { useLanguage } from '../../../hooks/useLanguage'

function MyLoans() {
  const { language } = useLanguage()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Mock data tailored for Investments
  const investments = [
    {
      id: 'AR-2025-021',
      type: 'AR',
      faceValue: 500000,
      investAmount: 495000,
      yield: 24.5,
      dueDate: '2025-06-30',
      status: '持有中'
    },
    {
      id: 'ABS-2025-001',
      type: 'ABS',
      faceValue: 2500000,
      investAmount: 250000,
      yield: 21.2,
      dueDate: '2025-12-31',
      status: '回款中'
    },
    {
      id: 'AR-2025-015',
      type: 'AR',
      faceValue: 800000,
      investAmount: 792000,
      yield: 26.8,
      dueDate: '2025-08-15',
      status: '已回款'
    }
  ]

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case '持有中': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">✅ {language === 'zh' ? '持有中' : 'Holding'}</span>;
      case '已回款': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">✅ {language === 'zh' ? '已回款' : 'Repaid'}</span>;
      case '回款中': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">⏳ {language === 'zh' ? '回款中' : 'Repaying'}</span>;
      default: return <span>{status}</span>;
    }
  }

  // Handle Filtering
  const filteredInvestments = investments.filter(inv => {
    const matchSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'All' || inv.type === typeFilter;
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <i className="fas fa-list mr-2 text-blue-600"></i>
          {language === 'zh' ? '我的投资' : 'My Investments'}
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder={language === 'zh' ? "搜索资产ID..." : "Search Asset ID..."}
              className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-2.5 top-2.5 text-gray-400 text-xs"></i>
          </div>

          <select
            className="border border-gray-300 rounded-lg text-sm py-1.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="All">{language === 'zh' ? '所有类型' : 'All Types'}</option>
            <option value="AR">AR</option>
            <option value="ABS">ABS</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg text-sm py-1.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">{language === 'zh' ? '所有状态' : 'All Status'}</option>
            <option value="持有中">{language === 'zh' ? '持有中' : 'Holding'}</option>
            <option value="回款中">{language === 'zh' ? '回款中' : 'Repaying'}</option>
            <option value="已回款">{language === 'zh' ? '已回款' : 'Repaid'}</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                {language === 'zh' ? '资产ID' : 'Asset ID'}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                {language === 'zh' ? '类型' : 'Type'}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                {language === 'zh' ? '面值' : 'Face Value'}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                {language === 'zh' ? '投资金额' : 'Invested'}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                {language === 'zh' ? '收益率' : 'Yield'}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                {language === 'zh' ? '到期日' : 'Due Date'}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                {language === 'zh' ? '状态' : 'Status'}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                {language === 'zh' ? '操作' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredInvestments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <i className="fas fa-box-open text-3xl text-gray-300 mb-3"></i>
                  <p>{language === 'zh' ? '暂无投资记录' : 'No investment records'}</p>
                </td>
              </tr>
            ) : (
              filteredInvestments.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-gray-900">{inv.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${inv.type === 'AR' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                      {inv.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-gray-600">
                      HK$ {inv.faceValue.toLocaleString('en-US')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-gray-900">
                      HK$ {inv.investAmount.toLocaleString('en-US')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-bold text-green-600">
                      {inv.yield}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-gray-600">{inv.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusDisplay(inv.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                    <button className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                      {language === 'zh' ? '[查看详情]' : '[Details]'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyLoans
