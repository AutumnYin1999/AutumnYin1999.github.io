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

  const handleTokenTypeToggle = (type: string) => {
    const newTypes = filters.tokenTypes.includes(type)
      ? filters.tokenTypes.filter(val => val !== type)
      : [...filters.tokenTypes, type]
    onFiltersChange({ ...filters, tokenTypes: newTypes })
  }

  const handleTaskTypeToggle = (type: string) => {
    const currentTypes = filters.taskTypes || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(val => val !== type)
      : [...currentTypes, type]
    onFiltersChange({ ...filters, taskTypes: newTypes })
  }

  const handleReset = () => {
    onFiltersChange({
      tokenTypes: ['receivable', 'abs'],
      riskLevel: 'all',
      issuer: 'all',
      priceRange: [0, 10000000],
      yieldRangeMin: '',
      yieldRangeMax: '',
      dueDateStart: '',
      dueDateEnd: '',
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
        {/* 资产类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'zh' ? '资产类型' : 'Asset Type'}
          </label>
          <div className="flex space-x-3 mt-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tokenTypes.includes('receivable')}
                onChange={() => handleTokenTypeToggle('receivable')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">AR</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tokenTypes.includes('abs')}
                onChange={() => handleTokenTypeToggle('abs')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">ABS</span>
            </label>
          </div>
        </div>

        {/* 风险评级 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('marketTrading.riskLevel')}
          </label>
          <div className="flex space-x-2">
            {['all', 'A', 'B', 'C'].map(rating => (
              <button
                key={rating}
                onClick={() => onFiltersChange({ ...filters, riskLevel: rating })}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${filters.riskLevel === rating
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {rating === 'all' ? t('marketTrading.all') : rating}
              </button>
            ))}
          </div>
        </div>

        {/* 收益率范围 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'zh' ? '收益率范围 (%)' : 'Yield Range (%)'}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={filters.yieldRangeMin || ''}
              onChange={(e) => onFiltersChange({ ...filters, yieldRangeMin: e.target.value })}
              placeholder="Min"
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={filters.yieldRangeMax || ''}
              onChange={(e) => onFiltersChange({ ...filters, yieldRangeMax: e.target.value })}
              placeholder="Max"
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 到期日范围 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'zh' ? '到期日范围' : 'Due Date Range'}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={filters.dueDateStart || ''}
              onChange={(e) => onFiltersChange({ ...filters, dueDateStart: e.target.value })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={filters.dueDateEnd || ''}
              onChange={(e) => onFiltersChange({ ...filters, dueDateEnd: e.target.value })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 核心企业 */}
        <div className="lg:col-start-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'zh' ? '核心企业' : 'Core Enterprise'}
          </label>
          <select
            value={filters.issuer}
            onChange={(e) => onFiltersChange({ ...filters, issuer: e.target.value })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t('marketTrading.all')}</option>
            {issuers.map(issuer => (
              <option key={issuer} value={issuer}>{issuer}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default TokenFilters
