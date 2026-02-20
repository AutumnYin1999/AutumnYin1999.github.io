import { useState, useMemo } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useRole } from '../hooks/useRole'
import MarketOverview from '../components/MarketTrading/MarketOverview'
import TokenFilters from '../components/MarketTrading/TokenFilters'
import TokenCard from '../components/MarketTrading/TokenCard'
import MarketSidebar from '../components/MarketTrading/MarketSidebar'
import PurchaseModal from '../components/MarketTrading/PurchaseModal'
import BatchPurchaseModal from '../components/MarketTrading/BatchPurchaseModal'
import MyListingsContent from '../components/MarketTrading/MyListingsContent'
import ValidatorPendingReviews from '../components/MarketTrading/ValidatorPendingReviews'

export interface Token {
  id: string
  type: 'receivable' | 'inventory' | 'abs'
  debtor?: string
  inventoryType?: string
  inventoryItem?: string
  faceValue: number
  currentPrice: number
  dueDate?: string
  daysRemaining?: number
  annualYield?: number
  riskRating?: string
  storageLocation?: string
  qualityStatus?: string
  issuer: string
  discount: number
  priceChange: number
  assetPool?: string
  tranche?: string
  scale?: number
  expectedYield?: number
}

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
}

type SortOption = 'yield' | 'daysRemaining' | 'discount' | 'price' | 'none'

function MarketTrading() {
  const { t, language } = useLanguage()
  const { currentRole } = useRole()

  // 建筑公司显示"我的在售资产"管理面板
  if (currentRole === '建筑公司') {
    return <MyListingsContent />
  }

  // 银行角色显示"待处理审核"面板
  if (currentRole === '银行') {
    return <ValidatorPendingReviews />
  }

  // 创建公司名称映射函数
  const getDebtorName = (debtorKey: string) => {
    const debtorMap: Record<string, string> = {
      'ABC科技有限公司': t('marketTrading.sampleDebtors.abcTech'),
      'XYZ工程集团': t('marketTrading.sampleDebtors.xyzEngineering'),
      'DEF建设股份公司': t('marketTrading.sampleDebtors.defConstruction'),
    }
    return debtorMap[debtorKey] || debtorKey
  }

  // 创建库存类型映射函数
  const getInventoryType = (typeKey: string) => {
    const typeMap: Record<string, string> = {
      '成品': t('marketTrading.inventoryTypes.finishedProduct'),
      '原材料': t('marketTrading.inventoryTypes.rawMaterial'),
      '在制品': t('marketTrading.inventoryTypes.workInProgress'),
    }
    return typeMap[typeKey] || typeKey
  }

  // 创建库存物品映射函数
  const getInventoryItem = (itemKey: string) => {
    const itemMap: Record<string, string> = {
      '建筑钢材': t('marketTrading.inventoryItems.constructionSteel'),
      '水泥': t('marketTrading.inventoryItems.cement'),
      '预制构件': t('marketTrading.inventoryItems.precastComponents'),
    }
    return itemMap[itemKey] || itemKey
  }

  // 创建存储位置映射函数
  const getStorageLocation = (locationKey: string) => {
    const locationMap: Record<string, string> = {
      '深圳仓库A': t('marketTrading.storageLocations.shenzhenWarehouseA'),
      '广州仓库B': t('marketTrading.storageLocations.guangzhouWarehouseB'),
      '东莞工厂C': t('marketTrading.storageLocations.dongguanFactoryC'),
    }
    return locationMap[locationKey] || locationKey
  }

  // 创建质量状态映射函数
  const getQualityStatus = (statusKey: string) => {
    const statusMap: Record<string, string> = {
      '已认证': t('marketTrading.qualityStatuses.certified'),
      '待认证': t('marketTrading.qualityStatuses.pendingCertification'),
    }
    return statusMap[statusKey] || statusKey
  }

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
  })

  const [sortOption, setSortOption] = useState<SortOption>('none')
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])

  // 模拟代币数据 - 使用 useMemo 确保语言变化时更新
  // 模拟代币数据 - 使用 useMemo 确保语言变化时更新
  const tokens: Token[] = useMemo(() => [
    {
      id: 'AR-2025-021',
      type: 'receivable',
      issuer: t('marketTrading.sampleIssuers.coreEnterpriseA'),
      faceValue: 500000,
      currentPrice: 498500,
      dueDate: '2025-06-30',
      daysRemaining: 101, // approximate
      annualYield: 24.5,
      riskRating: 'B+',
      discount: -0.3,
      priceChange: 0,
    },
    {
      id: 'ABS-2025-001',
      type: 'abs',
      issuer: t('marketTrading.sampleIssuers.coreEnterpriseA'),
      assetPool: language === 'zh' ? '核心企业A、B、C 共 5 笔 AR' : '5 ARs from Core Enterprise A, B, C',
      scale: 2500000,
      faceValue: 2500000, // For scaling/rendering purposes
      currentPrice: 2500000, // Placeholders
      tranche: 'Senior 70%',
      expectedYield: 21.2,
      annualYield: 21.2, // map to annual yield for sorting
      riskRating: 'AAA',
      discount: 0,
      priceChange: 0,
    },
    {
      id: 'AR-2025-022',
      type: 'receivable',
      issuer: t('marketTrading.sampleIssuers.coreEnterpriseB'),
      faceValue: 800000,
      currentPrice: 790400,
      dueDate: '2025-08-15',
      daysRemaining: 147,
      annualYield: 26.8,
      riskRating: 'A-',
      discount: -1.2,
      priceChange: 0,
    },
    {
      id: 'ABS-2025-002',
      type: 'abs',
      issuer: t('marketTrading.sampleIssuers.coreEnterpriseB'),
      assetPool: language === 'zh' ? '建筑公司X、Y 共 12 笔 AR' : '12 ARs from Construction X, Y',
      scale: 5000000,
      faceValue: 5000000,
      currentPrice: 5000000,
      tranche: 'Senior 80%',
      expectedYield: 22.0,
      annualYield: 22.0,
      riskRating: 'AA+',
      discount: 0,
      priceChange: 0,
    },
  ], [t, language])

  // 筛选逻辑
  const filteredTokens = useMemo(() => {
    let result = tokens.filter(token => {
      // 代币类型筛选
      if (filters.tokenTypes.length > 0 && !filters.tokenTypes.includes(token.type)) {
        return false
      }

      // 风险等级筛选
      if (filters.riskLevel !== 'all' && token.riskRating) {
        if (!token.riskRating.startsWith(filters.riskLevel)) {
          return false
        }
      }

      // 收益率范围筛选
      if (token.annualYield !== undefined) {
        if (filters.yieldRangeMin && filters.yieldRangeMin !== '') {
          if (token.annualYield < parseFloat(filters.yieldRangeMin)) return false
        }
        if (filters.yieldRangeMax && filters.yieldRangeMax !== '') {
          if (token.annualYield > parseFloat(filters.yieldRangeMax)) return false
        }
      }

      // 到期日范围筛选
      if (token.dueDate !== undefined) {
        if (filters.dueDateStart && filters.dueDateStart !== '') {
          if (new Date(token.dueDate) < new Date(filters.dueDateStart)) return false
        }
        if (filters.dueDateEnd && filters.dueDateEnd !== '') {
          if (new Date(token.dueDate) > new Date(filters.dueDateEnd)) return false
        }
      }

      // 发行方筛选
      if (filters.issuer !== 'all' && token.issuer !== filters.issuer) {
        return false
      }

      // 价格范围筛选 (仅为了兼容其他场景，原为必有条件)
      // 在新过滤视图中可能被隐藏，但仍存在
      if (token.currentPrice < filters.priceRange[0] || token.currentPrice > filters.priceRange[1]) {
        return false
      }

      // 到期时间筛选（仅应收账款）
      if (filters.dueTime && token.type === 'receivable' && token.daysRemaining) {
        const days = parseInt(filters.dueTime)
        if (token.daysRemaining > days) {
          return false
        }
      }

      // 库存类型筛选（仅库存）
      if (filters.inventoryType && token.type === 'inventory' && token.inventoryType !== filters.inventoryType) {
        return false
      }

      // 年化收益率范围筛选（仅应收账款，银行专用）
      if (filters.yieldRange && token.type === 'receivable' && token.annualYield) {
        const [min, max] = filters.yieldRange
        if (token.annualYield < min || token.annualYield > max) {
          return false
        }
      }

      // 剩余期限筛选（仅应收账款，银行专用）
      if (filters.remainingDays && token.type === 'receivable' && token.daysRemaining) {
        const days = parseInt(filters.remainingDays)
        if (token.daysRemaining > days) {
          return false
        }
      }

      // 信用评级筛选（仅应收账款，银行专用）
      if (filters.creditRating && token.type === 'receivable' && token.riskRating) {
        if (filters.creditRating === 'A+' && !token.riskRating.startsWith('A')) {
          return false
        }
        if (filters.creditRating === 'A' && !['A', 'A-'].includes(token.riskRating)) {
          return false
        }
        if (filters.creditRating === 'B+' && !['B+', 'B'].includes(token.riskRating)) {
          return false
        }
      }

      return true
    })

    // 排序逻辑
    if (sortOption !== 'none') {
      result = [...result].sort((a, b) => {
        switch (sortOption) {
          case 'yield':
            if (a.type === 'receivable' && b.type === 'receivable') {
              return (b.annualYield || 0) - (a.annualYield || 0)
            }
            return 0
          case 'daysRemaining':
            if (a.type === 'receivable' && b.type === 'receivable') {
              return (a.daysRemaining || 0) - (b.daysRemaining || 0)
            }
            return 0
          case 'discount':
            return b.discount - a.discount
          case 'price':
            return a.currentPrice - b.currentPrice
          default:
            return 0
        }
      })
    }

    return result
  }, [filters, tokens, sortOption])

  const handlePurchase = (token: Token) => {
    setSelectedToken(token)
    setShowPurchaseModal(true)
  }

  const handlePurchaseConfirm = (tokenId: string, quantity: number, totalPrice: number) => {
    // 模拟交易处理
    const transaction = {
      tokenId,
      quantity,
      totalPrice,
      timestamp: new Date().toLocaleString('zh-CN'),
      hash: '0x' + Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join(''),
    }

    setRecentTransactions(prev => [transaction, ...prev].slice(0, 10))
    setShowPurchaseModal(false)
    setSelectedToken(null)
  }

  const toggleWatchlist = (tokenId: string) => {
    setWatchlist(prev =>
      prev.includes(tokenId)
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    )
  }

  const handleBatchPurchase = () => {
    setShowBatchModal(true)
  }

  const handleBatchPurchaseConfirm = (purchases: { tokenId: string; quantity: number }[]) => {
    // 批量购买逻辑
    console.log('Batch purchase confirmed:', purchases)
    purchases.forEach(purchase => {
      const token = tokens.find(t => t.id === purchase.tokenId)
      if (token) {
        handlePurchaseConfirm(purchase.tokenId, purchase.quantity, token.currentPrice * purchase.quantity)
      }
    })
    setShowBatchModal(false)
    setSelectedTokens([])
  }

  const toggleTokenSelection = (tokenId: string) => {
    setSelectedTokens(prev =>
      prev.includes(tokenId)
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    )
  }

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
                {t('marketTrading.tradableTokens')} ({filteredTokens.length})
              </h3>
              <div className="flex items-center space-x-3">
                {/* 排序选择 */}
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">{language === 'zh' ? '默认排序' : 'Default Sort'}</option>
                  <option value="yield">{language === 'zh' ? '按收益率排序' : 'Sort by Yield'}</option>
                  <option value="daysRemaining">{language === 'zh' ? '按剩余期限排序' : 'Sort by Days Remaining'}</option>
                  <option value="discount">{language === 'zh' ? '按折扣率排序' : 'Sort by Discount'}</option>
                  <option value="price">{language === 'zh' ? '按价格排序' : 'Sort by Price'}</option>
                </select>
                <button
                  onClick={handleBatchPurchase}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  {t('marketTrading.batchPurchase')}
                  {selectedTokens.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-500 rounded-full text-xs">
                      {selectedTokens.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTokens.map(token => (
                <div key={token.id} className="relative">
                  <TokenCard
                    token={token}
                    onPurchase={() => handlePurchase(token)}
                    onToggleWatchlist={() => toggleWatchlist(token.id)}
                    isWatched={watchlist.includes(token.id)}
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

        {/* 右侧：侧边面板 */}
        <div className="lg:col-span-1">
          <MarketSidebar
            watchlist={watchlist}
            tokens={tokens}
            recentTransactions={recentTransactions}
            onRemoveFromWatchlist={toggleWatchlist}
          />
        </div>
      </div>

      {/* 购买确认模态框 */}
      {showPurchaseModal && selectedToken && (
        <PurchaseModal
          token={selectedToken}
          onConfirm={handlePurchaseConfirm}
          onClose={() => {
            setShowPurchaseModal(false)
            setSelectedToken(null)
          }}
        />
      )}

      {/* 批量购买模态框 */}
      {showBatchModal && (
        <BatchPurchaseModal
          tokens={tokens}
          selectedTokenIds={selectedTokens}
          onConfirm={handleBatchPurchaseConfirm}
          onClose={() => {
            setShowBatchModal(false)
            setSelectedTokens([])
          }}
        />
      )}
    </div>
  )
}

export default MarketTrading
