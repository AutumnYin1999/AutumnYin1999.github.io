import { useLanguage } from '../../hooks/useLanguage'

export interface NodeItem {
  id: string
  type: 'bank' | 'audit' | 'cic'
  name: string
  address: string
  status: 'online' | 'offline' | 'maintenance'
  joinDate: string
  cumulativeRevenue: number
  monthlyTasks: number
}

interface NodeCardProps {
  node: NodeItem
  onViewDetails?: () => void
  onEdit?: () => void
  onRemove?: () => void
}

function NodeCard({ node, onViewDetails, onEdit, onRemove }: NodeCardProps) {
  const { language } = useLanguage()

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'bank': return 'bg-blue-100 text-blue-700'
      case 'audit': return 'bg-purple-100 text-purple-700'
      case 'cic': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeName = (type: string) => {
    if (language === 'zh') {
      switch (type) {
        case 'bank': return '银行'
        case 'audit': return '审计'
        case 'cic': return 'CIC'
        default: return type
      }
    } else {
      switch (type) {
        case 'bank': return 'Bank'
        case 'audit': return 'Audit'
        case 'cic': return 'CIC'
        default: return type
      }
    }
  }

  const getStatusDisplay = (status: string) => {
    if (status === 'online') {
      return (
        <span className="flex items-center text-green-600 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2 shadow-sm shadow-green-200"></span>
          {language === 'zh' ? '在线' : 'Online'}
        </span>
      )
    }
    if (status === 'maintenance') {
      return (
        <span className="flex items-center text-yellow-600 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2 shadow-sm shadow-yellow-200"></span>
          {language === 'zh' ? '维护中' : 'Maintenance'}
        </span>
      )
    }
    return (
      <span className="flex items-center text-gray-400 font-medium">
        <span className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-2"></span>
        {language === 'zh' ? '离线' : 'Offline'}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col group relative overflow-hidden">
      {/* 装饰性背景 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-500"></div>

      {/* 头部：类型标签和名称 */}
      <div className="flex items-start justify-between mb-5 z-10">
        <div className="flex flex-col space-y-2">
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide w-fit ${getTypeStyle(node.type)}`}>
            {getTypeName(node.type).toUpperCase()}
          </span>
          <span className="font-bold text-gray-900 text-xl">{node.name}</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 z-10">
        {/* 地址和加入时间 */}
        <div className="flex flex-col space-y-1">
          <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{language === 'zh' ? '节点地址' : 'Node Address'}</span>
          <div className="flex items-center text-sm font-mono text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
            <i className="fas fa-link text-gray-400 mr-2 text-xs"></i>
            {node.address.substring(0, 10)}...{node.address.substring(node.address.length - 8)}
          </div>
        </div>

        {/* 状态 和 加入时间 */}
        <div className="flex items-center justify-between text-sm py-3 border-y border-gray-100">
          <div className="flex flex-col space-y-1">
            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{language === 'zh' ? '状态' : 'Status'}</span>
            {getStatusDisplay(node.status)}
          </div>
          <div className="flex flex-col space-y-1 items-end">
            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{language === 'zh' ? '加入时间' : 'Join Date'}</span>
            <span className="font-medium text-gray-800 flex items-center">
              <i className="far fa-calendar-alt text-gray-400 mr-1.5 text-xs"></i>
              {node.joinDate}
            </span>
          </div>
        </div>

        {/* 收益和审核量 */}
        <div className="flex items-center justify-between text-sm pt-2">
          <div className="flex flex-col space-y-1">
            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{language === 'zh' ? '累计收益' : 'Cumulative Revenue'}</span>
            <span className="font-bold text-gray-900 text-lg">HK$ {node.cumulativeRevenue.toLocaleString('en-US')}</span>
          </div>
          <div className="flex flex-col space-y-1 items-end">
            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{language === 'zh' ? '本月审核量' : 'Monthly Tasks'}</span>
            <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {node.monthlyTasks} {language === 'zh' ? '笔' : 'tasks'}
            </span>
          </div>
        </div>
      </div>

      {/* 操作按钮组 */}
      <div className="mt-6 pt-5 grid grid-cols-3 gap-3 border-t border-gray-100 z-10">
        <button
          onClick={onViewDetails}
          className="col-span-1 py-2 px-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
        >
          <i className="fas fa-info-circle mr-1.5 opacity-70"></i>
          {language === 'zh' ? '详情' : 'Details'}
        </button>
        <button
          onClick={onEdit}
          className="col-span-1 py-2 px-2 border border-gray-200 text-gray-700 bg-white shadow-sm rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center justify-center"
        >
          <i className="fas fa-edit mr-1.5 opacity-70"></i>
          {language === 'zh' ? '编辑' : 'Edit'}
        </button>
        <button
          onClick={onRemove}
          className="col-span-1 py-2 px-2 border border-red-100 text-red-600 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 hover:border-red-200 transition-colors flex items-center justify-center"
        >
          <i className="fas fa-trash-alt mr-1.5 opacity-70"></i>
          {language === 'zh' ? '移除' : 'Remove'}
        </button>
      </div>
    </div>
  )
}

export default NodeCard
