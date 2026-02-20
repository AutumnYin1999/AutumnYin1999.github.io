import { useState } from 'react'
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useLanguage } from '../../hooks/useLanguage'

interface ValidatorTask {
    id: string
    type: 'KYC' | 'AR' | 'Compliance'
    sme: string
    submitTime: string
    riskScore: number
    status: 'Urgent' | 'Pending' | 'New'
    coreField: string // 统一把之前分散的字段放进这个“核心字段”
    priority?: { zh: string; en: string; isUrgent?: boolean }
}

export default function ValidatorPendingReviews() {
    const { language } = useLanguage()
    const zh = language === 'zh'

    const [filterType, setFilterType] = useState<string>('All')
    const [filterStatus, setFilterStatus] = useState<string>('All')

    // ── Stats cards ──────────────────────────────────────────────────────────
    const stats = [
        { icon: 'fa-id-card', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', label: { zh: '待审核 KYC', en: 'Pending KYC' }, value: '8' },
        { icon: 'fa-file-invoice-dollar', iconBg: 'bg-green-50', iconColor: 'text-green-600', label: { zh: '待验证 AR', en: 'Pending AR' }, value: '14' },
        { icon: 'fa-shield-halved', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', label: { zh: '待合规查询', en: 'Pending Compliance' }, value: '2' },
        { icon: 'fa-clock', iconBg: 'bg-orange-50', iconColor: 'text-orange-500', label: { zh: '平均审核耗时', en: 'Avg. Response Time' }, value: '2.3d' },
        { icon: 'fa-circle-check', iconBg: 'bg-teal-50', iconColor: 'text-teal-600', label: { zh: '今日已完成', en: 'Completed Today' }, value: '5' },
    ]

    // ── Sidebar chart data ───────────────────────────────────────────────────
    const taskDistributionData = [
        { name: 'KYC', value: 35, color: '#3b82f6' },
        { name: 'AR', value: 45, color: '#22c55e' },
        { name: 'Compliance', value: 20, color: '#a855f7' },
    ]

    const taskTrendData = [
        { day: 'Mon', count: 12 },
        { day: 'Tue', count: 18 },
        { day: 'Wed', count: 15 },
        { day: 'Thu', count: 25 },
        { day: 'Fri', count: 22 },
        { day: 'Sat', count: 10 },
        { day: 'Sun', count: 8 },
    ]

    // ── Task data ────────────────────────────────────────────────────────────
    const tasks: ValidatorTask[] = [
        {
            id: 'TASK-023', type: 'KYC', sme: zh ? '建业工程' : 'Jianye Engineering',
            coreField: zh ? '文件 3/3' : 'Files 3/3',
            submitTime: '2025-04-02', riskScore: 85, status: 'Urgent',
            priority: { zh: '立即审核', en: 'Immediate Review', isUrgent: true },
        },
        {
            id: 'TASK-024', type: 'AR', sme: zh ? '恒发建材' : 'Hengfa Materials',
            coreField: zh ? '核心企业A, HK$500K, 到期2025-07-15' : 'Core Enterprise A, HK$500K, Due 2025-07-15',
            submitTime: '2025-04-02', riskScore: 92, status: 'Pending',
        },
        {
            id: 'TASK-025', type: 'Compliance', sme: zh ? '伟业机电' : 'Weiye M&E',
            coreField: zh ? '过往纠纷记录' : 'Past Disputes',
            submitTime: '2025-04-01', riskScore: 78, status: 'New',
            priority: { zh: '标准审核', en: 'Standard Review' },
        },
        {
            id: 'TASK-026', type: 'KYC', sme: zh ? '新昌营造' : 'Hsin Chong Construction',
            coreField: zh ? '文件 2/3（缺章程）' : 'Files 2/3 (Missing Charter)',
            submitTime: '2025-04-01', riskScore: 65, status: 'Pending',
        },
        {
            id: 'TASK-027', type: 'AR', sme: zh ? '金门建筑' : 'Gammon Construction',
            coreField: zh ? '核心企业B, HK$1.2M, 到期2025-09-10' : 'Core Enterprise B, HK$1.2M, Due 2025-09-10',
            submitTime: '2025-03-31', riskScore: 88, status: 'Pending',
        },
        {
            id: 'TASK-028', type: 'Compliance', sme: zh ? '协兴建筑' : 'Hip Hing Construction',
            coreField: zh ? '安全记录查询' : 'Safety Records',
            submitTime: '2025-03-30', riskScore: 95, status: 'New',
        },
    ]

    // ── Helpers ──────────────────────────────────────────────────────────────
    const typeColor = (type: string) => {
        if (type === 'KYC') return 'bg-blue-50 text-blue-600 border border-blue-200'
        if (type === 'AR') return 'bg-green-50 text-green-600 border border-green-200'
        return 'bg-purple-50 text-purple-600 border border-purple-200'
    }

    const typeLabel = (type: string) => {
        if (!zh) return type
        if (type === 'AR') return 'AR验证'
        if (type === 'Compliance' || type === '合规') return '合规查询'
        return type
    }

    const statusBadge = (status: ValidatorTask['status']) => {
        if (status === 'Urgent')
            return (
                <span className="flex items-center font-bold text-sm text-red-600">
                    <span className="w-2 h-2 rounded-full bg-red-600 mr-1.5 animate-pulse" />
                    Urgent
                </span>
            )
        if (status === 'Pending')
            return (
                <span className="flex items-center text-sm text-orange-500 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
                    Pending
                </span>
            )
        return (
            <span className="flex items-center text-sm text-blue-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                New
            </span>
        )
    }

    const filteredTasks = tasks.filter(t => {
        const matchType = filterType === 'All' || t.type === filterType
        const matchStatus = filterStatus === 'All' || t.status === filterStatus
        return matchType && matchStatus
    })

    return (
        <div className="p-6 min-h-[calc(100vh-4rem)]">

            {/* ── Page Header ───────────────────────────────────────────────────── */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {zh ? '待处理审核' : 'Pending Reviews'}
                </h2>
                <p className="text-gray-500 text-sm">
                    {zh ? '查看和处理需要验证的申请任务' : 'View and process pending verification applications'}
                </p>
            </div>

            {/* ── Stats Cards ───────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <i className={`fas ${s.icon} ${s.iconColor}`} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 leading-tight">{zh ? s.label.zh : s.label.en}</div>
                            <div className="text-xl font-bold text-gray-900 leading-tight mt-0.5">{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Content: Grid 3:1 ────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Area (3 columns wide) */}
                <div className="lg:col-span-3 space-y-6">

                    {/* ── Filter Conditions Section ────────────────────────────────── */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-filter text-blue-600" />
                                <h3 className="font-bold text-gray-800">{zh ? '筛选条件' : 'Filter Conditions'}</h3>
                            </div>
                            <button
                                onClick={() => { setFilterType('All'); setFilterStatus('All'); }}
                                className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                            >
                                <i className="fas fa-undo text-xs" />
                                {zh ? '重置' : 'Reset'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-3">{zh ? '任务类型' : 'Task Type'}</label>
                                <div className="flex flex-wrap gap-2">
                                    {['All', 'KYC', 'AR', 'Compliance'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setFilterType(type)}
                                            className={`px-6 py-2 rounded-full text-sm font-medium border transition-all ${filterType === type
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            {type === 'Compliance' && zh ? '合规' : type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-3">{zh ? '状态' : 'Status'}</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="All">{zh ? '全部' : 'All'}</option>
                                    <option value="Urgent">{zh ? '紧急' : 'Urgent'}</option>
                                    <option value="Pending">{zh ? '待处理' : 'Pending'}</option>
                                    <option value="New">{zh ? '新任务' : 'New'}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── Task Cards List (2 per row) ────────────────────────────── */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {zh ? '待处理任务' : 'Pending Tasks'} ({filteredTasks.length})
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-5 ${task.status === 'Urgent' ? 'border-red-200 bg-red-50/10' : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex flex-col h-full justify-between gap-4">
                                        <div className="space-y-3">
                                            {/* Row 1: [Type] ID Status */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${typeColor(task.type)}`}>
                                                        {typeLabel(task.type)}
                                                    </span>
                                                    <span className="font-mono text-gray-500 text-sm font-medium">{task.id}</span>
                                                </div>
                                                {statusBadge(task.status)}
                                            </div>

                                            {/* Row 2: SME */}
                                            <div>
                                                <span className="text-gray-400 text-xs block mb-0.5">SME</span>
                                                <span className="font-bold text-gray-900 text-lg leading-tight">{task.sme}</span>
                                            </div>

                                            {/* Row 3: Core Field */}
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mb-2">
                                                <span className="text-gray-400 text-xs block mb-1">{zh ? '核心字段' : 'Core Data'}</span>
                                                <p className="text-gray-700 text-sm font-medium leading-relaxed">
                                                    {task.coreField}
                                                </p>
                                            </div>

                                            {/* Row 4: Submit Time & Risk Score & Priority */}
                                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                                                <div>
                                                    <span className="text-gray-400 text-[10px] uppercase tracking-wider block">{zh ? '提交时间' : 'Submitted'}</span>
                                                    <span className="text-gray-600 text-sm">{task.submitTime}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 text-[10px] uppercase tracking-wider block">{zh ? '风险评分' : 'Risk Score'}</span>
                                                    <span className={`text-sm font-bold ${task.riskScore >= 90 ? 'text-red-600' : task.riskScore >= 80 ? 'text-orange-500' : 'text-green-600'}`}>
                                                        {task.riskScore}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button className="flex-1 px-4 py-2.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg bg-white hover:bg-blue-50 transition-colors">
                                                {task.type === 'AR' ? (zh ? '查看合同' : 'View Contract') : (zh ? '查看详情' : 'View Details')}
                                            </button>
                                            <button className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                                {zh ? '审核' : 'Review'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredTasks.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 text-gray-400 mt-4">
                                <i className="fas fa-clipboard-check text-4xl mb-3 block" />
                                <p>{zh ? '没有匹配的任务' : 'No matching tasks'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Sidebar with charts */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Task Distribution Pie Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/30">
                            <h3 className="font-bold text-gray-800 flex items-center text-sm">
                                <i className="fas fa-chart-pie mr-2 text-blue-500" />
                                {zh ? '任务分布' : 'Task Distribution'}
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={taskDistributionData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {taskDistributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) => [`${value}%`, zh ? '占比' : 'Percentage']}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Task Trend Line Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/30">
                            <h3 className="font-bold text-gray-800 flex items-center text-sm">
                                <i className="fas fa-chart-line mr-2 text-green-500" />
                                {zh ? '近7天任务趋势' : 'Task Trend (Last 7 Days)'}
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="h-56 w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={taskTrendData}>
                                        <XAxis
                                            dataKey="day"
                                            stroke="#94a3b8"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                            cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#3b82f6"
                                            strokeWidth={4}
                                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
