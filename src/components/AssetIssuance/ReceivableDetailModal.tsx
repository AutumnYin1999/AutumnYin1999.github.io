import { useLanguage } from '../../hooks/useLanguage'

interface Receivable {
  id: string
  issuer: string
  amount: number
  dueDate: string
  status: 'pending' | 'received' | 'listed' | 'sold' | 'settled'
  receivedDate?: string
  listedDate?: string
  soldDate?: string
  verificationProgress?: {
    bank: boolean
    audit: boolean
    cic: boolean
  }
}

interface ReceivableDetailModalProps {
  receivable: Receivable | null
  onClose: () => void
}

function ReceivableDetailModal({ receivable, onClose }: ReceivableDetailModalProps) {
  const { language } = useLanguage()

  if (!receivable) return null

  const getStatusLabel = (status: string) => {
    if (language === 'zh') {
      switch (status) {
        case 'pending': return '待验证'
        case 'received': return '待确权'
        case 'listed': return '融资中'
        case 'sold': return '已回款'
        case 'settled': return '已结清'
        default: return status
      }
    } else {
      switch (status) {
        case 'pending': return 'Pending Verification'
        case 'received': return 'Pending Confirmation'
        case 'listed': return 'Financing'
        case 'sold': return 'Repaid'
        case 'settled': return 'Settled'
        default: return status
      }
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
          <h3 className="text-2xl font-bold text-gray-800">
            {language === 'zh' ? '详情' : 'Details'}: {receivable.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* 基本信息 - 网格布局 */}
          <div>
            <h4 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {language === 'zh' ? '基本信息' : 'Basic Information'}
            </h4>
            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
              <div>
                <span className="text-sm text-gray-500 block mb-1">
                  {language === 'zh' ? '应收金额' : 'Amount'}
                </span>
                <span className="text-xl font-bold text-gray-900">
                  HK$ {receivable.amount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">
                  {language === 'zh' ? '核心企业' : 'Core Enterprise'}
                </span>
                <span className="text-base font-medium text-gray-900">{receivable.issuer}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">
                  {language === 'zh' ? '状态' : 'Status'}
                </span>
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full w-fit ${receivable.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  receivable.status === 'received' ? 'bg-blue-100 text-blue-800' :
                    receivable.status === 'listed' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                  }`}>
                  {getStatusLabel(receivable.status)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">
                  {language === 'zh' ? '到期日' : 'Due Date'}
                </span>
                <span className="text-base text-gray-900">{receivable.dueDate}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">
                  {language === 'zh' ? '上传日期' : 'Upload Date'}
                </span>
                <span className="text-base text-gray-900">2024-10-15</span>
              </div>
            </div>
          </div>

          {/* 验证节点签名状态 */}
          <div>
            <h4 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {language === 'zh' ? '验证节点状态' : 'Validator Status'}
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${receivable.verificationProgress?.bank ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                    <i className="fas fa-university text-lg"></i>
                  </div>
                  <span className="text-base font-medium text-gray-700">
                    {language === 'zh' ? '银行' : 'Bank'}
                  </span>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded ${receivable.verificationProgress?.bank
                  ? 'text-green-600 bg-green-50'
                  : 'text-yellow-600 bg-yellow-50'
                  }`}>
                  {receivable.verificationProgress?.bank
                    ? (language === 'zh' ? '已完成' : 'Completed')
                    : (language === 'zh' ? '进行中' : 'In Progress')}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${receivable.verificationProgress?.audit ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                    <i className="fas fa-file-contract text-lg"></i>
                  </div>
                  <span className="text-base font-medium text-gray-700">
                    {language === 'zh' ? '审计' : 'Audit'}
                  </span>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded ${receivable.verificationProgress?.audit
                  ? 'text-green-600 bg-green-50'
                  : 'text-yellow-600 bg-yellow-50'
                  }`}>
                  {receivable.verificationProgress?.audit
                    ? (language === 'zh' ? '已完成' : 'Completed')
                    : (language === 'zh' ? '进行中' : 'In Progress')}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${receivable.verificationProgress?.cic ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                    <i className="fas fa-globe text-lg"></i>
                  </div>
                  <span className="text-base font-medium text-gray-700">CIC</span>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded ${receivable.verificationProgress?.cic
                  ? 'text-green-600 bg-green-50'
                  : 'text-yellow-600 bg-yellow-50'
                  }`}>
                  {receivable.verificationProgress?.cic
                    ? (language === 'zh' ? '已完成' : 'Completed')
                    : (language === 'zh' ? '进行中' : 'In Progress')}
                </span>
              </div>
            </div>
          </div>

          {/* 相关文件 */}
          <div>
            <h4 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {language === 'zh' ? '相关文件' : 'Related Documents'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                language === 'zh' ? '贸易合同' : 'Contract',
                language === 'zh' ? '商业发票' : 'Invoice',
                language === 'zh' ? '验收单' : 'Acceptance Note'
              ].map((doc, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors group">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <i className="fas fa-file-pdf text-4xl text-red-500 group-hover:scale-110 transition-transform"></i>
                    <span className="text-sm font-medium text-gray-700 truncate w-full">{doc}.pdf</span>
                    <div className="flex space-x-3 w-full justify-center">
                      <button className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded flex-1">
                        {language === 'zh' ? '预览' : 'Preview'}
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded"><i className="fas fa-download"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 融资记录 (可选) */}
          {receivable.status === 'listed' && (
            <div>
              <h4 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {language === 'zh' ? '融资记录' : 'Financing History'}
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg text-base text-gray-600 flex justify-between">
                <span>{language === 'zh' ? '融资日期' : 'Financing Date'}: {receivable.listedDate}</span>
                <span>{language === 'zh' ? '融资金额' : 'Financed Amount'}: HK$ {(receivable.amount * 0.8).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors text-base"
          >
            {language === 'zh' ? '关闭' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReceivableDetailModal
