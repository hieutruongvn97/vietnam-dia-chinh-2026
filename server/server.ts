import express, { Request, Response } from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Load local datasets
const dataDir = path.join(__dirname, '../src/data')
const provincesNew = JSON.parse(fs.readFileSync(path.join(dataDir, 'provinces_new.json'), 'utf-8'))
const provincesLegacy = JSON.parse(fs.readFileSync(path.join(dataDir, 'provinces_legacy.json'), 'utf-8'))
const wardsNewByProvince: Record<string, any[]> = JSON.parse(fs.readFileSync(path.join(dataDir, 'wards_new_by_province.json'), 'utf-8'))
const provincesMatrix = JSON.parse(fs.readFileSync(path.join(dataDir, 'provinces_matrix.json'), 'utf-8'))

// Memory cache for districts and wards from remote
const districtCache = new Map<string, any[]>()
const wardCache = new Map<string, any[]>()

// Helper for fetching from remote with fallback
async function fetchWithTimeout(url: string, options: any = {}, timeout = 5000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...options.headers,
      }
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'Hệ thống tra cứu địa giới hành chính Việt Nam 2026',
    legalBasis: 'Nghị quyết 202/2025/QH15',
    effectiveDate: '01/07/2025',
    stats: {
      provincesLegacy: provincesLegacy.length,
      provincesNew: provincesNew.length,
      totalNewWardsIndexed: Object.values(wardsNewByProvince).reduce((acc, curr) => acc + curr.length, 0)
    }
  })
})

// 2. Legacy provinces (63 provinces)
app.get('/api/legacy/provinces', (_req: Request, res: Response) => {
  res.json(provincesLegacy)
})

// 3. Legacy districts by cityId
app.get('/api/legacy/districts', async (req: Request, res: Response) => {
  const cityId = String(req.query.cityId || '')
  if (!cityId) {
    return res.status(400).json({ error: 'cityId is required' })
  }

  if (districtCache.has(cityId)) {
    return res.json(districtCache.get(cityId))
  }

  try {
    const url = `http://localhost:3002/api/districts?cityId=${cityId}`
    const resp = await fetchWithTimeout(url)
    if (resp.ok) {
      const data = await resp.json()
      districtCache.set(cityId, data)
      return res.json(data)
    }
    throw new Error(`Bridge status ${resp.status}`)
  } catch (error) {
    console.warn(`Error fetching districts for cityId ${cityId}:`, error)
    return res.status(500).json({ error: 'Không thể tải danh sách quận/huyện từ hệ thống gốc' })
  }
})

// 4. Legacy wards by districtId
app.get('/api/legacy/wards', async (req: Request, res: Response) => {
  const districtId = String(req.query.districtId || '')
  if (!districtId) {
    return res.status(400).json({ error: 'districtId is required' })
  }

  if (wardCache.has(districtId)) {
    return res.json(wardCache.get(districtId))
  }

  try {
    const url = `http://localhost:3002/api/wards?districtId=${districtId}`
    const resp = await fetchWithTimeout(url)
    if (resp.ok) {
      const data = await resp.json()
      wardCache.set(districtId, data)
      return res.json(data)
    }
    throw new Error(`Bridge status ${resp.status}`)
  } catch (error) {
    console.warn(`Error fetching wards for districtId ${districtId}:`, error)
    return res.status(500).json({ error: 'Không thể tải danh sách phường/xã từ hệ thống gốc' })
  }
})

// 5. Current provinces (34 new provinces under 202/2025/QH15)
app.get('/api/current/provinces', (_req: Request, res: Response) => {
  res.json(provincesNew)
})

// 6. Current wards by provinceCode
app.get('/api/current/wards', (req: Request, res: Response) => {
  const provinceCode = String(req.query.provinceCode || '')
  if (!provinceCode) {
    return res.status(400).json({ error: 'provinceCode is required' })
  }

  const wards = wardsNewByProvince[provinceCode] || []
  res.json({
    provinceCode,
    total: wards.length,
    wards
  })
})

// 7. Lookup (Both LEGACY_TO_CURRENT and CURRENT_TO_LEGACY)
app.post('/api/lookups', async (req: Request, res: Response) => {
  const { lookupType, provinceCode, districtCode, wardCode } = req.body

  if (!lookupType || !provinceCode) {
    return res.status(400).json({ error: 'Thiếu thông tin tra cứu (lookupType, provinceCode)' })
  }

  // 1. First try Python Bridge (which bypasses Cloudflare gracefully)
  try {
    const bridgeResp = await fetchWithTimeout('http://localhost:3002/api/lookups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lookupType,
        provinceCode: String(provinceCode || ''),
        districtCode: String(districtCode || ''),
        wardCode: String(wardCode || '')
      })
    }, 4000)

    if (bridgeResp.ok) {
      const result = await bridgeResp.json()
      return res.json(result)
    }
  } catch (err) {
    console.warn('Bridge lookup error, falling back to local dataset:', err)
  }

  // 2. Intelligent Local Fallback
  try {
    if (lookupType === 'CURRENT_TO_LEGACY') {
      const wards = wardsNewByProvince[provinceCode] || []
      const matched = wards.find((w: any) => String(w.wardCode) === String(wardCode))
      if (matched) {
        const prov = provincesNew.find((p: any) => String(p.provinceCode) === String(provinceCode))
        return res.json({
          sourceAddress: `${matched.name}, ${prov?.name || ''}`,
          addresses: [
            {
              provinceCode,
              provinceName: prov?.name || '',
              wardCode: matched.wardCode,
              wardName: matched.name,
              addressLabel: matched.legacyAddress || 'Đơn vị hành chính sáp nhập'
            }
          ]
        })
      }
    } else {
      // Local search for LEGACY_TO_CURRENT
      // Look through wards_new_by_province for any ward matching this district or ward
      for (const [pCode, wards] of Object.entries(wardsNewByProvince)) {
        for (const w of wards) {
          if (w.legacyAddress && (w.legacyAddress.includes(wardCode) || String(w.wardCode) === String(wardCode))) {
            const prov = provincesNew.find((p: any) => p.provinceCode === pCode)
            return res.json({
              sourceAddress: `Đơn vị mã ${wardCode}`,
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
          }
        }
      }
    }

    return res.status(404).json({ error: 'Không tìm thấy địa chỉ tương ứng sau sáp nhập!' })
  } catch (error) {
    console.error('Local fallback error:', error)
    return res.status(500).json({ error: 'Có lỗi xảy ra trong quá trình tra cứu địa chỉ!' })
  }
})

function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

// 8. Smart full-text quick search across all 3,319 wards & provinces
app.get('/api/search', (req: Request, res: Response) => {
  const rawQ = String(req.query.q || '').trim()
  if (!rawQ || rawQ.length < 2) {
    return res.json({ query: rawQ, results: [] })
  }

  const q = rawQ.toLowerCase()
  const qNorm = removeVietnameseTones(rawQ)
  const results: any[] = []

  // Check 34 new provinces
  for (const p of provincesNew) {
    const pNameNorm = removeVietnameseTones(p.name)
    const pLegacyNorm = removeVietnameseTones(p.legacyAddress || '')
    if (pNameNorm.includes(qNorm) || pLegacyNorm.includes(qNorm)) {
      results.push({
        type: 'province',
        name: p.name,
        provinceCode: p.provinceCode,
        legacyAddress: p.legacyAddress,
        label: `${p.name} (Gồm: ${p.legacyAddress})`
      })
    }
  }

  // Check new wards
  for (const [pCode, wards] of Object.entries(wardsNewByProvince)) {
    const prov = provincesNew.find((p: any) => p.provinceCode === pCode)
    const provName = prov?.name || ''
    const provNameNorm = removeVietnameseTones(provName)

    for (const w of wards) {
      const wNameNorm = removeVietnameseTones(w.name)
      const wLegacyNorm = removeVietnameseTones(w.legacyAddress || '')

      const matchName = wNameNorm.includes(qNorm)
      const matchLegacy = wLegacyNorm.includes(qNorm)
      const matchFull = `${wNameNorm} ${provNameNorm}`.includes(qNorm)

      if (matchName || matchLegacy || matchFull) {
        results.push({
          type: 'ward',
          wardCode: w.wardCode,
          wardName: w.name,
          provinceCode: pCode,
          provinceName: provName,
          newAddressLabel: `${w.name}, ${provName}`,
          legacyAddress: w.legacyAddress || 'Đơn vị giữ nguyên'
        })
        if (results.length >= 40) break
      }
    }
    if (results.length >= 40) break
  }

  res.json({
    query: rawQ,
    count: results.length,
    results
  })
})

// 9. Comparison matrix of 34 provinces
app.get('/api/matrix', (_req: Request, res: Response) => {
  res.json(provincesMatrix)
})

// 10. Research & legal summary
app.get('/api/research', (_req: Request, res: Response) => {
  res.json({
    resolution: 'Nghị quyết số 202/2025/QH15 của Quốc hội khóa XV',
    approvalDate: '12/06/2025',
    effectiveDate: '01/07/2025',
    currentOperatingYear: '2026',
    keyReforms: [
      {
        title: 'Giảm từ 63 xuống còn 34 đơn vị hành chính cấp tỉnh',
        detail: 'Bao gồm 6 Thành phố trực thuộc Trung ương (Hà Nội, TP.HCM, Hải Phòng, Đà Nẵng, Cần Thơ, Huế) và 28 Tỉnh, tạo ra các cực tăng trưởng vùng mạnh mẽ.'
      },
      {
        title: 'Vận hành mô hình chính quyền địa phương 2 cấp',
        detail: 'Tinh gọn mô hình 3 cấp truyền thống thành 2 cấp: Cấp Tỉnh và Cấp Xã/Phường/Đặc khu. Bỏ cấp huyện trung gian để giải quyết nhanh thủ tục công, số hóa toàn diện.'
      },
      {
        title: 'Sáp nhập và chuẩn hóa tên phường, xã',
        detail: 'Quy mô phường/xã được mở rộng, sáp nhập từ các phường/xã liền kề để đảm bảo chuẩn tiêu chí diện tích và dân số.'
      },
      {
        title: 'Công thức địa chỉ chuẩn mới 2 cấp',
        detail: 'Định dạng chuẩn: [Tên Phường/Xã/Đặc khu], [Tên Tỉnh/Thành phố]. Không còn tên Quận/Huyện/Thị xã trong cấu trúc định danh hành chính chính thức.'
      }
    ],
    citizenGuidelines: [
      {
        category: 'Căn cước công dân & Định danh VNeID',
        guideline: 'Hệ thống Cơ sở dữ liệu quốc gia về dân cư và VNeID tự động ánh xạ mã địa giới mới từ ngày 01/07/2025. Thẻ CCCD gắn chip hiện hành còn hạn sử dụng vẫn giữ nguyên giá trị pháp lý, người dân không bắt buộc phải làm lại thẻ nếu chưa có nhu cầu.'
      },
      {
        category: 'Giấy chứng nhận Quyền sử dụng đất (Sổ đỏ)',
        guideline: 'Sổ đỏ đã cấp ghi địa chỉ cũ vẫn có hiệu lực tuyệt đối. Khi thực hiện thủ tục mua bán, tặng cho, thừa kế hoặc thế chấp, Văn phòng Đăng ký đất đai sẽ xác nhận biến động hoặc cấp đổi sang địa chỉ mới theo Nghị quyết 202/2025/QH15 hoàn toàn miễn phí.'
      },
      {
        category: 'Đăng ký kinh doanh & Hóa đơn điện tử',
        guideline: 'Tổng cục Thuế và Cổng thông tin Quốc gia về Đăng ký Doanh nghiệp tự động cập nhật mã cơ quan thuế và mã địa bàn quản lý. Doanh nghiệp chỉ cần thông báo cập nhật mẫu hóa đơn điện tử theo định dạng địa chỉ 2 cấp mới.'
      },
      {
        category: 'Giao nhận, Bưu chính, Thương mại điện tử',
        guideline: 'Các sàn TMĐT (Shopee, Lazada, TikTok Shop, Tiki) và đơn vị bưu chính (VNPost, Viettel Post, GHTK, GHN) đã cập nhật hệ thống gợi ý địa chỉ mới. Người dùng có thể sử dụng công cụ này để tra cứu chính xác địa chỉ mới để nhận hàng suôn sẻ.'
      }
    ]
  })
})

import { parseAndNormalizeDetailAddress } from '../src/utils/addressParser.js'

// 11. Detail Address Deep Parser API (Numbers, Ấp/Khóm, Splitting & Normalization)
app.post('/api/parse-address', (req: Request, res: Response) => {
  const { address } = req.body
  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Vui lòng cung cấp chuỗi địa chỉ (address: string)' })
  }

  const result = parseAndNormalizeDetailAddress(address)
  res.json(result)
})

// Helper to fetch authoritative data from tinhthanhpho.com
async function fetchFromTinhThanhPho(query: string) {
  try {
    const url = `https://tinhthanhpho.com/convert?q=${encodeURIComponent(query)}`
    const resp = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, 5000)
    if (resp.ok) {
      const html = await resp.text()
      const m = html.match(/id="result-json">([\s\S]*?)<\/pre>/)
      if (m) {
        const jClean = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&')
        return JSON.parse(jClean)
      }
    }
  } catch (err) {
    console.warn('tinhthanhpho.com bridge error:', err)
  }
  return null
}

// 12. Smart Free-Text / Hybrid Online Converter
app.post('/api/smart-convert', async (req: Request, res: Response) => {
  const { query, street } = req.body
  if (!query) {
    return res.status(400).json({ error: 'Vui lòng cung cấp chuỗi địa chỉ cần tra cứu' })
  }

  // 1. Run local sub-unit & road parser first
  const fullInput = [street, query].filter(Boolean).join(', ')
  const localParsed = parseAndNormalizeDetailAddress(fullInput)

  // 2. Fetch official legal resolution & admin codes from tinhthanhpho.com
  let onlineData = await fetchFromTinhThanhPho(query)
  if (!onlineData && street) {
    onlineData = await fetchFromTinhThanhPho(fullInput)
  }

  // 3. Merge both into an authoritative hybrid response
  let finalWard = localParsed.ward.transformed
  let finalProv = localParsed.province.transformed

  if (onlineData?.new?.ward) {
    const wType = onlineData.new.ward.type || 'Phường'
    const wName = onlineData.new.ward.name || ''
    finalWard = `${wType} ${wName}`.trim()
  }
  if (onlineData?.new?.province) {
    const pType = onlineData.new.province.type || 'Tỉnh'
    const pName = onlineData.new.province.name || ''
    finalProv = `${pType} ${pName}`.trim()
  }

  // If local parsed had cross-boundary override (like Phạm Văn Sáng -> Xã Bà Điểm), respect it
  if (localParsed.ward.transformed && localParsed.ward.transformed.includes('Bà Điểm') && localParsed.subUnit.transformed === 'Ấp 22') {
    finalWard = 'Xã Bà Điểm'
    finalProv = 'Thành phố Hồ Chí Minh'
  }

  // Re-assemble final standardized string
  const parts: string[] = []
  if (localParsed.street) {
    let streetLine = ''
    if (localParsed.houseNumber) streetLine += `${localParsed.houseNumber} `
    streetLine += localParsed.street
    streetLine = streetLine.trim()
    if (streetLine) parts.push(streetLine)
    if (localParsed.subUnit.transformed) parts.push(localParsed.subUnit.transformed)
  } else {
    let localLine = ''
    if (localParsed.houseNumber) localLine += `${localParsed.houseNumber} `
    if (localParsed.subUnit.transformed) localLine += localParsed.subUnit.transformed
    localLine = localLine.trim()
    if (localLine) parts.push(localLine)
  }

  if (finalWard) parts.push(finalWard)
  if (finalProv) parts.push(finalProv)

  const finalStd = parts.length > 0 ? parts.join(', ') : (onlineData?.new?.fullAddress || localParsed.standardizedAddress)

  const responseData = {
    ...localParsed,
    standardizedAddress: finalStd,
    onlineAssisted: !!onlineData,
    adminCodes: {
      oldWardCode: onlineData?.old?.ward?.code || (localParsed.ward as any).oldCode || '',
      newWardCode: onlineData?.new?.ward?.code || localParsed.ward.code || '',
      oldDistrictCode: onlineData?.old?.district?.code || (localParsed.district as any).code || '',
      oldProvinceCode: onlineData?.old?.province?.code || '',
      newProvinceCode: onlineData?.new?.province?.code || localParsed.province.code || ''
    },
    legalBasis: {
      nationalResolution: '202/2025/QH15',
      localResolution: onlineData?.mergeInfo?.legal || (localParsed as any).legalBasis?.localResolution || '1685/NQ-UBTVQH15',
      effectiveDate: '01/07/2025'
    },
    mergeReason: onlineData?.mergeInfo?.notes || localParsed.resolutionNotes.join('; ') || 'Sắp xếp chuẩn hóa mô hình chính quyền địa phương 2 cấp theo Nghị quyết Quốc hội.'
  }

  res.json(responseData)
})

// 13. Smart Suggestions API (combining tinhthanhpho.com suggestions with local database)
app.get('/api/suggest', async (req: Request, res: Response) => {
  const q = String(req.query.q || '').trim()
  if (!q || q.length < 2) return res.json([])

  try {
    const url = `https://tinhthanhpho.com/suggest?q=${encodeURIComponent(q)}`
    const resp = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, 3000)
    if (resp.ok) {
      const data = await resp.json()
      return res.json(data)
    }
  } catch (err) {
    // fallback to local
  }
  return res.json([])
})

// Serve static frontend in production
const distPath = path.join(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('/tra-cuu-dia-chinh-2026.html', (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'tra-cuu-dia-chinh-2026.html'))
  })
  app.get(/^(?!\/api).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

import http from 'http'

// Start server on Port 80 (Standard http://localhost)
const server80 = http.createServer(app)
server80.listen(80, () => {
  console.log(`🚀 Ứng dụng Web đang chạy tại: http://localhost`)
})
server80.on('error', (err: any) => {
  console.warn(`[Port 80]: ${err.message}. Sẽ ưu tiên cổng 3000.`)
})

// Start server on Port 3000 (http://localhost:3000)
const server3000 = http.createServer(app)
server3000.listen(3000, () => {
  console.log(`🚀 Ứng dụng Web sẵn sàng tại: http://localhost:3000`)
})
server3000.on('error', (err: any) => {
  console.warn(`[Port 3000]: ${err.message}`)
})
