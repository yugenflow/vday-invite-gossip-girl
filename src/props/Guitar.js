import * as THREE from 'three';

export function createWallGuitar() {
  const group = new THREE.Group();

  const woodMat = new THREE.MeshLambertMaterial({ color: 0x8B5A2B, flatShading: true });
  const darkWoodMat = new THREE.MeshLambertMaterial({ color: 0x5C3A1A, flatShading: true });
  const stringMat = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
  const blackMat = new THREE.MeshLambertMaterial({ color: 0x1A1A1A, flatShading: true });

  // Body (acoustic guitar shape — two ellipses)
  // Lower bout (larger)
  const lowerBout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.06, 12),
    woodMat
  );
  lowerBout.rotation.x = Math.PI / 2;
  lowerBout.position.set(0, -0.15, 0);
  group.add(lowerBout);

  // Upper bout (smaller)
  const upperBout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.06, 12),
    woodMat
  );
  upperBout.rotation.x = Math.PI / 2;
  upperBout.position.set(0, 0.12, 0);
  group.add(upperBout);

  // Waist (connecting piece)
  const waist = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.18, 0.06),
    woodMat
  );
  waist.position.set(0, 0, 0);
  group.add(waist);

  // Sound hole
  const hole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.005, 12),
    blackMat
  );
  hole.rotation.x = Math.PI / 2;
  hole.position.set(0, -0.02, 0.031);
  group.add(hole);

  // Sound hole ring (decorative)
  const ringMat = new THREE.MeshLambertMaterial({ color: 0xD4AF37, flatShading: true });
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.065, 0.008, 6, 16),
    ringMat
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, -0.02, 0.032);
  group.add(ring);

  // Neck
  const neck = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.5, 0.03),
    darkWoodMat
  );
  neck.position.set(0, 0.48, 0);
  group.add(neck);

  // Fretboard
  const fretboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.5, 0.005),
    blackMat
  );
  fretboard.position.set(0, 0.48, 0.018);
  group.add(fretboard);

  // Headstock
  const headstock = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.12, 0.025),
    darkWoodMat
  );
  headstock.position.set(0, 0.78, 0);
  group.add(headstock);

  // Tuning pegs (3 per side)
  for (let i = 0; i < 3; i++) {
    for (const side of [-1, 1]) {
      const peg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.04, 6),
        new THREE.MeshLambertMaterial({ color: 0xD4AF37, flatShading: true })
      );
      peg.rotation.x = Math.PI / 2;
      peg.position.set(side * 0.04, 0.73 + i * 0.04, 0);
      group.add(peg);
    }
  }

  // Strings (6 thin lines)
  for (let i = 0; i < 6; i++) {
    const xOff = -0.018 + i * 0.0072;
    const string = new THREE.Mesh(
      new THREE.BoxGeometry(0.002, 0.7, 0.002),
      stringMat
    );
    string.position.set(xOff, 0.35, 0.02);
    group.add(string);
  }

  // Bridge
  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.015, 0.015),
    blackMat
  );
  bridge.position.set(0, -0.2, 0.025);
  group.add(bridge);

  // Wall mount bracket
  const bracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.04, 0.06),
    new THREE.MeshLambertMaterial({ color: 0x333333, flatShading: true })
  );
  bracket.position.set(0, 0.48, -0.04);
  group.add(bracket);

  return group;
}
