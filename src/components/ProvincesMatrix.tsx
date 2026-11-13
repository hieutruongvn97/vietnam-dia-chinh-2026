import React, { useState, useEffect } from 'react'
import {
  Building,
  Landmark,
  MapPin,
  Users,
  Maximize2,
  Search,
  Filter,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react'
import type { ProvinceMatrixItem, WardNew } from '../types'

export const ProvincesMatrix: React.FC = () => {
  const [matrix, setMatrix] = useState<ProvinceMatrixItem[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedProvinceModal, setSelectedProvinceModal] = useState<ProvinceMatrixItem | null>(null)
  const [modalWards, setModalWards] = useState<WardNew[]>([])
  const [isWardsLoading, setIsWardsLoading] = useState<boolean>(false)
  const [wardSearch, setWardSearch] = useState<string>('')

  useEffect(() => {
    fetch('/api/matrix')
      .then(res => res.json())
      .then(data => setMatrix(data))
      .catch(err => console.error('Error fetching matrix:', err))
  }, [])

  // Open modal to view wards of a province
  const openWardsModal = (item: ProvinceMatrixItem) => {
    setSelectedProvinceModal(item)
    setIsWardsLoading(true)
    setWardSearch('')
    fetch(`/api/current/wards?provinceCode=${item.code}`)
      .then(res => res.json())
      .then(data => {
        setModalWards(data.wards || [])
        setIsWardsLoading(false)
      })
      .catch(err => {
        console.error('Error fetching province wards:', err)
        setIsWardsLoading(false)
      })
  }

  const regions = [
    { id: 'all', label: 'Tất cả (34 Đơn vị)' },
    { id: 'central', label: '6 TP Trực thuộc TW' },
    { id: 'Đồng bằng sông Hồng', label: 'ĐB Sông Hồng' },
    { id: 'Đông Nam Bộ', label: 'Đông Nam Bộ' },
    { id: 'Đồng bằng sông Cửu Long', label: 'ĐB Sông Cửu Long' },
    { id: 'Tây Nguyên - Duyên hải', label: 'Tây Nguyên - Duyên hải' },
    { id: 'Bắc Trung Bộ', label: 'Bắc Trung Bộ' },
    { id: 'Tây Bắc Bộ', label: 'Tây Bắc Bộ' },
    { id: 'Đông Bắc Bộ', label: 'Đông Bắc Bộ' }
  ]

  const filteredMatrix = matrix.filter(item => {
    const matchRegion =
      selectedRegion === 'all'
        ? true
        : selectedRegion === 'central'
        ? item.type.includes('Thành phố')
        : item.region.includes(selectedRegion)

    const matchSearch =
      searchTerm.trim() === ''
        ? true
        : item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.legacyProvinces.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
          item.center.toLowerCase().includes(searchTerm.toLowerCase())

    return matchRegion && matchSearch
  })

  const filteredModalWards = modalWards.filter(w =>
    w.name.toLowerCase().includes(wardSearch.toLowerCase()) ||
    (w.legacyAddress && w.legacyAddress.toLowerCase().includes(wardSearch.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-2">
              <Landmark className="w-3.5 h-3.5" />
              <span>Nghị quyết 202/2025/QH15</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Danh Sách 34 Đơn Vị Hành Chính Cấp Tỉnh Năm 2026
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Sau đợt sắp xếp lịch sử có hiệu lực từ ngày 01/07/2025, Việt Nam có 34 đơn vị hành chính cấp tỉnh gồm 6 Thành phố trực thuộc Trung ương và 28 Tỉnh.
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm theo tên tỉnh mới hoặc cũ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-red-600 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Region Filter Buttons */}
        <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {regions.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedRegion === r.id
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 34 Provinces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMatrix.map(item => {
          const isCentral = item.type.includes('Thành phố')
          return (
            <div
              key={item.code}
              className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg flex flex-col justify-between overflow-hidden ${
                isCentral
                  ? 'border-red-400 ring-2 ring-red-100 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header tag */}
                <div className={`px-5 py-3 border-b flex items-center justify-between text-xs font-bold ${
                  isCentral
                    ? 'bg-gradient-to-r from-red-700 to-rose-800 text-white'
                    : 'bg-slate-50 text-slate-700 border-slate-100'
                }`}>
                  <span className="flex items-center gap-1.5">
                    {isCentral ? <Sparkles className="w-3.5 h-3.5 text-amber-300" /> : <Building className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{item.type}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    isCentral ? 'bg-red-950/60 text-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    Mã: {item.code}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Name and Region */}
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>{item.region} • Trung tâm: <strong className="text-slate-700">{item.center}</strong></span>
                    </div>
                  </div>

                  {/* Merged Units */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                    <span className="text-slate-500 font-semibold block">Đơn vị cấu thành sau sáp nhập:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.legacyProvinces.map((lp, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-slate-300 px-2 py-0.5 rounded-md font-medium text-slate-800 text-[11px]"
                        >
                          {lp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-slate-400 flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" />
                        <span>Diện tích</span>
                      </div>
                      <div className="font-bold text-slate-800 mt-0.5">
                        {item.areaKm2.toLocaleString('vi-VN')} km²
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Dân số ước tính</span>
                      </div>
                      <div className="font-bold text-slate-800 mt-0.5">
                        {(item.population / 1000000).toFixed(2)} triệu người
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Highlights pills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-medium"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action footer */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                <button
                  onClick={() => openWardsModal(item)}
                  className="w-full py-2 px-3 bg-white hover:bg-red-50 text-red-700 hover:text-red-800 border border-red-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Xem danh sách xã/phường sáp nhập</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Wards of Province */}
      {selectedProvinceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-700 to-rose-800 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                  Mô hình 2 cấp • Danh sách phường/xã năm 2026
                </span>
                <h3 className="text-xl font-bold mt-1">
                  {selectedProvinceModal.name} ({modalWards.length} đơn vị hành chính cấp xã)
                </h3>
              </div>
              <button
                onClick={() => setSelectedProvinceModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Filter */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm nhanh xã/phường mới hoặc các đơn vị cũ sáp nhập..."
                value={wardSearch}
                onChange={e => setWardSearch(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800"
                autoFocus
              />
            </div>

            {/* Modal List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {isWardsLoading ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Đang tải danh mục xã/phường...
                </div>
              ) : filteredModalWards.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Không tìm thấy phường/xã nào khớp với từ khóa
                </div>
              ) : (
                filteredModalWards.map(w => (
                  <div
                    key={w.wardCode}
                    className="p-3.5 bg-slate-50 hover:bg-red-50/50 rounded-xl border border-slate-200 transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{w.name}</span>
                      <span className="text-[11px] font-mono text-slate-400">Mã: {w.wardCode}</span>
                    </div>
                    {w.legacyAddress && (
                      <p className="text-xs text-slate-600">
                        <span className="font-medium text-slate-500">Đơn vị sáp nhập:</span> {w.legacyAddress}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedProvinceModal(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
