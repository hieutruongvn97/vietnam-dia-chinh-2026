export interface RegionGeoInfo {
  id: string
  name: string
  center: [number, number] // [lat, lng]
  zoom: number
  description: string
  legacy: {
    label: string
    color: string
    boundary: [number, number][]
    areaKm2: number
    entities: string[]
  }
  current: {
    label: string
    color: string
    boundary: [number, number][]
    areaKm2: number
    entities: string[]
  }
  keyLocations: {
    name: string
    coords: [number, number]
    legacyAddress: string
    newAddress: string
    type: string
  }[]
}

export const REGION_GEO_DATA: Record<string, RegionGeoInfo> = {
  // 1. Cà Mau - Bạc Liêu (Ví dụ 1: Vĩnh Trạch, Thào Lạng)
  'ca-mau-bac-lieu': {
    id: 'ca-mau-bac-lieu',
    name: 'Tỉnh Cà Mau Mới (Hợp nhất Cà Mau + Bạc Liêu)',
    center: [9.22, 105.35],
    zoom: 9,
    description: 'Sắp xếp hợp nhất toàn bộ diện tích tự nhiên và dân số của Tỉnh Bạc Liêu và Tỉnh Cà Mau theo Nghị quyết 202/2025/QH15.',
    legacy: {
      label: 'Ranh giới Bạc Liêu & Cà Mau cũ (riêng biệt)',
      color: '#dc2626', // red-600
      areaKm2: 7890,
      entities: [
        'Tỉnh Bạc Liêu cũ: TP. Bạc Liêu, TX. Giá Rai, Đông Hải, Hồng Dân, Phước Long, Vĩnh Lợi, Hòa Bình',
        'Tỉnh Cà Mau cũ: TP. Cà Mau, Cái Nước, Đầm Dơi, Năm Căn, Ngọc Hiển, Phú Tân, Thới Bình, Trần Văn Thời, U Minh'
      ],
      boundary: [
        [9.55, 105.52],
        [9.40, 105.78],
        [9.15, 105.72],
        [9.20, 105.32],
        [9.45, 105.20],
        [9.55, 105.52]
      ]
    },
    current: {
      label: 'Ranh giới Tỉnh Cà Mau Mới 2026 (Hợp nhất toàn vẹn cực Nam)',
      color: '#059669', // emerald-600
      areaKm2: 7958,
      entities: [
        'Tỉnh Cà Mau mới 2026: Trung tâm đô thị Bạc Liêu & Cà Mau, cụm năng lượng tái tạo điện gió biển và cảng Hòn Khoai'
      ],
      boundary: [
        [9.62, 105.45],
        [9.42, 105.82],
        [9.12, 105.74],
        [8.88, 105.36],
        [8.58, 104.82],
        [8.65, 104.70],
        [8.98, 104.76],
        [9.28, 104.88],
        [9.52, 105.10],
        [9.62, 105.45]
      ]
    },
    keyLocations: [
      {
        name: 'Ấp Thào Lạng ➔ Khóm Thào Lạng',
        coords: [9.284, 105.735],
        legacyAddress: '12 ấp Thào Lạng, Xã Vĩnh Trạch, Thành phố Bạc Liêu, Tỉnh Bạc Liêu',
        newAddress: '12 khóm Thào Lạng, Phường Vĩnh Trạch, Tỉnh Cà Mau',
        type: 'Ví dụ 1 của bạn'
      },
      {
        name: 'TP. Bạc Liêu ➔ Khu đô thị Bạc Liêu',
        coords: [9.294, 105.727],
        legacyAddress: 'Thành phố Bạc Liêu, Tỉnh Bạc Liêu',
        newAddress: 'Tỉnh Cà Mau (mô hình 2 cấp)',
        type: 'Đô thị trung tâm'
      },
      {
        name: 'TP. Cà Mau ➔ Thủ phủ hành chính',
        coords: [9.176, 105.152],
        legacyAddress: 'Thành phố Cà Mau, Tỉnh Cà Mau',
        newAddress: 'Tỉnh Cà Mau',
        type: 'Trung tâm hành chính'
      },
      {
        name: 'Mũi Cà Mau (Cột mốc Cực Nam)',
        coords: [8.604, 104.718],
        legacyAddress: 'Xã Đất Mũi, Huyện Ngọc Hiển, Tỉnh Cà Mau',
        newAddress: 'Xã Đất Mũi, Tỉnh Cà Mau',
        type: 'Cực Nam Tổ quốc'
      }
    ]
  },

  // 2. TP. Hồ Chí Minh (Ví dụ 2: Hóc Môn, Xã Bà Điểm, Ấp Trung Lân)
  'ho-chi-minh': {
    id: 'ho-chi-minh',
    name: 'Thành phố Hồ Chí Minh (Hợp nhất TP.HCM + Bình Dương + BR-VT)',
    center: [10.82, 106.68],
    zoom: 10,
    description: 'Siêu đô thị hạt nhân kinh tế, tài chính, công nghệ và cảng biển nước sâu Cái Mép - Thị Vải; áp dụng mô hình chính quyền địa phương 2 cấp, không tổ chức cấp quận/huyện.',
    legacy: {
      label: 'Ranh giới TP.HCM cũ (2.095 km²)',
      color: '#dc2626',
      areaKm2: 2095,
      entities: ['TP. Hồ Chí Minh cũ: Quận 1..12, Hóc Môn, Củ Chi, Bình Chánh, Nhà Bè, Cần Giờ, TP Thủ Đức'],
      boundary: [
        [11.16, 106.48],
        [11.08, 106.68],
        [10.88, 106.84],
        [10.55, 106.92],
        [10.38, 106.78],
        [10.65, 106.50],
        [10.85, 106.50],
        [11.16, 106.48]
      ]
    },
    current: {
      label: 'Ranh giới Siêu đô thị TP.HCM 2026 (6.772 km²)',
      color: '#059669',
      areaKm2: 6772,
      entities: [
        'Hợp nhất TP.HCM + Tỉnh Bình Dương (Thủ Dầu Một, Thuận An, Dĩ An...) + Tỉnh Bà Rịa - Vũng Tàu (Vũng Tàu, Bà Rịa, Phú Mỹ, Côn Đảo)'
      ],
      boundary: [
        [11.55, 106.55],
        [11.50, 106.88],
        [11.25, 107.08],
        [10.85, 107.45],
        [10.55, 107.55],
        [10.32, 107.12],
        [10.38, 106.78],
        [10.65, 106.45],
        [11.15, 106.45],
        [11.55, 106.55]
      ]
    },
    keyLocations: [
      {
        name: 'Ấp Trung Lân ➔ Ấp Trung Lân 1 (Bà Điểm)',
        coords: [10.835, 106.602],
        legacyAddress: '58 ấp Trung Lân, xã Bà Điểm, Huyện Hóc Môn, Hồ Chí Minh',
        newAddress: '58 ấp Trung Lân 1, Xã Bà Điểm, Hồ Chí Minh',
        type: 'Ví dụ 2 của bạn'
      },
      {
        name: 'Quận 5 (Phường 6) ➔ Phường An Đông',
        coords: [10.755, 106.662],
        legacyAddress: 'Phường 6, Quận 5, TP. Hồ Chí Minh',
        newAddress: 'Phường An Đông, Hồ Chí Minh',
        type: 'Đô thị trung tâm'
      },
      {
        name: 'Huyện Hóc Môn (Đô thị vệ tinh phía Tây Bắc)',
        coords: [10.885, 106.592],
        legacyAddress: 'Huyện Hóc Môn, TP. Hồ Chí Minh',
        newAddress: 'Hồ Chí Minh (mô hình 2 cấp)',
        type: 'Khu vực chuyển đổi'
      },
      {
        name: 'Cụm Cảng nước sâu Cái Mép - Thị Vải',
        coords: [10.530, 107.025],
        legacyAddress: 'Thị xã Phú Mỹ, Tỉnh Bà Rịa - Vũng Tàu',
        newAddress: 'Hồ Chí Minh',
        type: 'Cửa ngõ cảng biển quốc tế'
      }
    ]
  },

  // 3. Khánh Hòa (Link Long Châu: Nha Trang, Vĩnh Hải ➔ Bắc Nha Trang)
  'khanh-hoa': {
    id: 'khanh-hoa',
    name: 'Tỉnh Khánh Hòa (Hợp nhất Khánh Hòa + Ninh Thuận)',
    center: [12.25, 109.18],
    zoom: 10,
    description: 'Trung tâm kinh tế biển quốc gia, tích hợp Vịnh Nha Trang, Cam Ranh và trung tâm năng lượng tái tạo Ninh Thuận.',
    legacy: {
      label: 'Ranh giới Khánh Hòa cũ (5.137 km²)',
      color: '#dc2626',
      areaKm2: 5137,
      entities: ['Tỉnh Khánh Hòa cũ (TP Nha Trang, Cam Ranh, Ninh Hòa, Vạn Ninh, Cam Lâm, Diên Khánh...)'],
      boundary: [
        [12.85, 109.10],
        [12.55, 109.30],
        [12.25, 109.25],
        [11.95, 109.15],
        [12.05, 108.80],
        [12.45, 108.85],
        [12.85, 109.10]
      ]
    },
    current: {
      label: 'Ranh giới Tỉnh Khánh Hòa Mới 2026 (8.511 km²)',
      color: '#059669',
      areaKm2: 8511,
      entities: ['Tỉnh Khánh Hòa + Tỉnh Ninh Thuận (Bao gồm Đặc khu Trường Sa)'],
      boundary: [
        [12.85, 109.10],
        [12.55, 109.30],
        [12.25, 109.25],
        [11.85, 109.15],
        [11.55, 109.05],
        [11.35, 108.95],
        [11.45, 108.65],
        [11.85, 108.70],
        [12.45, 108.85],
        [12.85, 109.10]
      ]
    },
    keyLocations: [
      {
        name: 'Phường Vĩnh Hải ➔ Phường Bắc Nha Trang',
        coords: [12.285, 109.198],
        legacyAddress: 'Phường Vĩnh Hải, Thành phố Nha Trang, Tỉnh Khánh Hòa (p=35, d=391, w=22330)',
        newAddress: 'Phường Bắc Nha Trang, Tỉnh Khánh Hòa',
        type: 'Link mẫu Long Châu'
      },
      {
        name: 'TP. Phan Rang - Tháp Chàm (Ninh Thuận cũ)',
        coords: [11.568, 108.995],
        legacyAddress: 'Thành phố Phan Rang - Tháp Chàm, Tỉnh Ninh Thuận',
        newAddress: 'Tỉnh Khánh Hòa (Mô hình 2 cấp)',
        type: 'Đô thị sáp nhập'
      }
    ]
  },

  // 4. Hải Phòng - Hải Dương
  'hai-phong': {
    id: 'hai-phong',
    name: 'Thành phố Hải Phòng (Hợp nhất Hải Phòng + Hải Dương)',
    center: [20.85, 106.68],
    zoom: 10,
    description: 'Tổ hợp công nghiệp công nghệ cao và cảng biển nước sâu quốc tế lớn nhất miền Bắc.',
    legacy: {
      label: 'Ranh giới TP. Hải Phòng cũ (1.527 km²)',
      color: '#dc2626',
      areaKm2: 1527,
      entities: ['Hải Phòng cũ: Hồng Bàng, Ngô Quyền, Lê Chân, Hải An, Thủy Nguyên, Đồ Sơn, Cát Hải'],
      boundary: [
        [21.05, 106.65],
        [20.90, 107.05],
        [20.65, 106.85],
        [20.70, 106.50],
        [21.05, 106.65]
      ]
    },
    current: {
      label: 'Ranh giới TP. Hải Phòng Mới 2026 (3.192 km²)',
      color: '#059669',
      areaKm2: 3192,
      entities: ['Hải Phòng + Tỉnh Hải Dương (gồm TP Hải Dương, Chí Linh, Kinh Môn...)'],
      boundary: [
        [21.20, 106.40],
        [21.05, 107.05],
        [20.65, 106.85],
        [20.65, 106.15],
        [21.00, 106.15],
        [21.20, 106.40]
      ]
    },
    keyLocations: [
      {
        name: 'TP. Hải Dương ➔ TP. Hải Phòng mới',
        coords: [20.941, 106.333],
        legacyAddress: 'Thành phố Hải Dương, Tỉnh Hải Dương',
        newAddress: 'Hải Phòng (mô hình 2 cấp)',
        type: 'Cực công nghiệp vệ tinh'
      },
      {
        name: 'Cảng nước sâu quốc tế Lạch Huyện',
        coords: [20.835, 106.887],
        legacyAddress: 'Huyện Cát Hải, Thành phố Hải Phòng',
        newAddress: 'Đặc khu Cát Hải, Hải Phòng',
        type: 'Cửa ngõ hàng hải quốc tế'
      }
    ]
  },

  // 5. Đà Nẵng - Quảng Nam
  'da-nang': {
    id: 'da-nang',
    name: 'Thành phố Đà Nẵng (Hợp nhất Đà Nẵng + Quảng Nam)',
    center: [15.95, 108.20],
    zoom: 9,
    description: 'Trung tâm tài chính quốc tế, công nghệ bán dẫn miền Trung kết hợp khu kinh tế mở Chu Lai và di sản Hội An, Mỹ Sơn.',
    legacy: {
      label: 'Ranh giới Đà Nẵng cũ (1.285 km²)',
      color: '#dc2626',
      areaKm2: 1285,
      entities: ['Đà Nẵng cũ: Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn, Liên Chiểu, Cẩm Lệ, Hòa Vang, Hoàng Sa'],
      boundary: [
        [16.25, 108.05],
        [16.15, 108.35],
        [15.95, 108.30],
        [15.95, 107.95],
        [16.25, 108.05]
      ]
    },
    current: {
      label: 'Ranh giới TP. Đà Nẵng Mới 2026 (11.859 km²)',
      color: '#059669',
      areaKm2: 11859,
      entities: ['Đà Nẵng + Tỉnh Quảng Nam (gồm TP Tam Kỳ, TP Hội An, Chu Lai, Điện Bàn...)'],
      boundary: [
        [16.25, 108.05],
        [16.15, 108.35],
        [15.45, 108.75],
        [14.95, 108.45],
        [15.35, 107.25],
        [16.15, 107.45],
        [16.25, 108.05]
      ]
    },
    keyLocations: [
      {
        name: 'Đô thị cổ Hội An',
        coords: [15.880, 108.338],
        legacyAddress: 'Thành phố Hội An, Tỉnh Quảng Nam',
        newAddress: 'Đà Nẵng (mô hình 2 cấp)',
        type: 'Di sản thế giới UNESCO'
      },
      {
        name: 'Khu kinh tế mở Chu Lai',
        coords: [15.433, 108.705],
        legacyAddress: 'Huyện Núi Thành, Tỉnh Quảng Nam',
        newAddress: 'Đà Nẵng',
        type: 'Tổ hợp công nghiệp ô tô & cảng'
      }
    ]
  }
}
