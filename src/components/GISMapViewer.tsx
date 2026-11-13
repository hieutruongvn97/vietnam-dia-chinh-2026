import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { REGION_GEO_DATA, type RegionGeoInfo } from '../data/geo_data'
import { Layers, MapPin, Compass, Info, Check, Map as MapIcon, Globe, Image } from 'lucide-react'

type TileProviderKey = 'esri_street' | 'esri_topo' | 'esri_satellite' | 'osm_hot'

const TILE_PROVIDERS: Record<TileProviderKey, { name: string; url: string; attribution: string; maxZoom: number }> = {
  esri_street: {
    name: 'Bản đồ Đô thị ESRI (Khuyên dùng - Siêu nét)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; ESRI World Street Map (Không giới hạn)',
    maxZoom: 19
  },
  esri_topo: {
    name: 'Bản đồ Địa hình ESRI Topo',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri World Topo',
    maxZoom: 19
  },
  esri_satellite: {
    name: 'Ảnh Vệ tinh ESRI World Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 18
  },
  osm_hot: {
    name: 'Bản đồ Mở Nhân đạo (OSM HOT)',
    url: 'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors, Humanitarian OpenStreetMap Team',
    maxZoom: 19
  }
}

export const GISMapViewer: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const currentTileLayerRef = useRef<L.TileLayer | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)

  const [activeRegionId, setActiveRegionId] = useState<string>('ca-mau-bac-lieu')
  const [boundaryViewMode, setBoundaryViewMode] = useState<'both' | 'current' | 'legacy'>('both')
  const [selectedTileProvider, setSelectedTileProvider] = useState<TileProviderKey>('esri_street')
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const currentRegion: RegionGeoInfo = REGION_GEO_DATA[activeRegionId] || REGION_GEO_DATA['ca-mau-bac-lieu']

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Fix marker icon URLs
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    const map = L.map(mapContainerRef.current, {
      center: currentRegion.center,
      zoom: currentRegion.zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    })
    mapInstanceRef.current = map

    // Base Tile Layer (OpenStreetMap / ESRI - 100% Free, NO WATERMARK, NO API KEY)
    const providerConfig = TILE_PROVIDERS[selectedTileProvider]
    const tileLayer = L.tileLayer(providerConfig.url, {
      attribution: providerConfig.attribution,
      maxZoom: providerConfig.maxZoom
    }).addTo(map)
    currentTileLayerRef.current = tileLayer

    // Layer Group for Polygons & Markers
    const layerGroup = L.layerGroup().addTo(map)
    layerGroupRef.current = layerGroup

    return () => {
      map.remove()
      mapInstanceRef.current = null
      currentTileLayerRef.current = null
      layerGroupRef.current = null
    }
  }, [activeRegionId])

  // 2. Change Tile Layer when selectedTileProvider changes
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current)
    }

    const providerConfig = TILE_PROVIDERS[selectedTileProvider]
    const newTileLayer = L.tileLayer(providerConfig.url, {
      attribution: providerConfig.attribution,
      maxZoom: providerConfig.maxZoom
    }).addTo(map)
    currentTileLayerRef.current = newTileLayer
  }, [selectedTileProvider])

  // 3. Render Boundary Polygons & Key Location Pins
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return
    const layerGroup = layerGroupRef.current
    layerGroup.clearLayers()

    // Lớp 1: Ranh giới cũ trước sáp nhập (Màu đỏ nét đứt)
    if (boundaryViewMode === 'both' || boundaryViewMode === 'legacy') {
      const legacyPolygon = L.polygon(currentRegion.legacy.boundary as L.LatLngExpression[], {
        color: '#dc2626',
        weight: 3.5,
        dashArray: '6, 6',
        fillColor: '#dc2626',
        fillOpacity: 0.14,
      }).addTo(layerGroup)

      legacyPolygon.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.5; min-width: 200px;">
          <div style="background: #fee2e2; color: #991b1b; font-weight: bold; padding: 2px 8px; border-radius: 9999px; font-size: 10px; display: inline-block; margin-bottom: 4px;">
            TRƯỚC SÁP NHẬP
          </div>
          <h4 style="margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #b91c1c;">${currentRegion.legacy.label}</h4>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            Quy mô diện tích cũ: <strong style="color: #0f172a;">${currentRegion.legacy.areaKm2.toLocaleString('vi-VN')} km²</strong>
          </div>
          <div style="font-size: 11px; color: #334155; line-height: 1.4; border-top: 1px solid #f1f5f9; padding-top: 4px;">
            <strong>Các đơn vị hành chính cũ:</strong>
            <ul style="margin: 4px 0 0; padding-left: 16px;">
              ${currentRegion.legacy.entities.map(e => `<li>${e}</li>`).join('')}
            </ul>
          </div>
        </div>
      `)
    }

    // Lớp 2: Ranh giới mới 2026 sau sáp nhập (Màu xanh lá liền nét)
    if (boundaryViewMode === 'both' || boundaryViewMode === 'current') {
      const currentPolygon = L.polygon(currentRegion.current.boundary as L.LatLngExpression[], {
        color: '#059669',
        weight: 4,
        fillColor: '#059669',
        fillOpacity: 0.2,
      }).addTo(layerGroup)

      currentPolygon.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.5; min-width: 220px;">
          <div style="background: #d1fae5; color: #065f46; font-weight: bold; padding: 2px 8px; border-radius: 9999px; font-size: 10px; display: inline-block; margin-bottom: 4px;">
            NGHỊ QUYẾT 202/2025/QH15
          </div>
          <h4 style="margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #047857;">${currentRegion.current.label}</h4>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            Diện tích tự nhiên mới: <strong style="color: #047857;">${currentRegion.current.areaKm2.toLocaleString('vi-VN')} km²</strong>
          </div>
          <div style="font-size: 11px; color: #334155; line-height: 1.4; border-top: 1px solid #f1f5f9; padding-top: 4px;">
            <strong>Đặc trưng quy hoạch mới 2026:</strong>
            <ul style="margin: 4px 0 0; padding-left: 16px;">
              ${currentRegion.current.entities.map(e => `<li>${e}</li>`).join('')}
            </ul>
          </div>
        </div>
      `)
    }

    // Lớp 3: Marker các điểm ghim mẫu
    currentRegion.keyLocations.forEach(loc => {
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background: linear-gradient(135deg, #b91c1c, #dc2626);
            color: #fef08a;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            border: 2.5px solid white;
            font-size: 14px;
            font-weight: 900;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ★
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      const marker = L.marker(loc.coords, { icon: customIcon }).addTo(layerGroup)
      marker.bindPopup(`
        <div style="min-width: 230px; font-family: inherit; font-size: 12px; line-height: 1.5;">
          <div style="display: inline-block; background: #fef3c7; color: #92400e; font-weight: 800; padding: 2px 8px; border-radius: 9999px; font-size: 10px; margin-bottom: 4px;">
            ${loc.type}
          </div>
          <h4 style="margin: 0 0 6px; font-size: 13px; font-weight: bold; color: #0f172a;">${loc.name}</h4>
          <div style="padding: 6px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; margin-bottom: 6px;">
            <div style="font-size: 10px; color: #be123c; font-weight: 700;">ĐỊA CHỈ CŨ:</div>
            <div style="color: #475569; font-size: 11px;">${loc.legacyAddress}</div>
          </div>
          <div style="padding: 6px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px;">
            <div style="font-size: 10px; color: #059669; font-weight: 800;">ĐỊA CHỈ MỚI 2 CẤP:</div>
            <div style="color: #065f46; font-weight: 700; font-size: 12px;">${loc.newAddress}</div>
          </div>
        </div>
      `)

      marker.on('click', () => {
        setSelectedLocation(loc)
      })
    })

    mapInstanceRef.current.setView(currentRegion.center, currentRegion.zoom)
  }, [boundaryViewMode, currentRegion])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Bản Đồ GIS Trực Quan (Leaflet / OpenStreetMap Không Cần API Key)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Bản Đồ Đối Chiếu Ranh Giới Trước & Sau Sáp Nhập
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-3xl">
              Trực quan hóa không gian địa lý của các tỉnh, thành phố và phường xã chịu tác động lớn theo Nghị quyết 202/2025/QH15. So sánh lớp ranh giới cũ (đỏ nét đứt) và lớp ranh giới mới 2026 (xanh lá liền nét).
            </p>
          </div>

          {/* Map Controls */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* Tile Provider Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setSelectedTileProvider('esri_street')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition ${
                  selectedTileProvider === 'esri_street' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bản đồ ESRI World Street (Khuyên dùng - Siêu nét)"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>ESRI Đô thị</span>
              </button>
              <button
                onClick={() => setSelectedTileProvider('esri_topo')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition ${
                  selectedTileProvider === 'esri_topo' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bản đồ Địa hình ESRI Topo"
              >
                <MapIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Địa hình</span>
              </button>
              <button
                onClick={() => setSelectedTileProvider('esri_satellite')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition ${
                  selectedTileProvider === 'esri_satellite' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Ảnh vệ tinh độ phân giải cao"
              >
                <Image className="w-3.5 h-3.5 text-amber-600" />
                <span>Vệ tinh</span>
              </button>
              <button
                onClick={() => setSelectedTileProvider('osm_hot')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition ${
                  selectedTileProvider === 'osm_hot' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Bản đồ Mở Nhân đạo OSM HOT"
              >
                <MapIcon className="w-3.5 h-3.5 text-rose-600" />
                <span>OSM HOT</span>
              </button>
            </div>

            {/* Boundary Layer Toggles */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setBoundaryViewMode('both')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  boundaryViewMode === 'both' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Xem Cả 2 Lớp
              </button>
              <button
                onClick={() => setBoundaryViewMode('current')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  boundaryViewMode === 'current' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mới 2026 (Xanh)
              </button>
              <button
                onClick={() => setBoundaryViewMode('legacy')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  boundaryViewMode === 'legacy' ? 'bg-rose-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cũ (Đỏ)
              </button>
            </div>
          </div>
        </div>

        {/* Region Switcher Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Chọn khu vực hiển thị:</span>
          </span>
          {Object.values(REGION_GEO_DATA).map(reg => (
            <button
              key={reg.id}
              onClick={() => {
                setActiveRegionId(reg.id)
                setSelectedLocation(null)
              }}
              className={`px-3 py-1.5 rounded-xl transition font-semibold border ${
                activeRegionId === reg.id
                  ? 'bg-red-700 text-white border-red-800 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {reg.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-[540px]">
          {/* Map Top Bar */}
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-amber-300">{currentRegion.name}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500"></span>
                <span>Cũ: {currentRegion.legacy.areaKm2.toLocaleString('vi-VN')} km²</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-emerald-500 rounded"></span>
                <span className="text-emerald-400 font-semibold">Mới: {currentRegion.current.areaKm2.toLocaleString('vi-VN')} km²</span>
              </span>
            </div>
          </div>

          {/* Leaflet DOM container */}
          <div ref={mapContainerRef} className="w-full flex-1 relative z-10" />
        </div>

        {/* Side Panel: Location Info & Key Points */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Region overview card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Info className="w-4 h-4 text-slate-400" />
              <span>Thông tin địa giới</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">{currentRegion.name}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{currentRegion.description}</p>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="p-2.5 bg-rose-50/60 border border-rose-200 rounded-xl text-rose-950">
                <strong className="block text-rose-800 font-bold mb-0.5">Lớp ranh giới cũ:</strong>
                {currentRegion.legacy.entities.join('; ')}
              </div>
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950">
                <strong className="block text-emerald-800 font-bold mb-0.5">Lớp ranh giới mới 2026:</strong>
                {currentRegion.current.entities.join('; ')}
              </div>
            </div>
          </div>

          {/* Specific Pin Point Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                <MapPin className="w-4 h-4" />
                <span>Các điểm mốc & Địa chỉ mẫu</span>
              </div>
              <span className="text-[10px] text-slate-400">Bấm điểm ghim trên bản đồ</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-56">
              {currentRegion.keyLocations.map((loc, idx) => {
                const isSelected = selectedLocation?.name === loc.name
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedLocation(loc)
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.setView(loc.coords, 14, { animate: true })
                      }
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition space-y-1.5 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:border-red-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{loc.name}</span>
                      <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
                        {loc.type}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      <strong>Cũ:</strong> {loc.legacyAddress}
                    </div>

                    <div className="text-[11px] text-emerald-800 font-bold flex items-center justify-between pt-1 border-t border-slate-100">
                      <span>Mới: {loc.newAddress}</span>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleCopy(loc.newAddress)
                        }}
                        className="text-slate-400 hover:text-emerald-700 text-[10px] font-semibold flex items-center gap-0.5 ml-2"
                      >
                        {copiedText === loc.newAddress ? <Check className="w-3 h-3 text-green-600" /> : 'Chép'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
