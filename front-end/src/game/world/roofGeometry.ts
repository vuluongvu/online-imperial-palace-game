import * as THREE from 'three';

/**
 * Hàm toán học dựng Mái Tứ Diện Cung Đình Cổ Trang (Imperial Vietnamese Hipped Roof)
 * Tự động tính toán đường cong uốn lượn (Mái Đao) vút cong ở 4 góc và võng nhẹ ở sườn ngói.
 */
export function createImperialRoofGeometry(
  wBottom: number,
  dBottom: number,
  wTop: number,
  dTop: number,
  height: number,
  eaveLift = 0.38,
  eaveSag = -0.12
): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const segX = 8;
  const segZ = 6;
  const segH = 4;

  const halfWb = wBottom / 2;
  const halfDb = dBottom / 2;
  const halfWt = wTop / 2;
  const halfDt = dTop / 2;
  const cornerFlare = eaveLift * 0.4;

  function addGrid(
    getPoint: (u: number, v: number) => { x: number; y: number; z: number },
    nx: number,
    ny: number,
    reverse = false
  ) {
    const startIdx = positions.length / 3;
    for (let iy = 0; iy <= ny; iy++) {
      const v = iy / ny;
      for (let ix = 0; ix <= nx; ix++) {
        const u = ix / nx;
        const pt = getPoint(u, v);
        positions.push(pt.x, pt.y, pt.z);
        uvs.push(u, v);
      }
    }
    const stride = nx + 1;
    for (let iy = 0; iy < ny; iy++) {
      for (let ix = 0; ix < nx; ix++) {
        const a = startIdx + iy * stride + ix;
        const b = startIdx + iy * stride + (ix + 1);
        const c = startIdx + (iy + 1) * stride + (ix + 1);
        const d = startIdx + (iy + 1) * stride + ix;
        if (!reverse) {
          indices.push(a, b, c, a, c, d);
        } else {
          indices.push(a, c, b, a, d, c);
        }
      }
    }
  }

  const calcCornerCurve = (t: number) => Math.pow(Math.abs(t - 0.5) * 2, 2.2);

  // 1. Mái Tiền (Mặt trước - hướng Nam: Z từ +halfDb -> +halfDt)
  addGrid(
    (u, v) => {
      const curve = calcCornerCurve(u);
      const lift = curve * eaveLift * (1 - v * 0.88);
      const flare = curve * cornerFlare * (1 - v);
      const sag = Math.sin(v * Math.PI) * eaveSag;

      const xBottom = -halfWb + u * wBottom + (u < 0.5 ? -flare : flare);
      const xTop = -halfWt + u * wTop;
      const x = xBottom * (1 - v) + xTop * v;

      const y = v * height + lift + sag;

      const zBottom = halfDb + flare;
      const zTop = halfDt;
      const z = zBottom * (1 - v) + zTop * v;
      return { x, y, z };
    },
    segX,
    segH,
    false
  );

  // 2. Mái Hậu (Mặt sau - hướng Bắc: Z từ -halfDb -> -halfDt)
  addGrid(
    (u, v) => {
      const curve = calcCornerCurve(u);
      const lift = curve * eaveLift * (1 - v * 0.88);
      const flare = curve * cornerFlare * (1 - v);
      const sag = Math.sin(v * Math.PI) * eaveSag;

      const xBottom = halfWb - u * wBottom + (u < 0.5 ? flare : -flare);
      const xTop = halfWt - u * wTop;
      const x = xBottom * (1 - v) + xTop * v;

      const y = v * height + lift + sag;

      const zBottom = -halfDb - flare;
      const zTop = -halfDt;
      const z = zBottom * (1 - v) + zTop * v;
      return { x, y, z };
    },
    segX,
    segH,
    false
  );

  // 3. Mái Chái Phải (Hướng Đông: X từ +halfWb -> +halfWt)
  addGrid(
    (u, v) => {
      const curve = calcCornerCurve(u);
      const lift = curve * eaveLift * (1 - v * 0.88);
      const flare = curve * cornerFlare * (1 - v);
      const sag = Math.sin(v * Math.PI) * eaveSag;

      const zBottom = halfDb - u * dBottom + (u < 0.5 ? flare : -flare);
      const zTop = halfDt - u * dTop;
      const z = zBottom * (1 - v) + zTop * v;

      const y = v * height + lift + sag;

      const xBottom = halfWb + flare;
      const xTop = halfWt;
      const x = xBottom * (1 - v) + xTop * v;
      return { x, y, z };
    },
    segZ,
    segH,
    false
  );

  // 4. Mái Chái Trái (Hướng Tây: X từ -halfWb -> -halfWt)
  addGrid(
    (u, v) => {
      const curve = calcCornerCurve(u);
      const lift = curve * eaveLift * (1 - v * 0.88);
      const flare = curve * cornerFlare * (1 - v);
      const sag = Math.sin(v * Math.PI) * eaveSag;

      const zBottom = -halfDb + u * dBottom + (u < 0.5 ? -flare : flare);
      const zTop = -halfDt + u * dTop;
      const z = zBottom * (1 - v) + zTop * v;

      const y = v * height + lift + sag;

      const xBottom = -halfWb - flare;
      const xTop = -halfWt;
      const x = xBottom * (1 - v) + xTop * v;
      return { x, y, z };
    },
    segZ,
    segH,
    false
  );

  // 5. Nóc Đỉnh (Đậy mặt phẳng bờ nóc chữ Nhất)
  addGrid(
    (u, v) => ({
      x: -halfWt + u * wTop,
      y: height,
      z: -halfDt + v * dTop,
    }),
    segX,
    2,
    false
  );

  // 6. Trần Soffit đáy diềm mái
  addGrid(
    (u, v) => ({
      x: -halfWb + u * wBottom,
      y: 0.05,
      z: halfDb - v * dBottom,
    }),
    segX,
    segZ,
    false
  );

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}
