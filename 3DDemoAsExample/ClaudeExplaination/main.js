import * as THREE from 'https://unpkg.com/three@0.166.0/build/three.module.js';

function buildFunctionSurface(f, size = 10, resolution = 50) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const indices = [];

  const step = size / resolution;
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = -size / 2 + i * step;
      const z = -size / 2 + j * step;
      const y = f(x, z);
      positions.push(x, y, z);
    }// 这是在干什么？
    // 这里是在生成网格顶点的位置数据。
    // 每个(i, j)对应网格上的一个点，计算其x, z坐标，并通过函数f计算y坐标，然后将(x, y, z)加入positions数组。
  }

  // build triangle pairs connecting each grid cell's 4 corners
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const a = i * (resolution + 1) + j;
      const b = a + 1;
      const c = a + (resolution + 1);
      const d = c + 1;
      indices.push(a, c, b,  b, c, d);
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals(); // needed for lighting to look right
  return geometry;
}

const geometry = buildFunctionSurface((x, z) => Math.sin(x) * Math.cos(z));
const material = new THREE.MeshStandardMaterial({ color: 0x3388ff, side: THREE.DoubleSide, wireframe: false });
const surface = new THREE.Mesh(geometry, material);
scene.add(surface);