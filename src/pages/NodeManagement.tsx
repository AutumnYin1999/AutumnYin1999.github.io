import { useState, useMemo } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import MarketOverview from '../components/NodeManagement/MarketOverview'
import TokenFilters from '../components/NodeManagement/TokenFilters'
import NodeCard from '../components/NodeManagement/TokenCard'
import PendingApplicationsSidebar from '../components/NodeManagement/PendingApplicationsSidebar'



export interface FilterState {
  tokenTypes: string[]
  riskLevel: string
  issuer: string
  priceRange: [number, number]
  yieldRangeMin?: string
  yieldRangeMax?: string
  dueDateStart?: string
  dueDateEnd?: string
  dueTime?: string
  inventoryType?: string
  // 银行专用筛选
  yieldRange?: [number, number]
  remainingDays?: string
  creditRating?: string
  taskTypes?: string[]
  taskStatus?: string
  nodeType?: string
  nodeStatus?: string
  searchQuery?: string
}

function NodeManagementPage() {
  const { language } = useLanguage()
  const [filters, setFilters] = useState<FilterState>({
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
    yieldRange: undefined,
    remainingDays: undefined,
    creditRating: undefined,
    taskTypes: [],
    taskStatus: 'all',
    nodeType: 'all',
    nodeStatus: 'all',
    searchQuery: '',
  })


  const tokens: any[] = useMemo(() => [
    {
      id: 'node-1',
      type: 'bank',
      name: language === 'zh' ? '汇丰银行' : 'HSBC',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      status: 'online',
      joinDate: '2025-01-15',
      cumulativeRevenue: 1240000,
      monthlyTasks: 245,
    },
    {
      id: 'node-2',
      type: 'audit',
      name: language === 'zh' ? '普华永道' : 'PwC',
      address: '0x883b25Cc6634C0532925a3b844Bc454e4438fa1b',
      status: 'online',
      joinDate: '2025-01-20',
      cumulativeRevenue: 850000,
      monthlyTasks: 180,
    },
    {
      id: 'node-3',
      type: 'cic',
      name: language === 'zh' ? '建造业议会' : 'CIC',
      address: '0x992c35Cc6634C0532925a3b844Bc454e4438f22c',
      status: 'maintenance',
      joinDate: '2025-02-01',
      cumulativeRevenue: 420000,
      monthlyTasks: 95,
    },
    {
      id: 'node-4',
      type: 'bank',
      name: language === 'zh' ? '渣打银行' : 'Standard Chartered',
      address: '0x114d35Cc6634C0532925a3b844Bc454e4438f88d',
      status: 'offline',
      joinDate: '2025-02-10',
      cumulativeRevenue: 310000,
      monthlyTasks: 62,
    },
  ], [language])

  const filteredTokens = useMemo(() => {
    let result = tokens.filter(node => {
      // 节点类型筛选
      if (filters.nodeType && filters.nodeType !== 'all') {
        if (node.type !== filters.nodeType) return false
      }

      // 节点状态筛选
      if (filters.nodeStatus && filters.nodeStatus !== 'all') {
        if (node.status !== filters.nodeStatus) return false
      }

      // 搜索框搜索
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        if (
          !node.name.toLowerCase().includes(query) &&
          !node.address.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      return true
    })

    // Sorting logic (if needed, add here)
    // For now, let's assume no sorting is applied or it's handled elsewhere
    // if (sortOption === 'yield') {
    //   result.sort((a, b) => (b.annualYield || 0) - (a.annualYield || 0));
    // } else if (sortOption === 'daysRemaining') {
    //   result.sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0));
    // } else if (sortOption === 'discount') {
    //   result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    // } else if (sortOption === 'price') {
    //   result.sort((a, b) => a.currentPrice - b.currentPrice);
    // }

    return result
  }, [filters, tokens])



  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">

      {/* 市场概览 */}
      <MarketOverview />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* 左侧：筛选和代币列表 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 筛选区 */}
          <TokenFilters filters={filters} onFiltersChange={setFilters} />

          {/* 代币列表 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {language === 'zh' ? '验证节点列表' : 'Validator Nodes'} ({filteredTokens.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTokens.map((token: any) => (
                <div key={token.id}>
                  <NodeCard
                    node={token}
                    onViewDetails={() => console.log('view', token.id)}
                    onEdit={() => console.log('edit', token.id)}
                    onRemove={() => console.log('remove', token.id)}
                  />
                </div>
              ))}
            </div>

            {/* 这里是分页 */}
            {filteredTokens.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="px-4 py-2 border border-blue-600 bg-blue-50 text-blue-600 font-medium rounded-md">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium rounded-md">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium rounded-md">
                    3
                  </button>
                  <span className="text-gray-500 px-2">...</span>
                  <button className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium rounded-md">
                    12
                  </button>
                  <button className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            )}

            {filteredTokens.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-600">没有找到匹配的代币</p>
                <p className="text-sm text-gray-500 mt-2">请尝试调整筛选条件</p>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：待审核节点申请面板 */}
        <div className="lg:col-span-1">
          <PendingApplicationsSidebar />
        </div>
      </div>
    </div>
  )
}

export default NodeManagementPage
