import { useLanguage } from '../../../hooks/useLanguage'

function NBFISidebar() {
  const { language } = useLanguage()
  return (
    <div className="space-y-6">
      {/* 核心指标卡片 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          <i className="fas fa-chart-pie mr-2 text-blue-600"></i>
          {language === 'zh' ? '投资组合概览' : 'Portfolio Overview'}
        </h3>
        <div className="space-y-4">
          {/* 总投资额 */}
          <div>
            <div className="text-sm text-gray-500 mb-1">{language === 'zh' ? '总投资额' : 'Total Investment'}</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">
                HK$ 12,500,000
              </div>
            </div>
          </div>

          {/* 持仓市值 */}
          <div className="border-t border-gray-100 pt-3">
            <div className="text-sm text-gray-500 mb-1">{language === 'zh' ? '持仓市值' : 'Current Value'}</div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-gray-800">
                HK$ 12,380,000
              </div>
              <div className="text-sm font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded flex items-center" title="较上月变动" >
                <i className="fas fa-arrow-down text-[10px] mr-1"></i>0.9%
              </div>
            </div>
          </div>

          {/* 累计收益 */}
          <div className="border-t border-gray-100 pt-3">
            <div className="text-sm text-gray-500 mb-1">{language === 'zh' ? '累计收益' : 'Acc. Returns'}</div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-green-600">
                HK$ 680,000
              </div>
              <div className="text-sm font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded flex items-center" title="本月新增">
                <i className="fas fa-arrow-up text-[10px] mr-1"></i>2.1%
              </div>
            </div>
          </div>

          {/* 平均年化 和 持有资产数 */}
          <div className="border-t border-gray-100 pt-3 flex space-x-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">{language === 'zh' ? '平均年化' : 'Avg Yield'}</div>
              <div className="text-lg font-bold text-gray-800">
                6.8%
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">{language === 'zh' ? '持有资产数' : 'Holdings'}</div>
              <div className="text-lg font-bold text-gray-800">
                {language === 'zh' ? '24 笔' : '24 Items'}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default NBFISidebar
