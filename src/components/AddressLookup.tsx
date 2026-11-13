import React, { useState, useEffect } from 'react'
import {
  MapPin,
  ArrowRight,
  Copy,
  Share2,
  Check,
  RefreshCw,
  AlertCircle,
  FileCheck,
  ChevronDown,
  Search,
  Sparkles
} from 'lucide-react'
import type {
  ProvinceLegacy,
  DistrictLegacy,
  WardLegacy,
  ProvinceNew,
  WardNew,
  LookupResponse
} from '../types'
import { parseAndNormalizeDetailAddress, removeVietnameseTones } from '../utils/addressParser'
import type { ParsedAddress } from '../utils/addressParser'
import provincesLegacyData from '../data/provinces_legacy.json'
import provincesNewData from '../data/provinces_new.json'
import districtsByCityDataRaw from '../data/legacy_districts_by_city.json'
import wardsByDistrictDataRaw from '../data/legacy_wards_by_district.json'
import wardsNewByProvinceDataRaw from '../data/wards_new_by_province.json'

const districtsByCityData = districtsByCityDataRaw as Record<string, DistrictLegacy[]>
const wardsByDistrictData = wardsByDistrictDataRaw as Record<string, WardLegacy[]>
const wardsNewByProvinceData = wardsNewByProvinceDataRaw as Record<string, WardNew[]>

export interface SubUnitOption {
  id: string
  name: string
  type: 'ap' | 'khom' | 'khu_pho' | 'to_dan_pho'
  note?: string
}

export const KNOWN_WARD_SUBUNITS: Record<string, SubUnitOption[]> = {
  // Bà Điểm
  'badiem': [
    { id: 'nam_lan', name: 'Ấp Nam Lân', type: 'ap', note: 'Chia tách thành Ấp Nam Lân 1 & Nam Lân 2 (Đường Bà Điểm 9 ➔ Nam Lân 2)' },
    { id: 'trung_lan', name: 'Ấp Trung Lân', type: 'ap', note: 'Chia tách thành Ấp Trung Lân 1 & Trung Lân 2' },
    { id: 'tay_lan', name: 'Ấp Tây Lân', type: 'ap', note: 'Chia tách thành Ấp Tây Lân 1 & Tây Lân 2' },
    { id: 'dong_lan', name: 'Ấp Đông Lân', type: 'ap', note: 'Chia tách thành Ấp Đông Lân 1 & Đông Lân 2' },
    { id: 'tien_lan', name: 'Ấp Tiền Lân', type: 'ap', note: 'Chia tách thành Ấp Tiền Lân 1 & Tiền Lân 2' },
    { id: 'bac_lan', name: 'Ấp Bắc Lân', type: 'ap', note: 'Chuẩn hóa sắp xếp địa bàn ấp' },
    { id: 'hau_lan', name: 'Ấp Hậu Lân', type: 'ap', note: 'Chuẩn hóa sắp xếp địa bàn ấp' },
    { id: 'ap_22', name: 'Ấp 22', type: 'ap', note: 'Tuyến đường Phạm Văn Sáng (chuyển tiếp từ Ấp 2 Xã Xuân Thới Thượng sang)' }
  ],
  // Xuân Thới Thượng
  'xuan_thoi_thuong': [
    { id: 'ap_1', name: 'Ấp 1', type: 'ap', note: 'Chuẩn hóa địa bàn ấp' },
    { id: 'ap_2', name: 'Ấp 2', type: 'ap', note: 'Tuyến Phạm Văn Sáng phân định sang Ấp 22, Xã Bà Điểm' },
    { id: 'ap_3', name: 'Ấp 3', type: 'ap', note: 'Chuẩn hóa địa bàn ấp' },
    { id: 'ap_4', name: 'Ấp 4', type: 'ap', note: 'Chuẩn hóa địa bàn ấp' },
    { id: 'ap_5', name: 'Ấp 5', type: 'ap', note: 'Chuẩn hóa địa bàn ấp' },
    { id: 'ap_6', name: 'Ấp 6', type: 'ap', note: 'Chuẩn hóa địa bàn ấp' },
    { id: 'ap_7', name: 'Ấp 7', type: 'ap', note: 'Chuẩn hóa địa bàn ấp' }
  ],
  // Vĩnh Trạch
  'vinh_trach': [
    { id: 'thao_lang', name: 'Ấp Thào Lạng', type: 'ap', note: 'Chuyển đổi thành Khóm Thào Lạng (do nâng cấp lên Phường)' },
    { id: 'vinh_an', name: 'Ấp Vĩnh An', type: 'ap', note: 'Chuyển đổi thành Khóm Vĩnh An' },
    { id: 'vinh_moi', name: 'Ấp Vĩnh Mới', type: 'ap', note: 'Chuyển đổi thành Khóm Vĩnh Mới' },
    { id: 'kim_son', name: 'Ấp Kim Sơn', type: 'ap', note: 'Chuyển đổi thành Khóm Kim Sơn' },
    { id: 'dong_gang', name: 'Ấp Đồng Găng', type: 'ap', note: 'Chuyển đổi thành Khóm Đồng Găng' },
    { id: 'bien_tay_b', name: 'Ấp Biển Tây B', type: 'ap', note: 'Chuyển đổi thành Khóm Biển Tây B' }
  ],
  // Vĩnh Hải (Nha Trang)
  'vinh_hai': [
    { id: 'kp_1', name: 'Khu phố 1', type: 'khu_pho', note: 'Tổ dân phố / Khu phố thuộc Phường Bắc Nha Trang mới' },
    { id: 'kp_2', name: 'Khu phố 2', type: 'khu_pho', note: 'Tổ dân phố / Khu phố thuộc Phường Bắc Nha Trang mới' },
    { id: 'kp_3', name: 'Khu phố 3', type: 'khu_pho', note: 'Tổ dân phố / Khu phố thuộc Phường Bắc Nha Trang mới' },
    { id: 'kp_4', name: 'Khu phố 4', type: 'khu_pho', note: 'Tổ dân phố / Khu phố thuộc Phường Bắc Nha Trang mới' },
    { id: 'kp_5', name: 'Khu phố 5', type: 'khu_pho', note: 'Tổ dân phố / Khu phố thuộc Phường Bắc Nha Trang mới' }
  ],
  // Giao Thạnh / Thạnh Phong (Thạnh Phú, Bến Tre)
  'giao_thanh': [
    { id: 'giao_hoa_a', name: 'Ấp Giao Hòa A', type: 'ap', note: 'Sáp nhập cùng Ấp Tân Hiệp thành Ấp Giao Hiệp (Xã Thạnh Phong mới)' },
    { id: 'giao_hoa_b', name: 'Ấp Giao Hòa B', type: 'ap', note: 'Sáp nhập cùng Ấp Giao Hòa Chợ thành Ấp Giao Hòa' },
    { id: 'tan_hiep', name: 'Ấp Tân Hiệp', type: 'ap', note: 'Sáp nhập cùng Ấp Giao Hòa A thành Ấp Giao Hiệp' },
    { id: 'giao_hiep', name: 'Ấp Giao Hiệp', type: 'ap', note: 'Ấp mới thành lập từ việc sáp nhập Ấp Giao Hòa A và Ấp Tân Hiệp' },
    { id: 'giao_hoa', name: 'Ấp Giao Hòa', type: 'ap', note: 'Ấp mới thành lập từ việc sáp nhập Ấp Giao Hòa B và Ấp Giao Hòa Chợ' },
    { id: 'thanh_loi', name: 'Ấp Thạnh Lợi', type: 'ap', note: 'Ấp trực thuộc Xã Thạnh Phong mới' }
  ]
}

function getSubUnitsForWard(wardName?: string, wardId?: string): SubUnitOption[] {
  if (!wardName && !wardId) return []
  const norm = wardName ? removeVietnameseTones(wardName) : ''
  const wId = String(wardId || '')

  if (norm.includes('ba diem') || wId === '27592' || wId === '14068') return KNOWN_WARD_SUBUNITS['badiem']
  if (norm.includes('xuan thoi thuong') || wId === '27589') return KNOWN_WARD_SUBUNITS['xuan_thoi_thuong']
  if (norm.includes('vinh trach') || wId === '26404' || wId === '31834') return KNOWN_WARD_SUBUNITS['vinh_trach']
  if (norm.includes('vinh hai') || wId === '22330') return KNOWN_WARD_SUBUNITS['vinh_hai']
  if (norm.includes('giao thanh') || norm.includes('thanh phong') || wId === '29227' || wId === '29230') return KNOWN_WARD_SUBUNITS['giao_thanh']
  return [
    { id: 'ap_1', name: 'Ấp 1', type: 'ap', note: 'Đơn vị cơ sở thôn/ấp' },
    { id: 'ap_2', name: 'Ấp 2', type: 'ap', note: 'Đơn vị cơ sở thôn/ấp' },
    { id: 'ap_3', name: 'Ấp 3', type: 'ap', note: 'Đơn vị cơ sở thôn/ấp' },
    { id: 'ap_4', name: 'Ấp 4', type: 'ap', note: 'Đơn vị cơ sở thôn/ấp' },
    { id: 'ap_5', name: 'Ấp 5', type: 'ap', note: 'Đơn vị cơ sở thôn/ấp' },
    { id: 'ap_6', name: 'Ấp 6', type: 'ap', note: 'Đơn vị cơ sở thôn/ấp' },
    { id: 'khom_1', name: 'Khóm 1', type: 'khom', note: 'Đơn vị cơ sở khóm đô thị' },
    { id: 'khom_2', name: 'Khóm 2', type: 'khom', note: 'Đơn vị cơ sở khóm đô thị' },
    { id: 'khom_3', name: 'Khóm 3', type: 'khom', note: 'Đơn vị cơ sở khóm đô thị' },
    { id: 'kp_1', name: 'Khu phố 1', type: 'khu_pho', note: 'Khu phố đô thị' },
    { id: 'kp_2', name: 'Khu phố 2', type: 'khu_pho', note: 'Khu phố đô thị' },
    { id: 'kp_3', name: 'Khu phố 3', type: 'khu_pho', note: 'Khu phố đô thị' },
    { id: 'to_1', name: 'Tổ dân phố 1', type: 'to_dan_pho', note: 'Tổ dân phố dân cư' },
    { id: 'to_2', name: 'Tổ dân phố 2', type: 'to_dan_pho', note: 'Tổ dân phố dân cư' }
  ]
}

interface AddressLookupProps {
  onNavigateToResearch?: () => void
}

export const AddressLookup: React.FC<AddressLookupProps> = () => {
  // Mode: LEGACY_TO_CURRENT or CURRENT_TO_LEGACY
  const [mode, setMode] = useState<'LEGACY_TO_CURRENT' | 'CURRENT_TO_LEGACY'>('LEGACY_TO_CURRENT')

  // --- State for Legacy -> Current ---
  const [legacyProvinces, setLegacyProvinces] = useState<ProvinceLegacy[]>(provincesLegacyData as ProvinceLegacy[])
  const [legacyDistricts, setLegacyDistricts] = useState<DistrictLegacy[]>([])
  const [legacyWards, setLegacyWards] = useState<WardLegacy[]>([])

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('')
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('')
  const [selectedWardId, setSelectedWardId] = useState<string>('')
  const [selectedSubUnit, setSelectedSubUnit] = useState<string>('')

  // Filter text inside dropdowns
  const [provFilter, setProvFilter] = useState('')
  const [distFilter, setDistFilter] = useState('')
  const [wardFilter, setWardFilter] = useState('')
  const [subUnitFilter, setSubUnitFilter] = useState('')

  const [openDropdown, setOpenDropdown] = useState<'prov' | 'dist' | 'ward' | 'subunit' | 'newProv' | 'newWard' | null>(null)

  // SubUnit parsed detail result
  const [subUnitDetailResult, setSubUnitDetailResult] = useState<ParsedAddress | null>(null)

  // --- State for Current -> Legacy ---
  const [currentProvinces, setCurrentProvinces] = useState<ProvinceNew[]>(provincesNewData as ProvinceNew[])
  const [currentWards, setCurrentWards] = useState<WardNew[]>([])

  const [selectedNewProvinceCode, setSelectedNewProvinceCode] = useState<string>('')
  const [selectedNewWardCode, setSelectedNewWardCode] = useState<string>('')
  const [newProvFilter, setNewProvFilter] = useState('')
  const [newWardFilter, setNewWardFilter] = useState('')

  // Loading & Error & Results
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDistrictsLoading, setIsDistrictsLoading] = useState<boolean>(false)
  const [isWardsLoading, setIsWardsLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [lookupResult, setLookupResult] = useState<LookupResponse | null>(null)

  // Copy feedback
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState<boolean>(false)

  // 1. Initial Load: Fetch Legacy Provinces & New Provinces
  useEffect(() => {
    fetch('/api/legacy/provinces')
      .then(res => res.json())
      .then(data => setLegacyProvinces(data))
      .catch(err => console.error('Error fetching legacy provinces:', err))

    fetch('/api/current/provinces')
      .then(res => res.json())
      .then(data => setCurrentProvinces(data))
      .catch(err => console.error('Error fetching current provinces:', err))
  }, [])

  // 2. Read URL params on mount (?p=35&d=391&w=22330)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const p = params.get('p')
    const d = params.get('d')
    const w = params.get('w')

    if (p) {
      setSelectedProvinceId(p)
      if (d) {
        setSelectedDistrictId(d)
        if (w) {
          setSelectedWardId(w)
          // Trigger search automatically once initial data is ready
          executeLookup('LEGACY_TO_CURRENT', p, d, w)
        }
      }
    }
  }, [])

  // 3. When legacy province changes, load districts
  useEffect(() => {
    if (!selectedProvinceId) {
      setLegacyDistricts([])
      setSelectedDistrictId('')
      setLegacyWards([])
      setSelectedWardId('')
      setSelectedSubUnit('')
      setSubUnitDetailResult(null)
      return
    }

    setSelectedSubUnit('')
    setSubUnitDetailResult(null)

    // Instant local dataset load
    if (districtsByCityData[selectedProvinceId]) {
      setLegacyDistricts(districtsByCityData[selectedProvinceId])
      setIsDistrictsLoading(false)
      return
    }

    setIsDistrictsLoading(true)
    fetch(`/api/legacy/districts?cityId=${selectedProvinceId}`)
      .then(res => res.json())
      .then(data => {
        setLegacyDistricts(data)
        setIsDistrictsLoading(false)
      })
      .catch(err => {
        console.warn('Network error, using local fallback:', err)
        setIsDistrictsLoading(false)
      })
  }, [selectedProvinceId])

  // 4. When legacy district changes, load wards
  useEffect(() => {
    if (!selectedDistrictId) {
      setLegacyWards([])
      setSelectedWardId('')
      setSelectedSubUnit('')
      setSubUnitDetailResult(null)
      return
    }

    setSelectedSubUnit('')
    setSubUnitDetailResult(null)

    // Instant local dataset load
    if (wardsByDistrictData[selectedDistrictId]) {
      setLegacyWards(wardsByDistrictData[selectedDistrictId])
      setIsWardsLoading(false)
      return
    }

    setIsWardsLoading(true)
    fetch(`/api/legacy/wards?districtId=${selectedDistrictId}`)
      .then(res => res.json())
      .then(data => {
        setLegacyWards(data)
        setIsWardsLoading(false)
      })
      .catch(err => {
        console.warn('Network error, using local fallback:', err)
        setIsWardsLoading(false)
      })
  }, [selectedDistrictId])

  // 5. When new province changes, load new wards
  useEffect(() => {
    if (!selectedNewProvinceCode) {
      setCurrentWards([])
      setSelectedNewWardCode('')
      return
    }

    if (wardsNewByProvinceData[selectedNewProvinceCode]) {
      setCurrentWards(wardsNewByProvinceData[selectedNewProvinceCode])
      return
    }

    fetch(`/api/current/wards?provinceCode=${selectedNewProvinceCode}`)
      .then(res => res.json())
      .then(data => {
        setCurrentWards(data.wards || [])
      })
      .catch(err => console.error('Error fetching new wards:', err))
  }, [selectedNewProvinceCode])

  // Execute Lookup with Offline / GitHub Pages fallback
  const executeLookup = async (
    type: 'LEGACY_TO_CURRENT' | 'CURRENT_TO_LEGACY',
    provCode: string,
    distCode: string,
    wCode: string
  ) => {
    setIsLoading(true)
    setErrorMsg(null)

    // Update URL params
    if (type === 'LEGACY_TO_CURRENT') {
      const url = new URL(window.location.href)
      url.searchParams.set('p', provCode)
      if (distCode) url.searchParams.set('d', distCode)
      if (wCode) url.searchParams.set('w', wCode)
      window.history.replaceState({}, '', url.toString())
    }

    // Try remote server first if available
    try {
      const resp = await fetch('/api/lookups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lookupType: type,
          provinceCode: provCode,
          districtCode: distCode,
          wardCode: wCode
        })
      })

      if (resp.ok) {
        const data: LookupResponse = await resp.json()
        setLookupResult(data)
        setIsLoading(false)
        return
      }
    } catch {
      // Remote unavailable, seamlessly proceed to local algorithm
    }

    // Client-side intelligent lookup fallback
    try {
      if (type === 'CURRENT_TO_LEGACY') {
        const wards = wardsNewByProvinceData[provCode] || []
        const matched = wards.find((w: any) => String(w.wardCode) === String(wCode))
        if (matched) {
          const prov = (provincesNewData as any[]).find((p: any) => String(p.provinceCode) === String(provCode))
          setLookupResult({
            sourceAddress: `${matched.name}, ${prov?.name || ''}`,
            addresses: [
              {
                provinceCode: provCode,
                provinceName: prov?.name || '',
                wardCode: matched.wardCode,
                wardName: matched.name,
                addressLabel: matched.legacyAddress || 'Đơn vị hành chính sáp nhập'
              }
            ]
          })
          return
        }
      } else {
        // LEGACY_TO_CURRENT: look through wardsNewByProvinceData
        for (const [pCode, wards] of Object.entries(wardsNewByProvinceData)) {
          for (const w of wards) {
            if (w.legacyAddress && (w.legacyAddress.includes(wCode) || String(w.wardCode) === String(wCode))) {
              const prov = (provincesNewData as any[]).find((p: any) => p.provinceCode === pCode)
              setLookupResult({
                sourceAddress: `Đơn vị mã ${wCode}`,
                addresses: [
                  {
                    provinceCode: pCode,
                    provinceName: prov?.name || '',
                    wardCode: w.wardCode,
                    wardName: w.name,
                    addressLabel: `${w.name}, ${prov?.name || ''}`
                  }
                ]
              })
              return
            }
          }
        }

        // Comprehensive address parser fallback
        const provObj = (provincesLegacyData as any[]).find((p: any) => String(p.cityId) === String(provCode))
        const distList = districtsByCityData[provCode] || legacyDistricts || []
        const distObj = distList.find((d: any) => String(d.districtId) === String(distCode))
        const wardList = (distCode ? wardsByDistrictData[distCode] : null) || legacyWards || []
        const wardObj = wardList.find((w: any) => String(w.wardId) === String(wCode))

        const fullAddr = `${wardObj?.name || ''}, ${distObj?.name ? distObj.name + ', ' : ''}${provObj?.name || ''}`
        const parsed = parseAndNormalizeDetailAddress(fullAddr)
        if (parsed.standardizedAddress) {
          setLookupResult({
            sourceAddress: fullAddr,
            addresses: [
              {
                provinceCode: parsed.province.code || provCode || '',
                provinceName: parsed.province.transformed,
                wardCode: parsed.ward.code || wCode || '',
                wardName: parsed.ward.transformed,
                addressLabel: `${parsed.ward.transformed}, ${parsed.province.transformed}`
              }
            ]
          })
          return
        }
      }

      throw new Error('Không tìm thấy địa chỉ tương ứng sau sáp nhập!')
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra trong quá trình tra cứu!')
      setLookupResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Form Submit
  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'LEGACY_TO_CURRENT') {
      if (!selectedProvinceId || !selectedDistrictId || !selectedWardId) {
        setErrorMsg('Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã trước khi tra cứu.')
        return
      }

      // If user selected or typed a sub-unit (Ấp / Khóm / Khu phố)
      if (selectedSubUnit && selectedWardObj && selectedProvObj) {
        const fullAddr = `${selectedSubUnit}, ${selectedWardObj.name}, ${selectedDistObj ? selectedDistObj.name + ', ' : ''}${selectedProvObj.name}`
        const parsed = parseAndNormalizeDetailAddress(fullAddr)
        setSubUnitDetailResult(parsed)
      } else {
        setSubUnitDetailResult(null)
      }

      executeLookup('LEGACY_TO_CURRENT', selectedProvinceId, selectedDistrictId, selectedWardId)
    } else {
      if (!selectedNewProvinceCode || !selectedNewWardCode) {
        setErrorMsg('Vui lòng chọn Tỉnh/Thành phố mới và Phường/Xã mới.')
        return
      }
      setSubUnitDetailResult(null)
      executeLookup('CURRENT_TO_LEGACY', selectedNewProvinceCode, '', selectedNewWardCode)
    }
  }

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAddress(text)
    setTimeout(() => setCopiedAddress(null), 2500)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  // Search matcher: supports both case-insensitive and Vietnamese tone-insensitive matching
  const matchSearch = (text: string, query: string) => {
    if (!query || !query.trim()) return true
    const qTrim = query.trim()
    const qLower = qTrim.toLowerCase()
    if (text.toLowerCase().includes(qLower)) return true
    const qNorm = removeVietnameseTones(qTrim)
    const tNorm = removeVietnameseTones(text)
    return tNorm.includes(qNorm)
  }

  // Filtered dropdown options with tone-insensitive search
  const filteredLegacyProv = legacyProvinces.filter(p => matchSearch(p.name, provFilter))
  const filteredLegacyDist = legacyDistricts.filter(d => matchSearch(d.name, distFilter))
  const filteredLegacyWard = legacyWards.filter(w => matchSearch(w.name, wardFilter))

  const filteredNewProv = currentProvinces.filter(p => matchSearch(p.name, newProvFilter))
  const filteredNewWard = currentWards.filter(w => matchSearch(w.name, newWardFilter))

  const selectedProvObj = legacyProvinces.find(p => String(p.cityId) === selectedProvinceId)
  const selectedDistObj = legacyDistricts.find(d => String(d.districtId) === selectedDistrictId)
  const selectedWardObj = legacyWards.find(w => String(w.wardId) === selectedWardId)

  // SubUnit options based on selected ward (supports both ward name & ward code)
  const availableSubUnits = getSubUnitsForWard(selectedWardObj?.name, selectedWardId)
  const filteredSubUnits = availableSubUnits.filter(sub => {
    if (!subUnitFilter || !subUnitFilter.trim()) return true
    return matchSearch(sub.name, subUnitFilter) || (sub.note ? matchSearch(sub.note, subUnitFilter) : false)
  })

  const selectedNewProvObj = currentProvinces.find(p => p.provinceCode === selectedNewProvinceCode)
  const selectedNewWardObj = currentWards.find(w => w.wardCode === selectedNewWardCode)

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chuẩn hóa địa giới Việt Nam 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Tra Cứu Chuyển Đổi Địa Chỉ Hành Chính
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Nhập địa chỉ cũ để tìm đơn vị hành chính mới theo Nghị quyết 202/2025/QH15 hoặc tra ngược từ địa chỉ mới để xem các đơn vị đã sáp nhập.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
            <button
              onClick={() => {
                setMode('LEGACY_TO_CURRENT')
                setLookupResult(null)
                setErrorMsg(null)
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                mode === 'LEGACY_TO_CURRENT'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cũ ➔ Mới (63 tỉnh ➔ 34 tỉnh)
            </button>
            <button
              onClick={() => {
                setMode('CURRENT_TO_LEGACY')
                setLookupResult(null)
                setErrorMsg(null)
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                mode === 'CURRENT_TO_LEGACY'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mới ➔ Cũ (Xem lịch sử sáp nhập)
            </button>
          </div>
        </div>

        {/* Form Formats */}
        <form onSubmit={handleLookupSubmit} className="mt-6 space-y-4">
          {mode === 'LEGACY_TO_CURRENT' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Dropdown 1: Tỉnh cũ */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  1. Chọn Tỉnh/Thành phố cũ
                </label>
                <div
                  onClick={() => setOpenDropdown(openDropdown === 'prov' ? null : 'prov')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl cursor-pointer hover:border-red-500 transition shadow-sm text-sm"
                >
                  <span className={selectedProvObj ? 'text-slate-900 font-medium truncate' : 'text-slate-400'}>
                    {selectedProvObj ? selectedProvObj.name : 'Chọn Tỉnh/Thành phố'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>

                {openDropdown === 'prov' && (
                  <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm tỉnh/thành..."
                        value={provFilter}
                        onChange={e => setProvFilter(e.target.value)}
                        className="w-full text-xs bg-transparent focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto p-1 flex-1">
                      {filteredLegacyProv.length === 0 ? (
                        <div className="p-3 text-xs text-slate-400 text-center">Không tìm thấy</div>
                      ) : (
                        filteredLegacyProv.map(p => (
                          <div
                            key={p.cityId}
                            onClick={() => {
                              setSelectedProvinceId(String(p.cityId))
                              setSelectedDistrictId('')
                              setSelectedWardId('')
                              setSelectedSubUnit('')
                              setSubUnitDetailResult(null)
                              setOpenDropdown(null)
                              setProvFilter('')
                            }}
                            className={`px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-700 transition ${
                              selectedProvinceId === String(p.cityId) ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700'
                            }`}
                          >
                            {p.name}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown 2: Quận/Huyện cũ */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  2. Chọn Quận/Huyện cũ
                </label>
                <div
                  onClick={() => {
                    if (selectedProvinceId && !isDistrictsLoading) {
                      setOpenDropdown(openDropdown === 'dist' ? null : 'dist')
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl shadow-sm text-sm transition ${
                    !selectedProvinceId
                      ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'border-slate-300 cursor-pointer hover:border-red-500'
                  }`}
                >
                  <span className={selectedDistObj ? 'text-slate-900 font-medium truncate' : 'text-slate-400'}>
                    {isDistrictsLoading
                      ? 'Đang tải...'
                      : selectedDistObj
                      ? selectedDistObj.name
                      : 'Chọn Quận/Huyện'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>

                {openDropdown === 'dist' && selectedProvinceId && (
                  <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm quận/huyện..."
                        value={distFilter}
                        onChange={e => setDistFilter(e.target.value)}
                        className="w-full text-xs bg-transparent focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto p-1 flex-1">
                      {filteredLegacyDist.length === 0 ? (
                        <div className="p-3 text-xs text-slate-400 text-center">Không tìm thấy</div>
                      ) : (
                        filteredLegacyDist.map(d => (
                          <div
                            key={d.districtId}
                            onClick={() => {
                              setSelectedDistrictId(String(d.districtId))
                              setSelectedWardId('')
                              setSelectedSubUnit('')
                              setSubUnitDetailResult(null)
                              setOpenDropdown(null)
                              setDistFilter('')
                            }}
                            className={`px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-700 transition ${
                              selectedDistrictId === String(d.districtId) ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700'
                            }`}
                          >
                            {d.name}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown 3: Phường/Xã cũ */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  3. Chọn Phường/Xã cũ
                </label>
                <div
                  onClick={() => {
                    if (selectedDistrictId && !isWardsLoading) {
                      setOpenDropdown(openDropdown === 'ward' ? null : 'ward')
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl shadow-sm text-sm transition ${
                    !selectedDistrictId
                      ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'border-slate-300 cursor-pointer hover:border-red-500'
                  }`}
                >
                  <span className={selectedWardObj ? 'text-slate-900 font-medium truncate' : 'text-slate-400'}>
                    {isWardsLoading
                      ? 'Đang tải...'
                      : selectedWardObj
                      ? selectedWardObj.name
                      : 'Chọn Phường/Xã'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>

                {openDropdown === 'ward' && selectedDistrictId && (
                  <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm phường/xã..."
                        value={wardFilter}
                        onChange={e => setWardFilter(e.target.value)}
                        className="w-full text-xs bg-transparent focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto p-1 flex-1">
                      {filteredLegacyWard.length === 0 ? (
                        <div className="p-3 text-xs text-slate-400 text-center">Không tìm thấy</div>
                      ) : (
                        filteredLegacyWard.map(w => (
                          <div
                            key={w.wardId}
                            onClick={() => {
                              setSelectedWardId(String(w.wardId))
                              setSelectedSubUnit('')
                              setSubUnitDetailResult(null)
                              setOpenDropdown(null)
                              setWardFilter('')
                            }}
                            className={`px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-700 transition ${
                              selectedWardId === String(w.wardId) ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700'
                            }`}
                          >
                            {w.name}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown 4: Ấp / Khóm / Khu phố (Bộ lọc đơn vị dưới xã/phường) */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    4. Chọn Ấp / Khóm / Khu phố
                  </label>
                  <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                    Tùy chọn
                  </span>
                </div>
                <div
                  onClick={() => {
                    if (selectedWardId) {
                      setOpenDropdown(openDropdown === 'subunit' ? null : 'subunit')
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl shadow-sm text-sm transition ${
                    !selectedWardId
                      ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'border-slate-300 cursor-pointer hover:border-red-500'
                  }`}
                >
                  <span className={selectedSubUnit ? 'text-slate-900 font-medium truncate' : 'text-slate-400'}>
                    {selectedSubUnit || '-- Tất cả ấp / khóm --'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {selectedSubUnit && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSubUnit('')
                          setSubUnitDetailResult(null)
                        }}
                        className="text-slate-400 hover:text-red-600 p-0.5 text-xs font-bold leading-none cursor-pointer"
                        title="Xóa lựa chọn"
                      >
                        ✕
                      </span>
                    )}
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </div>
                </div>

                {openDropdown === 'subunit' && selectedWardId && (
                  <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm hoặc gõ tên ấp/khóm..."
                        value={subUnitFilter}
                        onChange={e => setSubUnitFilter(e.target.value)}
                        className="w-full text-xs bg-transparent focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto p-1 flex-1">
                      {/* 1. Option: Tất cả ấp / khóm */}
                      <div
                        onClick={() => {
                          setSelectedSubUnit('')
                          setSubUnitDetailResult(null)
                          setOpenDropdown(null)
                          setSubUnitFilter('')
                        }}
                        className={`px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-slate-100 transition ${
                          !selectedSubUnit ? 'bg-slate-100 font-bold text-slate-700' : 'text-slate-500'
                        }`}
                      >
                        -- Tất cả ấp / khóm (Toàn xã) --
                      </div>

                      {/* 2. Matched predefined SubUnits */}
                      {filteredSubUnits.map(sub => (
                        <div
                          key={sub.id}
                          onClick={() => {
                            setSelectedSubUnit(sub.name)
                            setOpenDropdown(null)
                            setSubUnitFilter('')
                            if (selectedWardObj && selectedProvObj) {
                              const full = `${sub.name}, ${selectedWardObj.name}, ${selectedDistObj ? selectedDistObj.name + ', ' : ''}${selectedProvObj.name}`
                              setSubUnitDetailResult(parseAndNormalizeDetailAddress(full))
                            }
                          }}
                          className={`px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-700 transition ${
                            selectedSubUnit === sub.name ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <div className="font-semibold flex items-center justify-between">
                            <span className="text-slate-900 font-bold">{sub.name}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium uppercase">
                              {sub.type === 'ap' ? 'Ấp' : sub.type === 'khom' ? 'Khóm' : 'Khu phố'}
                            </span>
                          </div>
                          {sub.note && (
                            <div className="text-[10px] text-amber-800 line-clamp-1 mt-0.5">{sub.note}</div>
                          )}
                        </div>
                      ))}

                      {/* 3. Custom typing option if user typed custom text */}
                      {subUnitFilter.trim() && (
                        <div
                          onClick={() => {
                            const val = subUnitFilter.trim()
                            setSelectedSubUnit(val)
                            setOpenDropdown(null)
                            setSubUnitFilter('')
                            if (selectedWardObj && selectedProvObj) {
                              const full = `${val}, ${selectedWardObj.name}, ${selectedDistObj ? selectedDistObj.name + ', ' : ''}${selectedProvObj.name}`
                              setSubUnitDetailResult(parseAndNormalizeDetailAddress(full))
                            }
                          }}
                          className="px-3 py-2 text-xs rounded-lg cursor-pointer bg-amber-50 text-amber-900 hover:bg-amber-100 font-semibold border-t border-amber-200 transition mt-1"
                        >
                          + Sử dụng từ khóa: &quot;{subUnitFilter.trim()}&quot;
                        </div>
                      )}

                      {filteredSubUnits.length === 0 && !subUnitFilter.trim() && (
                        <div className="p-3 text-xs text-slate-400 text-center">Không có danh mục ấp định sẵn</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* CURRENT_TO_LEGACY Form */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dropdown New Province */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  1. Chọn Tỉnh/Thành phố mới (theo 34 đơn vị hành chính 2026)
                </label>
                <div
                  onClick={() => setOpenDropdown(openDropdown === 'newProv' ? null : 'newProv')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl cursor-pointer hover:border-red-500 transition shadow-sm text-sm"
                >
                  <span className={selectedNewProvObj ? 'text-slate-900 font-medium truncate' : 'text-slate-400'}>
                    {selectedNewProvObj ? selectedNewProvObj.name : 'Chọn Tỉnh/Thành mới'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>

                {openDropdown === 'newProv' && (
                  <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm tỉnh/thành mới..."
                        value={newProvFilter}
                        onChange={e => setNewProvFilter(e.target.value)}
                        className="w-full text-xs bg-transparent focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto p-1 flex-1">
                      {filteredNewProv.map(p => (
                        <div
                          key={p.provinceCode}
                          onClick={() => {
                            setSelectedNewProvinceCode(p.provinceCode)
                            setSelectedNewWardCode('')
                            setOpenDropdown(null)
                            setNewProvFilter('')
                          }}
                          className={`px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-700 transition ${
                            selectedNewProvinceCode === p.provinceCode ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <div className="font-semibold">{p.name}</div>
                          {p.legacyAddress && (
                            <div className="text-[10px] text-slate-400">Gốc: {p.legacyAddress}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown New Ward */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  2. Chọn Phường/Xã mới
                </label>
                <div
                  onClick={() => {
                    if (selectedNewProvinceCode) {
                      setOpenDropdown(openDropdown === 'newWard' ? null : 'newWard')
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl shadow-sm text-sm transition ${
                    !selectedNewProvinceCode
                      ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'border-slate-300 cursor-pointer hover:border-red-500'
                  }`}
                >
                  <span className={selectedNewWardObj ? 'text-slate-900 font-medium truncate' : 'text-slate-400'}>
                    {selectedNewWardObj ? selectedNewWardObj.name : 'Chọn Phường/Xã mới'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>

                {openDropdown === 'newWard' && selectedNewProvinceCode && (
                  <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm phường/xã..."
                        value={newWardFilter}
                        onChange={e => setNewWardFilter(e.target.value)}
                        className="w-full text-xs bg-transparent focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto p-1 flex-1">
                      {filteredNewWard.map(w => (
                        <div
                          key={w.wardCode}
                          onClick={() => {
                            setSelectedNewWardCode(w.wardCode)
                            setOpenDropdown(null)
                            setNewWardFilter('')
                          }}
                          className={`px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-700 transition ${
                            selectedNewWardCode === w.wardCode ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <div className="font-semibold">{w.name}</div>
                          {w.legacyAddress && (
                            <div className="text-[10px] text-slate-400 truncate">Gồm: {w.legacyAddress}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Đang kết nối cơ sở dữ liệu tra cứu...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 text-amber-300" />
                  <span>Tra Cứu Ngay</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error message display */}
        {errorMsg && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Result Section */}
      {lookupResult && (
        <div className="bg-white rounded-2xl shadow-md border-2 border-red-500/20 overflow-hidden transition-all animate-fadeIn">
          <div className="bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 px-6 py-4 border-b border-red-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-red-700" />
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Kết Quả Tra Cứu Địa Giới Hành Chính
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Đã chép link' : 'Chia sẻ link'}</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Old Address Source Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{mode === 'LEGACY_TO_CURRENT' ? 'Địa chỉ cũ trước sáp nhập' : 'Địa chỉ mới theo Nghị quyết 202/2025/QH15'}</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-800">
                {selectedSubUnit ? `${selectedSubUnit}, ${lookupResult.sourceAddress}` : lookupResult.sourceAddress}
              </div>
            </div>

            {/* Detailed Sub-unit Result Card (Ấp / Khóm Transformation) */}
            {subUnitDetailResult && subUnitDetailResult.subUnit.original && (
              <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-100/50 border-2 border-amber-400 rounded-2xl p-5 shadow-sm space-y-4 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                      PHÂN ĐỊNH CHI TIẾT CẤP ẤP / KHÓM 2026
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      ✓ Khớp chính xác
                    </span>
                    {subUnitDetailResult.legalBasis?.localResolution && (
                      <span className="text-xs bg-amber-100 text-amber-950 px-2 py-0.5 rounded-md font-semibold">
                        Căn cứ: <strong>{subUnitDetailResult.legalBasis.localResolution}</strong>
                      </span>
                    )}
                    {subUnitDetailResult.ward.code && (
                      <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-amber-300">
                        Mã mới: #{subUnitDetailResult.ward.code}
                      </span>
                    )}
                    {subUnitDetailResult.ward.oldCode && (
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        Mã cũ: #{subUnitDetailResult.ward.oldCode}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(subUnitDetailResult.standardizedAddress)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
                  >
                    {copiedAddress === subUnitDetailResult.standardizedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã chép địa chỉ chi tiết!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép địa chỉ có ấp/khóm</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-white/80 border border-amber-200 rounded-xl p-3.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Tên ấp / khóm trước sáp nhập:</div>
                    <div className="text-base font-extrabold text-slate-800 line-through">
                      {subUnitDetailResult.subUnit.original}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Thuộc {subUnitDetailResult.ward.original}
                    </div>
                  </div>

                  <div className="bg-white border-2 border-emerald-500/50 rounded-xl p-3.5 shadow-xs">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase flex items-center justify-between">
                      <span>Định danh mới 2026:</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-bold">Đã chuẩn hóa</span>
                    </div>
                    <div className="text-base font-extrabold text-emerald-900">
                      {subUnitDetailResult.subUnit.transformed}
                    </div>
                    {subUnitDetailResult.subUnit.alternatives && subUnitDetailResult.subUnit.alternatives.length > 1 && (
                      <div className="text-[11px] text-amber-900 mt-1 font-semibold">
                        Phương án phân tách: {subUnitDetailResult.subUnit.alternatives.join(' & ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Complete standardized string */}
                <div className="bg-white border border-amber-300 rounded-xl p-3.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Chuỗi địa chỉ hoàn chỉnh đã chuẩn hóa (có ấp / khóm):
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    {subUnitDetailResult.standardizedAddress}
                  </div>
                </div>

                {/* Notes */}
                {subUnitDetailResult.resolutionNotes && subUnitDetailResult.resolutionNotes.length > 0 && (
                  <div className="text-xs text-amber-950 bg-amber-100/70 p-3 rounded-xl space-y-1">
                    <strong className="font-bold">Căn cứ điều chỉnh & phân định:</strong>
                    <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-amber-900">
                      {subUnitDetailResult.resolutionNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Transform Arrow Indicator */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1"></div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-300">
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {lookupResult.addresses.length > 1
                    ? 'Có thể được đổi thành các địa chỉ mới sau:'
                    : 'Được đổi thành đơn vị hành chính chuẩn hóa:'}
                </span>
              </div>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {/* New Addresses Output List */}
            <div className="space-y-4">
              {lookupResult.addresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-emerald-50/60 to-slate-50 border-2 border-emerald-500/30 rounded-2xl p-5 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                          ĐỊA CHỈ MỚI 2 CẤP
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          ✓ Khớp chính xác
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Mã xã mới: <code className="font-mono font-bold text-slate-700">#{addr.wardCode || 'N/A'}</code>
                        </span>
                        {subUnitDetailResult?.legalBasis?.localResolution && (
                          <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-semibold">
                            Căn cứ: <strong>{subUnitDetailResult.legalBasis.localResolution}</strong>
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg sm:text-xl font-extrabold text-emerald-950">
                        {addr.addressLabel}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Cấu trúc: <strong className="text-slate-800">{addr.wardName}</strong> thuộc <strong className="text-slate-800">{addr.provinceName}</strong> (Mô hình chính quyền địa phương 2 cấp, không tổ chức cấp huyện).
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                      <button
                        onClick={() => handleCopy(addr.addressLabel)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                      >
                        {copiedAddress === addr.addressLabel ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-200" />
                            <span>Đã sao chép!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Sao chép địa chỉ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legal compliance notice */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Lưu ý pháp lý theo Nghị quyết 202/2025/QH15:</strong> Các loại giấy tờ đã được cơ quan có thẩm quyền cấp trước ngày 01/07/2025 theo địa chỉ cũ (như Căn cước công dân, Giấy chứng nhận quyền sử dụng đất, Giấy phép lái xe, Đăng ký xe, Giấy chứng nhận đăng ký kinh doanh) vẫn tiếp tục được sử dụng và có giá trị pháp lý đầy đủ. Không thu các loại phí, lệ phí khi công dân và doanh nghiệp thực hiện cập nhật biến động địa chỉ.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
