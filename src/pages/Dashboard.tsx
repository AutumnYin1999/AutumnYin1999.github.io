import { useMemo, useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { useRole } from '../hooks/useRole'
import { useLanguage } from '../hooks/useLanguage'

function DashboardPage() {
  const { currentRole } = useRole()
  const { t, language } = useLanguage()
  const [selectedAR, setSelectedAR] = useState<any>(null)



  // 根据角色显示不同的KPI数据
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
      // 核心企业：显示已发行的应收账款（负债）和融资成本
      return [
        { nameKey: 'dashboard.issuedReceivables', value: '1,600.0K', change: '+150.0K', icon: 'fa-file-invoice', bgColor: '#fee2e2', iconColor: '#dc2626' },
        { nameKey: 'dashboard.fundingCost', value: '6.5%', change: '-0.2%', icon: 'fa-percent', bgColor: '#fef3c7', iconColor: '#f59e0b' },
        { nameKey: 'dashboard.totalLiabilities', value: '1,600.0K', change: '+150.0K', icon: 'fa-balance-scale', bgColor: '#fee2e2', iconColor: '#dc2626' },
        { nameKey: 'dashboard.activeIssuances', value: '5', change: '+1', icon: 'fa-coins', bgColor: '#e9d5ff', iconColor: '#8b5cf6' },
        { nameKey: 'dashboard.avgMaturity', value: '45天', change: '-2天', icon: 'fa-calendar-alt', bgColor: '#dbeafe', iconColor: '#2563eb' },
        { nameKey: 'dashboard.costAnalysis', value: '良好', change: '稳定', icon: 'fa-chart-pie', bgColor: '#d1fae5', iconColor: '#10b981' },
      ]
    } else {
      // 其他角色：显示通用KPI
      return [
        { nameKey: 'dashboard.totalAssets', value: '1,245.8M', change: '+3.2%', icon: 'fa-wallet', bgColor: '#dbeafe', iconColor: '#2563eb' },
        { nameKey: 'dashboard.dailyVolume', value: '325.0M', change: '+5.2%', icon: 'fa-exchange-alt', bgColor: '#d1fae5', iconColor: '#10b981' },
        { nameKey: 'dashboard.platformRevenue', value: '162.5K', change: '+3.8%', icon: 'fa-dollar-sign', bgColor: '#fef3c7', iconColor: '#f59e0b' },
        { nameKey: 'dashboard.activeAssets', value: '89', change: '+1.1%', icon: 'fa-coins', bgColor: '#e9d5ff', iconColor: '#8b5cf6' },
        { nameKey: 'dashboard.userActivity', value: '1,250', change: '-0.5%', icon: 'fa-users', bgColor: '#fce7f3', iconColor: '#ec4899' },
        { nameKey: 'dashboard.avgFundingCost', value: '6.5%', change: '-0.2%', icon: 'fa-percent', bgColor: '#e0e7ff', iconColor: '#6366f1' },
      ]
    }
  }, [currentRole])

  // 交易趋势数据 - 使用翻译键作为 dataKey
  const transactionData = useMemo(() => {
    const locale = language === 'zh' ? 'zh-CN' : 'en-US'
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
        buy: Math.floor(Math.random() * 100 + 50),
        sell: Math.floor(Math.random() * 80 + 30),
        lend: Math.floor(Math.random() * 60 + 20),
        bridge: Math.floor(Math.random() * 40 + 10),
      }
    })
  }, [language])

  // 根据角色显示不同的资产分布数据
  const assetDistribution = useMemo(() => {
    if (currentRole === '建筑公司') {
      // 建筑公司：应收账款和库存资产
      return [
        { nameKey: 'dashboard.receivable', value: 65, color: '#3b82f6' },
        { nameKey: 'dashboard.inventory', value: 35, color: '#10b981' },
      ]
    } else if (currentRole === '核心企业') {
      // 核心企业：已发行的应收账款（负债）
      return [
        { nameKey: 'dashboard.issuedReceivables', value: 100, color: '#dc2626' },
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
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${currentRole === '建筑公司' ? 'xl:grid-cols-4' : 'xl:grid-cols-6'} gap-4 mb-6`}>
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
                  className={`text-sm font-medium ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</div>
              <div className="text-sm text-gray-600">{t(kpi.nameKey)}</div>
            </div>
          ))}
        </div>



        {/* 待处理事项 - 仅建筑公司可见 */}
        {currentRole === '建筑公司' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.pendingItems')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 bg-white p-2 rounded-full shadow-sm">
                  <i className="fas fa-clipboard-check text-xl"></i>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t('dashboard.pendingVerification')}</div>
                  <div className="text-xl font-bold text-gray-800">5 <span className="text-xs font-normal text-gray-500">{t('common.items')}</span></div>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                <div className="text-orange-600 bg-white p-2 rounded-full shadow-sm">
                  <i className="fas fa-file-signature text-xl"></i>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t('dashboard.pendingConfirmation')}</div>
                  <div className="text-xl font-bold text-gray-800">3 <span className="text-xs font-normal text-gray-500">{t('common.items')}</span></div>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="text-purple-600 bg-white p-2 rounded-full shadow-sm">
                  <i className="fas fa-coins text-xl"></i>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t('dashboard.financing')}</div>
                  <div className="text-xl font-bold text-gray-800">15 <span className="text-xs font-normal text-gray-500">{t('common.items')}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 图表区域 */}
        {/* 图表区域 - 仅非建筑公司可见 */}
        {currentRole !== '建筑公司' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 交易趋势图 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.transactionTrend')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend
                    formatter={(value) => {
                      const legendMap: Record<string, string> = {
                        buy: t('dashboard.buy'),
                        sell: t('dashboard.sell'),
                        lend: t('dashboard.lend'),
                        bridge: t('dashboard.bridge'),
                      }
                      return legendMap[value] || value
                    }}
                  />
                  <Line type="monotone" dataKey="buy" name="buy" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="sell" name="sell" stroke="#f97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="lend" name="lend" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="bridge" name="bridge" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 资产分布图 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.assetDistribution')}</h3>
              <ResponsiveContainer width="100%" height={300}>
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
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}



        {/* 最近提交的应收账款列表 - 仅建筑公司可见 */}
        {currentRole === '建筑公司' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.recentARRequests')}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.arId')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.receivableAmount')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.coreEnterprise')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.operations')}</th>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t(`marketTrading.sampleIssuers.coreEnterprise${item.enterprise.split(' ')[2] || 'A'}`)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${item.status === 'pendingVerification' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'financing' ? 'bg-purple-100 text-purple-800' :
                              item.status === 'pendingConfirmation' ? 'bg-orange-100 text-orange-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                            {t(`dashboard.${item.status}`)}
                          </span>
                          {/* 节点验证进度条 (示例) */}
                          {item.id === 'AR-0241' && (
                            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                              <span title="Bank Verification"><i className="fas fa-university text-green-500"></i> <i className="fas fa-check"></i></span>
                              <span title="Audit Verification"><i className="fas fa-file-contract text-yellow-500"></i> <i className="fas fa-hourglass-half"></i></span>
                              <span title="CIC Verification"><i className="fas fa-globe text-blue-500"></i> <i className="fas fa-hourglass-half"></i></span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
        {currentRole === '建筑公司' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 融资申请趋势 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.financingTrend')}</h3>
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
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis yAxisId="left" stroke="#3b82f6" orientation="left" style={{ fontSize: '12px' }} />
                  <YAxis yAxisId="right" stroke="#10b981" orientation="right" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="count" name={t('common.quantity')} stroke="#3b82f6" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="amount" name={t('common.amount')} stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AR状态分布 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.arStatusDistribution')}</h3>
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
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.transactionComparison')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  formatter={(value) => {
                    const legendMap: Record<string, string> = {
                      buy: t('dashboard.buy'),
                      sell: t('dashboard.sell'),
                      lend: t('dashboard.lend'),
                      bridge: t('dashboard.bridge'),
                    }
                    return legendMap[value] || value
                  }}
                />
                <Bar dataKey="buy" name="buy" fill="#3b82f6" />
                <Bar dataKey="sell" name="sell" fill="#f97316" />
                <Bar dataKey="lend" name="lend" fill="#8b5cf6" />
                <Bar dataKey="bridge" name="bridge" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* AR 详情弹窗 */}
      {selectedAR && (
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
      )}
    </div>
  )
}

export default DashboardPage
