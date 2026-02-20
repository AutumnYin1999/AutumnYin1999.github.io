import { useLanguage } from '../../hooks/useLanguage'


function MarketOverview() {
  const { language } = useLanguage()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 总节点数 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">{language === 'zh' ? '总节点数' : 'Total Nodes'}</span>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <i className="fas fa-network-wired text-blue-600"></i>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">9</div>
        <div className="text-sm text-gray-500">{language === 'zh' ? '网络中所有验证节点总数' : 'Total validator nodes in the network'}</div>
      </div>

      {/* 在线节点 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">{language === 'zh' ? '在线节点' : 'Online Nodes'}</span>
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <i className="fas fa-server text-green-600"></i>
          </div>
        </div>
        <div className="flex items-end space-x-2 mb-2">
          <div className="text-3xl font-bold text-gray-900">8</div>
          <div className="flex items-center text-green-500 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse mr-2 shadow-sm shadow-green-200"></span>
          </div>
        </div>
        <div className="text-sm text-gray-500">{language === 'zh' ? '当前在线的节点数量' : 'Currently online nodes'}</div>
      </div>

      {/* 待审核节点申请 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">{language === 'zh' ? '待审核节点申请' : 'Pending Node Applications'}</span>
          <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
            <i className="fas fa-user-clock text-yellow-600"></i>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
        <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer transition-colors max-w-fit">
          {language === 'zh' ? '新申请加入网络的节点数量 (点击审核)' : 'New node applications (Click to review)'}
        </div>
      </div>

      {/* 累计节点收益 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">{language === 'zh' ? '累计节点收益' : 'Cumulative Node Revenue'}</span>
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
            <i className="fas fa-hand-holding-usd text-purple-600"></i>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">HK$ 4.2M</div>
        <div className="text-sm text-gray-500">{language === 'zh' ? '所有节点累计分账总额' : 'Cumulative revenue distributed to all nodes'}</div>
      </div>
    </div>
  )
}

export default MarketOverview
