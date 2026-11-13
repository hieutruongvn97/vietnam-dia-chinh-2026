import React from 'react'
import { Landmark, ShieldCheck, Heart } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-amber-300 text-xs">
                ★
              </div>
              <span>Hệ Thống Tra Cứu Địa Giới Hành Chính Việt Nam 2026</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Công cụ hỗ trợ công dân, tổ chức và doanh nghiệp tra cứu, chuẩn hóa địa chỉ hành chính theo đề án cải cách sắp xếp 63 tỉnh/thành xuống 34 đơn vị hành chính và mô hình 2 cấp.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>Căn Cứ Pháp Lý & Văn Bản Quy Phạm</span>
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Nghị quyết số 202/2025/QH15 của Quốc hội khóa XV</li>
              <li>• Nghị quyết của Ủy ban Thường vụ Quốc hội về sắp xếp ĐVHC cấp xã</li>
              <li>• Quyết định triển khai mô hình chính quyền địa phương 2 cấp</li>
              <li>• Thời điểm có hiệu lực: Từ ngày 01/07/2025</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Nguồn Dữ Liệu Đối Chiếu</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Dữ liệu được chuẩn hóa, đối chiếu từ Cổng thông tin điện tử Quốc hội, Chính phủ, Bộ Nội vụ, kết hợp nguồn dữ liệu tra cứu địa chính mới từ hệ thống FPT Long Châu.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <span>© 2026 Hệ thống Tra cứu Địa giới Hành chính Mới Việt Nam.</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-extrabold border border-amber-400/30 text-[11px]">
              Tác giả: MH-SAMA
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <span>Phục vụ cộng đồng và số hóa hành chính quốc gia</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  )
}
