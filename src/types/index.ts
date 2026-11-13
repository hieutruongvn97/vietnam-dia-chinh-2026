export interface ProvinceLegacy {
  id: number
  name: string
  cityId: string
  locationSlug: string
}

export interface DistrictLegacy {
  id: number
  name: string
  districtId: string
  cityId: string
  locationSlug: string
}

export interface WardLegacy {
  id: number
  name: string
  wardId: string
  districtId: string
  locationSlug: string
}

export interface ProvinceNew {
  provinceCode: string
  name: string
  locationSlug: string
  legacyAddress?: string
}

export interface WardNew {
  provinceCode: string
  wardCode: string
  name: string
  locationSlug: string
  legacyAddress?: string
}

export interface LookupAddress {
  provinceCode: string
  provinceName: string
  provinceSlug?: string
  districtCode?: string
  districtName?: string
  districtSlug?: string
  wardCode: string
  wardName: string
  wardSlug?: string
  addressLabel: string
}

export interface LookupResponse {
  sourceAddress: string
  addresses: LookupAddress[]
}

export interface SearchResultItem {
  type: 'province' | 'ward'
  name?: string
  provinceCode: string
  provinceName?: string
  wardCode?: string
  wardName?: string
  newAddressLabel?: string
  legacyAddress?: string
  label?: string
}

export interface ProvinceMatrixItem {
  code: string
  name: string
  type: string
  region: string
  center: string
  legacyProvinces: string[]
  areaKm2: number
  population: number
  summary: string
  highlights: string[]
}
