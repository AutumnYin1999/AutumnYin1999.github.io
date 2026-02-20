import { FilterState } from '../../pages/MarketTrading'
import { useLanguage } from '../../hooks/useLanguage'
import { useRole } from '../../hooks/useRole'

interface TokenFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

function TokenFilters({ filters, onFiltersChange }: TokenFiltersProps) {
  const { t, language } = useLanguage()
  const { currentRole } = useRole()
  const isBank = currentRole === '银行'
  const issuers = [
    t('marketTrading.sampleIssuers.coreEnterpriseA'),
    t('marketTrading.sampleIssuers.coreEnterpriseB'),
    t('marketTrading.sampleIssuers.coreEnterpriseC'),
    t('marketTrading.sampleIssuers.constructionCompanyX'),
    t('marketTrading.sampleIssuers.constructionCompanyY'),
    t('marketTrading.sampleIssuers.constructionCompanyZ'),
  ]

  const handleTokenTypeToggle = (type: 'receivable' | 'inventory') => {
    const newTypes = filters.tokenTypes.includes(type)
      ? filters.tokenTypes.filter(t => t !== type)
      : [...filters.tokenTypes, type]
    onFiltersChange({ ...filters, tokenTypes: newTypes })
  }

  const handleTaskTypeToggle = (type: string) => {
    const currentTypes = filters.taskTypes || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    onFiltersChange({ ...filters, taskTypes: newTypes })
  }

  const handleReset = () => {
    onFiltersChange({
      tokenTypes: [],
      riskLevel: 'all',
      issuer: 'all',
      priceRange: [0, 1000000],
      dueTime: undefined,
      inventoryType: undefined,
      // yieldRange removed
      remainingDays: undefined,
      creditRating: undefined,
      taskTypes: [],
      taskStatus: 'all',
    })
  }

  if (isBank) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            <i className="fas fa-filter mr-2 text-blue-600"></i>
            {t('marketTrading.filterConditions')}
          </h3>
          <button
            onClick={handleReset}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="fas fa-redo mr-1"></i>
            {t('marketTrading.reset')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Task Type (Tags) */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('marketTrading.taskType')}
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'kyc', labelKey: 'marketTrading.pendingKYC' },
                { id: 'ar', labelKey: 'marketTrading.pendingAR' },
                { id: 'compliance', labelKey: 'marketTrading.pendingCompliance' },
              ].map(type => {
                const isSelected = filters.taskTypes?.includes(type.id)
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTaskTypeToggle(type.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isSelected
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {t(type.labelKey).replace('Pending ', '').replace('待 ', '').replace('审核', '').replace('验证', '').replace('查询', '')}
                    {/* Basic cleanup or rely on t() returning full string. User requested: KYC | AR 验证 | 合规查询 */}
                    {/* Let's use direct labels or existing keys. existing keys have "Pending". User wants "KYC", "AR Verification". */}
                    {/* Reuse keys but maybe strip "Pending"? Or adds new keys? User said: "KYC | AR Verification | Compliance Check". */}
                    {/* I'll use hardcoded for now or reuse keys. I reused keys. */}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status (Select) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('marketTrading.taskStatus')}
            </label>
            <select
              value={filters.taskStatus || 'all'}
              onChange={(e) => onFiltersChange({ ...filters, taskStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t('marketTrading.all')}</option>
              <option value="pending">{t('marketTrading.pending')}</option>
              <option value="inProgress">{t('marketTrading.inProgress')}</option>
              <option value="urgent">{t('marketTrading.urgent')}</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          <i className="fas fa-filter mr-2 text-blue-600"></i>
          {t('marketTrading.filterConditions')}
        </h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <i className="fas fa-redo mr-1"></i>
          {t('marketTrading.reset')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 代币类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('marketTrading.tokenType')}
          </label>
          <div className="flex space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tokenTypes.includes('receivable')}
                onChange={() => handleTokenTypeToggle('receivable')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{t('marketTrading.receivable')}</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tokenTypes.includes('inventory')}
                onChange={() => handleTokenTypeToggle('inventory')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{t('marketTrading.inventory')}</span>
            </label>
          </div>
        </div>

        {/* 风险等级 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('marketTrading.riskLevel')}
          </label>
          <select
            value={filters.riskLevel}
            onChange={(e) => onFiltersChange({ ...filters, riskLevel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t('marketTrading.all')}</option>
            <option value="low">{t('marketTrading.lowRisk')}</option>
            <option value="medium">{t('marketTrading.mediumRisk')}</option>
            <option value="high">{t('marketTrading.highRisk')}</option>
          </select>
        </div>

        {/* 发行方 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('marketTrading.issuer')}
          </label>
          <select
            value={filters.issuer}
            onChange={(e) => onFiltersChange({ ...filters, issuer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t('marketTrading.all')}</option>
            {issuers.map(issuer => (
              <option key={issuer} value={issuer}>{issuer}</option>
            ))}
          </select>
        </div>

        {/* 价格范围 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('marketTrading.priceRange')}: {filters.priceRange[0].toLocaleString()} - HK$
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={filters.priceRange[0]}
              onChange={(e) => onFiltersChange({
                ...filters,
                priceRange: [parseInt(e.target.value), filters.priceRange[1]]
              })}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={filters.priceRange[1]}
              onChange={(e) => onFiltersChange({
                ...filters,
                priceRange: [filters.priceRange[0], parseInt(e.target.value)]
              })}
              className="flex-1"
            />
          </div>
        </div>

        {/* 到期时间（仅应收账款） */}
        {filters.tokenTypes.includes('receivable') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('marketTrading.dueTime')}
            </label>
            <select
              value={filters.dueTime || 'all'}
              onChange={(e) => onFiltersChange({
                ...filters,
                dueTime: e.target.value === 'all' ? undefined : e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t('marketTrading.all')}</option>
              <option value="30">30 {t('marketTrading.withinDays')}</option>
              <option value="90">90 {t('marketTrading.withinDays')}</option>
              <option value="180">180 {t('marketTrading.withinDays')}</option>
            </select>
          </div>
        )}

        {/* 库存类型（仅库存） */}
        {filters.tokenTypes.includes('inventory') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('marketTrading.inventoryType')}
            </label>
            <select
              value={filters.inventoryType || 'all'}
              onChange={(e) => onFiltersChange({
                ...filters,
                inventoryType: e.target.value === 'all' ? undefined : e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t('marketTrading.all')}</option>
              <option value="raw">{t('assetIssuance.rawMaterial')}</option>
              <option value="wip">{t('assetIssuance.workInProgress')}</option>
              <option value="finished">{t('assetIssuance.finishedProduct')}</option>
            </select>
          </div>
        )}


      </div>
    </div>
  )
}

export default TokenFilters
