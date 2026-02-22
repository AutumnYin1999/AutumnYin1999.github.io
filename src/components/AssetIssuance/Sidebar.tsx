import { NavLink, useLocation } from 'react-router-dom'
import { useRole } from '../../hooks/useRole'
import { useLanguage } from '../../hooks/useLanguage'
import { hasPermission } from '../../utils/rolePermissions'

interface SidebarProps {
  isOpen: boolean
}

// ── Menu item type with bilingual labels ──────────────────────────────────────
interface MenuItem {
  id: string
  labelZh: string
  labelEn: string
  icon: string
  path: string
  permission: string
}

function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation()
  const { currentRole } = useRole()
  const { language } = useLanguage()
  const zh = language === 'zh'

  // ── Admin-only menu (Dashboard + Node Management + Ledger Management) ──
  const adminMenuItems: MenuItem[] = [
    { id: 'dashboard', labelZh: '仪表盘', labelEn: 'Dashboard', icon: 'fa-chart-line', path: '/app/dashboard', permission: 'dashboard' },
    { id: 'node-management', labelZh: '节点管理', labelEn: 'Node Management', icon: 'fa-server', path: '/app/node-management', permission: 'nodeManagement' },
    { id: 'ledger-management', labelZh: '账本管理', labelEn: 'Ledger Management', icon: 'fa-book-open', path: '/app/ledger-management', permission: 'nodeManagement' },
  ]

  // ── Full menu for other roles ──
  const baseMenuItems: MenuItem[] = [
    { id: 'dashboard', labelZh: '仪表盘', labelEn: 'Dashboard', icon: 'fa-chart-line', path: '/app/dashboard', permission: 'dashboard' },
    { id: 'market-trading', labelZh: currentRole === '银行' ? '待审核' : '资产市场', labelEn: currentRole === '银行' ? 'Pending Reviews' : 'Asset Marketplace', icon: 'fa-exchange-alt', path: '/app/market-trading', permission: 'marketTrading' },
    { id: 'lending', labelZh: '我的投资组合', labelEn: 'My Portfolio', icon: 'fa-hand-holding-usd', path: '/app/lending', permission: 'lending' },
    { id: 'abs-packaging', labelZh: '验证历史', labelEn: 'Validation History', icon: 'fa-history', path: '/app/abs-packaging', permission: 'absPackaging' },
    { id: 'fund-recovery', labelZh: '节点收益', labelEn: 'Node Earnings', icon: 'fa-coins', path: '/app/fund-recovery', permission: 'fundRecovery' },
    { id: 'bridge', labelZh: '跨链桥', labelEn: 'Bridge', icon: 'fa-bridge', path: '/app/bridge', permission: 'bridge' },
  ]

  // 根据角色决定资产发行相关菜单项
  let assetIssuanceItems: MenuItem[] = []
  if (currentRole === '建筑公司') {
    assetIssuanceItems = [
      { id: 'receivables-management', labelZh: '应收账款管理', labelEn: 'Receivables Management', icon: 'fa-file-invoice-dollar', path: '/app/receivables-management', permission: 'assetIssuanceReceivable' },
    ]
  } else if (currentRole !== 'admin') {
    assetIssuanceItems = [
      { id: 'asset-issuance', labelZh: '确权管理', labelEn: 'AR Confirmation', icon: 'fa-coins', path: '/app/asset-issuance', permission: 'assetIssuance' },
    ]
  }

  // ── Build final menu ──
  let menuItems: MenuItem[]

  if (currentRole === 'admin') {
    // Admin only sees 3 items
    menuItems = adminMenuItems
  } else {
    // Other roles: dashboard -> asset items -> rest
    menuItems = [
      baseMenuItems[0], // dashboard
      ...assetIssuanceItems,
      ...baseMenuItems.slice(1), // other items
    ]
  }

  if (!isOpen) return null

  const visibleMenuItems = menuItems.filter((item) => {
    return hasPermission(currentRole, item.permission as any)
  })

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-sm z-40">
      <nav className="p-4 space-y-2">
        {visibleMenuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              <span>{zh ? item.labelZh : item.labelEn}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
