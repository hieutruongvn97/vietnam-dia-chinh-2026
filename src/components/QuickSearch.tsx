import React, { useState, useEffect } from 'react'
import { Search, MapPin, Copy, Check, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import type { SearchResultItem } from '../types'

interface QuickSearchProps {
  onSelectResult?: (item: SearchResultItem) => void
}

export const QuickSearch: React.FC<QuickSearchProps> = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Popular search suggestions
  const suggestions = [
    'Vĩnh Hải',
    'Bắc Nha Trang',
    'Côn Đảo',
    'Quận 5',
    'An Đông',
    'Quận 2',
    'An Khánh',
    'Hải Dương',
    'Bình Dương',
    'Bắc Ninh',
    'Lâm Đồng',
    'Mỹ Tho'
  ]

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.results || [])
          setIsLoading(false)
        })
        .catch(err => {
          console.error('Search error:', err)
          setIsLoading(false)
        })
    }, 200)

    return () => clearTimeout(timeout)
  }, [query])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Tra cứu siêu tốc không cần chọn dropdown</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tìm Kiếm Toàn Diện Địa Giới Hành Chính 2026
          </h2>
          <p className="text-slate-600 text-sm">
            Gõ tên bất kỳ (Tỉnh, Huyện, Phường, Xã cũ hoặc mới) để xem ngay đơn vị sáp nhập và địa chỉ chuẩn hóa 2 cấp tương ứng.
          </p>

          {/* Search Box */}
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Nhập tên phường, xã, huyện, thị trấn hoặc tỉnh (VD: Vĩnh Hải, Côn Đảo, Quận 2, Hải Dương...)"
              className="w-full pl-11 pr-12 py-3.5 text-sm sm:text-base bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-red-600 focus:outline-none transition shadow-inner font-medium text-slate-900"
              autoFocus
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Loader2 className="h-5 w-5 animate-spin text-red-600" />
              </div>
            )}
            {query && !isLoading && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Suggestion tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-400">Gợi ý từ khóa:</span>
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-lg transition font-medium border border-slate-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results List */}
      {query.trim().length >= 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-2">
            <span>
              Tìm thấy <strong className="text-slate-800">{results.length}</strong> kết quả phù hợp cho "{query}"
            </span>
            <span>Chính sách: Nghị quyết 202/2025/QH15</span>
          </div>

          {results.length === 0 && !isLoading ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-500">
              <MapPin className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">Không tìm thấy địa giới hành chính khớp với từ khóa</p>
              <p className="text-xs text-slate-400 mt-1">
                Thử tìm theo tên đơn vị cấp xã, phường, hoặc tỉnh thành lân cận.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-red-400 hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.type === 'province'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {item.type === 'province' ? 'CẤP TỈNH MỚI' : 'CẤP XÃ/PHƯỜNG MỚI'}
                      </span>
                      {item.wardCode && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Mã: {item.wardCode}
                        </span>
                      )}
                    </div>

                    <div className="text-base sm:text-lg font-bold text-slate-900 flex items-baseline gap-2">
                      <span>{item.type === 'province' ? item.name : item.newAddressLabel}</span>
                    </div>

                    {item.legacyAddress && (
                      <div className="text-xs text-slate-500 flex items-start gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-slate-600">Đơn vị sáp nhập hình thành:</span>{' '}
                          <span className="text-slate-800">{item.legacyAddress}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      onClick={() => handleCopy(item.type === 'province' ? (item.name || '') : (item.newAddressLabel || ''))}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                    >
                      {copiedText === (item.type === 'province' ? item.name : item.newAddressLabel) ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
