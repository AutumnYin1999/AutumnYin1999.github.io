import { FilterState } from '../../pages/NodeManagement'
import { useLanguage } from '../../hooks/useLanguage'

interface TokenFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

function TokenFilters({ filters, onFiltersChange }: TokenFiltersProps) {
  const { language } = useLanguage()

  const handleReset = () => {
    onFiltersChange({
      ...filters,
      nodeType: 'all',
      nodeStatus: 'all',
      searchQuery: '',
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          <i className="fas fa-filter mr-2 text-blue-600"></i>
          {language === 'zh' ? '筛选条件' : 'Filter Conditions'}
        </h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <i className="fas fa-redo mr-1"></i>
          {language === 'zh' ? '重置' : 'Reset'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 节点类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'zh' ? '节点类型' : 'Node Type'}
          </label>
          <div className="flex flex-wrap gap-2">
            {['all', 'bank', 'audit', 'cic'].map(type => {
              const typeLabels: Record<string, string> = {
                all: language === 'zh' ? '全部' : 'All',
                bank: language === 'zh' ? '银行' : 'Bank',
                audit: language === 'zh' ? '审计' : 'Audit',
                cic: language === 'zh' ? 'CIC' : 'CIC',
              }
              const isSelected = (filters.nodeType || 'all') === type
              return (
                <button
                  key={type}
                  onClick={() => onFiltersChange({ ...filters, nodeType: type })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${isSelected
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {typeLabels[type]}
                </button>
              )
            })}
          </div>
        </div>

        {/* 节点状态 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'zh' ? '节点状态' : 'Node Status'}
          </label>
          <select
            value={filters.nodeStatus || 'all'}
            onChange={(e) => onFiltersChange({ ...filters, nodeStatus: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{language === 'zh' ? '全部' : 'All'}</option>
            <option value="online">{language === 'zh' ? '在线' : 'Online'}</option>
            <option value="offline">{language === 'zh' ? '离线' : 'Offline'}</option>
            <option value="maintenance">{language === 'zh' ? '维护中' : 'Under Maintenance'}</option>
          </select>
        </div>

        {/* 搜索框 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'zh' ? '搜索' : 'Search'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.searchQuery || ''}
              onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
              placeholder={language === 'zh' ? '按节点名称或地址搜索' : 'Search by node name or address'}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenFilters
