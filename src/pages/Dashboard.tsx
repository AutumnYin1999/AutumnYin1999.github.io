import { useMemo, useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area } from 'recharts'
import { useRole } from '../hooks/useRole'
import { useLanguage } from '../hooks/useLanguage'

function DashboardPage() {
  const { currentRole } = useRole()
  const { t, language } = useLanguage()
  const [selectedAR, setSelectedAR] = useState<any>(null)



  // 根据角色显示不同的KPI数据
  const isPlatformAdmin = !['核心企业', '建筑公司', '银行', 'NBFI'].includes(currentRole as string || '')

  const kpiData = useMemo(() => {
    if (currentRole === '建筑公司') {
      // 建筑公司：显示累计提交AR、已融资、待回款、活跃AR数量
      return [
        { nameKey: 'dashboard.accumulatedARTotal', value: 'HK$ 16.8M', change: '+2.5%', icon: 'fa-file-invoice-dollar', bgColor: '#dbeafe', iconColor: '#2563eb' },
        { nameKey: 'dashboard.financedAmount', value: 'HK$ 12.5M', change: '+1.8%', icon: 'fa-coins', bgColor: '#d1fae5', iconColor: '#10b981' },
        { nameKey: 'dashboard.pendingRepayment', value: 'HK$ 4.3M', change: '-0.5%', icon: 'fa-clock', bgColor: '#fef3c7', iconColor: '#f59e0b' },
        { nameKey: 'dashboard.activeARCount', value: '23', change: '+5', icon: 'fa-file-contract', bgColor: '#e9d5ff', iconColor: '#8b5cf6' },
      ]
    } else if (currentRole === '核心企业') {
      // 核心企业：待确认AR、已确认AR、待支付、平均账期、确权效率
      return [
        { nameKey: 'dashboard.issuedReceivables', value: 'HK$ 1,600K', change: (language === 'zh' ? '环比 ' : 'MoM ') + '+150K', icon: 'fa-file-invoice', bgColor: '#fee2e2', iconColor: '#dc2626' },
        { nameKey: 'dashboard.fundingCost', value: 'HK$ 6,500K', change: (language === 'zh' ? '环比 ' : 'MoM ') + '+200K', icon: 'fa-check-circle', bgColor: '#d1fae5', iconColor: '#10b981' },
        { nameKey: 'dashboard.totalLiabilities', value: 'HK$ 2,800K', change: (language === 'zh' ? '环比 +3 笔' : 'MoM +3 txns'), icon: 'fa-balance-scale', bgColor: '#fef3c7', iconColor: '#f59e0b' },
        { nameKey: 'dashboard.avgMaturity', value: '45' + (language === 'zh' ? '天' : ' days'), change: (language === 'zh' ? '环比 -2天' : 'MoM -2 days'), icon: 'fa-calendar-alt', bgColor: '#dbeafe', iconColor: '#2563eb' },
        { nameKey: 'dashboard.costAnalysis', value: '2.4' + (language === 'zh' ? '天' : ' days'), change: '-0.3', icon: 'fa-chart-pie', bgColor: '#e9d5ff', iconColor: '#8b5cf6' },
      ]
    } else if (currentRole === '银行') {
      // 验证节点 (银行/审计/CIC)
      return [
        { nameKey: 'dashboard.totalValidatedAR', value: 'HK$ 1,245.8M', change: '↑2.1%', icon: 'fa-check-double', bgColor: '#dbeafe', iconColor: '#2563eb' },
        { nameKey: 'dashboard.pendingReviews', value: '24', change: language === 'zh' ? '+5 今日' : '+5 today', icon: 'fa-tasks', bgColor: '#fef3c7', iconColor: '#f59e0b' },
        { nameKey: 'dashboard.nodeEarnings', value: 'HK$ 162.5K', change: '↑12.5K', icon: 'fa-coins', bgColor: '#d1fae5', iconColor: '#10b981' },
        { nameKey: 'dashboard.avgValidationTime', value: '2.3' + (language === 'zh' ? ' 天' : ' days'), change: language === 'zh' ? '↓0.1天' : '↓0.1d', icon: 'fa-clock', bgColor: '#e0e7ff', iconColor: '#6366f1' },
        { nameKey: 'dashboard.participatingSMEs', value: '89', change: '+3', icon: 'fa-building', bgColor: '#fce7f3', iconColor: '#ec4899' },
        { nameKey: 'dashboard.nodeUptime', value: '99.8%', change: '↓0.1%', icon: 'fa-server', bgColor: '#f3f4f6', iconColor: '#4b5563' },
      ]
    } else if (currentRole === 'NBFI') {
      // 资本方 (Capital Provider)
      return [
        { nameKey: 'dashboard.totalInvestment', value: 'HK$ 42.5M', change: (language === 'zh' ? '环比 ↑2.5%' : 'MoM ↑2.5%'), icon: 'fa-chart-pie', bgColor: '#dbeafe', iconColor: '#2563eb' },
        { nameKey: 'dashboard.portfolioValue', value: 'HK$ 38.2M', change: (language === 'zh' ? '环比 ↑1.8%' : 'MoM ↑1.8%'), icon: 'fa-briefcase', bgColor: '#e0e7ff', iconColor: '#6366f1' },
        { nameKey: 'dashboard.accumulatedReturn', value: 'HK$ 2.8M', change: (language === 'zh' ? '环比 ↑5.2%' : 'MoM ↑5.2%'), icon: 'fa-coins', bgColor: '#d1fae5', iconColor: '#10b981' },
        { nameKey: 'dashboard.avgAnnualizedReturn', value: '6.8%', change: (language === 'zh' ? '环比 +0.3%' : 'MoM +0.3%'), icon: 'fa-percent', bgColor: '#fce7f3', iconColor: '#ec4899' },
        { nameKey: 'dashboard.activeInvestments', value: '23' + (language === 'zh' ? ' 笔' : ''), change: (language === 'zh' ? '环比 +5' : 'MoM +5'), icon: 'fa-chart-line', bgColor: '#fef3c7', iconColor: '#f59e0b' },
        { nameKey: 'dashboard.pendingCollections', value: 'HK$ 8.7M', change: (language === 'zh' ? '环比 ↓0.5%' : 'MoM ↓0.5%'), icon: 'fa-clock', bgColor: '#fee2e2', iconColor: '#dc2626' },
      ]
    } else {
      // 平台管理员 (Platform Admin) 等其他角色：显示平台通用运营指标
      return [
        { nameKey: 'dashboard.totalAssets', name: language === 'zh' ? '总上链资产' : 'Total On-Chain Assets', value: 'HK$ 1,245.8M', change: '↑2.1%', icon: 'fa-globe-asia', bgColor: '#dbeafe', iconColor: '#2563eb' },
        { nameKey: 'dashboard.dailyVolume', name: language === 'zh' ? '累计融资金额' : 'Total Financed Amount', value: 'HK$ 892.3M', change: '↑3.5%', icon: 'fa-coins', bgColor: '#d1fae5', iconColor: '#10b981' },
        { nameKey: 'dashboard.platformRevenue', name: language === 'zh' ? '活跃节点数' : 'Active Nodes', value: '9', change: '0', icon: 'fa-network-wired', bgColor: '#fef3c7', iconColor: '#f59e0b' },
        { nameKey: 'dashboard.activeAssets', name: language === 'zh' ? '累计分账总额' : 'Total Distributed Revenue', value: 'HK$ 4.2M', change: '↑8.2%', icon: 'fa-chart-pie', bgColor: '#e9d5ff', iconColor: '#8b5cf6' },
        { nameKey: 'dashboard.userActivity', name: language === 'zh' ? '活跃 SME 数' : 'Active SMEs', value: '89', change: '+5', icon: 'fa-users', bgColor: '#fce7f3', iconColor: '#ec4899' },
        { nameKey: 'dashboard.avgFundingCost', name: language === 'zh' ? '待处理任务' : 'Pending Tasks', value: '24', change: '-3', icon: 'fa-tasks', bgColor: '#e0e7ff', iconColor: '#6366f1' },
      ]
    }
  }, [currentRole, language])

  // 核心企业：确权趋势数据
  const confirmationTrendData = useMemo(() => {
    const locale = language === 'zh' ? 'zh-CN' : 'en-US'
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
        confirmed: Math.floor(Math.random() * 500 + 200), // 确权金额
        pending: Math.floor(Math.random() * 300 + 100),   // 待确权金额
      }
    })
  }, [language])

  // 核心企业：确权效率对比数据
  const efficiencyData = useMemo(() => {
    return [
      { name: t('dashboard.sampleDebtors.abcTech'), value: 1.5, color: '#3b82f6' },
      { name: t('dashboard.sampleDebtors.xyzEngineering'), value: 2.8, color: '#10b981' },
      { name: t('dashboard.sampleDebtors.defConstruction'), value: 3.2, color: '#f59e0b' },
      { name: t('dashboard.sampleIssuers.constructionCompanyX'), value: 2.1, color: '#6366f1' },
      { name: t('dashboard.sampleIssuers.constructionCompanyY'), value: 1.8, color: '#ec4899' },
    ]
  }, [t])

  // 平台管理员：收益趋势数据 (30天)
  const adminRevenueData = useMemo(() => {
    const locale = language === 'zh' ? 'zh-CN' : 'en-US'
    let total = 3500000 // Base
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const daily = Math.floor(Math.random() * 20000 + 15000 + (i * 500))
      total += daily
      return {
        date: date.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
        revenue: total,
      }
    })
  }, [language])

  // 平台管理员：节点任务处理量分布
  const adminTaskData = useMemo(() => {
    return [
      { name: language === 'zh' ? '汇丰银行' : 'HSBC', completed: 156, processing: 12 },
      { name: language === 'zh' ? '渣打银行' : 'Standard Chartered', completed: 142, processing: 8 },
      { name: language === 'zh' ? '毕马威' : 'KPMG', completed: 98, processing: 5 },
      { name: 'CIC', completed: 85, processing: 3 },
    ]
  }, [language])

  // 验证节点：收益趋势数据 (30 days)
  const nodeEarningsData = useMemo(() => {
    const locale = language === 'zh' ? 'zh-CN' : 'en-US'
    let total = 120000 // Base
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      // Smoother random curve
      const daily = Math.floor(Math.random() * 800 + 1000 + (i * 20))
      total += daily
      return {
        date: date.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
        earnings: total,
        daily: daily
      }
    })
  }, [language])

  // 资本方：投资组合分布数据
  const nbfiPortfolioData = useMemo(() => {
    return [
      { nameKey: 'dashboard.riskLevelA', value: 45, color: '#10b981' }, // Low Risk (A)
      { nameKey: 'dashboard.riskLevelB', value: 35, color: '#3b82f6' }, // Medium Risk (B)
      { nameKey: 'dashboard.riskLevelC', value: 20, color: '#f59e0b' }, // High Risk (C)
    ]
  }, [])

  // 资本方：收益趋势数据 (30天)
  const nbfiEarningsData = useMemo(() => {
    const locale = language === 'zh' ? 'zh-CN' : 'en-US'
    let total = 2500000 // Base: 2.5M
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const daily = Math.floor(Math.random() * 5000 + 8000 + (i * 100))
      total += daily
      return {
        date: date.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
        earnings: total,
        daily: daily
      }
    })
  }, [language])

  const nbfiRecentInvestments = useMemo(() => {
    return [
      { id: 'AR-2025-021', type: 'AR', amount: 'HK$ 500,000', yield: '26.5%', status: 'holding', date: '2025-04-02' },
      { id: 'ABS-001', type: 'ABS', amount: 'HK$ 1,200,000', yield: '22.8%', status: 'holding', date: '2025-04-01' },
      { id: 'AR-2025-015', type: 'AR', amount: 'HK$ 800,000', yield: '27.2%', status: 'repaid', date: '2025-03-30' },
      { id: 'AR-2025-012', type: 'AR', amount: 'HK$ 350,000', yield: '24.5%', status: 'holding', date: '2025-03-25' },
      { id: 'ABS-005', type: 'ABS', amount: 'HK$ 2,500,000', yield: '21.5%', status: 'holding', date: '2025-03-20' },
    ]
  }, [])

  // 验证节点：任务分布数据
  const verificationDistributionData = useMemo(() => {
    return [
      { nameKey: 'dashboard.kycPending', value: 35, color: '#3b82f6' },
      { nameKey: 'dashboard.arPending', value: 60, color: '#10b981' },
      { nameKey: 'dashboard.complianceCheck', value: 5, color: '#f59e0b' },
    ]
  }, [])

  // 根据角色显示不同的资产分布数据
  const assetDistribution = useMemo(() => {
    if (currentRole === '建筑公司') {
      // 建筑公司：应收账款和库存资产
      return [
        { nameKey: 'dashboard.receivable', value: 65, color: '#3b82f6' },
        { nameKey: 'dashboard.inventory', value: 35, color: '#10b981' },
      ]
    } else if (currentRole === '核心企业') {
      // 核心企业：待确权AR分布（按项目）
      return [
        { nameKey: 'dashboard.projectA', value: 40, color: '#3b82f6' },
        { nameKey: 'dashboard.projectB', value: 35, color: '#10b981' },
        { nameKey: 'dashboard.projectC', value: 25, color: '#f59e0b' },
      ]
    } else {
      // 其他角色：通用资产分布
      return [
        { nameKey: 'dashboard.receivable', value: 65, color: '#3b82f6' },
        { nameKey: 'dashboard.inventory', value: 35, color: '#10b981' },
      ]
    }
  }, [currentRole])

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">


        {/* KPI 卡片 */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${currentRole === '建筑公司' ? 'xl:grid-cols-4' : currentRole === '核心企业' ? 'xl:grid-cols-5' : 'xl:grid-cols-6'} gap-4 mb-6`}>
          {kpiData.map((kpi, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: kpi.bgColor }}
                >
                  <i className={`fas ${kpi.icon}`} style={{ color: kpi.iconColor }}></i>
                </div>
                <span
                  className={`text-sm font-medium ${kpi.change.includes('+') ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</div>
              <div className="text-base text-gray-600">{(kpi as any).name || t(kpi.nameKey)}</div>
            </div>
          ))}
        </div>



        {/* 待处理事项 - 仅建筑公司可见 */}
        {currentRole === '建筑公司' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('dashboard.pendingItems')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 bg-white p-2 rounded-full shadow-sm">
                  <i className="fas fa-clipboard-check text-xl"></i>
                </div>
                <div>
                  <div className="text-base text-gray-500">{t('dashboard.pendingVerification')}</div>
                  <div className="text-xl font-bold text-gray-800">5 <span className="text-sm font-normal text-gray-500">{t('common.items')}</span></div>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                <div className="text-orange-600 bg-white p-2 rounded-full shadow-sm">
                  <i className="fas fa-file-signature text-xl"></i>
                </div>
                <div>
                  <div className="text-base text-gray-500">{t('dashboard.pendingConfirmation')}</div>
                  <div className="text-xl font-bold text-gray-800">3 <span className="text-sm font-normal text-gray-500">{t('common.items')}</span></div>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="text-purple-600 bg-white p-2 rounded-full shadow-sm">
                  <i className="fas fa-coins text-xl"></i>
                </div>
                <div>
                  <div className="text-base text-gray-500">{t('dashboard.financing')}</div>
                  <div className="text-xl font-bold text-gray-800">15 <span className="text-sm font-normal text-gray-500">{t('common.items')}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 验证节点专用区域 (Pending Tasks + Earnings Trend) */}
        {currentRole === '银行' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            {/* 左侧：待验证任务概览 (40%) */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-tasks mr-2 text-blue-500"></i>
                {t('dashboard.pendingTasksOverview')}
              </h3>

              <div className="space-y-4 flex-1">
                {/* KYC */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-user-shield"></i>
                    </div>
                    <span className="text-gray-700 font-medium">{t('dashboard.kycPending')}</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800">8</span>
                </div>

                {/* AR Verification */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-file-contract"></i>
                    </div>
                    <span className="text-gray-700 font-medium">{t('dashboard.arPending')}</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800">14</span>
                </div>

                {/* Compliance */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-search-dollar"></i>
                    </div>
                    <span className="text-gray-700 font-medium">{t('dashboard.complianceCheck')}</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800">2</span>
                </div>
              </div>

              <button className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md text-lg">
                {t('dashboard.viewAllPending')}
              </button>
            </div>

            {/* 右侧：节点收益趋势 (60%) */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  <i className="fas fa-chart-line mr-2 text-green-500"></i>
                  {t('dashboard.nodeEarningsTrend')}
                </h3>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-600">{t('dashboard.monthlyAccumulated')}: <span className="font-bold text-gray-800">HK$ 42.8K</span></span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                    <span className="text-gray-600">{t('dashboard.dailyAvg')}: <span className="font-bold text-gray-800">HK$ 1.4K</span></span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={nodeEarningsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} minTickGap={30} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `HK$${(value / 1000).toFixed(0)}K`} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: any) => [`HK$ ${value.toLocaleString()}`, t('dashboard.nodeEarnings')]}
                    labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 图表区域 - 仅非建筑公司且非验证节点可见 */}
        {currentRole !== '建筑公司' && currentRole !== '银行' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 左侧图表：核心企业显示确权趋势，NBFI显示投资组合分布，其他显示交易趋势 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className={`${isPlatformAdmin ? 'text-xl' : 'text-lg'} font-semibold text-gray-800 mb-4`}>
                {currentRole === '核心企业' ? t('dashboard.confirmationTrend') :
                  currentRole === 'NBFI' ? t('dashboard.portfolioDistribution') : (language === 'zh' ? '平台累计分账收益趋势' : 'Platform Cumulative Distributed Revenue Trend')}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                {currentRole === '核心企业' ? (
                  <LineChart data={confirmationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="confirmed" name={t('dashboard.confirmedAmount')} stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="pending" name={t('dashboard.pendingConfirmationAmount')} stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                ) : currentRole === 'NBFI' ? (
                  <PieChart>
                    <Pie
                      data={nbfiPortfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={({ nameKey, percent }) => `${t(nameKey)} ${(percent * 100).toFixed(0)}%`}
                    >
                      {nbfiPortfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, _name: string, props: any) => {
                        return [`${value}%`, t(props.payload.nameKey)]
                      }}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Legend
                      formatter={(_value, entry: any) => t(entry.payload.nameKey)}
                      verticalAlign="bottom"
                    />
                  </PieChart>
                ) : (
                  <AreaChart data={adminRevenueData}>
                    <defs>
                      <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '14px' }} tickLine={false} axisLine={false} tickMargin={10} minTickGap={30} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '13px' }} tickLine={false} axisLine={false} tickFormatter={(value) => `HK$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: any) => [`HK$ ${value.toLocaleString()}`, language === 'zh' ? '累计收益' : 'Cumulative Revenue']}
                      itemStyle={{ fontSize: '14px' }}
                      labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminRev)" activeDot={{ r: 6 }} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* 右侧图表：平台管理员显示节点状态 */}
            {isPlatformAdmin && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{language === 'zh' ? '节点在线状态' : 'Node Online Status'}</h3>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                  {[
                    { name: language === 'zh' ? '汇丰银行' : 'HSBC', status: 'online', color: 'bg-green-500' },
                    { name: language === 'zh' ? '毕马威' : 'KPMG', status: 'online', color: 'bg-green-500' },
                    { name: 'CIC', status: 'online', color: 'bg-green-500' },
                    { name: language === 'zh' ? '渣打银行' : 'Standard Chartered', status: 'offline', color: 'bg-gray-400' },
                  ].map((node, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${node.status === 'online' ? 'bg-blue-50 text-blue-500' : 'bg-white text-gray-400'}`}>
                          <i className="fas fa-server"></i>
                        </div>
                        <span className={`text-lg font-medium ${node.status === 'online' ? 'text-gray-800' : 'text-gray-500'}`}>{node.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${node.color} ${node.status === 'online' ? 'animate-pulse shadow-sm shadow-green-200' : ''}`}></span>
                        <span className={`text-base font-medium px-2 py-1 rounded-md ${node.status === 'online' ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100'}`}>
                          {node.status === 'online' ? (language === 'zh' ? '在线' : 'Online') : (language === 'zh' ? '离线' : 'Offline')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 右侧图表：核心企业显示待确权AR分布，NBFI显示收益趋势，其他显示资产分布 */}
            {!isPlatformAdmin && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {currentRole === '核心企业' ? t('dashboard.pendingARDistribution') :
                    currentRole === 'NBFI' ? t('dashboard.revenueTrend') : t('dashboard.assetDistribution')}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  {currentRole === 'NBFI' ? (
                    <AreaChart data={nbfiEarningsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorNbfiEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} minTickGap={30} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `HK$${(value / 1000).toFixed(0)}K`} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value: any) => [`HK$ ${value.toLocaleString()}`, t('dashboard.accumulatedReturn')]}
                        labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                      />
                      <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorNbfiEarnings)" activeDot={{ r: 6 }} />
                    </AreaChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={assetDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ nameKey, percent }) => `${t(nameKey)} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {assetDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, _name: string, props: any) => {
                          return [`${value}%`, t(props.payload.nameKey)]
                        }}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* 最近投资记录 - 仅资本方可见 */}
        {currentRole === 'NBFI' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.recentInvestments')}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.time')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.assetId')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.investmentType')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.investmentAmount')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.yieldRate')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.investmentStatus')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.operations')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {nbfiRecentInvestments.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.type === 'AR' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.yield}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'holding' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {t(`dashboard.${item.status}` as any)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900" onClick={(e) => { e.preventDefault() }}>{t('dashboard.viewDetails')}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* 最近提交的应收账款列表 - 仅建筑公司可见 */}
        {currentRole === '建筑公司' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('dashboard.recentARRequests')}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.arId')}</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.receivableAmount')}</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.coreEnterprise')}</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.status')}</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.operations')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { id: 'AR-0241', amount: 'HK$ 500K', enterprise: 'Core Enterprise A', status: 'pendingVerification', date: '2023-10-24' },
                    { id: 'AR-0240', amount: 'HK$ 1.2M', enterprise: 'Core Enterprise B', status: 'financing', date: '2023-10-23' },
                    { id: 'AR-0239', amount: 'HK$ 800K', enterprise: 'Core Enterprise A', status: 'pendingConfirmation', date: '2023-10-22' },
                    { id: 'AR-0238', amount: 'HK$ 350K', enterprise: 'Core Enterprise C', status: 'repaid', date: '2023-10-20' },
                    { id: 'AR-0237', amount: 'HK$ 2.1M', enterprise: 'Core Enterprise B', status: 'financing', date: '2023-10-18' },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-blue-600">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{item.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{t(`marketTrading.sampleIssuers.coreEnterprise${item.enterprise.split(' ')[2] || 'A'}`)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full w-fit ${item.status === 'pendingVerification' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'financing' ? 'bg-purple-100 text-purple-800' :
                              item.status === 'pendingConfirmation' ? 'bg-orange-100 text-orange-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                            {t(`dashboard.${item.status}`)}
                          </span>
                          {/* 节点验证进度条 (示例) */}
                          {item.id === 'AR-0241' && (
                            <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                              <span title="Bank Verification"><i className="fas fa-university text-green-500"></i> <i className="fas fa-check"></i></span>
                              <span title="Audit Verification"><i className="fas fa-file-contract text-yellow-500"></i> <i className="fas fa-hourglass-half"></i></span>
                              <span title="CIC Verification"><i className="fas fa-globe text-blue-500"></i> <i className="fas fa-hourglass-half"></i></span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => setSelectedAR(item)}
                        >
                          {t('dashboard.viewDetails')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 交易类型对比 */}

        {/* 底部图表区域 */}
        {/* 底部图表区域 */}
        {currentRole === '建筑公司' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 融资申请趋势 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('dashboard.financingTrend')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={Array.from({ length: 7 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() - (6 - i))
                    return {
                      date: date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }),
                      count: Math.floor(Math.random() * 5 + 1),
                      amount: Math.floor(Math.random() * 100 + 20),
                    }
                  })}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '14px' }} />
                  <YAxis yAxisId="left" stroke="#3b82f6" orientation="left" style={{ fontSize: '14px' }} />
                  <YAxis yAxisId="right" stroke="#10b981" orientation="right" style={{ fontSize: '14px' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                    itemStyle={{ fontSize: '14px' }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="count" name={t('common.quantity')} stroke="#3b82f6" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="amount" name={t('common.amount')} stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AR状态分布 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('dashboard.arStatusDistribution')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { nameKey: 'dashboard.pendingVerification', value: 5, color: '#f59e0b' },
                      { nameKey: 'dashboard.pendingConfirmation', value: 3, color: '#f97316' },
                      { nameKey: 'dashboard.financing', value: 15, color: '#8b5cf6' },
                      { nameKey: 'dashboard.repaid', value: 8, color: '#10b981' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nameKey, percent }) => `${t(nameKey)} ${(percent * 100).toFixed(0)}%`}
                    style={{ fontSize: '16px' }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { nameKey: 'dashboard.pendingVerification', value: 5, color: '#f59e0b' },
                      { nameKey: 'dashboard.pendingConfirmation', value: 3, color: '#f97316' },
                      { nameKey: 'dashboard.financing', value: 15, color: '#8b5cf6' },
                      { nameKey: 'dashboard.repaid', value: 8, color: '#10b981' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _name: string, props: any) => {
                      return [`${value}`, t(props.payload.nameKey)]
                    }}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : currentRole === '核心企业' ? (
          /* 核心企业：确权效率对比 */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.confirmationEfficiency')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={efficiencyData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" style={{ fontSize: '12px' }} width={150} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="value" name={t('dashboard.avgConfirmationTime')} radius={[0, 4, 4, 0]} barSize={20}>
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : currentRole === '银行' ? (
          /* 验证节点：底部区域 (节点在线状态 + 验证任务分布) */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Node Online Status (List) - 40% */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.nodeStatus')}</h3>
              <div className="space-y-4 flex-1">
                {[
                  { nameKey: 'dashboard.hsbc', status: 'online', color: 'bg-green-500' },
                  { nameKey: 'dashboard.kpmg', status: 'online', color: 'bg-green-500' },
                  { nameKey: 'dashboard.cic', status: 'online', color: 'bg-green-500' },
                  { nameKey: 'dashboard.currentNode', status: 'online', color: 'bg-green-500', bold: true },
                ].map((node, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 ${node.bold ? 'bg-blue-50 border-blue-100 ring-1 ring-blue-100' : ''} hover:bg-gray-100 transition-colors`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${node.bold ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-400'}`}>
                        <i className="fas fa-server"></i>
                      </div>
                      <span className={`text-base ${node.bold ? 'font-bold text-gray-800' : 'font-medium text-gray-700'}`}>{t(node.nameKey)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${node.color} animate-pulse shadow-sm shadow-green-200`}></span>
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">{t('dashboard.online')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Verification Distribution (Pie Chart) - 60% */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 w-full">{t('dashboard.verificationTaskDistribution')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={verificationDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {verificationDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _name: string, props: any) => {
                      return [`${value}%`, t(props.payload.nameKey)]
                    }}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend
                    formatter={(_value, entry: any) => t(entry.payload.nameKey)}
                    wrapperStyle={{ paddingTop: '20px' }}
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : isPlatformAdmin && (
          /* 平台管理员：节点任务处理量分布 */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{language === 'zh' ? '节点任务处理量（近7天）' : 'Node Task Processing Volume (Last 7 Days)'}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adminTaskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '14px' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" style={{ fontSize: '14px' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="completed" name={language === 'zh' ? '已完成' : 'Completed'} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="processing" name={language === 'zh' ? '处理中' : 'Processing'} fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* AR 详情弹窗 */}
      {
        selectedAR && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAR(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 弹窗头部 */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-gray-800">{t('dashboard.arId')}: {selectedAR.id}</h3>
                <button
                  onClick={() => setSelectedAR(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-2xl"></i>
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* 基本信息 - 网格布局 */}
                <div>
                  <h4 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('dashboard.basicInfo')}</h4>
                  <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">{t('dashboard.receivableAmount')}</span>
                      <span className="text-xl font-bold text-gray-900">{selectedAR.amount}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">{t('dashboard.coreEnterprise')}</span>
                      <span className="text-base font-medium text-gray-900">{t(`marketTrading.sampleIssuers.coreEnterprise${selectedAR.enterprise.split(' ')[2] || 'A'}`)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">{t('dashboard.status')}</span>
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full w-fit ${selectedAR.status === 'pendingVerification' ? 'bg-yellow-100 text-yellow-800' :
                        selectedAR.status === 'financing' ? 'bg-purple-100 text-purple-800' :
                          selectedAR.status === 'pendingConfirmation' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                        {t(`dashboard.${selectedAR.status}`)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">{t('dashboard.uploadDate')}</span>
                      <span className="text-base text-gray-900">{selectedAR.date}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">{t('dashboard.expectedPaymentDate')}</span>
                      <span className="text-base text-gray-900">2024-01-20</span>
                    </div>
                  </div>
                </div>

                {/* 验证节点签名状态 */}
                <div>
                  <h4 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('dashboard.validatorStatus')}</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <i className="fas fa-university text-lg"></i>
                        </div>
                        <span className="text-base font-medium text-gray-700">{t('dashboard.bank')} - HSBC</span>
                      </div>
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded">{t('dashboard.completed')}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                          <i className="fas fa-file-contract text-lg"></i>
                        </div>
                        <span className="text-base font-medium text-gray-700">{t('dashboard.audit')} - PwC</span>
                      </div>
                      <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded">{t('dashboard.inProgress')}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                          <i className="fas fa-globe text-lg"></i>
                        </div>
                        <span className="text-base font-medium text-gray-700">{t('dashboard.cic')}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded">{t('dashboard.notStarted')}</span>
                    </div>
                  </div>
                </div>

                {/* 相关文件 */}
                <div>
                  <h4 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('dashboard.relatedDocuments')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[t('dashboard.contract'), t('dashboard.invoice'), t('dashboard.acceptanceNote')].map((doc, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors group">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <i className="fas fa-file-pdf text-4xl text-red-500 group-hover:scale-110 transition-transform"></i>
                          <span className="text-sm font-medium text-gray-700 truncate w-full">{doc}.pdf</span>
                          <div className="flex space-x-3 w-full justify-center">
                            <button className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded flex-1">{t('dashboard.preview')}</button>
                            <button className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded"><i className="fas fa-download"></i></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 融资记录 (可选) */}
                {selectedAR.status === 'financing' && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('dashboard.financingHistory')}</h4>
                    <div className="bg-gray-50 p-4 rounded-lg text-base text-gray-600 flex justify-between">
                      <span>{t('dashboard.financingDate')}: 2023-11-01</span>
                      <span>{t('dashboard.financedAmount')}: HK$ 400K</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部按钮 */}
              <div className="p-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedAR(null)}
                  className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors text-base"
                >
                  {language === 'zh' ? '关闭' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}

export default DashboardPage
