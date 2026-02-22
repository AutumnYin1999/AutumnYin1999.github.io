import { useLanguage } from '../../hooks/useLanguage'
import { useRole } from '../../hooks/useRole'

function MarketOverview() {
  const { t, language } = useLanguage()

  const { currentRole } = useRole()

  if (currentRole === 'NBFI') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 可投资 AR 总额 */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base text-gray-600">{t('marketTrading.totalInvestableAR')}</span>
            <i className="fas fa-wallet text-blue-600"></i>
          </div>
          <div className="text-3xl font-bold text-gray-800">18.5M</div>
          <div className="text-base text-gray-500 mt-1">HK$</div>
        </div>

        {/* ABS 产品数量 */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base text-gray-600">{t('marketTrading.absProducts')}</span>
            <i className="fas fa-cubes text-purple-600"></i>
          </div>
          <div className="text-3xl font-bold text-gray-800">5</div>
          <div className="text-base text-gray-500 mt-1">{t('marketTrading.activeTokenCount') ? t('marketTrading.activeTokenCount').replace('Active Token Count', 'Products').replace('活跃代币数量', '个') : '个'}</div>
        </div>

        {/* 平均收益率 */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base text-gray-600">{t('marketTrading.averageYield')}</span>
            <i className="fas fa-percentage text-green-600"></i>
          </div>
          <div className="text-3xl font-bold text-gray-800">6.8%</div>
          <div className="text-base text-gray-500 mt-1">{language === 'zh' ? '年化收益率' : 'Annualized Yield'}</div>
        </div>

        {/* 今日新增资产 */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base text-gray-600">{t('marketTrading.newAssetsToday')}</span>
            <i className="fas fa-plus-circle text-orange-600"></i>
          </div>
          <div className="text-3xl font-bold text-gray-800">2.3M</div>
          <div className="text-base text-gray-500 mt-1">HK$ (8 {t('dashboard.activeInvestments').replace('Active Investments', 'pieces').replace('活跃投资', '笔')})</div>
        </div>

        {/* 最低折扣 */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base text-gray-600">{t('marketTrading.lowestDiscount')}</span>
            <i className="fas fa-tags text-red-600"></i>
          </div>
          <div className="text-3xl font-bold text-green-600">-1.2%</div>
          <div className="text-base text-gray-500 mt-1">{language === 'zh' ? '相对面值' : 'Relative to face value'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 市场总交易量 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{t('marketTrading.marketTotalVolume')}</span>
          <i className="fas fa-chart-line text-blue-600"></i>
        </div>
        <div className="text-2xl font-bold text-gray-800">1,245,800</div>
        <div className="text-sm text-gray-500 mt-1">HK$</div>
      </div>

      {/* 活跃代币数量 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{t('marketTrading.activeTokenCount')}</span>
          <i className="fas fa-coins text-green-600"></i>
        </div>
        <div className="text-2xl font-bold text-gray-800">89</div>
        <div className="text-sm text-gray-500 mt-1">{t('marketTrading.tokens')}</div>
      </div>

      {/* 今日交易笔数 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{t('marketTrading.todayTransactionCount')}</span>
          <i className="fas fa-exchange-alt text-purple-600"></i>
        </div>
        <div className="text-2xl font-bold text-gray-800">24</div>
        <div className="text-sm text-gray-500 mt-1">{t('marketTrading.transactions')}</div>
      </div>

      {/* 平台总佣金 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{t('marketTrading.platformTotalCommission')}</span>
          <i className="fas fa-dollar-sign text-yellow-600"></i>
        </div>
        <div className="text-2xl font-bold text-gray-800">62,290</div>
        <div className="text-sm text-gray-500 mt-1">HK$ {t('marketTrading.today')}</div>
      </div>

      {/* 24小时市场变化 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{t('marketTrading.marketChange24h')}</span>
          <i className="fas fa-arrow-up text-green-500"></i>
        </div>
        <div className="text-2xl font-bold text-green-600">+2.4%</div>
        <div className="text-sm text-gray-500 mt-1">{t('marketTrading.comparedToYesterday')}</div>
      </div>
    </div>
  )
}

export default MarketOverview
