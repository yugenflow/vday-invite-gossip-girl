import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';
import { COLORS } from '../constants.js';

export function createBookRack() {
  const group = new THREE.Group();

  // Shelves (2 levels)
  const shelf1 = makeBox(1.2, 0.04, 0.25, COLORS.BOOK_RACK);
  shelf1.position.set(0, 0, 0);
  group.add(shelf1);

  const shelf2 = makeBox(1.2, 0.04, 0.25, COLORS.BOOK_RACK);
  shelf2.position.set(0, 0.4, 0);
  group.add(shelf2);

  // Side panels
  const side1 = makeBox(0.04, 0.44, 0.25, COLORS.BOOK_RACK);
  side1.position.set(-0.6, 0.2, 0);
  group.add(side1);

  const side2 = makeBox(0.04, 0.44, 0.25, COLORS.BOOK_RACK);
  side2.position.set(0.6, 0.2, 0);
  group.add(side2);

  // Books on lower shelf
  const bookColors = [0xCC3333, 0x3366CC, 0x33AA33, 0xCCAA33, 0x9933CC, 0xCC6633];
  bookColors.forEach((color, i) => {
    const h = 0.2 + Math.random() * 0.12;
    const book = makeBox(0.04 + Math.random() * 0.03, h, 0.18, color);
    book.position.set(-0.45 + i * 0.16, 0.02 + h / 2, 0);
    group.add(book);
  });

  // Books on upper shelf
  const upperColors = [0xAA3366, 0x336699, 0x66AA33, 0xAA6633];
  upperColors.forEach((color, i) => {
    const h = 0.18 + Math.random() * 0.1;
    const book = makeBox(0.04 + Math.random() * 0.03, h, 0.18, color);
    book.position.set(-0.35 + i * 0.18, 0.42 + h / 2, 0);
    group.add(book);
  });

  return group;
}
