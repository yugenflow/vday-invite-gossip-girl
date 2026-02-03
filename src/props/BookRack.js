import * as THREE from 'three';
import { makeBox } from '../utils/LowPolyHelpers.js';

export function createBookRack() {
  const group = new THREE.Group();

  const shelfMat = new THREE.MeshLambertMaterial({ color: 0xF5F0EB, flatShading: true });
  const bracketMat = new THREE.MeshLambertMaterial({ color: 0xD4AF37, flatShading: true });

  // Two shelves stacked
  for (let i = 0; i < 2; i++) {
    const yOff = i * 0.5;

    // Shelf board
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.22), shelfMat);
    shelf.position.set(0, yOff, 0);
    group.add(shelf);

    // L-brackets (gold)
    for (const x of [-0.5, 0.5]) {
      const vertBracket = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), bracketMat);
      vertBracket.position.set(x, yOff - 0.06, 0.08);
      group.add(vertBracket);
    }

    // Books on shelf
    const bookColors = [
      [0xCC2233, 0x8B1A2A], // red
      [0x1A3A6A, 0x0D2040], // navy
      [0x2A6A3A, 0x1A4A2A], // green
      [0xD4AF37, 0xB08A20], // gold
      [0x6A2A6A, 0x4A1A4A], // purple
      [0x1A1A1A, 0x333333], // black
      [0xCC6633, 0x8B4422], // brown
    ];

    let bx = -0.48;
    const shelfBooks = i === 0 ? 6 : 5;
    for (let b = 0; b < shelfBooks; b++) {
      const [color, spine] = bookColors[b % bookColors.length];
      const bw = 0.06 + Math.random() * 0.04;
      const bh = 0.16 + Math.random() * 0.06;

      // Book body
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(bw, bh, 0.14),
        new THREE.MeshLambertMaterial({ color, flatShading: true })
      );
      book.position.set(bx + bw / 2, yOff + 0.015 + bh / 2, 0);
      // Slight random tilt
      book.rotation.z = (Math.random() - 0.5) * 0.06;
      group.add(book);

      // Spine detail (thin lighter strip)
      const spineStrip = new THREE.Mesh(
        new THREE.BoxGeometry(bw + 0.002, 0.02, 0.002),
        new THREE.MeshLambertMaterial({ color: spine, flatShading: true })
      );
      spineStrip.position.set(bx + bw / 2, yOff + 0.015 + bh * 0.6, 0.072);
      group.add(spineStrip);

      bx += bw + 0.02;
    }

    // One book lying flat on second shelf
    if (i === 1) {
      const flatBook = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.04, 0.1),
        new THREE.MeshLambertMaterial({ color: 0xF5C6C6, flatShading: true })
      );
      flatBook.position.set(bx + 0.12, yOff + 0.035, 0);
      group.add(flatBook);
    }
  }

  return group;
}
