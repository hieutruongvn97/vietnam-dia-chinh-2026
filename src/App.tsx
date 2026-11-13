import { Header } from './components/Header'
import { AddressLookup } from './components/AddressLookup'
import { Footer } from './components/Footer'
import { Sparkles } from 'lucide-react'

export function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top National Announcement Bar */}
      <div className="bg-amber-400 text-red-950 px-4 py-2 text-xs font-bold text-center border-b border-amber-500 shadow-sm flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-4 h-4 text-red-700" />
          <span>
            Nghị quyết số 202/2025/QH15 (hiệu lực từ 01/07/2025): Giảm từ 63 xuống 34 đơn vị cấp tỉnh & chuẩn hóa mô hình chính quyền địa phương 2 cấp.
          </span>
        </div>
        <div className="mx-auto sm:mx-0 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-900 text-amber-300 font-extrabold text-xs shadow-xs">
          <span>Tác giả: MH-SAMA</span>
        </div>
      </div>

      {/* Main Header */}
      <Header />

      {/* Main Content Area - Duy nhất mục Tra Cứu Chuyển Đổi Địa Chỉ Hành Chính */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AddressLookup />
      </main>

      {/* Authoritative Footer */}
      <Footer />
    </div>
  )
}

export default App
