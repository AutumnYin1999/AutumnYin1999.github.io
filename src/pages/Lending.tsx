import { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useRole } from '../hooks/useRole'
import NBFIView from '../components/Lending/NBFIView'
import BankView from '../components/Lending/BankView'

function Lending() {
  const { t, language } = useLanguage()
  const { currentRole, permissions } = useRole()
  // 从localStorage获取用户角色（与TopNavbar同步）
  const [userRole, setUserRole] = useState<'核心企业' | '建筑公司' | 'NBFI' | 'Bank' | '银行' | 'admin' | '系统管理员'>(() => {
    return (localStorage.getItem('userRole') as any) || 'NBFI'
  })

  // 监听localStorage变化（当在同一标签页切换角色时）
  useEffect(() => {
    const handleStorageChange = () => {
      const newRole = localStorage.getItem('userRole') as any
      if (newRole) {
        setUserRole(newRole)
      }
    }

    // 监听storage事件（跨标签页）
    window.addEventListener('storage', handleStorageChange)

    // 定期检查localStorage（同一标签页）
    const interval = setInterval(() => {
      const currentRole = localStorage.getItem('userRole') as any
      if (currentRole && currentRole !== userRole) {
        setUserRole(currentRole)
      }
    }, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [userRole])

  // 根据用户角色判断显示哪个视图
  const isAdmin = currentRole === 'admin' || userRole === 'admin' || userRole === '系统管理员'
  const isNBFI = userRole === 'NBFI' || (isAdmin && permissions.lendingBorrow) // 系统管理员可以查看NBFI视图
  const isBank = userRole === 'Bank' || userRole === '银行' || (isAdmin && permissions.lendingLend) // 系统管理员可以查看Bank视图

  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      {/* 系统管理员：显示所有视图 */}
      {isAdmin && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('lending.nbfiView') || 'NBFI视图（借款方）'}</h3>
            <NBFIView />
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('lending.bankView') || '银行视图（贷款方）'}</h3>
            <BankView />
          </div>
        </div>
      )}

      {/* 普通用户：显示对应视图 */}
      {!isAdmin && (
        <>
          {isNBFI && <NBFIView />}
          {isBank && <BankView />}
          {!isNBFI && !isBank && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <i className="fas fa-exclamation-triangle text-yellow-600 text-3xl mb-3"></i>
              <p className="text-yellow-800 font-medium">
                {language === 'zh' ? '您没有权限访问此功能' : 'You do not have permission to access this feature'}
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                {t('lending.switchRoleHint') || '请在顶部导航栏切换用户角色为"NBFI"或"Bank"'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Lending
