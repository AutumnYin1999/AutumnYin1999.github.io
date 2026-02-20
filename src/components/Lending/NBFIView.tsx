import MyLoans from './NBFI/MyLoans'
import NBFISidebar from './NBFI/NBFISidebar'
import PortfolioCharts from './NBFI/PortfolioCharts'

function NBFIView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 左侧：主要内容 */}
      <div className="lg:col-span-3 space-y-6">
        <MyLoans />
        <PortfolioCharts />
      </div>

      {/* 右侧：统计面板 */}
      <div className="lg:col-span-1">
        <NBFISidebar />
      </div>
    </div>
  )
}

export default NBFIView
