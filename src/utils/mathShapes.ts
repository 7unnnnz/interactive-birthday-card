export interface ParticleData {
  count: number;
  cakePositions: Float32Array;
  flowerPositions: Float32Array;
  cakeColors: Float32Array;
  flowerColors: Float32Array;
  sizes: Float32Array;
  randomSpeeds: Float32Array;
  isFlame: Uint8Array;     // Đánh dấu hạt ngọn lửa để tạo chuyển động bập bùng
  flameCenterY: Float32Array; // Tọa độ Y tâm ngọn lửa
}

/**
 * Tạo mô hình Bánh kem 3 tầng nhũ hồng với 5 ngọn nến (theo ảnh mẫu 2)
 * và Bó hoa Ly hồng Stargazer với nhụy dài, cánh viền trắng, lá xanh & vệt sao lấp lánh (theo ảnh mẫu 1)
 */
export function generateCakeAndFlowerParticles(count = 22000): ParticleData {
  const cakePositions = new Float32Array(count * 3);
  const flowerPositions = new Float32Array(count * 3);
  const cakeColors = new Float32Array(count * 3);
  const flowerColors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const randomSpeeds = new Float32Array(count);
  const isFlame = new Uint8Array(count);
  const flameCenterY = new Float32Array(count);

  // =========================================================================
  // 1. TẠO MÔ HÌNH BÁNH KEM 3 TẦNG NHŨ HỒNG & 5 CÂY NẾN (Ảnh mẫu 2)
  // =========================================================================
  // Phân bổ hạt cho bánh kem:
  // - Đĩa đế bánh: 10%
  // - Tầng 1 (đáy lớn): 26%
  // - Kẹo ngọc trai vàng tầng 1: 3%
  // - Tầng 2 (tầng giữa): 22%
  // - Quả dâu đỏ viền tầng 2: 4%
  // - Tầng 3 (tầng trên): 16%
  // - 5 thân nến sọc xanh ngọc: 9%
  // - 5 ngọn lửa nến bập bùng: 10%
  const plateCount = Math.floor(count * 0.10);
  const tier1Count = Math.floor(count * 0.25);
  const pearlsCount = Math.floor(count * 0.03);
  const tier2Count = Math.floor(count * 0.21);
  const berriesCount = Math.floor(count * 0.04);
  const tier3Count = Math.floor(count * 0.16);
  const candleCount = Math.floor(count * 0.09);
  const flameCount = count - (plateCount + tier1Count + pearlsCount + tier2Count + berriesCount + tier3Count + candleCount);

  let cIdx = 0;

  // 1.1 ĐĨA ĐẾ BÁNH (Plate / Platter): Mỏng, phẳng, tròn, màu bạc ngọc trai
  for (let i = 0; i < plateCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 2.8 + Math.sqrt(Math.random()) * 1.5;
    const x = Math.cos(angle) * r;
    const y = -2.15 + (Math.random() - 0.5) * 0.08;
    const z = Math.sin(angle) * r;

    cakePositions[cIdx * 3] = x;
    cakePositions[cIdx * 3 + 1] = y;
    cakePositions[cIdx * 3 + 2] = z;

    // Màu bạc ngọc trai ánh xà cừ
    const isGlint = Math.random() > 0.8;
    cakeColors[cIdx * 3] = isGlint ? 1.0 : 0.92;
    cakeColors[cIdx * 3 + 1] = isGlint ? 0.98 : 0.90;
    cakeColors[cIdx * 3 + 2] = isGlint ? 1.0 : 0.94;

    sizes[cIdx] = 0.038 + Math.random() * 0.025;
    randomSpeeds[cIdx] = 0.5 + Math.random() * 0.5;
    isFlame[cIdx] = 0;
    flameCenterY[cIdx] = 0;
    cIdx++;
  }

  // 1.2 TẦNG 1 (Đáy bánh lớn): R=2.7, H=1.1, Y: -2.1 -> -1.0
  // Màu hồng phấn ánh nhũ kim sa (Pink glitter sparkle)
  for (let i = 0; i < tier1Count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const isSurface = Math.random() > 0.3;
    const r = isSurface ? 2.65 + (Math.random() - 0.5) * 0.16 : Math.sqrt(Math.random()) * 2.65;
    const yNorm = Math.random();
    let y = -2.1 + yNorm * 1.1;

    // Lớp kem trắng ở mép trên tầng 1
    const isTopIcing = yNorm > 0.88;
    if (isTopIcing) {
      y += Math.sin(angle * 16) * 0.05;
    }

    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    cakePositions[cIdx * 3] = x;
    cakePositions[cIdx * 3 + 1] = y;
    cakePositions[cIdx * 3 + 2] = z;

    if (isTopIcing) {
      // Kem trắng ngọc trai
      cakeColors[cIdx * 3] = 0.99;
      cakeColors[cIdx * 3 + 1] = 0.97;
      cakeColors[cIdx * 3 + 2] = 0.98;
    } else {
      // Nhũ hồng pastel lấp lánh như mẫu
      const glitter = Math.random();
      if (glitter > 0.7) {
        // Ánh bạc lấp lánh
        cakeColors[cIdx * 3] = 1.0;
        cakeColors[cIdx * 3 + 1] = 0.92;
        cakeColors[cIdx * 3 + 2] = 0.96;
      } else {
        // Hồng phấn bánh kem
        cakeColors[cIdx * 3] = 0.96;
        cakeColors[cIdx * 3 + 1] = 0.62 + Math.random() * 0.15;
        cakeColors[cIdx * 3 + 2] = 0.74 + Math.random() * 0.12;
      }
    }

    sizes[cIdx] = 0.04 + Math.random() * 0.03;
    randomSpeeds[cIdx] = 0.6 + Math.random() * 0.6;
    isFlame[cIdx] = 0;
    flameCenterY[cIdx] = 0;
    cIdx++;
  }

  // 1.3 VIÊN NGỌC TRAI VÀNG TRANG TRÍ TẦNG 1 (Yellow Sugar Pearl Beads)
  const numPearls = 18;
  for (let i = 0; i < pearlsCount; i++) {
    const pearlIdx = Math.floor(Math.random() * numPearls);
    const centerAngle = (pearlIdx * 2 * Math.PI) / numPearls;
    const pearlR = 2.68;
    const px = Math.cos(centerAngle) * pearlR;
    const pz = Math.sin(centerAngle) * pearlR;
    const py = -1.02;

    // Hạt phân bố hình cầu nhỏ bán kính 0.08
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const pr = Math.pow(Math.random(), 0.6) * 0.08;

    cakePositions[cIdx * 3] = px + pr * Math.sin(phi) * Math.cos(theta);
    cakePositions[cIdx * 3 + 1] = py + pr * Math.sin(phi) * Math.sin(theta);
    cakePositions[cIdx * 3 + 2] = pz + pr * Math.cos(phi);

    // Màu vàng kẹo óng ánh
    cakeColors[cIdx * 3] = 1.0;
    cakeColors[cIdx * 3 + 1] = 0.85;
    cakeColors[cIdx * 3 + 2] = 0.35;

    sizes[cIdx] = 0.045 + Math.random() * 0.02;
    randomSpeeds[cIdx] = 0.5 + Math.random() * 0.5;
    isFlame[cIdx] = 0;
    flameCenterY[cIdx] = 0;
    cIdx++;
  }

  // 1.4 TẦNG 2 (Tầng giữa): R=1.9, H=0.9, Y: -1.0 -> -0.1
  // Màu hồng nhũ đậm hơn một chút (Rose sparkle)
  for (let i = 0; i < tier2Count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const isSurface = Math.random() > 0.3;
    const r = isSurface ? 1.88 + (Math.random() - 0.5) * 0.14 : Math.sqrt(Math.random()) * 1.88;
    const yNorm = Math.random();
    let y = -1.0 + yNorm * 0.9;

    const isTopIcing = yNorm > 0.85;
    if (isTopIcing) {
      y += Math.sin(angle * 14) * 0.04;
    }

    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    cakePositions[cIdx * 3] = x;
    cakePositions[cIdx * 3 + 1] = y;
    cakePositions[cIdx * 3 + 2] = z;

    if (isTopIcing) {
      // Kem trắng mềm
      cakeColors[cIdx * 3] = 0.99;
      cakeColors[cIdx * 3 + 1] = 0.96;
      cakeColors[cIdx * 3 + 2] = 0.97;
    } else {
      // Hồng nhũ trung tính
      const glitter = Math.random();
      if (glitter > 0.75) {
        cakeColors[cIdx * 3] = 1.0;
        cakeColors[cIdx * 3 + 1] = 0.90;
        cakeColors[cIdx * 3 + 2] = 0.95;
      } else {
        cakeColors[cIdx * 3] = 0.92;
        cakeColors[cIdx * 3 + 1] = 0.50 + Math.random() * 0.15;
        cakeColors[cIdx * 3 + 2] = 0.68 + Math.random() * 0.12;
      }
    }

    sizes[cIdx] = 0.04 + Math.random() * 0.03;
    randomSpeeds[cIdx] = 0.6 + Math.random() * 0.6;
    isFlame[cIdx] = 0;
    flameCenterY[cIdx] = 0;
    cIdx++;
  }

  // 1.5 CÁC VIÊN DÂU TÂY ĐỎ VIỀN TẦNG 2 (Red Berries): Đúng như mẫu ảnh 2
  const numBerries = 12;
  for (let i = 0; i < berriesCount; i++) {
    const berryIdx = Math.floor(Math.random() * numBerries);
    const centerAngle = (berryIdx * 2 * Math.PI) / numBerries + 0.15;
    const berryR = 1.88;
    const bx = Math.cos(centerAngle) * berryR;
    const bz = Math.sin(centerAngle) * berryR;
    const by = -0.12;

    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const br = Math.pow(Math.random(), 0.6) * 0.11;

    cakePositions[cIdx * 3] = bx + br * Math.sin(phi) * Math.cos(theta);
    cakePositions[cIdx * 3 + 1] = by + br * Math.sin(phi) * Math.sin(theta);
    cakePositions[cIdx * 3 + 2] = bz + br * Math.cos(phi);

    // Màu đỏ mọng dâu tây rực rỡ
    cakeColors[cIdx * 3] = 0.98;
    cakeColors[cIdx * 3 + 1] = 0.15;
    cakeColors[cIdx * 3 + 2] = 0.28;

    sizes[cIdx] = 0.048 + Math.random() * 0.02;
    randomSpeeds[cIdx] = 0.5 + Math.random() * 0.5;
    isFlame[cIdx] = 0;
    flameCenterY[cIdx] = 0;
    cIdx++;
  }

  // 1.6 TẦNG 3 (Tầng trên cùng): R=1.15, H=0.8, Y: -0.1 -> 0.7
  for (let i = 0; i < tier3Count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const isSurface = Math.random() > 0.3;
    const r = isSurface ? 1.12 + (Math.random() - 0.5) * 0.12 : Math.sqrt(Math.random()) * 1.12;
    const yNorm = Math.random();
    let y = -0.1 + yNorm * 0.8;

    const isTopIcing = yNorm > 0.82;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;

    cakePositions[cIdx * 3] = x;
    cakePositions[cIdx * 3 + 1] = y;
    cakePositions[cIdx * 3 + 2] = z;

    if (isTopIcing) {
      // Phủ kem trắng tinh khôi
      cakeColors[cIdx * 3] = 0.99;
      cakeColors[cIdx * 3 + 1] = 0.98;
      cakeColors[cIdx * 3 + 2] = 1.0;
    } else {
      // Hồng phấn ánh kim
      cakeColors[cIdx * 3] = 0.98;
      cakeColors[cIdx * 3 + 1] = 0.65 + Math.random() * 0.18;
      cakeColors[cIdx * 3 + 2] = 0.78 + Math.random() * 0.15;
    }

    sizes[cIdx] = 0.038 + Math.random() * 0.03;
    randomSpeeds[cIdx] = 0.6 + Math.random() * 0.6;
    isFlame[cIdx] = 0;
    flameCenterY[cIdx] = 0;
    cIdx++;
  }

  // 1.7 ĐÚNG NHƯ MẪU 2: 5 CÂY NẾN CẮM TRÊN TẦNG 3
  // 5 vị trí nến xếp hình vòng cung trên đỉnh tầng 3:
  const candleConfigs = [
    { x: -0.48, z: 0.10 },
    { x: -0.24, z: -0.22 },
    { x: 0.00,  z: 0.28 },
    { x: 0.24,  z: -0.22 },
    { x: 0.48,  z: 0.10 },
  ];
  const numCandles = candleConfigs.length; // 5 cây nến

  // Thân nến màu trắng kẻ sọc xanh ngọc/xanh biển nhạt
  for (let i = 0; i < candleCount; i++) {
    const candleIdx = Math.floor(Math.random() * numCandles);
    const cfg = candleConfigs[candleIdx];

    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.085;
    const y = 0.7 + Math.random() * 0.85; // Chiều cao thân nến từ 0.7 đến 1.55

    const x = cfg.x + Math.cos(angle) * r;
    const z = cfg.z + Math.sin(angle) * r;

    cakePositions[cIdx * 3] = x;
    cakePositions[cIdx * 3 + 1] = y;
    cakePositions[cIdx * 3 + 2] = z;

    // Sọc xoắn màu xanh biển/xanh ngọc trên thân trắng (như mẫu 2)
    const isStripe = Math.sin(y * 22 + angle * 2) > 0.15;
    if (isStripe) {
      cakeColors[cIdx * 3] = 0.35;
      cakeColors[cIdx * 3 + 1] = 0.75;
      cakeColors[cIdx * 3 + 2] = 0.95;
    } else {
      cakeColors[cIdx * 3] = 0.98;
      cakeColors[cIdx * 3 + 1] = 0.98;
      cakeColors[cIdx * 3 + 2] = 1.0;
    }

    sizes[cIdx] = 0.035 + Math.random() * 0.02;
    randomSpeeds[cIdx] = 0.4 + Math.random() * 0.5;
    isFlame[cIdx] = 0;
    flameCenterY[cIdx] = 0;
    cIdx++;
  }

  // 1.8 5 NGỌN LỬA NẾN LUNG LINH BẬP BÙNG (5 Flickering Flames)
  for (let i = 0; i < flameCount; i++) {
    const candleIdx = Math.floor(Math.random() * numCandles);
    const cfg = candleConfigs[candleIdx];

    const t = Math.random(); // 0 ở gốc lửa (y=1.55), 1 ở đỉnh nhọn (y=2.15)
    const rMax = 0.14 * Math.sin(t * Math.PI); // Hình giọt lệ
    const angle = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.6) * rMax;
    const y = 1.58 + t * 0.58;

    const x = cfg.x + Math.cos(angle) * r;
    const z = cfg.z + Math.sin(angle) * r;

    cakePositions[cIdx * 3] = x;
    cakePositions[cIdx * 3 + 1] = y;
    cakePositions[cIdx * 3 + 2] = z;

    // Gradient ngọn lửa: Trắng xanh ở gốc -> Vàng kim rực rỡ -> Cam đỏ ở ngọn
    if (t < 0.22) {
      cakeColors[cIdx * 3] = 0.7;
      cakeColors[cIdx * 3 + 1] = 0.92;
      cakeColors[cIdx * 3 + 2] = 1.0;
    } else if (t < 0.75) {
      cakeColors[cIdx * 3] = 1.0;
      cakeColors[cIdx * 3 + 1] = 0.90;
      cakeColors[cIdx * 3 + 2] = 0.20;
    } else {
      cakeColors[cIdx * 3] = 1.0;
      cakeColors[cIdx * 3 + 1] = 0.45;
      cakeColors[cIdx * 3 + 2] = 0.10;
    }

    sizes[cIdx] = 0.045 + Math.random() * 0.035;
    randomSpeeds[cIdx] = 1.6 + Math.random() * 1.8;
    isFlame[cIdx] = 1; // Đánh dấu hạt ngọn lửa
    flameCenterY[cIdx] = 1.85;
    cIdx++;
  }

  // =========================================================================
  // 2. TẠO MÔ HÌNH BÓ HOA LY HỒNG STARGAZER & VỆT SAO LẤP LÁNH (Ảnh mẫu 1)
  // =========================================================================
  // Phân bổ hạt cho Bó Hoa Ly:
  // - Hoa Ly trung tâm (6 cánh lớn viền trắng, lòng hồng đậm, đốm freckles): 42%
  // - Nhụy hoa ly (6 vòi nhụy dài cong vút + đầu hạt gạo nâu đỏ): 10%
  // - Hoa phụ / nụ hoa phía sau: 18%
  // - Cành và lá hoa ly xanh thon dài phía dưới: 18%
  // - Vệt sao ma thuật & trái tim hồng lơ lửng xung quanh (Fairy Sparkles): 12%
  const mainLilyPetalsCount = Math.floor(count * 0.42);
  const stamensCount = Math.floor(count * 0.10);
  const secondaryFlowerCount = Math.floor(count * 0.18);
  const foliageCount = Math.floor(count * 0.18);
  const fairyTrailCount = count - (mainLilyPetalsCount + stamensCount + secondaryFlowerCount + foliageCount);

  let fIdx = 0;

  // 2.1 BÔNG HOA LY CHÍNH: 6 CÁNH HOA THON DÀI UỐN CONG DUYÊN DÁNG (Main Stargazer Lily)
  // 3 cánh trong (lớn hơn), 3 cánh ngoài (nhỏ hơn, so le)
  for (let i = 0; i < mainLilyPetalsCount; i++) {
    const numPetals = 6;
    const petalIdx = Math.floor(Math.random() * numPetals);
    const baseAngle = (petalIdx * 2 * Math.PI) / numPetals;
    const isInnerTepal = petalIdx % 2 === 0;

    const u = Math.random(); // 0 ở họng hoa, 1 ở đầu cánh nhọn
    const v = (Math.random() - 0.5) * 2; // -1 đến 1: khoảng cách từ sống giữa ra 2 mép cánh

    // Bề rộng cánh hoa hình thoi thuôn dài đặc trưng hoa ly
    const maxWidth = isInnerTepal ? 0.75 : 0.62;
    const widthProfile = Math.sin(Math.pow(u, 0.75) * Math.PI) * maxWidth;
    const r = 0.35 + u * 2.65;
    const angle = baseAngle + v * widthProfile * 0.62;

    // Đường cong sống lưng cánh hoa ly: vươn lên rồi cong uốn ngược ra ngoài mềm mại
    const archY = 0.25 + Math.sin(u * Math.PI * 0.8) * 0.85 - Math.pow(u, 2.0) * 0.95;
    // Độ cong võng lòng thuyền (Cup shape)
    const troughY = -Math.pow(v, 2.0) * 0.22 * Math.sin(u * Math.PI);

    // Mép cánh hoa hơi uốn lượn rập rờn nhẹ
    const ruffle = (Math.abs(v) > 0.7) ? Math.sin(u * 18.0) * 0.04 : 0;

    const x = Math.cos(angle) * r;
    const y = archY + troughY + ruffle;
    const z = Math.sin(angle) * r;

    flowerPositions[fIdx * 3] = x;
    flowerPositions[fIdx * 3 + 1] = y;
    flowerPositions[fIdx * 3 + 2] = z;

    // PHỐI MÀU HOA LY HỒNG STARGAZER (Đúng như ảnh 1):
    // - Sống giữa cánh (v ~ 0): Hồng cánh sen đậm (#d63384 / #be185d)
    // - Lưng chừng cánh: Hồng phấn đào ngọt ngào (#f472b6)
    // - Mép ngoài cùng (v ~ ±1): Trắng ngọc trai tinh khôi (#ffffff)
    // - Lưng cuống họng hoa (u < 0.25): Xanh vàng nhạt ánh ngọc
    const distFromCenter = Math.abs(v);

    if (u < 0.16) {
      // Họng hoa xanh vàng phớt
      flowerColors[fIdx * 3] = 0.75;
      flowerColors[fIdx * 3 + 1] = 0.90;
      flowerColors[fIdx * 3 + 2] = 0.55;
    } else if (distFromCenter < 0.35) {
      // Sống giữa cánh: Hồng đậm rực rỡ
      flowerColors[fIdx * 3] = 0.88;
      flowerColors[fIdx * 3 + 1] = 0.18 + u * 0.20;
      flowerColors[fIdx * 3 + 2] = 0.50 + u * 0.15;
    } else if (distFromCenter < 0.78) {
      // Thân cánh: Hồng phấn đào
      flowerColors[fIdx * 3] = 0.96;
      flowerColors[fIdx * 3 + 1] = 0.50 + u * 0.25;
      flowerColors[fIdx * 3 + 2] = 0.72 + u * 0.15;
    } else {
      // Mép cánh: Trắng viền mềm
      flowerColors[fIdx * 3] = 0.99;
      flowerColors[fIdx * 3 + 1] = 0.94;
      flowerColors[fIdx * 3 + 2] = 0.97;
    }

    // Đốm chấm hạt li ti (Freckles) ở họng hoa ly
    if (u > 0.18 && u < 0.55 && distFromCenter < 0.6 && Math.random() > 0.78) {
      flowerColors[fIdx * 3] = 0.55; // Nâu đỏ thẫm
      flowerColors[fIdx * 3 + 1] = 0.08;
      flowerColors[fIdx * 3 + 2] = 0.20;
    }

    fIdx++;
  }

  // 2.2 NHỤY HOA LY ĐẶC TRƯNG: 6 VÒI NHỤY CONG DÀI & ĐẦU HẠT GẠO NÂU ĐỎ (Stamens & Anthers)
  const numStamens = 6;
  for (let i = 0; i < stamensCount; i++) {
    const stamenIdx = Math.floor(Math.random() * numStamens);
    const baseAngle = (stamenIdx * 2 * Math.PI) / numStamens + 0.52; // So le với cánh hoa

    const u = Math.random(); // 0 ở họng hoa, 1 ở đầu hạt phấn

    if (u < 0.82) {
      // Thân chỉ nhị (Filament): Mảnh, cong vút hướng ra trước
      const filamentR = 0.15 + u * 1.35;
      const filamentY = 0.25 + u * 0.82 - Math.pow(u, 2.0) * 0.35;
      const spreadAngle = baseAngle + (Math.random() - 0.5) * 0.08;

      flowerPositions[fIdx * 3] = Math.cos(spreadAngle) * filamentR;
      flowerPositions[fIdx * 3 + 1] = filamentY;
      flowerPositions[fIdx * 3 + 2] = Math.sin(spreadAngle) * filamentR;

      // Màu chỉ nhị: Vàng chanh / xanh nhạt
      flowerColors[fIdx * 3] = 0.85;
      flowerColors[fIdx * 3 + 1] = 0.92;
      flowerColors[fIdx * 3 + 2] = 0.45;
    } else {
      // Bao phấn (Anther): Hình hạt gạo nằm ngang ở đầu vòi nhụy
      const antherR = 1.35;
      const antherY = 0.82;
      const ax = Math.cos(baseAngle) * antherR;
      const az = Math.sin(baseAngle) * antherR;

      // Hạt gạo dài ~0.25
      const along = (Math.random() - 0.5) * 0.25;
      const perpAngle = baseAngle + Math.PI / 2;

      flowerPositions[fIdx * 3] = ax + Math.cos(perpAngle) * along + (Math.random() - 0.5) * 0.05;
      flowerPositions[fIdx * 3 + 1] = antherY + (Math.random() - 0.5) * 0.06;
      flowerPositions[fIdx * 3 + 2] = az + Math.sin(perpAngle) * along + (Math.random() - 0.5) * 0.05;

      // Màu phấn hoa: Nâu đỏ cam đậm (đúng như trong ảnh 1)
      flowerColors[fIdx * 3] = 0.65;
      flowerColors[fIdx * 3 + 1] = 0.18;
      flowerColors[fIdx * 3 + 2] = 0.08;
    }
    fIdx++;
  }

  // 2.3 HOA PHỤ / NỤ HOA TẠO CHIỀU SÂU BÓ HOA (Bouquet Depth)
  for (let i = 0; i < secondaryFlowerCount; i++) {
    // 2 đóa hoa phụ lệch trái (-1.0, 0.7, -0.6) và lệch phải (1.1, 0.6, -0.5)
    const isLeft = Math.random() > 0.5;
    const centerOffset = isLeft ? { x: -1.05, y: 0.65, z: -0.6 } : { x: 1.10, y: 0.55, z: -0.5 };

    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 0.7) * 1.35;

    flowerPositions[fIdx * 3] = centerOffset.x + r * Math.sin(phi) * Math.cos(theta);
    flowerPositions[fIdx * 3 + 1] = centerOffset.y + r * Math.sin(phi) * Math.sin(theta) * 0.65;
    flowerPositions[fIdx * 3 + 2] = centerOffset.z + r * Math.cos(phi);

    // Hoa phụ có tone màu phớt hồng và trắng ngà
    const isPale = Math.random() > 0.5;
    if (isPale) {
      flowerColors[fIdx * 3] = 0.99;
      flowerColors[fIdx * 3 + 1] = 0.92;
      flowerColors[fIdx * 3 + 2] = 0.95;
    } else {
      flowerColors[fIdx * 3] = 0.95;
      flowerColors[fIdx * 3 + 1] = 0.55;
      flowerColors[fIdx * 3 + 2] = 0.75;
    }
    fIdx++;
  }

  // 2.4 CÀNH VÀ LÁ HOA LY XANH MƯỚT (Foliage & Stems - Như ảnh 1)
  for (let i = 0; i < foliageCount; i++) {
    // Lá thon dài hình mũi mác vươn ra từ cuống hoa hướng xuống dưới
    const leafAngle = Math.random() * Math.PI * 2;
    const u = Math.random(); // 0 ở gốc cuống, 1 ở chóp lá

    const leafR = 0.3 + Math.pow(u, 0.8) * 1.95;
    const leafY = -0.15 - u * 1.95; // Từ -0.15 xuống -2.1
    const leafWidth = Math.sin(u * Math.PI) * 0.22;
    const spread = (Math.random() - 0.5) * leafWidth;

    flowerPositions[fIdx * 3] = Math.cos(leafAngle) * leafR + Math.sin(leafAngle) * spread;
    flowerPositions[fIdx * 3 + 1] = leafY;
    flowerPositions[fIdx * 3 + 2] = Math.sin(leafAngle) * leafR - Math.cos(leafAngle) * spread;

    // Màu xanh ngọc lá cây rực rỡ và xanh thẫm
    const isEmerald = Math.random() > 0.4;
    if (isEmerald) {
      flowerColors[fIdx * 3] = 0.12;
      flowerColors[fIdx * 3 + 1] = 0.65;
      flowerColors[fIdx * 3 + 2] = 0.28;
    } else {
      flowerColors[fIdx * 3] = 0.08;
      flowerColors[fIdx * 3 + 1] = 0.48;
      flowerColors[fIdx * 3 + 2] = 0.20;
    }
    fIdx++;
  }

  // 2.5 VỆT BỤI SAO MA THUẬT & TRÁI TIM HỒNG LƠ LỬNG (Fairy Sparkles & Floating Hearts - Ảnh 1)
  for (let i = 0; i < fairyTrailCount; i++) {
    const isHeart = Math.random() > 0.65;

    if (isHeart) {
      // Vẽ các cụm trái tim nhỏ bay bổng xung quanh bông hoa
      const heartCenters = [
        { x: -1.8, y: 1.6, z: 0.5 },
        { x: 1.9,  y: 1.4, z: 0.3 },
        { x: -1.4, y: 0.2, z: 1.2 },
        { x: 1.6,  y: -0.4, z: 0.9 },
        { x: 0.0,  y: 2.1, z: -0.2 }
      ];
      const hc = heartCenters[Math.floor(Math.random() * heartCenters.length)];

      const t = Math.random() * Math.PI * 2;
      const hScale = 0.015;
      // Công thức tham số hình trái tim
      const hx = 16 * Math.pow(Math.sin(t), 3) * hScale;
      const hy = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * hScale;

      flowerPositions[fIdx * 3] = hc.x + hx + (Math.random() - 0.5) * 0.04;
      flowerPositions[fIdx * 3 + 1] = hc.y + hy + (Math.random() - 0.5) * 0.04;
      flowerPositions[fIdx * 3 + 2] = hc.z + (Math.random() - 0.5) * 0.08;

      // Trái tim màu hồng cánh sen phát sáng rực rỡ
      flowerColors[fIdx * 3] = 1.0;
      flowerColors[fIdx * 3 + 1] = 0.25;
      flowerColors[fIdx * 3 + 2] = 0.65;
    } else {
      // Vệt dải sao bụi tiên (Fairy Sparkle Trail) lượn sóng xung quanh bó hoa
      const trailT = Math.random() * Math.PI * 4; // 2 vòng xoắn
      const trailR = 2.4 + Math.sin(trailT * 3.0) * 0.45;
      const trailY = -0.8 + (trailT / (Math.PI * 4)) * 3.2;

      flowerPositions[fIdx * 3] = Math.cos(trailT) * trailR + (Math.random() - 0.5) * 0.15;
      flowerPositions[fIdx * 3 + 1] = trailY + (Math.random() - 0.5) * 0.15;
      flowerPositions[fIdx * 3 + 2] = Math.sin(trailT) * trailR + (Math.random() - 0.5) * 0.15;

      // Ánh sao trắng & vàng kim lấp lánh
      const isGold = Math.random() > 0.4;
      flowerColors[fIdx * 3] = 1.0;
      flowerColors[fIdx * 3 + 1] = isGold ? 0.90 : 0.98;
      flowerColors[fIdx * 3 + 2] = isGold ? 0.45 : 1.0;
    }
    fIdx++;
  }

  return {
    count,
    cakePositions,
    flowerPositions,
    cakeColors,
    flowerColors,
    sizes,
    randomSpeeds,
    isFlame,
    flameCenterY
  };
}
