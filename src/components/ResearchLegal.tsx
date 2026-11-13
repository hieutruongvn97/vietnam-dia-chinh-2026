import React from 'react'
import {
  FileText,
  Calendar,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Scale,
  CreditCard,
  Home,
  Briefcase,
  Layers
} from 'lucide-react'

export const ResearchLegal: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-red-800 via-rose-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-red-500/30">
        <div className="inline-flex items-center gap-2 bg-amber-400 text-red-950 text-xs font-extrabold px-3 py-1 rounded-full mb-4 shadow">
          <Scale className="w-3.5 h-3.5" />
          <span>VĂN BẢN QUỐC HỘI KHÓA XV</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Nghiên Cứu Chuyên Sâu: Nghị Quyết Số 202/2025/QH15
        </h2>
        <p className="text-rose-100 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Đề án cải cách địa giới hành chính lớn nhất trong hơn 30 năm qua: Sắp xếp 63 tỉnh/thành phố thành 34 đơn vị hành chính cấp tỉnh, chuyển đổi sang mô hình chính quyền địa phương 2 cấp, có hiệu lực từ ngày 01/07/2025 và đi vào thực thi toàn diện trong năm 2026.
        </p>

        {/* Milestone Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-rose-700/50">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase">
              <Calendar className="w-4 h-4" />
              <span>12/06/2025</span>
            </div>
            <div className="text-sm font-semibold mt-1">Quốc hội thông qua</div>
            <p className="text-xs text-rose-200 mt-1">
              461/465 đại biểu Quốc hội (99,14%) biểu quyết tán thành thông qua Nghị quyết số 202/2025/QH15.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase">
              <Calendar className="w-4 h-4" />
              <span>01/07/2025</span>
            </div>
            <div className="text-sm font-semibold mt-1">Chính thức vận hành</div>
            <p className="text-xs text-rose-200 mt-1">
              Bộ máy chính quyền các tỉnh thành mới, các xã/phường sáp nhập chính thức đi vào hoạt động thực tế.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase">
              <Calendar className="w-4 h-4" />
              <span>Năm 2026</span>
            </div>
            <div className="text-sm font-semibold mt-1">Đồng bộ dữ liệu số</div>
            <p className="text-xs text-rose-200 mt-1">
              Vận hành trọn vẹn mô hình 2 cấp, hoàn thành tích hợp dữ liệu dân cư, đất đai, thuế và doanh nghiệp.
            </p>
          </div>
        </div>
      </div>

      {/* Part 1: Bối cảnh & Cốt lõi của Nghị quyết */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Bối Cảnh & Các Trụ Cột Cốt Lõi Của Nghị Quyết 202/2025/QH15
            </h3>
            <p className="text-xs text-slate-500">Mục tiêu chiến lược tái cấu trúc không gian phát triển quốc gia</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-red-600" />
                <span>Giảm từ 63 xuống còn 34 đơn vị cấp tỉnh</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hợp nhất các tỉnh liền kề có quy mô nhỏ, thiếu không gian liên kết vùng. 34 đơn vị mới gồm:
                <strong className="text-slate-900"> 6 Thành phố trực thuộc Trung ương</strong> (Hà Nội, TP.HCM, Hải Phòng, Đà Nẵng, Cần Thơ, Huế) và <strong className="text-slate-900">28 Tỉnh</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-red-600" />
                <span>Chuyển sang mô hình chính quyền 2 cấp</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chấm dứt tổ chức cấp huyện trung gian; chuyển đổi triệt để sang 2 cấp: <strong>Cấp Tỉnh</strong> và <strong>Cấp Cơ sở (Xã/Phường/Thị trấn/Đặc khu)</strong>. Quyền hạn hành chính công được phân cấp trực tiếp về cơ sở kết hợp dịch vụ công trực tuyến.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>Quy chuẩn hóa cấu trúc địa chỉ mới</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Địa chỉ hành chính mới tại Việt Nam chuẩn hóa theo công thức: <code className="bg-red-50 text-red-800 px-2 py-0.5 rounded font-mono font-bold">[Tên Phường/Xã/Đặc khu], [Tên Tỉnh/Thành phố]</code>. Không còn tên Quận/Huyện/Thị xã trong định danh hành chính chính thức.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-red-600" />
                <span>Tạo ra các siêu cực tăng trưởng kinh tế</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hợp nhất TP.HCM với Bình Dương và Bà Rịa - Vũng Tàu hình thành vùng kinh tế - công nghiệp - cảng biển nước sâu toàn cầu; mở rộng Hải Phòng với Hải Dương; mở rộng Đà Nẵng với Quảng Nam.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Cẩm nang pháp lý cho Công Dân & Doanh Nghiệp */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Cẩm Nang Thủ Tục Giấy Tờ Khi Thay Đổi Địa Giới Năm 2026
            </h3>
            <p className="text-xs text-slate-500">Hướng dẫn chi tiết cho công dân và tổ chức theo Nghị quyết của Quốc hội</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Item 1: CCCD & VNeID */}
          <div className="border border-slate-200 rounded-2xl p-5 hover:border-red-300 transition space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <CreditCard className="w-5 h-5" />
              <span>Căn cước công dân & Tài khoản định danh VNeID</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              • <strong>Không bắt buộc đổi thẻ:</strong> Thẻ CCCD gắn chip hiện hành ghi địa chỉ cũ vẫn có giá trị pháp lý sử dụng bình thường đến hết thời hạn ghi trên thẻ.<br />
              • <strong>VNeID tự động cập nhật:</strong> Hệ thống Cơ sở dữ liệu quốc gia về dân cư đã tự động đồng bộ mã địa giới hành chính mới trên ứng dụng VNeID.<br />
              • <strong>Khi làm lại thẻ:</strong> Công dân đổi thẻ mới hoặc cấp lại sẽ được in theo tên địa chỉ hành chính mới 2 cấp.
            </p>
          </div>

          {/* Item 2: Sổ đỏ / Giấy chứng nhận QSDĐ */}
          <div className="border border-slate-200 rounded-2xl p-5 hover:border-red-300 transition space-y-2">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <Home className="w-5 h-5" />
              <span>Sổ đỏ & Giấy tờ nhà đất</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              • <strong>Hiệu lực nguyên vẹn:</strong> Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở đã cấp ghi địa chỉ cũ vẫn có giá trị pháp lý đầy đủ, không bắt buộc đi đổi lại.<br />
              • <strong>Cập nhật miễn phí:</strong> Khi công dân thực hiện các giao dịch biến động (chuyển nhượng, tặng cho, thừa kế, thế chấp ngân hàng), Văn phòng Đăng ký đất đai sẽ xác nhận chỉnh lý trang 4 hoặc cấp đổi sang địa chỉ mới <strong>hoàn toàn miễn phí</strong>.
            </p>
          </div>

          {/* Item 3: Đăng ký kinh doanh & Doanh nghiệp */}
          <div className="border border-slate-200 rounded-2xl p-5 hover:border-red-300 transition space-y-2">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <Briefcase className="w-5 h-5" />
              <span>Đăng ký Doanh nghiệp & Giấy phép kinh doanh</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              • <strong>Tự động kết nối cơ sở dữ liệu:</strong> Cổng thông tin Quốc gia về Đăng ký Doanh nghiệp phối hợp cùng cơ quan Thuế tự động cập nhật địa bàn hoạt động của doanh nghiệp.<br />
              • <strong>Cập nhật thông tin đăng ký:</strong> Doanh nghiệp có thể nộp thông báo thay đổi nội dung đăng ký doanh nghiệp trực tuyến mà không bị tính lệ phí nhà nước.<br />
              • <strong>Hợp đồng kinh tế:</strong> Các hợp đồng đã ký trước ngày 01/07/2025 giữ nguyên giá trị, không cần ký lại phụ lục hợp đồng chỉ vì thay đổi tên địa giới.
            </p>
          </div>

          {/* Item 4: Hóa đơn điện tử & Thuế */}
          <div className="border border-slate-200 rounded-2xl p-5 hover:border-red-300 transition space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <FileText className="w-5 h-5" />
              <span>Hóa đơn điện tử & Kê khai thuế năm 2026</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              • <strong>Định dạng hóa đơn:</strong> Doanh nghiệp cấu hình mẫu hóa đơn điện tử mới theo địa chỉ chuẩn hóa 2 cấp mới (Xã/Phường, Tỉnh/Thành phố).<br />
              • <strong>Phần mềm kế toán & e-Invoice:</strong> Các nhà cung cấp giải pháp hóa đơn điện tử (VNPT, Viettel, MISA, BKAV...) đã cập nhật danh mục địa giới 34 tỉnh và phường/xã mới.<br />
              • <strong>Mã số thuế:</strong> Mã số thuế doanh nghiệp và mã số thuế cá nhân giữ nguyên, không thay đổi.
            </p>
          </div>
        </div>
      </div>

      {/* Part 3: FAQ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Các Câu Hỏi Thường Gặp (FAQ) Về Địa Chính Mới 2026
            </h3>
            <p className="text-xs text-slate-500">Giải đáp thắc mắc người dân thường gặp khi tra cứu</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>Ví dụ: Phường Vĩnh Hải, TP Nha Trang, Tỉnh Khánh Hòa đổi thành gì?</span>
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Theo phương án sắp xếp tại Khánh Hòa, Phường Vĩnh Hải cùng với các phường Vĩnh Phước, Vĩnh Thọ, Vĩnh Hòa và các xã Vĩnh Phương, Vĩnh Lương đã được sáp nhập thành <strong className="text-slate-900">Phường Bắc Nha Trang, Tỉnh Khánh Hòa</strong> (không còn cấp huyện là TP. Nha Trang trong tên địa chỉ chuẩn hóa 2 cấp).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>Khi đặt hàng trực tuyến (Shopee, Lazada, TikTok Shop) thì ghi địa chỉ ra sao?</span>
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Bạn có thể sử dụng chính công cụ tra cứu này để tra ra tên Xã/Phường mới và Tỉnh/Thành phố mới. Các đơn vị vận chuyển (VNPost, Viettel Post, GHTK, GHN, Shopee Xpress) đã đồng bộ toàn bộ dữ liệu địa giới mới theo chuẩn 2 cấp.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>Người dân có phải trả phí cập nhật thông tin địa chỉ trên các giấy tờ không?</span>
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Nghị quyết của Quốc hội quy định nghiêm cấm việc thu phí, lệ phí của người dân và doanh nghiệp khi thực hiện chuyển đổi, cập nhật thông tin do sắp xếp đơn vị hành chính. Cơ quan nhà nước chịu trách nhiệm tạo mọi điều kiện thuận lợi nhất.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
