import { useLanguage } from '../../../hooks/useLanguage'
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'

function PortfolioCharts() {
    const { language } = useLanguage()

    // 模拟假数据：饼图分布
    const distributionData = [
        { name: language === 'zh' ? 'AR (应收账款)' : 'AR (Account Receivable)', value: 10000000, color: '#3b82f6' }, // Blue
        { name: language === 'zh' ? 'ABS (资产支持证券)' : 'ABS (Asset-Backed Security)', value: 2500000, color: '#a855f7' }, // Purple
    ]

    // 模拟假数据：收益趋势折线图
    const trendData = [
        { month: language === 'zh' ? '9月' : 'Sep', return: 95000 },
        { month: language === 'zh' ? '10月' : 'Oct', return: 102000 },
        { month: language === 'zh' ? '11月' : 'Nov', return: 110000 },
        { month: language === 'zh' ? '12月' : 'Dec', return: 115000 },
        { month: language === 'zh' ? '1月' : 'Jan', return: 122000 },
        { month: language === 'zh' ? '2月' : 'Feb', return: 136000 },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* 投资组合分布 (饼图) */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <i className="fas fa-chart-pie mr-2 text-blue-600"></i>
                    {language === 'zh' ? '投资组合分布' : 'Portfolio Distribution'}
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={distributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="name"
                                label={({ x, y, cx, name, percent }) => {
                                    const parts = name.split(' (');
                                    const mainName = parts[0];
                                    const subName = parts[1] ? `(${parts[1]}` : '';
                                    return (
                                        <text x={x} y={y} fill="#475569" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="14">
                                            <tspan x={x} dy={subName ? "-0.4em" : "0"} fontWeight="bold">{mainName}</tspan>
                                            <tspan dx="4" fontWeight="bold">{(percent * 100).toFixed(0)}%</tspan>
                                            {subName && <tspan x={x} dy="1.2em" fontSize="12" fill="#94a3b8">{subName}</tspan>}
                                        </text>
                                    );
                                }}
                                labelLine={true}
                            >
                                {distributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => [`HK$ ${value.toLocaleString()}`, language === 'zh' ? '投资金额' : 'Investment']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 收益趋势 (折线图) */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <i className="fas fa-chart-line mr-2 text-green-600"></i>
                    {language === 'zh' ? '近 6 个月收益趋势' : '6-Month Yield Trend'}
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 14 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 14 }}
                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                formatter={(value: number) => [`HK$ ${value.toLocaleString()}`, language === 'zh' ? '本月收益' : 'Monthly Yield']}
                                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="return"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                name={language === 'zh' ? '收益金额' : 'Yield Amount'}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default PortfolioCharts
