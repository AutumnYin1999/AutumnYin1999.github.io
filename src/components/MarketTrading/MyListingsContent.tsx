import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

interface ListedToken {
  id: string
  type: 'receivable' | 'inventory'
  faceValue: number
  listedPrice: number
  listedDate: string
  inquiryCount: number
  status: 'selling'
  // 应收账款特有
  dueDate?: string
  issuer?: string
  financedAmount?: number
  financingRatio?: number
}

interface SaleRecord {
  tokenId: string
  buyer: string
  salePrice: number
  saleDate: string
  commission: number
}


function MyListingsContent() {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [selectedToken, setSelectedToken] = useState<ListedToken | null>(null)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [newPrice, setNewPrice] = useState('')

  // 模拟数据：在售的应收账款代币
  const receivableTokens: ListedToken[] = [
    {
      id: 'AR-2024-101',
      type: 'receivable',
      faceValue: 400000,
      listedPrice: 395000,
      listedDate: '2024-12-20',
      inquiryCount: 5,
      status: 'selling',
      dueDate: '2025-04-10',
      issuer: language === 'zh' ? '核心企业A' : 'Core Enterprise A',
      financedAmount: 200000,
      financingRatio: 50
    },
    {
      id: 'AR-2024-100',
      type: 'receivable',
      faceValue: 600000,
      listedPrice: 590000,
      listedDate: '2024-12-15',
      inquiryCount: 8,
      status: 'selling',
      dueDate: '2025-05-20',
      issuer: language === 'zh' ? '核心企业C' : 'Core Enterprise C',
      financedAmount: 0,
      financingRatio: 0
    },
  ]


  // 模拟数据：销售记录
  const saleRecords: SaleRecord[] = [
    {
      tokenId: 'AR-2024-050',
      buyer: language === 'zh' ? 'NBFI机构A' : 'NBFI Institution A',
      salePrice: 195000,
      saleDate: '2024-12-01',
      commission: 1950,
    },
    {
      tokenId: 'AR-2024-045',
      buyer: language === 'zh' ? 'NBFI机构C' : 'NBFI Institution C',
      salePrice: 480000,
      saleDate: '2024-11-20',
      commission: 4800,
    },
  ]


  const handleModifyPrice = (token: ListedToken) => {
    setSelectedToken(token)
    setNewPrice(token.listedPrice.toString())
    setShowPriceModal(true)
  }

  const handleConfirmPrice = () => {
    if (selectedToken && newPrice) {
      // 这里应该更新代币价格
      console.log('Update price:', selectedToken.id, newPrice)
      setShowPriceModal(false)
      setSelectedToken(null)
      setNewPrice('')
    }
  }

  const handleUnlist = (tokenId: string) => {
    // 这里应该下架代币
    console.log('Unlist token:', tokenId)
  }

  const handleViewDetail = (token: ListedToken) => {
    // 显示详情弹窗
    console.log('View detail:', token.id)
  }

  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      {/* 顶部导航 */}
      <div className="mb-6 flex items-center justify-end">
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-home mr-2"></i>
            {language === 'zh' ? '返回首页' : 'Back to Home'}
          </button>
          <button
            onClick={() => navigate('/app/receivables-management')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            {language === 'zh' ? '上架新 AR' : 'List New AR'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Card 1: Financed Amount */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            <i className="fas fa-coins text-xl"></i>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">{language === 'zh' ? '已融资金额' : 'Financed Amount'}</div>
            <div className="text-xl font-bold text-gray-900">HK$ 960,000</div>
          </div>
        </div>

        {/* Card 2: Listed Amount */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
            <i className="fas fa-layer-group text-xl"></i>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">{language === 'zh' ? '上架中总额' : 'Total Listed'}</div>
            <div className="text-xl font-bold text-gray-900">HK$ 2,450,000</div>
          </div>
        </div>

        {/* Card 3: Avg Discount */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
            <i className="fas fa-percentage text-xl"></i>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">{language === 'zh' ? '平均折扣率' : 'Avg. Discount'}</div>
            <div className="text-xl font-bold text-gray-900">1.2%</div>
          </div>
        </div>

        {/* Card 4: Commission */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
            <i className="fas fa-hand-holding-usd text-xl"></i>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">{language === 'zh' ? '平台累计佣金' : 'Total Commission'}</div>
            <div className="text-xl font-bold text-gray-900">HK$ 9,600</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：在售资产列表 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header for list */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <i className="fas fa-list mr-2 text-teal-600"></i>
                {language === 'zh' ? '应收账款列表' : 'Receivables List'}
              </h3>
            </div>

            {/* 列表内容 */}
            <div className="p-6">
              {receivableTokens.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                  <p className="text-sm">
                    {language === 'zh' ? '暂无在售的代币' : 'No tokens on sale'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivableTokens.map((token) => (
                    <div
                      key={token.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1 space-y-4">
                          {/* Row 0: ID */}
                          <div className="flex items-center">
                            <span className="font-bold text-2xl text-gray-900 mr-4">{token.id}</span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-base font-medium">
                              {language === 'zh' ? '出售中' : 'Selling'}
                            </span>
                          </div>

                          {/* Row 1: Details */}
                          <div className="flex items-center text-lg text-gray-600 flex-wrap gap-y-2">
                            <span className="font-medium text-gray-800">{token.issuer}</span>
                            <span className="mx-3 text-gray-300">|</span>
                            <span>{language === 'zh' ? '面值' : 'Face Value'}: <span className="text-gray-900 font-medium">HK${token.faceValue.toLocaleString()}</span></span>
                            <span className="mx-3 text-gray-300">|</span>
                            <span>{language === 'zh' ? '挂牌价' : 'Listed'}: <span className="text-gray-900 font-medium">HK${token.listedPrice.toLocaleString()}</span></span>
                            <span className="mx-3 text-gray-300">|</span>
                            <span>{language === 'zh' ? '到期' : 'Due'}: <span className="text-gray-900 font-medium">{token.dueDate}</span></span>
                          </div>

                          {/* Row 2: Listing Details & Financing */}
                          <div className="flex items-center text-lg text-gray-600 flex-wrap gap-y-2">
                            <span>{language === 'zh' ? '挂牌' : 'Listed'}: <span className="text-gray-900 font-medium">{token.listedDate}</span></span>
                            <span className="mx-3 text-gray-300">|</span>
                            <span>{language === 'zh' ? '询价' : 'Inquiries'}: <span className="text-gray-900 font-medium">{token.inquiryCount}</span></span>
                            {token.financedAmount !== undefined && (
                              <div className="flex items-center ml-3">
                                <span className="mr-2">{language === 'zh' ? '已融资' : 'Financed'}:</span>
                                <div className="flex items-center">
                                  <div className="w-24 h-2.5 bg-gray-100 rounded-full overflow-hidden mr-2 border border-gray-200">
                                    <div
                                      className="h-full bg-teal-500 rounded-full"
                                      style={{ width: `${token.financingRatio}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-teal-600 font-medium">
                                    HK${token.financedAmount.toLocaleString()} ({token.financingRatio}%)
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => handleModifyPrice(token)}
                          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
                        >
                          <i className="fas fa-edit mr-2"></i>
                          {language === 'zh' ? '修改价格' : 'Modify Price'}
                        </button>
                        <button
                          onClick={() => handleUnlist(token.id)}
                          className="px-5 py-2.5 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors text-lg"
                        >
                          <i className="fas fa-arrow-down mr-2"></i>
                          {language === 'zh' ? '下架' : 'Unlist'}
                        </button>
                        <button
                          onClick={() => handleViewDetail(token)}
                          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-lg"
                        >
                          <i className="fas fa-eye mr-2"></i>
                          {language === 'zh' ? '查看详情' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：销售记录与统计 */}
        <div className="lg:col-span-1 space-y-6">

          {/* 近期成交记录 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {language === 'zh' ? '近期成交记录' : 'Recent Sales'}
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {saleRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-inbox text-3xl mb-2 text-gray-300"></i>
                  <p className="text-sm">{language === 'zh' ? '暂无成交记录' : 'No sales records'}</p>
                </div>
              ) : (
                saleRecords.map((record, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="font-bold text-gray-800 text-lg mb-2">{record.tokenId}</div>
                    <div className="text-base text-gray-600 space-y-1">
                      <div className="flex flex-wrap items-center">
                        <span className="mr-1">{language === 'zh' ? '买方' : 'Buyer'}:</span>
                        <span className="font-medium text-gray-800 mr-2">{record.buyer}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{language === 'zh' ? '成交价' : 'Price'}: HK${record.salePrice.toLocaleString()}</span>
                        <span className="mx-2">|</span>
                        <span>{language === 'zh' ? '佣金' : 'Comm'}: HK${record.commission.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 修改价格弹窗 */}
      {showPriceModal && selectedToken && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPriceModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {language === 'zh' ? '修改价格' : 'Modify Price'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '代币ID' : 'Token ID'}
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{selectedToken.id}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '当前价格' : 'Current Price'}
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                  HK$ {selectedToken.listedPrice.toLocaleString()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh' ? '新价格' : 'New Price'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder={language === 'zh' ? '请输入新价格' : 'Enter new price'}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => {
                  setShowPriceModal(false)
                  setSelectedToken(null)
                  setNewPrice('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmPrice}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                {language === 'zh' ? '确认修改' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyListingsContent
