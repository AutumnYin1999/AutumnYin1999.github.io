import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const smeTranslations: Record<string, string> = {
    '建业工程': 'Jianye Engineering',
    '恒发建材': 'Hengfa Building Materials',
    '伟业机电': 'Weiye Machinery',
};

interface Task {
    id: string;
    type: string;
    sme: string;
    submitTime: string;
    reviewTime: string;
    result: 'passed' | 'rejected';
}

const mockTasks: Task[] = [
    {
        id: 'TASK-023',
        type: 'KYC',
        sme: '建业工程',
        submitTime: '2025-04-01',
        reviewTime: '2025-04-02',
        result: 'passed',
    },
    {
        id: 'TASK-021',
        type: 'AR',
        sme: '恒发建材',
        submitTime: '2025-03-30',
        reviewTime: '2025-04-01',
        result: 'passed',
    },
    {
        id: 'TASK-019',
        type: '合规',
        sme: '伟业机电',
        submitTime: '2025-03-28',
        reviewTime: '2025-03-29',
        result: 'rejected',
    },
];

export default function HistoryList() {
    const { language } = useLanguage();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const closeModal = () => setSelectedTask(null);

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">
                    {language === 'zh' ? '历史记录' : 'History'}
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Task ID</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Type</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">SME</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Submit Time</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Review Time</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Result</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {mockTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-2 font-mono text-xs text-gray-800">{task.id}</td>
                                <td className="px-3 py-2 text-xs text-gray-800">{task.type}</td>
                                <td className="px-3 py-2 text-xs text-gray-800">{language === 'zh' ? task.sme : smeTranslations[task.sme] || task.sme}</td>
                                <td className="px-3 py-2 text-xs text-gray-800">{task.submitTime}</td>
                                <td className="px-3 py-2 text-xs text-gray-800">{task.reviewTime}</td>
                                <td className="px-3 py-2 text-xs">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${task.result === 'passed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {task.result === 'passed'
                                            ? language === 'zh'
                                                ? '✅ 通过'
                                                : 'Passed'
                                            : language === 'zh'
                                                ? '❌ 拒绝'
                                                : 'Rejected'}
                                    </span>
                                </td>
                                <td className="px-3 py-2">
                                    <button
                                        onClick={() => setSelectedTask(task)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        {language === 'zh' ? '查看详情' : 'View Details'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <h4 className="text-lg font-semibold mb-4">
                            {language === 'zh' ? '任务详情' : 'Task Details'}
                        </h4>
                        <div className="space-y-2 text-sm">
                            <p><strong>ID:</strong> {selectedTask.id}</p>
                            <p><strong>{language === 'zh' ? '类型' : 'Type'}:</strong> {selectedTask.type}</p>
                            <p><strong>{language === 'zh' ? 'SME' : 'SME'}:</strong> {selectedTask.sme}</p>
                            <p><strong>{language === 'zh' ? '提交时间' : 'Submit Time'}:</strong> {selectedTask.submitTime}</p>
                            <p><strong>{language === 'zh' ? '审核时间' : 'Review Time'}:</strong> {selectedTask.reviewTime}</p>
                            <p><strong>{language === 'zh' ? '结果' : 'Result'}:</strong> {selectedTask.result === 'passed' ? (language === 'zh' ? '通过' : 'Passed') : (language === 'zh' ? '拒绝' : 'Rejected')}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
