import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

function createBag(color, w, h, d, labelColor) {
  const bag = new THREE.Group();
  const body = makeBox(w, h, d, color);
  body.position.y = h / 2;
  bag.add(body);

  // Flap
  const flap = makeBox(w * 0.9, h * 0.12, d + 0.01, color);
  flap.position.set(0, h * 0.88, 0);
  bag.add(flap);

  // Clasp (gold)
  const clasp = makeBox(0.025, 0.025, 0.015, COLORS.ACCENT_GOLD);
  clasp.position.set(0, h * 0.8, d / 2 + 0.01);
  bag.add(clasp);

  // Handle
  const handle = makeBox(w * 0.4, 0.015, 0.015, COLORS.ACCENT_GOLD);
  handle.position.set(0, h + 0.03, 0);
  bag.add(handle);

  // Brand label (small colored rectangle on front)
  if (labelColor) {
    const label = makeBox(w * 0.3, h * 0.08, 0.005, labelColor);
    label.position.set(0, h * 0.5, d / 2 + 0.01);
    bag.add(label);
  }

  return bag;
}

export function createBagCabinet() {
  const group = new THREE.Group();

  // Cabinet frame (white/cream modern shelving unit)
  const cabinetW = 1.2;
  const cabinetH = 2.0;
  const cabinetD = 0.4;
  const shelfCount = 4;

  // Back panel
  const back = makeBox(cabinetW, cabinetH, 0.03, COLORS.VANITY_WHITE);
  back.position.set(0, cabinetH / 2, -cabinetD / 2 + 0.015);
  group.add(back);

  // Side panels
  const sideL = makeBox(0.03, cabinetH, cabinetD, COLORS.VANITY_WHITE);
  sideL.position.set(-cabinetW / 2 + 0.015, cabinetH / 2, 0);
  group.add(sideL);

  const sideR = makeBox(0.03, cabinetH, cabinetD, COLORS.VANITY_WHITE);
  sideR.position.set(cabinetW / 2 - 0.015, cabinetH / 2, 0);
  group.add(sideR);

  // Top
  const top = makeBox(cabinetW, 0.03, cabinetD, COLORS.VANITY_WHITE);
  top.position.set(0, cabinetH, 0);
  group.add(top);

  // Shelves and bags
  const shelfSpacing = cabinetH / shelfCount;
  const bags = [
    // Shelf 1 (bottom): Two LV bags
    [
      { color: 0x5C3A1E, w: 0.25, h: 0.2, d: 0.12, label: 0xD4AF37 },  // LV brown
      { color: 0xF5E6D0, w: 0.22, h: 0.18, d: 0.1, label: 0xD4AF37 },  // LV cream
    ],
    // Shelf 2: Chanel bags
    [
      { color: 0x1A1A1A, w: 0.24, h: 0.17, d: 0.1, label: 0xCCCCCC },  // Chanel black
      { color: 0xCC0033, w: 0.2, h: 0.16, d: 0.1, label: 0xFFFFFF },    // Chanel red
    ],
    // Shelf 3: Dior & Hermes
    [
      { color: 0xF5E6D0, w: 0.22, h: 0.18, d: 0.12, label: 0x1A1A1A },  // Dior cream
      { color: 0xEB6A34, w: 0.26, h: 0.2, d: 0.13, label: 0xD4AF37 },   // Hermes orange
    ],
    // Shelf 4 (top): Small clutches
    [
      { color: 0xD4AF37, w: 0.18, h: 0.12, d: 0.06, label: null },  // Gold clutch
      { color: 0xFF69B4, w: 0.16, h: 0.1, d: 0.06, label: null },   // Pink clutch
      { color: 0x1A1A1A, w: 0.17, h: 0.11, d: 0.06, label: 0xD4AF37 }, // Black clutch
    ],
  ];

  bags.forEach((shelfBags, shelfIndex) => {
    const shelfY = shelfIndex * shelfSpacing + 0.02;

    // Shelf board
    const shelf = makeBox(cabinetW - 0.06, 0.025, cabinetD - 0.02, COLORS.VANITY_WHITE);
    shelf.position.set(0, shelfY, 0);
    group.add(shelf);

    // Place bags on shelf
    const totalW = shelfBags.reduce((sum, b) => sum + b.w + 0.06, -0.06);
    let xOff = -totalW / 2;
    shelfBags.forEach(b => {
      const bag = createBag(b.color, b.w, b.h, b.d, b.label);
      bag.position.set(xOff + b.w / 2, shelfY + 0.015, 0.02);
      group.add(bag);
      xOff += b.w + 0.06;
    });
  });

  // Gold accent trim on top
  const goldTrim = makeBox(cabinetW + 0.02, 0.02, cabinetD + 0.02, COLORS.ACCENT_GOLD);
  goldTrim.position.set(0, cabinetH + 0.01, 0);
  group.add(goldTrim);

  return group;
}
