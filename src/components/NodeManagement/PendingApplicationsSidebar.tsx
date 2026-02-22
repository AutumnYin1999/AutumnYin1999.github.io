import { useLanguage } from '../../hooks/useLanguage'

export default function PendingApplicationsSidebar() {
    const { language } = useLanguage()

    const pendingApplications = [
        { id: '1', name: language === 'zh' ? '香港数码港管理有限公司' : 'Hong Kong Cyberport Management', time: '2025-02-20 10:30' },
        { id: '2', name: language === 'zh' ? '阿里云计算有限公司' : 'Alibaba Cloud Computing', time: '2025-02-19 15:45' },
        { id: '3', name: language === 'zh' ? '腾讯科技(深圳)有限公司' : 'Tencent Technology (Shenzhen)', time: '2025-02-18 09:15' },
        { id: '4', name: language === 'zh' ? '百度时代网络技术(北京)有限公司' : 'Baidu Times Network Tech', time: '2025-02-17 14:20' },
        { id: '5', name: language === 'zh' ? '华为技术有限公司' : 'Huawei Technologies', time: '2025-02-16 11:05' },
    ]

    const title = language === 'zh' ? '待审核节点申请（5）' : 'Pending Node Applications (5)'
    const auditBtnText = language === 'zh' ? '审核' : 'Audit'

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-fit flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 text-lg flex items-center">
                    <i className="fas fa-clipboard-check mr-2 text-blue-600"></i>
                    {title}
                </h3>
            </div>
            <div className="p-4 flex-1">
                <ul className="space-y-4">
                    {pendingApplications.map(app => (
                        <li key={app.id} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0 gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-medium text-gray-800 truncate" title={app.name}>{app.name}</p>
                                <p className="text-sm text-gray-500 mt-1">{app.time}</p>
                            </div>
                            <button className="flex-shrink-0 px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded text-sm font-medium hover:bg-blue-100 transition-colors whitespace-nowrap">
                                {auditBtnText}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {/* 占位分页 */}
            <div className="p-3 border-t border-gray-200 flex justify-center items-center space-x-2 text-sm">
                <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 cursor-not-allowed">
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-blue-500 bg-blue-50 text-blue-600 font-medium">
                    1
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-transparent text-gray-600 hover:bg-gray-50">
                    2
                </button>
                <span className="text-gray-400">...</span>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-transparent text-gray-600 hover:bg-gray-50">
                    5
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50">
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    )
}
