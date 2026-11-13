import React, { useState } from 'react'
import {
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileCheck2,
  Wand2
} from 'lucide-react'
import { parseAndNormalizeDetailAddress, type ParsedAddress } from '../utils/addressParser'

export const DetailAddressSolver: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    '12 ấp Thào Lạng, Xã Vĩnh Trạch, Thành phố Bạc Liêu, Tỉnh Bạc Liêu'
  )
  const [parsedResult, setParsedResult] = useState<ParsedAddress>(() =>
    parseAndNormalizeDetailAddress('12 ấp Thào Lạng, Xã Vĩnh Trạch, Thành phố Bạc Liêu, Tỉnh Bạc Liêu')
  )
  const [copied, setCopied] = useState<boolean>(false)

  const handleAnalyze = (textToAnalyze?: string) => {
    const text = textToAnalyze || inputText
    if (!text.trim()) return
    const res = parseAndNormalizeDetailAddress(text)
    setParsedResult(res)
  }

  const setExampleAndAnalyze = (sample: string) => {
    setInputText(sample)
    handleAnalyze(sample)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-2">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Công Nghệ Bóc Tách & Chuẩn Hóa Địa Chỉ Chi Tiết Đa Tầng</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Giải Quyết Bài Toán Địa Chỉ Chi Tiết (Số Nhà, Ấp, Khóm, Thôn)
          </h2>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            Hầu hết các hệ thống tra cứu hành chính chỉ xử lý tới cấp Xã/Phường. Khi đi vào thực tế (số nhà, ấp, khóm, tổ), phát sinh 2 khó khăn lớn:
            <strong> (1) Xã lên Phường làm đổi danh xưng "Ấp" ➔ "Khóm/Khu phố"</strong> và 
            <strong> (2) Các ấp đông dân bị chia tách (VD: Ấp Trung Lân ➔ Trung Lân 1, Trung Lân 2)</strong>. Công cụ dưới đây tự động bóc tách và chuẩn hóa toàn bộ 5 tầng địa chỉ.
          </p>
        </div>

        {/* Input box */}
        <div className="mt-5 space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Nhập chuỗi địa chỉ chi tiết bất kỳ:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="VD: 12 ấp Thào Lạng, Xã Vĩnh Trạch, Thành phố Bạc Liêu, Tỉnh Bạc Liêu..."
              className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-red-600 focus:outline-none transition shadow-inner text-slate-900"
            />
            <button
              onClick={() => handleAnalyze()}
              className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Bóc Tách & Chuẩn Hóa</span>
            </button>
          </div>

          {/* Quick Example Presets */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Thử các ví dụ thực tế:</span>
            <button
              onClick={() => setExampleAndAnalyze('12 ấp Thào Lạng, Xã Vĩnh Trạch, Thành phố Bạc Liêu, Tỉnh Bạc Liêu')}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg font-semibold transition cursor-pointer"
            >
              Ví dụ 1: 12 ấp Thào Lạng (Bạc Liêu ➔ Cà Mau)
            </button>
            <button
              onClick={() => setExampleAndAnalyze('58 ấp Trung Lân, xã Bà Điểm, Huyện Hóc Môn, Hồ Chí Minh')}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-300 rounded-lg font-semibold transition cursor-pointer"
            >
              Ví dụ 2: 58 ấp Trung Lân (Bà Điểm, Hóc Môn ➔ TP.HCM)
            </button>
            <button
              onClick={() => setExampleAndAnalyze('số 149 Đường Phạm Văn Sáng Ấp 2, Xã Xuân Thới Thượng, Huyện Hóc Môn,Thành phố Hồ Chí Minh')}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-lg font-semibold transition cursor-pointer"
            >
              Ví dụ 3: 149 Phạm Văn Sáng (Xuân Thới Thượng ➔ Ấp 22 Bà Điểm)
            </button>
            <button
              onClick={() => setExampleAndAnalyze('8/3a đường Bà Điểm 9, Ấp Nam Lân, Xã Bà Điểm, Huyện Hóc Môn, Tp.HCM')}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-300 rounded-lg font-semibold transition cursor-pointer"
            >
              Ví dụ 4: 8/3a Bà Điểm 9 (Nam Lân ➔ Nam Lân 2)
            </button>
            <button
              onClick={() => setExampleAndAnalyze('223 Đường 2/4, Phường Vĩnh Hải, Thành phố Nha Trang, Tỉnh Khánh Hòa')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-semibold transition cursor-pointer"
            >
              Ví dụ 5: Nha Trang (Vĩnh Hải ➔ Bắc Nha Trang)
            </button>
          </div>
        </div>
      </div>

      {/* Analysis & Breakdown Display */}
      {parsedResult && (
        <div className="bg-white rounded-3xl shadow-md border-2 border-slate-200 overflow-hidden">
          {/* Top Result Banner */}
          <div className="bg-gradient-to-r from-red-700 via-rose-800 to-red-900 text-white p-6 sm:p-7">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-amber-400 text-red-950 text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow">
                    ĐỊA CHỈ CHUẨN HÓA NĂM 2026
                  </span>
                  <span className="text-xs text-rose-200 font-medium">
                    Độ tin cậy: <strong className="text-amber-300">{parsedResult.confidenceScore}%</strong>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {parsedResult.standardizedAddress}
                </h3>
                <p className="text-xs text-rose-200 mt-1">
                  Địa chỉ gốc: <span className="text-white font-medium">{parsedResult.original}</span>
                </p>
              </div>

              <button
                onClick={() => handleCopy(parsedResult.standardizedAddress)}
                className="self-start md:self-auto px-5 py-2.5 bg-white hover:bg-rose-50 text-red-900 font-extrabold text-xs sm:text-sm rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-red-700" />
                    <span>Sao chép địa chỉ chuẩn</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 5-Tier Breakdown Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-red-600" />
              <span>Chi Tiết Bóc Tách & Biến Đổi 5 Tầng Cấu Trúc Địa Chỉ</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-xs">
              {/* Tier 1: House Number / Street */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="font-bold text-slate-500 uppercase text-[10px]">Tầng 1: Số Nhà</div>
                <div className="text-base font-extrabold text-slate-900">
                  {parsedResult.houseNumber || 'Không có số'}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  ✓ Giữ nguyên số nhà
                </div>
              </div>

              {/* Tier 2: Sub-unit (Ấp / Khóm / Thôn / Tổ) */}
              <div className="p-4 bg-amber-50/70 border-2 border-amber-300 rounded-2xl space-y-2">
                <div className="font-bold text-amber-800 uppercase text-[10px] flex items-center justify-between">
                  <span>Tầng 2: Ấp / Khóm</span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 rounded font-bold">Trọng yếu</span>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 line-through">
                    {parsedResult.subUnit.original || 'Không có'}
                  </div>
                  <div className="text-sm font-extrabold text-amber-950 mt-0.5">
                    {parsedResult.subUnit.transformed}
                  </div>
                </div>
                <p className="text-[10px] text-amber-900 leading-tight">
                  {parsedResult.subUnit.ruleApplied || 'Chuẩn hóa danh xưng theo quy chuẩn đô thị'}
                </p>

                {/* If alternatives exist (e.g. Ấp Trung Lân 1 vs 2) */}
                {parsedResult.subUnit.alternatives && (
                  <div className="pt-1 border-t border-amber-200">
                    <span className="text-[10px] text-slate-500 font-semibold block mb-1">Các nhánh chia tách:</span>
                    <div className="flex flex-wrap gap-1">
                      {parsedResult.subUnit.alternatives.map((alt, i) => (
                        <span key={i} className="text-[10px] bg-white border border-amber-300 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tier 3: Commune / Ward */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="font-bold text-slate-500 uppercase text-[10px]">Tầng 3: Xã / Phường</div>
                <div>
                  <div className="text-[11px] text-slate-400 line-through">
                    {parsedResult.ward.original}
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {parsedResult.ward.transformed}
                  </div>
                </div>
                <div className="text-[10px] text-slate-600">
                  {parsedResult.ward.isUpgradedToPhuong
                    ? 'Được nâng cấp thành Phường'
                    : 'Thuộc mô hình chính quyền 2 cấp'}
                </div>
              </div>

              {/* Tier 4: District */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="font-bold text-slate-500 uppercase text-[10px]">Tầng 4: Quận / Huyện</div>
                <div className="text-xs font-bold text-slate-400 line-through">
                  {parsedResult.district.original || 'Không có'}
                </div>
                <div className="text-[10px] text-red-700 font-bold bg-red-50 px-2 py-1 rounded-md border border-red-200">
                  ✕ Bãi bỏ cấp huyện trung gian
                </div>
              </div>

              {/* Tier 5: Province */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-300 rounded-2xl space-y-2">
                <div className="font-bold text-emerald-800 uppercase text-[10px]">Tầng 5: Tỉnh / Thành</div>
                <div>
                  <div className="text-[11px] text-slate-400 line-through">
                    {parsedResult.province.original}
                  </div>
                  <div className="text-sm font-extrabold text-emerald-950 mt-0.5">
                    {parsedResult.province.transformed}
                  </div>
                </div>
                <div className="text-[10px] text-emerald-800 font-semibold">
                  Mã: {parsedResult.province.code} (Nghị quyết 202/2025)
                </div>
              </div>
            </div>

            {/* Explanation notes */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <strong className="text-slate-800 font-bold block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Các căn cứ và quy luật điều chỉnh được áp dụng:</span>
              </strong>
              <ul className="space-y-1 text-slate-600 pl-5 list-disc">
                {parsedResult.resolutionNotes.map((n, idx) => (
                  <li key={idx}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Resolution Guide Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Lightbulb className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Phân Tích Nguyên Nhân & Hướng Giải Quyết Toàn Diện Địa Chỉ Chi Tiết
            </h3>
            <p className="text-xs text-slate-500">
              Giải pháp cho trường hợp địa chỉ dưới cấp xã chưa rõ ràng hoặc bị chia tách
            </p>
          </div>
        </div>

        {/* 3 Core Problems & 3 Concrete Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          {/* Left Column: Bản chất khó khăn */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Tại sao địa chỉ chi tiết (Ấp/Khóm/Số nhà) lại phức tạp?</span>
            </h4>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold">1. Khác biệt danh xưng Nông thôn vs Đô thị:</strong>
              <p className="text-slate-600 text-xs leading-relaxed">
                Khi một xã nông thôn phát triển và được phê duyệt lên Phường (như Xã Vĩnh Trạch lên Phường Vĩnh Trạch), theo quy định quản lý hành chính đô thị:
                <strong> "Ấp" phải chuyển thành "Khóm"</strong> (ở các tỉnh Tây Nam Bộ) hoặc <strong>"Khu phố"</strong> (ở TP.HCM và Đông Nam Bộ). Rất nhiều người dân vẫn quen ghi tên ấp cũ.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold">2. Hiện tượng chia tách Ấp/Khu phố đông dân:</strong>
              <p className="text-slate-600 text-xs leading-relaxed">
                Tại các khu vực đô thị hóa nhanh như Hóc Môn, Bình Chánh (TP.HCM), một ấp cũ có thể có trên 5.000 - 10.000 dân. Khi thực hiện tinh giản tổ dân phố, thành phố chia tách một ấp thành nhiều ấp nhỏ:
                Ví dụ: <strong>Ấp Trung Lân</strong> được chia thành <strong>Ấp Trung Lân 1, Trung Lân 2</strong>. Số nhà 58 nằm trong khu vực ranh giới của Ấp Trung Lân 1.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block font-bold">3. Dữ liệu trung ương chỉ đến cấp Xã:</strong>
              <p className="text-slate-600 text-xs leading-relaxed">
                Cơ sở dữ liệu hành chính chuẩn quốc gia của Tổng cục Thống kê và Nghị quyết 202/2025/QH15 chỉ chuẩn hóa đến mã cấp Xã/Phường. Cấp ấp, khóm và số nhà thuộc thẩm quyền quyết định của UBND địa phương, dẫn tới sự thiếu đồng bộ trên các app thương mại.
              </p>
            </div>
          </div>

          {/* Right Column: Hướng giải quyết */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Hướng giải quyết triệt để (Framework 3 Bước)</span>
            </h4>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
              <strong className="text-emerald-950 block font-bold">Bước 1: Áp dụng Bộ Quy Tắc Chuyển Đổi Danh Xưng Vi Mô:</strong>
              <p className="text-slate-700 text-xs leading-relaxed">
                Hệ thống tự động nhận diện nếu đơn vị đích là <em>Phường</em> ➔ tự động hoán đổi từ khóa <em>"Ấp"</em> thành <em>"Khóm"</em> (với Tây Nam Bộ) hoặc <em>"Khu phố"</em> (với TP.HCM). Điều này giải quyết trọn vẹn Ví dụ 1 (12 ấp Thào Lạng ➔ 12 khóm Thào Lạng).
              </p>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
              <strong className="text-emerald-950 block font-bold">Bước 2: Xây dựng Từ điển Ánh xạ Chia Tách (Subdivision Dictionary):</strong>
              <p className="text-slate-700 text-xs leading-relaxed">
                Đối với các địa bàn có đề án chia tách ấp như TP.HCM (Hóc Môn, Củ Chi, Bình Chánh), nạp trước danh mục tương quan tổ/số nhà cũ sang ấp mới. Trường hợp số nhà nằm ở vùng ranh giới, hệ thống hiển thị tùy chọn cho người dân bấm chọn nhanh giữa Trung Lân 1 hoặc Trung Lân 2.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
              <strong className="text-emerald-950 block font-bold">Bước 3: Định vị Tọa Độ Địa Lý (GIS Geocoding):</strong>
              <p className="text-slate-700 text-xs leading-relaxed">
                Kết hợp với bản đồ GIS Leaflet OpenStreetMap. Thay vì chỉ tìm kiếm theo chuỗi văn bản, gắn tọa độ GPS của số nhà/tuyến đường để xác định chính xác nó nằm trong ranh giới của ấp/khóm nào sau khi điều chỉnh địa giới.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
