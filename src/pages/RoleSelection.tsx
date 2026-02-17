import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

interface Role {
  id: string
  nameKey: string
  englishName: string
  icon: string
  color: string
  bgGradient: string
  responsibilities: string[]
  permissions: { textKey: string; allowed: boolean }[]
  buttonTextKey: string
  descriptionKey: string
}

function RoleSelection() {
  const navigate = useNavigate()
  const { language, t, toggleLanguage } = useLanguage()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [theme] = useState<'light' | 'dark'>('light')

  const roles: Role[] = [
    {
      id: '建筑公司',
      nameKey: 'roles.construction',
      englishName: 'SME',
      icon: 'fa-hammer',
      color: '#0F766E',
      bgGradient: 'from-teal-800 to-teal-900',
      responsibilities: language === 'zh'
        ? ['上传应收账款', '发起融资申请', '查看资产状态']
        : ['Upload accounts receivable', 'Initiate financing applications', 'View asset status'],
      permissions: [
        { textKey: language === 'zh' ? '提交AR' : 'Submit AR', allowed: true },
        { textKey: language === 'zh' ? '查看融资历史' : 'View financing history', allowed: true },
        { textKey: language === 'zh' ? '跟踪资产状态' : 'Track asset status', allowed: true },
        { textKey: language === 'zh' ? '无验证权限' : 'No verification permission', allowed: false },
      ],
      buttonTextKey: language === 'zh' ? '进入中小企业工作台' : 'Enter SME Workspace',
      descriptionKey: language === 'zh' ? '应收账款上传与融资申请' : 'AR Upload & Financing Applications',
    },
    {
      id: '核心企业',
      nameKey: 'roles.coreEnterprise',
      englishName: 'Core Enterprise',
      icon: 'fa-building',
      color: '#EA580C',
      bgGradient: 'from-orange-600 to-orange-800',
      responsibilities: language === 'zh'
        ? ['确权应收账款', '确认付款义务', '查看供应链数据']
        : ['Confirm accounts receivable', 'Confirm payment obligations', 'View supply chain data'],
      permissions: [
        { textKey: language === 'zh' ? '确认/拒绝AR' : 'Confirm/reject AR', allowed: true },
        { textKey: language === 'zh' ? '查看确权记录' : 'View confirmation records', allowed: true },
        { textKey: language === 'zh' ? '监控供应链融资' : 'Monitor supply chain financing', allowed: true },
        { textKey: language === 'zh' ? '无资产打包权限' : 'No asset packaging permission', allowed: false },
      ],
      buttonTextKey: language === 'zh' ? '进入企业工作台' : 'Enter Enterprise Workspace',
      descriptionKey: language === 'zh' ? '确权与供应链融资' : 'Confirmation & Supply Chain Financing',
    },
    {
      id: '银行',
      nameKey: 'roles.bank',
      englishName: 'Validator',
      icon: 'fa-building-columns',
      color: '#1E40AF',
      bgGradient: 'from-blue-700 to-blue-900',
      responsibilities: language === 'zh'
        ? ['执行 KYC/AML', '验证 AR 真实性', '提供合规数据']
        : ['Perform KYC/AML', 'Verify AR authenticity', 'Provide compliance data'],
      permissions: [
        { textKey: language === 'zh' ? '审核 SME' : 'Review SME', allowed: true },
        { textKey: language === 'zh' ? '验证AR' : 'Validate AR', allowed: true },
        { textKey: language === 'zh' ? '查看节点收益' : 'View node earnings', allowed: true },
        { textKey: language === 'zh' ? '参与网络治理' : 'Participate in network governance', allowed: true },
      ],
      buttonTextKey: language === 'zh' ? '进入验证节点工作台' : 'Enter Validator Workspace',
      descriptionKey: language === 'zh' ? 'KYC/AML 与 AR 验证' : 'KYC/AML & AR Verification',
    },
    {
      id: 'NBFI',
      nameKey: 'roles.nbfi',
      englishName: 'Capital Provider',
      icon: 'fa-chart-line',
      color: '#059669',
      bgGradient: 'from-emerald-600 to-emerald-800',
      responsibilities: language === 'zh'
        ? ['投资应收账款', '购买资产包', '管理投资组合']
        : ['Invest in accounts receivable', 'Purchase asset packages', 'Manage investment portfolios'],
      permissions: [
        { textKey: language === 'zh' ? '浏览资产池' : 'Browse asset pool', allowed: true },
        { textKey: language === 'zh' ? '投资/竞标' : 'Invest/bid', allowed: true },
        { textKey: language === 'zh' ? '查看持仓' : 'View holdings', allowed: true },
        { textKey: language === 'zh' ? '无验证权限' : 'No verification permission', allowed: false },
      ],
      buttonTextKey: language === 'zh' ? '进入资本方工作台' : 'Enter Capital Provider Workspace',
      descriptionKey: language === 'zh' ? '资产投资与组合管理' : 'Asset Investment & Portfolio Management',
    },
    {
      id: 'admin',
      nameKey: 'roles.admin',
      englishName: 'Platform Admin',
      icon: 'fa-crown',
      color: '#7C3AED',
      bgGradient: 'from-purple-600 to-purple-800',
      responsibilities: language === 'zh'
        ? ['监控平台', '管理节点', '配置系统', '查看收益分账']
        : ['Monitor platform', 'Manage nodes', 'Configure system', 'View revenue distribution'],
      permissions: [
        { textKey: language === 'zh' ? '访问所有数据' : 'Access all data', allowed: true },
        { textKey: language === 'zh' ? '节点管理' : 'Node management', allowed: true },
        { textKey: language === 'zh' ? '分账管理' : 'Ledger management', allowed: true },
        { textKey: language === 'zh' ? '风险监控' : 'Risk monitoring', allowed: true },
      ],
      buttonTextKey: language === 'zh' ? '进入平台管理控制台' : 'Enter Platform Admin Console',
      descriptionKey: language === 'zh' ? '平台监控与节点配置' : 'Platform Monitoring & Node Configuration',
    },
  ]

  // 模拟平台数据（港元，与文档一致）
  const [platformStats, setPlatformStats] = useState({
    onChainARTotal: 28,       // 累计上链AR总额，单位：亿
    dailyFinancingVolume: 328, // 今日融资成交额，单位：百万
    activeSMEs: 65,
    validatorNodes: 8,
    nodeRevenue: 889,         // 节点累计收益，单位：百万
  })

  // 模拟数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setPlatformStats((prev) => ({
        onChainARTotal: Math.max(20, Math.round((prev.onChainARTotal + (Math.random() - 0.5) * 1) * 10) / 10),
        dailyFinancingVolume: Math.max(200, prev.dailyFinancingVolume + (Math.random() - 0.5) * 10),
        activeSMEs: Math.max(60, prev.activeSMEs + Math.floor((Math.random() - 0.5) * 2)),
        validatorNodes: prev.validatorNodes,
        nodeRevenue: Math.max(800, prev.nodeRevenue + (Math.random() - 0.5) * 5),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    localStorage.setItem('userRole', roleId)
    // 触发角色变更事件
    window.dispatchEvent(new CustomEvent('userRoleChanged', { detail: roleId }))

    // 根据角色跳转到不同页面
    setTimeout(() => {
      navigate('/app/dashboard')
    }, 300)
  }


  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}>
      {/* 动态背景 - 区块链节点网络效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
        {/* 连接线效果 */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          {Array.from({ length: 15 }).map((_, i) => {
            const x1 = Math.random() * 100
            const y1 = Math.random() * 100
            const x2 = Math.random() * 100
            const y2 = Math.random() * 100
            return (
              <line
                key={i}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="#3b82f6"
                strokeWidth="1"
                className="animate-pulse"
                style={{
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            )
          })}
        </svg>
      </div>

      <div className="relative z-10">
        {/* 语言切换按钮 */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleLanguage}
            className={`px-4 py-2 rounded-lg shadow-md border font-semibold text-base transition-colors ${theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
              : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-100'
              }`}
          >
            {language === 'zh' ? '切换到 English' : 'Switch to 中文'}
          </button>
        </div>

        {/* 区域A：顶部品牌区 */}
        <header className="text-center py-12 px-4">
          <div className="mb-6 inline-block">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 animate-pulse">
              <i className="fas fa-cube text-white text-5xl"></i>
            </div>
          </div>
          <h1 className={`text-6xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {t('roleSelection.title')}
          </h1>
          <p className={`text-3xl mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('roleSelection.subtitle')}
          </p>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('roleSelection.description')}
          </p>
        </header>

        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 区域B：中央角色选择面板 */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${selectedRole === role.id ? 'scale-105' : ''
                      }`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <div
                      className={`bg-gradient-to-br ${role.bgGradient} rounded-2xl p-6 shadow-xl border-2 ${selectedRole === role.id ? 'border-white ring-4 ring-white/50' : 'border-transparent'
                        } transition-all duration-300 h-full`}
                    >
                      {/* 角色图标 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <i className={`fas ${role.icon} text-white text-3xl`}></i>
                        </div>
                        {selectedRole === role.id && (
                          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center animate-pulse">
                            <i className="fas fa-check text-purple-600"></i>
                          </div>
                        )}
                      </div>

                      {/* 角色名称 */}
                      <h3 className="text-3xl font-bold text-white mb-1">{t(role.nameKey)}</h3>
                      <p className="text-white/80 text-base mb-4 min-h-[1.5rem]">{role.englishName}</p>

                      {/* 核心职责 */}
                      <div className="mb-4">
                        <p className="text-white/90 text-base font-semibold mb-2">{t('roleSelection.responsibilities')}:</p>
                        <ul className="space-y-1">
                          {role.responsibilities.map((resp, i) => (
                            <li key={i} className="text-white/80 text-sm flex items-start">
                              <i className="fas fa-circle text-white/60 text-[8px] mt-1.5 mr-2 flex-shrink-0"></i>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 权限亮点 */}
                      <div className="mb-4">
                        <p className="text-white/90 text-base font-semibold mb-2">{t('roleSelection.permissions')}:</p>
                        <div className="space-y-1">
                          {role.permissions.map((perm, i) => (
                            <div key={i} className="flex items-center text-sm">
                              {perm.allowed ? (
                                <i className="fas fa-check-circle text-green-300 mr-2 flex-shrink-0"></i>
                              ) : (
                                <i className="fas fa-times-circle text-red-300 mr-2 flex-shrink-0"></i>
                              )}
                              <span className={`${perm.allowed ? 'text-white/90' : 'text-white/60'}`}>
                                {perm.textKey}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 入口按钮 */}
                      <button
                        className="w-full py-3 px-4 bg-white rounded-lg font-semibold text-base hover:bg-white/90 transition-colors mt-auto"
                        style={{ color: role.color }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRoleSelect(role.id)
                        }}
                      >
                        {role.buttonTextKey}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 区域C：右侧演示控制面板 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 平台数据概览 */}
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  <i className="fas fa-chart-bar mr-2 text-green-500"></i>
                  {t('roleSelection.platformStats')}
                </h3>
                <div className="space-y-4">
                  {/* Item 1: Chain AR Total */}
                  <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center">
                      <i className="fas fa-link mr-3" style={{ color: '#3b82f6' }}></i>
                      <span className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('roleSelection.totalAssets')}
                      </span>
                    </div>
                    <span className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {language === 'zh' ? `HK$${Number(platformStats.onChainARTotal).toFixed(1)}亿` : `HK$${(platformStats.onChainARTotal / 10).toFixed(1)}B`}
                    </span>
                  </div>

                  {/* Item 2: Daily Financing Volume */}
                  <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center">
                      <i className="fas fa-hand-holding-usd mr-3" style={{ color: '#10b981' }}></i>
                      <span className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('roleSelection.dailyVolume')}
                      </span>
                    </div>
                    <span className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      HK${platformStats.dailyFinancingVolume.toFixed(0)}M
                    </span>
                  </div>

                  {/* Split Item 3 & 4: Active SMEs / Validator Nodes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`flex flex-col items-center justify-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center mb-1">
                        <i className="fas fa-building mr-2" style={{ color: '#8b5cf6' }}></i>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {t('roleSelection.activeSMEs')}
                        </span>
                      </div>
                      <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {platformStats.activeSMEs}+
                      </span>
                    </div>

                    <div className={`flex flex-col items-center justify-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center mb-1">
                        <i className="fas fa-server mr-2" style={{ color: '#0d9488' }}></i>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {t('roleSelection.validatorNodes')}
                        </span>
                      </div>
                      <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {platformStats.validatorNodes}
                      </span>
                    </div>
                  </div>

                  {/* Item 5: Node Revenue */}
                  <div className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center">
                      <i className="fas fa-coins mr-3" style={{ color: '#f97316' }}></i>
                      <span className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('roleSelection.bridgeVolume')}
                      </span>
                    </div>
                    <span className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      HK${platformStats.nodeRevenue.toFixed(0)}M
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 区域D：底部 Core Business Flow - 六张圆角卡片 */}
          <div className={`mt-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              <i className="fas fa-project-diagram mr-2 text-blue-500"></i>
              {t('roleSelection.businessFlow')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
              {[
                { icon: 'fa-coins', labelKey: 'roleSelection.assetIssuance', color: '#3b82f6' },
                { icon: 'fa-store', labelKey: 'roleSelection.marketTrading', color: '#10b981' },
                { icon: 'fa-box', labelKey: 'roleSelection.absPackaging', color: '#8b5cf6' },
                { icon: 'fa-hand-holding-usd', labelKey: 'roleSelection.lending', color: '#f97316' },
                { icon: 'fa-bridge', labelKey: 'roleSelection.bridge', color: '#14b8a6' },
                { icon: 'fa-file-invoice-dollar', labelKey: 'roleSelection.fundRecovery', color: '#ec4899' },
              ].map((step, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center rounded-2xl p-5 shadow-md border transition-transform hover:scale-[1.02] ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-md mb-3"
                    style={{ backgroundColor: step.color }}
                  >
                    <i className={`fas ${step.icon} text-white text-lg`}></i>
                  </div>
                  <span className={`text-base font-medium text-center leading-tight ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t(step.labelKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
