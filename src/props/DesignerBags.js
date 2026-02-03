import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

function createBag(color, handleColor, w, h, d) {
  const bag = new THREE.Group();
  const body = makeBox(w, h, d, color);
  body.position.y = h / 2;
  bag.add(body);

  // Flap
  const flap = makeBox(w * 0.9, h * 0.15, d + 0.02, color);
  flap.position.set(0, h * 0.85, 0);
  bag.add(flap);

  // Clasp
  const clasp = makeBox(0.03, 0.03, 0.02, handleColor || COLORS.ACCENT_GOLD);
  clasp.position.set(0, h * 0.77, d / 2 + 0.01);
  bag.add(clasp);

  // Handle/strap
  const handle = makeBox(w * 0.5, 0.02, 0.02, handleColor || COLORS.ACCENT_GOLD);
  handle.position.set(0, h + 0.04, 0);
  bag.add(handle);

  return bag;
}

export function createDesignerBags() {
  const group = new THREE.Group();

  // Hermes Birkin (orange)
  const hermes = createBag(COLORS.DESIGNER_BAG_ORANGE, COLORS.ACCENT_GOLD, 0.3, 0.22, 0.15);
  hermes.position.set(-0.25, 0, 0);
  group.add(hermes);

  // Chanel (black, quilted effect via extra box)
  const chanel = createBag(COLORS.DESIGNER_BAG_BLACK, 0xCCCCCC, 0.25, 0.18, 0.1);
  chanel.position.set(0.15, 0, 0.05);
  // Add CC logo suggestion (two small arcs)
  const logoL = makeBox(0.02, 0.04, 0.01, 0xCCCCCC);
  logoL.position.set(0.13, 0.1, 0.11);
  group.add(logoL);
  const logoR = makeBox(0.02, 0.04, 0.01, 0xCCCCCC);
  logoR.position.set(0.17, 0.1, 0.11);
  group.add(logoR);
  group.add(chanel);

  // Dior (cream)
  const dior = createBag(COLORS.DESIGNER_BAG_CREAM, COLORS.ACCENT_GOLD, 0.22, 0.16, 0.12);
  dior.position.set(0.45, 0, -0.05);
  dior.rotation.y = -0.3;
  group.add(dior);

  return group;
}
