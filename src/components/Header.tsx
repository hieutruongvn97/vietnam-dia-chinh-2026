import React from 'react'
import { CheckCircle2 } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-red-700 via-red-800 to-rose-900 text-white shadow-xl border-b-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-amber-400/20 p-2 flex items-center justify-center border-2 border-amber-300 shadow-inner">
                {/* Emblem stylized star */}
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center border border-amber-300">
                  <span className="text-amber-300 text-2xl font-black">★</span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-red-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                2026
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <div className="inline-flex items-center gap-2 bg-red-950/50 text-amber-300 text-xs px-2.5 py-1 rounded-full border border-amber-400/30 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nghị quyết số 202/2025/QH15 • Hiệu lực từ 01/07/2025</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-amber-400 text-red-950 text-xs px-3 py-1 rounded-full font-extrabold shadow-sm">
                  <span>Tác giả: MH-SAMA</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Tra Cứu Địa Giới & Đơn Vị Hành Chính Mới Việt Nam
              </h1>
              <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-2xl">
                Chuẩn hóa địa chỉ hành chính theo mô hình chính quyền địa phương 2 cấp năm 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

