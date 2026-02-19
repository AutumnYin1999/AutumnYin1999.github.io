import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRole } from '../../hooks/useRole'
import { useLanguage } from '../../hooks/useLanguage'

type TabType = 'pending' | 'confirmed' | 'rejected'

interface ARItem {
  id: string
  smeZh: string
  smeEn: string
  amount: string
  dueDate: string
  submissionTime: string
  file: string
  status: 'pending' | 'confirmed' | 'rejected'
  confirmationTime?: string
  rejectionTime?: string
  rejectionReasonZh?: string
  rejectionReasonEn?: string
}

function AssetIssuanceContent() {
  const { currentRole } = useRole()
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('pending')

  // 待确认列表数据
  const [pendingARs, setPendingARs] = useState<ARItem[]>([
    { id: 'AR-2025-021', smeZh: '建业工程', smeEn: 'Jianye Engineering', amount: 'HK$ 500K', dueDate: '2025-06-30', submissionTime: '2025-04-02', file: 'contract_021.pdf', status: 'pending' },
    { id: 'AR-2025-020', smeZh: '恒发建材', smeEn: 'Hengfa Materials', amount: 'HK$ 1.2M', dueDate: '2025-07-15', submissionTime: '2025-04-01', file: 'contract_020.pdf', status: 'pending' },
    { id: 'AR-2025-019', smeZh: '伟业机电', smeEn: 'Weiye M&E', amount: 'HK$ 800K', dueDate: '2025-08-01', submissionTime: '2025-03-31', file: 'contract_019.pdf', status: 'pending' },
  ])

  // 已确认列表数据 (Sample Data)
  const [confirmedARs] = useState<ARItem[]>([
    { id: 'AR-2025-018', smeZh: '建业工程', smeEn: 'Jianye Engineering', amount: 'HK$ 300K', dueDate: '2025-05-20', submissionTime: '2025-03-25', confirmationTime: '2025-03-28', file: 'contract_018.pdf', status: 'confirmed' },
    { id: 'AR-2025-015', smeZh: '恒发建材', smeEn: 'Hengfa Materials', amount: 'HK$ 2.0M', dueDate: '2025-09-10', submissionTime: '2025-03-22', confirmationTime: '2025-03-25', file: 'contract_015.pdf', status: 'confirmed' },
    { id: 'AR-2025-012', smeZh: '伟业机电', smeEn: 'Weiye M&E', amount: 'HK$ 450K', dueDate: '2025-04-30', submissionTime: '2025-03-18', confirmationTime: '2025-03-20', file: 'contract_012.pdf', status: 'confirmed' },
  ])

  // 已拒绝列表数据 (Sample Data)
  const [rejectedARs] = useState<ARItem[]>([
    { id: 'AR-2025-010', smeZh: '建业工程', smeEn: 'Jianye Engineering', amount: 'HK$ 600K', dueDate: '2025-06-15', submissionTime: '2025-03-14', rejectionTime: '2025-03-15', rejectionReasonZh: '文件不完整', rejectionReasonEn: 'Incomplete documents', file: 'contract_010.pdf', status: 'rejected' },
  ])

  // 模态框状态
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [fileModalOpen, setFileModalOpen] = useState(false)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [currentAR, setCurrentAR] = useState<ARItem | null>(null)

  const handleConfirm = (id: string) => {
    // 模拟确认操作：从列表移除
    setPendingARs(prev => prev.filter(ar => ar.id !== id))
    alert(t('assetIssuance.confirmSuccess'))
  }

  const openRejectModal = (id: string) => {
    setRejectTargetId(id)
    setRejectReason('')
    setRejectModalOpen(true)
  }

  const handleReject = () => {
    if (rejectTargetId) {
      setPendingARs(prev => prev.filter(ar => ar.id !== rejectTargetId))
      setRejectModalOpen(false)
      setRejectTargetId(null)
      alert(t('assetIssuance.rejectSuccess'))
    }
  }

  const openFileModal = (file: string) => {
    setCurrentFile(file)
    setFileModalOpen(true)
  }

  const openDetailsModal = (ar: ARItem) => {
    setCurrentAR(ar)
    setDetailsModalOpen(true)
  }

  const handleModify = (id: string) => {
    alert(t('dashboard.operations') + ': ' + t('assetIssuance.modify') + ' (ID: ' + id + ')')
  }

  // 建筑公司重定向到新页面
  if (currentRole === '建筑公司') {
    return (
      <div className="p-6 min-h-[calc(100vh-4rem)]">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <i className="fas fa-info-circle text-4xl text-teal-600 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {language === 'zh' ? '页面已拆分' : 'Page Split'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'zh'
              ? '建筑公司的资产发行功能已拆分为两个独立页面，请使用左侧导航菜单访问：'
              : 'Asset issuance functions for construction companies have been split into two separate pages. Please use the left navigation menu:'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/app/receivables-management')}
              className="p-6 bg-teal-50 border-2 border-teal-200 rounded-lg hover:bg-teal-100 transition-colors text-left"
            >
              <i className="fas fa-file-invoice-dollar text-2xl text-teal-600 mb-2"></i>
              <h3 className="font-semibold text-gray-800 mb-1">
                {language === 'zh' ? '应收账款管理' : 'Receivables Management'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'zh' ? '管理从核心企业接收的应收账款代币' : 'Manage receivables received from core enterprises'}
              </p>
            </button>
            <button
              onClick={() => navigate('/app/inventory-issuance')}
              className="p-6 bg-teal-50 border-2 border-teal-200 rounded-lg hover:bg-teal-100 transition-colors text-left"
            >
              <i className="fas fa-boxes text-2xl text-teal-600 mb-2"></i>
              <h3 className="font-semibold text-gray-800 mb-1">
                {language === 'zh' ? '库存代币发行' : 'Inventory Issuance'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'zh' ? '发行和管理库存代币' : 'Issue and manage inventory tokens'}
              </p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 核心企业新布局：AR确权管理
  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('assetIssuance.title')}</h2>
        <p className="text-gray-600">{t('assetIssuance.description')}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 标签页 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-8 py-4 font-medium transition-colors border-b-2 text-center justify-center ${activeTab === 'pending'
              ? 'text-blue-600 border-blue-600 bg-blue-50'
              : 'text-gray-600 border-transparent hover:text-gray-800 hover:bg-gray-50'
              }`}
          >
            <i className="fas fa-list-ul mr-2"></i>
            {t('assetIssuance.pendingConfirmationList')}
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`flex-1 px-8 py-4 font-medium transition-colors border-b-2 text-center justify-center ${activeTab === 'confirmed'
              ? 'text-green-600 border-green-600 bg-green-50'
              : 'text-gray-600 border-transparent hover:text-gray-800 hover:bg-gray-50'
              }`}
          >
            <i className="fas fa-check-circle mr-2"></i>
            {t('assetIssuance.confirmedList')}
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex-1 px-8 py-4 font-medium transition-colors border-b-2 text-center justify-center ${activeTab === 'rejected'
              ? 'text-red-600 border-red-600 bg-red-50'
              : 'text-gray-600 border-transparent hover:text-gray-800 hover:bg-gray-50'
              }`}
          >
            <i className="fas fa-times-circle mr-2"></i>
            {t('assetIssuance.rejectedList')}
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          {activeTab === 'pending' && (
            <div className="animate-fade-in">
              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-sm text-orange-700 font-medium opacity-80">{t('assetIssuance.pendingCount')}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{pendingARs.length}</p>
                  </div>
                  <i className="fas fa-file-invoice text-orange-300 text-3xl"></i>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-sm text-emerald-700 font-medium opacity-80">{t('assetIssuance.pendingTotal')}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">HK$ 2.5M</p>
                  </div>
                  <i className="fas fa-coins text-emerald-300 text-3xl"></i>
                </div>
              </div>

              {/* 待确认列表 */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-base">
                      <th className="py-4 px-4 font-semibold">{t('dashboard.arId')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.smeName')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.receivableAmount')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.dueDate')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.submissionTime')}</th>
                      <th className="py-4 px-4 font-semibold">{t('dashboard.relatedDocuments')}</th>
                      <th className="py-4 px-4 font-semibold text-right">{t('dashboard.operations')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-lg text-gray-700">
                    {pendingARs.map((ar) => (
                      <tr key={ar.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-medium text-blue-600">{ar.id}</td>
                        <td className="py-4 px-4 font-medium">{language === 'zh' ? ar.smeZh : ar.smeEn}</td>
                        <td className="py-4 px-4 font-bold tracking-wide">{ar.amount}</td>
                        <td className="py-4 px-4">{ar.dueDate}</td>
                        <td className="py-4 px-4 text-gray-500 text-base">{ar.submissionTime}</td>
                        <td className="py-4 px-4 text-base">
                          <button
                            onClick={() => openFileModal(ar.file)}
                            className="text-blue-600 hover:text-blue-800 underline flex items-center"
                          >
                            <i className="fas fa-file-pdf mr-1"></i>
                            {t('assetIssuance.viewContract')}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right space-x-3">
                          <button
                            onClick={() => handleConfirm(ar.id)}
                            className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 text-base font-medium transition-colors"
                          >
                            {t('common.confirm')}
                          </button>
                          <button
                            onClick={() => openRejectModal(ar.id)}
                            className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 text-base font-medium transition-colors"
                          >
                            {t('assetIssuance.reject')}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingARs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-500 text-xl">
                          {t('common.noData')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'confirmed' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-base">
                      <th className="py-4 px-4 font-semibold">{t('dashboard.arId')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.smeName')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.receivableAmount')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.dueDate')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.confirmationTime')}</th>
                      <th className="py-4 px-4 font-semibold">{t('dashboard.status')}</th>
                      <th className="py-4 px-4 font-semibold text-right">{t('dashboard.operations')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-lg text-gray-700">
                    {confirmedARs.map((ar) => (
                      <tr key={ar.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-medium text-blue-600">{ar.id}</td>
                        <td className="py-4 px-4 font-medium">{language === 'zh' ? ar.smeZh : ar.smeEn}</td>
                        <td className="py-4 px-4 font-bold tracking-wide">{ar.amount}</td>
                        <td className="py-4 px-4">{ar.dueDate}</td>
                        <td className="py-4 px-4 text-gray-500 text-base">{ar.confirmationTime}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {t('dashboard.completed')}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => openDetailsModal(ar)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {t('dashboard.viewDetails')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rejected' && (
            <div className="animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-base">
                      <th className="py-4 px-4 font-semibold">{t('dashboard.arId')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.smeName')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.receivableAmount')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.rejectionTime')}</th>
                      <th className="py-4 px-4 font-semibold">{t('assetIssuance.rejectReason')}</th>
                      <th className="py-4 px-4 font-semibold text-right">{t('dashboard.operations')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-lg text-gray-700">
                    {rejectedARs.map((ar) => (
                      <tr key={ar.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-medium text-blue-600">{ar.id}</td>
                        <td className="py-4 px-4 font-medium">{language === 'zh' ? ar.smeZh : ar.smeEn}</td>
                        <td className="py-4 px-4 font-bold tracking-wide">{ar.amount}</td>
                        <td className="py-4 px-4 text-gray-500 text-base">{ar.rejectionTime}</td>
                        <td className="py-4 px-4 text-red-600 max-w-xs truncate">{language === 'zh' ? ar.rejectionReasonZh : ar.rejectionReasonEn}</td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleModify(ar.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            [{t('assetIssuance.modify')}]
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 拒绝确认模态框 */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('assetIssuance.confirmReject')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {language === 'zh' ? '您确定要拒绝此 AR 确权申请吗？此操作不可撤销。' : 'Are you sure you want to reject this AR confirmation? This action cannot be undone.'}
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('assetIssuance.rejectReason')}
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={t('assetIssuance.enterRejectReason')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none h-24"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {t('assetIssuance.reject')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 文件预览模态框 */}
      {fileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setFileModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{t('assetIssuance.viewContract')}</h3>
              <button onClick={() => setFileModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-500">
                <i className="fas fa-file-pdf text-6xl mb-4 text-red-500"></i>
                <p className="text-xl font-medium">{currentFile}</p>
                <p className="text-base mt-2">{language === 'zh' ? '在此处显示文件预览' : 'File preview displayed here'}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFileModalOpen(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 详情模态框 */}
      {detailsModalOpen && currentAR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setDetailsModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">{t('assetIssuance.arDetails')}</h3>
              <button onClick={() => setDetailsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
                <span className="text-gray-500">{t('dashboard.arId')}</span>
                <span className="col-span-2 font-medium text-gray-800">{currentAR.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
                <span className="text-gray-500">{t('assetIssuance.smeName')}</span>
                <span className="col-span-2 font-medium text-gray-800">{language === 'zh' ? currentAR.smeZh : currentAR.smeEn}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
                <span className="text-gray-500">{t('assetIssuance.receivableAmount')}</span>
                <span className="col-span-2 font-bold text-blue-600">{currentAR.amount}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
                <span className="text-gray-500">{t('assetIssuance.dueDate')}</span>
                <span className="col-span-2 text-gray-800">{currentAR.dueDate}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
                <span className="text-gray-500">{t('assetIssuance.submissionTime')}</span>
                <span className="col-span-2 text-gray-800">{currentAR.submissionTime}</span>
              </div>
              {currentAR.confirmationTime && (
                <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{t('assetIssuance.confirmationTime')}</span>
                  <span className="col-span-2 text-gray-800">{currentAR.confirmationTime}</span>
                </div>
              )}
              {currentAR.rejectionTime && (
                <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{t('assetIssuance.rejectionTime')}</span>
                  <span className="col-span-2 text-red-600">{currentAR.rejectionTime}</span>
                </div>
              )}
              {(currentAR.rejectionReasonZh || currentAR.rejectionReasonEn) && (
                <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{t('assetIssuance.rejectReason')}</span>
                  <span className="col-span-2 text-red-600">{language === 'zh' ? currentAR.rejectionReasonZh : currentAR.rejectionReasonEn}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <span className="text-gray-500">{t('dashboard.relatedDocuments')}</span>
                <span className="col-span-2">
                  <button
                    onClick={() => openFileModal(currentAR.file)}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <i className="fas fa-file-pdf mr-2"></i>
                    {currentAR.file}
                  </button>
                </span>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssetIssuanceContent
