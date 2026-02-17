import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useRole } from '../../hooks/useRole'
import ReceivableDetailModal from './ReceivableDetailModal'

interface Receivable {
  id: string
  issuer: string
  amount: number
  dueDate: string
  status: 'pending' | 'received' | 'listed' | 'sold' | 'settled'
  receivedDate?: string
  listedDate?: string
  soldDate?: string
  verificationProgress?: {
    bank: boolean
    audit: boolean
    cic: boolean
  }
  financedAmount?: number
  financingProgress?: number
  repaidDate?: string
}

type TabType = 'pending' | 'received' | 'listed' | 'history'

function ReceivablesManagementContent() {
  const { language } = useLanguage()
  const { currentRole } = useRole()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterIssuer, setFilterIssuer] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedReceivable, setSelectedReceivable] = useState<Receivable | null>(null)

  // 模拟数据：待接收的应收账款
  const initialPendingData = useMemo(() => [
    {
      id: 'AR-2025-001',
      issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A',
      amount: 500000,
      dueDate: '2025-06-30',
      status: 'pending' as const,
      verificationProgress: { bank: true, audit: false, cic: false }
    },
    {
      id: 'AR-2025-002',
      issuer: language === 'zh' ? '核心企业B' : 'Core Enterprise B',
      amount: 300000,
      dueDate: '2025-07-15',
      status: 'pending' as const,
      verificationProgress: { bank: true, audit: true, cic: false }
    },
    {
      id: 'AR-2025-003',
      issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A',
      amount: 800000,
      dueDate: '2025-08-01',
      status: 'pending' as const,
      verificationProgress: { bank: false, audit: false, cic: false }
    },
  ], [language])

  const [pendingReceivables, setPendingReceivables] = useState<Receivable[]>(initialPendingData)
  const [receivedReceivables, setReceivedReceivables] = useState<Receivable[]>([
    {
      id: 'AR-2025-004',
      issuer: language === 'zh' ? '核心企业C' : 'Core Enterprise C',
      amount: 1000000,
      dueDate: '2025-05-20',
      status: 'received' as const,
      receivedDate: '2025-01-10',
    },
    {
      id: 'AR-2025-005',
      issuer: language === 'zh' ? '核心企业B' : 'Core Enterprise B',
      amount: 800000,
      dueDate: '2025-06-15',
      status: 'received' as const,
      receivedDate: '2025-01-12',
    },
  ])
  const [listedReceivables, setListedReceivables] = useState<Receivable[]>([
    {
      id: 'AR-2025-006',
      issuer: language === 'zh' ? '核心企业B' : 'Core Enterprise B',
      amount: 1000000,
      dueDate: '2025-10-01',
      status: 'listed' as const,
      listedDate: '2025-01-15',
      financedAmount: 400000,
      financingProgress: 40
    },
    {
      id: 'AR-2025-007',
      issuer: language === 'zh' ? '核心企业D' : 'Core Enterprise D',
      amount: 750000,
      dueDate: '2025-07-30',
      status: 'listed' as const,
      listedDate: '2025-01-20',
      financedAmount: 750000,
      financingProgress: 100
    },
    {
      id: 'AR-2025-008',
      issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A',
      amount: 2000000,
      dueDate: '2025-11-15',
      status: 'listed' as const,
      listedDate: '2025-02-01',
      financedAmount: 0,
      financingProgress: 0
    }
  ])
  const [historyReceivables] = useState<Receivable[]>([
    {
      id: 'AR-2025-009',
      issuer: language === 'zh' ? '核心企业C' : 'Core Enterprise C',
      amount: 900000,
      dueDate: '2025-06-15',
      status: 'settled' as const,
      repaidDate: '2025-06-15',
    },
    {
      id: 'AR-2025-010',
      issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A',
      amount: 1500000,
      dueDate: '2025-05-20',
      status: 'settled' as const,
      repaidDate: '2025-05-20',
    },
  ])

  const [selectedInvestmentAR, setSelectedInvestmentAR] = useState<Receivable | null>(null)

  // 当语言改变时更新数据
  useEffect(() => {
    setPendingReceivables(prev => prev.map((r, i) => ({
      ...r,
      issuer: initialPendingData[i]?.issuer || r.issuer
    })))
  }, [language, initialPendingData])

  // 获取所有发行企业列表（用于筛选）
  const allIssuers = useMemo(() => {
    const issuers = new Set<string>()
    const allReceivables = [
      ...pendingReceivables,
      ...receivedReceivables,
      ...listedReceivables,
      ...historyReceivables
    ]
    allReceivables.forEach(r => {
      issuers.add(r.issuer)
    })
    return Array.from(issuers)
  }, [pendingReceivables, receivedReceivables, listedReceivables, historyReceivables])

  // 计算统计数据
  const stats = useMemo(() => {
    const pendingTotal = pendingReceivables.reduce((sum, r) => sum + r.amount, 0)
    const receivedTotal = receivedReceivables.reduce((sum, r) => sum + r.amount, 0)
    const listedTotal = listedReceivables.reduce((sum, r) => sum + r.amount, 0)
    const financedTotal = historyReceivables.reduce((sum, r) => sum + r.amount, 0)

    // 计算平均回款周期（已售出的应收账款）
    const soldItems = historyReceivables.filter(r => r.status === 'sold' && r.receivedDate && r.soldDate)
    const avgDays = soldItems.length > 0
      ? Math.round(soldItems.reduce((sum, r) => {
        const received = new Date(r.receivedDate!)
        const sold = new Date(r.soldDate!)
        return sum + (sold.getTime() - received.getTime()) / (1000 * 60 * 60 * 24)
      }, 0) / soldItems.length)
      : 0

    return { pendingTotal, receivedTotal, listedTotal, avgDays, financedTotal }
  }, [pendingReceivables, receivedReceivables, listedReceivables, historyReceivables])

  // 筛选数据
  const getFilteredData = (data: Receivable[]) => {
    return data.filter(r => {
      const matchSearch = !searchTerm || r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.issuer.toLowerCase().includes(searchTerm.toLowerCase())
      const matchIssuer = !filterIssuer || r.issuer === filterIssuer
      const matchDate = !dateRange.start || !dateRange.end ||
        (r.dueDate >= dateRange.start && r.dueDate <= dateRange.end)
      return matchSearch && matchIssuer && matchDate
    })
  }

  const handleReceive = (id: string) => {
    const receivable = pendingReceivables.find(r => r.id === id)
    if (receivable) {
      setPendingReceivables(prev => prev.filter(r => r.id !== id))
      setReceivedReceivables(prev => [{
        ...receivable,
        status: 'received',
        receivedDate: new Date().toISOString().split('T')[0],
      }, ...prev])
      setActiveTab('received')
    }
  }

  const handleBatchReceive = () => {
    const toReceive = pendingReceivables.filter(r => selectedItems.includes(r.id))
    const now = new Date().toISOString().split('T')[0]
    setPendingReceivables(prev => prev.filter(r => !selectedItems.includes(r.id)))
    setReceivedReceivables(prev => [
      ...toReceive.map(r => ({
        ...r,
        status: 'received' as const,
        receivedDate: now,
      })),
      ...prev
    ])
    setSelectedItems([])
    setActiveTab('received')
  }

  const handleList = (id: string) => {
    const receivable = receivedReceivables.find(r => r.id === id)
    if (receivable) {
      setReceivedReceivables(prev => prev.filter(r => r.id !== id))
      setListedReceivables(prev => [{
        ...receivable,
        status: 'listed',
        listedDate: new Date().toISOString().split('T')[0],
      }, ...prev])
      setActiveTab('listed')
    }
  }

  const handleBatchList = () => {
    const toList = receivedReceivables.filter(r => selectedItems.includes(r.id))
    const now = new Date().toISOString().split('T')[0]
    setReceivedReceivables(prev => prev.filter(r => !selectedItems.includes(r.id)))
    setListedReceivables(prev => [
      ...toList.map(r => ({
        ...r,
        status: 'listed' as const,
        listedDate: now,
      })),
      ...prev
    ])
    setSelectedItems([])
    setActiveTab('listed')
  }

  const getStatusLabel = (status: string) => {
    if (language === 'zh') {
      switch (status) {
        case 'pending': return '待验证'
        case 'received': return '待确权'
        case 'listed': return '融资中'
        case 'sold': return '已回款'
        case 'settled': return '已结清'
        default: return status
      }
    } else {
      switch (status) {
        case 'pending': return 'Pending Verification'
        case 'received': return 'Pending Confirmation'
        case 'listed': return 'Financing'
        case 'sold': return 'Repaid'
        case 'settled': return 'Settled'
        default: return status
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'received': return 'bg-blue-100 text-blue-800'
      case 'listed': return 'bg-green-100 text-green-800'
      case 'sold': return 'bg-purple-100 text-purple-800'
      case 'settled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const currentData = activeTab === 'pending' ? pendingReceivables :
    activeTab === 'received' ? receivedReceivables :
      activeTab === 'listed' ? listedReceivables :
        historyReceivables

  const filteredData = getFilteredData(currentData)

  // 如果不是建筑公司，显示无权限
  if (currentRole !== '建筑公司') {
    return (
      <div className="p-6 text-center py-12 text-gray-500">
        <i className="fas fa-lock text-4xl mb-4"></i>
        <p>{language === 'zh' ? '您没有权限访问此页面' : 'You do not have permission to access this page'}</p>
      </div>
    )
  }

  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      {/* 顶部导航 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'zh' ? 'SME - 应收账款管理' : 'SME - Accounts Receivable Management'}
          </h2>
          <p className="text-gray-600">
            {language === 'zh' ? '上传并管理您的应收账款，实时跟踪验证与融资状态' : 'Upload and manage your receivables, track verification and financing status in real-time'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-home mr-2"></i>
            {language === 'zh' ? '返回仪表盘' : 'Back to Dashboard'}
          </button>
          <button
            onClick={() => navigate('/app/market-trading')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <i className="fas fa-exchange-alt mr-2"></i>
            {language === 'zh' ? '已上架应收账款' : 'My Listed AR'}
          </button>
        </div>
      </div>

      {/* 统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {language === 'zh' ? '待验证总额' : 'Pending Verification Total'}
            </span>
            <i className="fas fa-clock text-yellow-600"></i>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            HK$ {(stats.pendingTotal / 1000000).toFixed(1)}M
          </div>
          <p className="text-xs text-gray-500">
            {language === 'zh' ? '已提交但尚未完成三方验证的 AR 总额' : 'AR submitted but pending 3-party verification'}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {language === 'zh' ? '可融资金额' : 'Financing Available'}
            </span>
            <i className="fas fa-wallet text-blue-600"></i>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            HK$ {(stats.receivedTotal / 1000000).toFixed(1)}M
          </div>
          <p className="text-xs text-gray-500">
            {language === 'zh' ? '已完成验证、可发起融资的 AR 总额' : 'Verified AR ready for financing'}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {language === 'zh' ? '已融资金额' : 'Financed Amount'}
            </span>
            <i className="fas fa-money-bill-wave text-purple-600"></i>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            HK$ {(stats.financedTotal / 1000000).toFixed(1)}M
          </div>
          <p className="text-xs text-gray-500">
            {language === 'zh' ? '已成功完成融资的 AR 总额' : 'Total AR amount successfully financed'}
          </p>
        </div>
      </div>

      {/* 搜索与筛选 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder={language === 'zh' ? '搜索 AR ID 或核心企业' : 'Search AR ID or Core Enterprise'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <select
              value={filterIssuer}
              onChange={(e) => setFilterIssuer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">{language === 'zh' ? '所有核心企业' : 'All Core Enterprises'}</option>
              {allIssuers.map(issuer => (
                <option key={issuer} value={issuer}>{issuer}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="date"
              placeholder={language === 'zh' ? '起始日期' : 'Start Date'}
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <input
              type="date"
              placeholder={language === 'zh' ? '结束日期' : 'End Date'}
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 标签页 */}
        <div className="flex border-b border-gray-200">
          {(['pending', 'received', 'listed', 'history'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setSelectedItems([])
              }}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === tab
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              {tab === 'pending' && (language === 'zh' ? '待验证' : 'Pending Verification')}
              {tab === 'received' && (language === 'zh' ? '待确权' : 'Pending Confirmation')}
              {tab === 'listed' && (language === 'zh' ? '融资中' : 'Financing')}
              {tab === 'history' && (language === 'zh' ? '已回款' : 'Repayment History')}
              {tab === 'pending' && pendingReceivables.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                  {pendingReceivables.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Summary Statistics Bar */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex items-center justify-between shadow-sm">
          {activeTab === 'pending' && (
            <div className="flex space-x-6 text-base">
              <span className="font-medium text-gray-700">{language === 'zh' ? '待验证总额' : 'Total Pending Verification'}: <span className="text-xl font-bold text-gray-900">HK$ {(currentData.reduce((acc, curr) => acc + curr.amount, 0) / 1000).toLocaleString()}K</span></span>
              <span className="text-gray-400">|</span>
              <span className="font-medium text-gray-700">{language === 'zh' ? '笔数' : 'Count'}: <span className="text-xl font-bold text-gray-900">{currentData.length}</span></span>
            </div>
          )}
          {activeTab === 'received' && (
            <div className="flex space-x-6 text-base">
              <span className="font-medium text-gray-700">{language === 'zh' ? '待确权总额' : 'Total Pending Confirmation'}: <span className="text-xl font-bold text-gray-900">HK$ {(currentData.reduce((acc, curr) => acc + curr.amount, 0) / 1000).toLocaleString()}K</span></span>
              <span className="text-gray-400">|</span>
              <span className="font-medium text-gray-700">{language === 'zh' ? '笔数' : 'Count'}: <span className="text-xl font-bold text-gray-900">{currentData.length}</span></span>
            </div>
          )}
          {activeTab === 'listed' && (
            <div className="flex space-x-6 text-base">
              <span className="font-medium text-gray-700">{language === 'zh' ? '融资中总额' : 'Total Financing'}: <span className="text-xl font-bold text-gray-900">HK$ {(currentData.reduce((acc, curr) => acc + curr.amount, 0) / 1000).toLocaleString()}K</span></span>
              <span className="text-gray-400">|</span>
              <span className="font-medium text-gray-700">{language === 'zh' ? '已融' : 'Financed'}: <span className="text-xl font-bold text-teal-600">HK$ {(currentData.reduce((acc, curr) => acc + (curr.financedAmount || 0), 0) / 1000).toLocaleString()}K</span></span>
            </div>
          )}
          {activeTab === 'history' && (
            <div className="flex space-x-6 text-base">
              <span className="font-medium text-gray-700">{language === 'zh' ? '历史回款总额' : 'Total Repaid'}: <span className="text-xl font-bold text-gray-900">HK$ {(currentData.reduce((acc, curr) => acc + curr.amount, 0) / 1000).toLocaleString()}K</span></span>
              <span className="text-gray-400">|</span>
              <span className="font-medium text-gray-700">{language === 'zh' ? '笔数' : 'Count'}: <span className="text-xl font-bold text-gray-900">{currentData.length}</span></span>
            </div>
          )}
        </div>

        {/* 批量操作栏 */}
        {selectedItems.length > 0 && (
          <div className="p-4 bg-teal-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {language === 'zh' ? `已选择 ${selectedItems.length} 项` : `${selectedItems.length} items selected`}
            </span>
            <div className="flex space-x-2">
              {activeTab === 'pending' && (
                <button
                  onClick={handleBatchReceive}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                >
                  <i className="fas fa-check-circle mr-2"></i>
                  {language === 'zh' ? '批量接收' : 'Batch Receive'}
                </button>
              )}
              {activeTab === 'received' && (
                <button
                  onClick={handleBatchList}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                >
                  <i className="fas fa-arrow-up mr-2"></i>
                  {language === 'zh' ? '批量上架' : 'Batch List'}
                </button>
              )}
              <button
                onClick={() => setSelectedItems([])}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                {language === 'zh' ? '取消选择' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* 内容区域 */}
        <div className="p-6 max-h-[calc(100vh-30rem)] overflow-y-auto">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
              <p className="text-sm">
                {language === 'zh' ? `暂无${getStatusLabel(activeTab === 'history' ? 'history' : currentData[0]?.status || '')}的应收账款` : `No ${getStatusLabel(activeTab === 'history' ? 'history' : currentData[0]?.status || '')} receivables`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredData.map((receivable) => (
                <div
                  key={receivable.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${selectedItems.includes(receivable.id) ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                    }`}
                >
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
                    {(activeTab === 'pending' || activeTab === 'received' || activeTab === 'history') && (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(receivable.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(prev => [...prev, receivable.id])
                          } else {
                            setSelectedItems(prev => prev.filter(id => id !== receivable.id))
                          }
                        }}
                        className="mt-2 w-5 h-5"
                      />
                    )}
                    <div className="flex-1 w-full">
                      {/* Top Row: ID, Status, Actions */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-2xl text-gray-800">{receivable.id}</span>
                          <span className={`px-3 py-1 rounded text-base font-medium ${getStatusColor(receivable.status)}`}>
                            {getStatusLabel(receivable.status)}
                          </span>
                        </div>
                      </div>

                      {/* Data Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-gray-500 block text-base uppercase tracking-wide mb-1">
                            {language === 'zh' ? '核心企业' : 'Core Enterprise'}
                          </span>
                          <span className="font-medium text-xl text-gray-800">{receivable.issuer}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-base uppercase tracking-wide mb-1">
                            {language === 'zh' ? '金额' : 'Amount'}
                          </span>
                          <span className="font-medium text-xl text-gray-800">
                            HK$ {receivable.amount.toLocaleString()}
                          </span>
                        </div>

                        {/* Conditional Columns for Listed Tab */}
                        {activeTab === 'listed' ? (
                          <>
                            <div>
                              <span className="text-gray-500 block text-base uppercase tracking-wide mb-1">
                                {language === 'zh' ? '已融资金额' : 'Financed Amount'}
                              </span>
                              <span className="font-medium text-xl text-teal-600">
                                HK$ {(receivable.financedAmount || 0).toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-base uppercase tracking-wide mb-1">
                                {language === 'zh' ? '到期日' : 'Due Date'}
                              </span>
                              <span className="font-medium text-xl text-gray-800">{receivable.dueDate}</span>
                            </div>
                            {/* Progress Bar (Spanning full width on mobile or specific layout) - Actually I'll put it below grid or in grid if space allows. 
                                 Let's keep the grid structure. I'll add a new row or span for progress.
                             */}
                          </>
                        ) : (
                          <div>
                            <span className="text-gray-500 block text-base uppercase tracking-wide mb-1">
                              {language === 'zh' ? '到期日' : 'Due Date'}
                            </span>
                            <span className="font-medium text-xl text-gray-800">{receivable.dueDate}</span>
                          </div>
                        )}

                        {/* Verification Progress for Pending Tab */}
                        {activeTab === 'pending' && receivable.verificationProgress && (
                          <div>
                            <span className="text-gray-500 block text-base uppercase tracking-wide mb-1">
                              {language === 'zh' ? '验证进度' : 'Verification Progress'}
                            </span>
                            <div className="flex space-x-3 text-base">
                              <div className="flex items-center space-x-1" title="Bank">
                                <span>{language === 'zh' ? '银行' : 'Bank'}</span>
                                {receivable.verificationProgress.bank ? <span className="text-green-500">✅</span> : <span className="text-yellow-500">⏳</span>}
                              </div>
                              <div className="flex items-center space-x-1" title="Audit">
                                <span>{language === 'zh' ? '审计' : 'Audit'}</span>
                                {receivable.verificationProgress.audit ? <span className="text-green-500">✅</span> : <span className="text-yellow-500">⏳</span>}
                              </div>
                              <div className="flex items-center space-x-1" title="CIC">
                                <span>CIC</span>
                                {receivable.verificationProgress.cic ? <span className="text-green-500">✅</span> : <span className="text-yellow-500">⏳</span>}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Other dates for non-pending/non-listed tabs */}
                        {receivable.receivedDate && activeTab !== 'pending' && activeTab !== 'listed' && activeTab !== 'history' && (
                          <div>
                            <span className="text-gray-500 block text-base uppercase tracking-wide mb-1">
                              {language === 'zh' ? '接收日期' : 'Received'}
                            </span>
                            <span className="font-medium text-xl text-gray-800">{receivable.receivedDate}</span>
                          </div>
                        )}

                        {/* History Tab Specifics */}
                        {activeTab === 'history' && (
                          <>
                            <div>
                              <span className="text-gray-500 block text-base uppercase tracking-wide mb-1">
                                {language === 'zh' ? '回款日期' : 'Repayment Date'}
                              </span>
                              <span className="font-medium text-xl text-gray-800">{receivable.repaidDate}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-base uppercase tracking-wide mb-1">
                                {language === 'zh' ? '回款状态' : 'Repayment Status'}
                              </span>
                              <span className="font-medium text-xl text-green-600">
                                {language === 'zh' ? '已结清' : 'Settled'}
                              </span>
                            </div>
                          </>
                        )}

                        {activeTab !== 'pending' && activeTab !== 'listed' && activeTab !== 'history' && activeTab !== 'received' && (
                          <div>
                            <span className="text-gray-500 block text-base uppercase tracking-wide mb-1">
                              {language === 'zh' ? '售出日期' : 'Sold'}
                            </span>
                            <span className="font-medium text-xl text-gray-800">{receivable.soldDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Financing Progress Bar for Listed Tab */}
                      {activeTab === 'listed' && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-600">
                              {language === 'zh' ? '融资进度' : 'Financing Progress'}
                            </span>
                            <span className="text-sm font-medium text-teal-600">
                              {receivable.financingProgress || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${receivable.financingProgress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons Column */}
                    <div className="flex flex-col space-y-2 md:w-32">
                      {receivable.status === 'pending' && (
                        <button
                          onClick={() => {
                            if (receivable.verificationProgress?.bank && receivable.verificationProgress?.audit && receivable.verificationProgress?.cic) {
                              handleReceive(receivable.id);
                            } else {
                              alert(language === 'zh' ? '请等待验证完成' : 'Please wait for verification completion');
                            }
                          }}
                          className={`py-3 px-4 rounded-lg font-medium transition-colors text-base text-center border ${(receivable.verificationProgress?.bank && receivable.verificationProgress?.audit && receivable.verificationProgress?.cic)
                            ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
                            : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                          {language === 'zh' ? '申请融资' : 'Financing'}
                        </button>
                      )}

                      {receivable.status === 'received' && (
                        <button
                          onClick={() => handleList(receivable.id)}
                          className="bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-base text-center shadow-sm"
                        >
                          {language === 'zh' ? '上架' : 'List'}
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedReceivable(receivable)}
                        className="py-3 px-4 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors text-base text-center"
                      >
                        {language === 'zh' ? '查看详情' : 'Details'}
                      </button>

                      {receivable.status === 'listed' && (receivable.financingProgress || 0) > 0 && (
                        <button
                          onClick={() => setSelectedInvestmentAR(receivable)}
                          className="py-3 px-4 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg font-medium hover:bg-teal-100 transition-colors text-base text-center"
                        >
                          {language === 'zh' ? '查看投资' : 'Investments'}
                        </button>
                      )}

                      {activeTab === 'history' && (
                        <button
                          onClick={() => alert(language === 'zh' ? '正在下载凭证...' : 'Downloading proof...')}
                          className="py-3 px-4 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-100 transition-colors text-base text-center flex items-center justify-center space-x-2"
                        >
                          <i className="fas fa-download text-sm"></i>
                          <span>{language === 'zh' ? '下载凭证' : 'Proof'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 详情弹窗 */}
      {/* 详情弹窗 */}
      {selectedReceivable && (
        <ReceivableDetailModal
          receivable={selectedReceivable}
          onClose={() => setSelectedReceivable(null)}
        />
      )}

      {/* 投资详情弹窗 - Simple Inline Modal or imported */}
      {selectedInvestmentAR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedInvestmentAR(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {language === 'zh' ? '投资详情' : 'Investment Details'}
              </h3>
              <button onClick={() => setSelectedInvestmentAR(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>

            <div className="mb-6">
              <div className="text-gray-500 mb-1">{language === 'zh' ? '应收账款ID' : 'Receivable ID'}</div>
              <div className="text-xl font-bold text-gray-800">{selectedInvestmentAR.id}</div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Digital Vision Capital</span>
                  <span className="text-teal-600 font-bold">HK$ {(selectedInvestmentAR.financedAmount ? selectedInvestmentAR.financedAmount * 0.6 : 0).toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-500">2025-01-16 10:30:22</div>
              </div>
              {(selectedInvestmentAR.financedAmount || 0) > 500000 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">HK Web3 Fund</span>
                    <span className="text-teal-600 font-bold">HK$ {(selectedInvestmentAR.financedAmount ? selectedInvestmentAR.financedAmount * 0.4 : 0).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-500">2025-01-17 14:15:00</div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedInvestmentAR(null)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                {language === 'zh' ? '关闭' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceivablesManagementContent
