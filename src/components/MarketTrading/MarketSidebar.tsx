import { Token } from '../../pages/MarketTrading'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts'
import { useLanguage } from '../../hooks/useLanguage'
import { useRole } from '../../hooks/useRole'

interface MarketSidebarProps {
  watchlist: string[]
  tokens: Token[]
  recentTransactions: any[]
  onRemoveFromWatchlist: (tokenId: string) => void
}

function MarketSidebar({ watchlist, tokens, recentTransactions, onRemoveFromWatchlist }: MarketSidebarProps) {
  const { t, language } = useLanguage()
  const { currentRole } = useRole()
  // 获取观察列表中的代币
  const watchedTokens = tokens.filter(token => watchlist.includes(token.id))

  // 模拟市场趋势数据 (Generic)
  const trendData = [
    { day: t('marketTrading.monday'), price: 45000 },
    { day: t('marketTrading.tuesday'), price: 45200 },
    { day: t('marketTrading.wednesday'), price: 44800 },
    { day: t('marketTrading.thursday'), price: 45500 },
    { day: t('marketTrading.friday'), price: 46000 },
    { day: t('marketTrading.saturday'), price: 45800 },
    { day: t('marketTrading.sunday'), price: 46200 },
  ]

  // Validator Data
  const taskDistributionData = [
    { name: 'KYC', value: 35, color: '#3b82f6' }, // Blue
    { name: 'AR', value: 45, color: '#22c55e' }, // Green
    { name: 'Compliance', value: 20, color: '#a855f7' }, // Purple
  ]

  const taskTrendData = [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 18 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 25 },
    { day: 'Fri', count: 22 },
    { day: 'Sat', count: 10 },
    { day: 'Sun', count: 8 },
  ]

  if (currentRole === '银行') {
    return (
      <div className="space-y-6">
        {/* Task Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <i className="fas fa-chart-pie mr-2 text-blue-600"></i>
              {t('marketTrading.taskDistribution')}
            </h3>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Task Trend */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <i className="fas fa-chart-line mr-2 text-green-600"></i>
              {t('marketTrading.taskTrend7Days')}
            </h3>
          </div>
          <div className="p-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskTrendData}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentRole === 'NBFI') {
    const topYields = [...tokens]
      .filter(t => t.type === 'receivable' && t.annualYield !== undefined)
      .sort((a, b) => (b.annualYield || 0) - (a.annualYield || 0))
      .slice(0, 3)

    const hotAssets = [...tokens]
      .filter(t => t.type === 'receivable')
      .sort((a, b) => b.faceValue - a.faceValue)
      .slice(0, 2)

    const nbfiTransactions = [
      { tokenId: 'AR-2025-001', time: '10 mins ago', amount: '500,000' },
      { tokenId: 'AR-2025-005', time: '1 hour ago', amount: '1,200,000' },
      { tokenId: 'AR-2025-002', time: '2 hours ago', amount: '800,000' },
    ]

    return (
      <div className="space-y-6">
        {/* 热门资产推荐 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <i className="fas fa-fire mr-2 text-red-500"></i>
              {language === 'zh' ? '热门资产推荐' : 'Hot Assets'}
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {hotAssets.map((token) => (
              <div key={`hot-${token.id}`} className="bg-red-50/50 rounded-lg p-3 border border-red-100/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800 text-sm">{token.id}</span>
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full"><i className="fas fa-arrow-trend-up mr-1"></i> Hot</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">{language === 'zh' ? '面值' : 'Face Value'}:</span>
                  <span className="font-medium text-gray-700">HK$ {token.faceValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">{language === 'zh' ? '年化收益' : 'Yield'}:</span>
                  <span className="font-medium text-green-600">{token.annualYield}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 收益率排行榜 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <i className="fas fa-trophy mr-2 text-yellow-500"></i>
              {language === 'zh' ? '收益率排行榜' : 'Top Yield Leaderboard'}
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {topYields.map((token, index) => (
                <div key={`yield-${token.id}`} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${index === 0 ? 'bg-yellow-100 text-yellow-600' : index === 1 ? 'bg-gray-200 text-gray-600' : 'bg-orange-100 text-orange-600'}`}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{token.id}</span>
                  </div>
                  <span className="text-green-600 font-bold text-sm">{token.annualYield}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 最近成交记录 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <i className="fas fa-exchange-alt mr-2 text-blue-500"></i>
              {language === 'zh' ? '资本方实时成交' : 'Live Transactions'}
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {nbfiTransactions.map((tx, idx) => (
              <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div>
                  <div className="text-sm font-medium text-gray-800">{tx.tokenId}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{tx.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-0.5">{language === 'zh' ? '成交量' : 'Vol'}</div>
                  <div className="text-sm font-semibold text-gray-700">HK$ {tx.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 我的观察列表 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <i className="fas fa-star mr-2 text-yellow-500"></i>
            {t('marketTrading.myWatchlist')}
          </h3>
        </div>
        <div className="p-4 max-h-64 overflow-y-auto">
          {watchedTokens.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              <i className="fas fa-star text-2xl text-gray-300 mb-2"></i>
              <p>{t('marketTrading.noWatchedTokens')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('marketTrading.clickStarToAdd')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {watchedTokens.map(token => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{token.id}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${token.type === 'receivable'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                        }`}>
                        {token.type === 'receivable' ? 'AR' : 'INV'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      HK$
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFromWatchlist(token.id)}
                    className="text-yellow-500 hover:text-yellow-600 transition-colors"
                    title={t('marketTrading.remove')}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 最近交易 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <i className="fas fa-history mr-2 text-blue-600"></i>
            {t('marketTrading.recentTransactions')}
          </h3>
        </div>
        <div className="p-4 max-h-64 overflow-y-auto">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              <i className="fas fa-exchange-alt text-2xl text-gray-300 mb-2"></i>
              <p>{t('marketTrading.noTransactionRecords')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">{tx.tokenId}</span>
                    <span className="text-xs text-gray-500">{tx.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{t('marketTrading.quantity')}: {tx.quantity}</span>
                    <span className="text-gray-800 font-medium">
                      {tx.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} HK$
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 市场趋势 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <i className="fas fa-chart-line mr-2 text-green-600"></i>
            {t('marketTrading.marketTrend')}
          </h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={trendData}>
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                style={{ fontSize: '10px' }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '10px' }}
                domain={['dataMin - 500', 'dataMax + 500']}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`$HK$ `, t('marketTrading.price')]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default MarketSidebar
