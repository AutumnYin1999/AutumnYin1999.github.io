import { Token } from '../../pages/MarketTrading'
import { useLanguage } from '../../hooks/useLanguage'

interface TokenCardProps {
  token: Token
  onPurchase: () => void
  onToggleWatchlist: () => void
  isWatched: boolean
}

function TokenCard({ token, onPurchase, onToggleWatchlist, isWatched }: TokenCardProps) {
  const { t, language } = useLanguage()
  const isReceivable = token.type === 'receivable'
  const isABS = token.type === 'abs'
  const isInventory = token.type === 'inventory'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* 头部：代币ID和类型标签 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-800">{token.id}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${isReceivable
            ? 'bg-blue-100 text-blue-700'
            : isABS
              ? 'bg-purple-100 text-purple-700'
              : 'bg-green-100 text-green-700'
            }`}>
            {isReceivable ? 'AR' : isABS ? 'ABS' : t('marketTrading.inventory')}
          </span>
        </div>
        <button
          onClick={onToggleWatchlist}
          className={`p-2 rounded-lg transition-colors ${isWatched
            ? 'text-yellow-500 hover:bg-yellow-50'
            : 'text-gray-400 hover:bg-gray-100'
            }`}
          title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <i className={`fas fa-star`}></i>
        </button>
      </div>

      <div className="flex-1">
        {/* AR 内容 */}
        {isReceivable && (
          <div className="space-y-3 mb-2">
            <div className="text-sm">
              <span className="text-gray-500">{language === 'zh' ? '核心企业' : 'Core Enterprise'}:</span>
              <span className="font-medium text-gray-800 ml-2">{token.issuer}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm">
              <div>
                <span className="text-gray-500">{language === 'zh' ? '面值' : 'Face Value'}:</span>
                <span className="font-medium text-gray-800 ml-2">HK$ {token.faceValue.toLocaleString('en-US')}</span>
              </div>
              <div className="text-gray-300">|</div>
              <div>
                <span className="text-gray-500">{language === 'zh' ? '到期' : 'Due'}:</span>
                <span className="font-medium text-gray-800 ml-2">{token.dueDate}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm">
              <div>
                <span className="text-gray-500">{language === 'zh' ? '年化收益率' : 'Yield'}:</span>
                <span className="font-bold text-green-600 ml-2">{token.annualYield}%</span>
              </div>
              <div className="text-gray-300">|</div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">{language === 'zh' ? '风险评级' : 'Rating'}:</span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${token.riskRating?.startsWith('A')
                  ? 'bg-green-100 text-green-700'
                  : token.riskRating?.startsWith('B')
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {token.riskRating}
                </span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm bg-gray-50/50 -mx-2 px-2 py-2 rounded">
              <div>
                <span className="text-gray-500">{language === 'zh' ? '挂牌价' : 'Price'}:</span>
                <span className="font-bold text-gray-800 ml-2">HK$ {token.currentPrice.toLocaleString('en-US')}</span>
              </div>
              <div className="text-gray-300">|</div>
              <div>
                <span className="text-gray-500">{language === 'zh' ? '折扣' : 'Discount'}:</span>
                <span className={`font-semibold ml-2 ${token.discount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {token.discount > 0 ? `+${token.discount}` : token.discount}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ABS 内容 */}
        {isABS && (
          <div className="space-y-3 mb-2">
            <div className="text-sm">
              <span className="text-gray-500">{language === 'zh' ? '资产池' : 'Asset Pool'}:</span>
              <span className="font-medium text-gray-800 ml-2">{token.assetPool}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm">
              <div>
                <span className="text-gray-500">{language === 'zh' ? '规模' : 'Scale'}:</span>
                <span className="font-medium text-gray-800 ml-2">HK$ {token.scale?.toLocaleString('en-US')}</span>
              </div>
              <div className="text-gray-300">|</div>
              <div>
                <span className="text-gray-500">{language === 'zh' ? '分层' : 'Tranche'}:</span>
                <span className="font-medium text-gray-800 ml-2">{token.tranche}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between text-sm">
              <div>
                <span className="text-gray-500">{language === 'zh' ? '预期收益率' : 'Exp. Yield'}:</span>
                <span className="font-bold text-green-600 ml-2">{token.expectedYield}%</span>
              </div>
              <div className="text-gray-300">|</div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">{language === 'zh' ? '风险评级' : 'Rating'}:</span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${token.riskRating?.startsWith('A')
                  ? 'bg-green-100 text-green-700'
                  : token.riskRating?.startsWith('B')
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {token.riskRating}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 库存代币内容 */}
        {isInventory && (
          <div className="space-y-3 mb-2">
            <div className="text-sm">
              <span className="text-gray-500">{t('marketTrading.inventoryType') || '库存类型'}:</span>
              <span className="font-medium text-gray-800 ml-2">{token.inventoryType}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">{t('marketTrading.item') || '物品'}:</span>
              <span className="font-medium text-gray-800 ml-2">{token.inventoryItem}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{t('marketTrading.valuation') || '估值'}:</span>
              <span className="font-semibold text-gray-800">
                HK$ {token.faceValue.toLocaleString('en-US')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{t('marketTrading.storageLocation') || '存储位置'}:</span>
              <span className="text-gray-800">{token.storageLocation}</span>
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮组 (AR 和 ABS 以及 INV 统一用底部布局，ABS有两个按钮) */}
      <div className="mt-4 pt-4 flex space-x-3">
        {isABS ? (
          <>
            <button
              className="flex-1 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              <i className="fas fa-file-alt mr-2"></i>
              {language === 'zh' ? '查看详情' : 'Details'}
            </button>
            <button
              onClick={onPurchase}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-coins mr-2"></i>
              {language === 'zh' ? '投资' : 'Invest'}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onPurchase}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <i className={isInventory ? "fas fa-shopping-cart mr-2" : "fas fa-coins mr-2"}></i>
              {isInventory ? t('marketTrading.buyNow') : (language === 'zh' ? '投资' : 'Invest')}
            </button>
            <button
              className="p-2 px-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              title="Alert"
            >
              <i className="fas fa-bell"></i>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default TokenCard
