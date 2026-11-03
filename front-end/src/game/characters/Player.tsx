import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  createRobeTexture,
  OfficialRank,
  RANK_OUTFITS,
} from './CharacterMaterials';
import {
  CharacterAnimationState,
  ChibiRigRefs,
  updateChibiAnimation,
} from './CharacterAnimations';
import { useGameStore } from '../../stores/useGameStore';
import { useGameplayStore } from '../../stores/useGameplayStore';

interface PlayerProps {
  rank?: OfficialRank;
  animationState?: CharacterAnimationState;
}

const PEARL_COLUMNS = [-0.28, -0.21, -0.14, -0.07, 0, 0.07, 0.14, 0.21, 0.28];
const PEARL_ROWS = [0.04, 0.09, 0.14, 0.19];

/**
 * Nhân vật Chibi Big Head (Đầu chiếm ~43% chiều cao cơ thể).
 * Hỗ trợ đầy đủ trang phục Hoàng Đế (Long Bào Vàng + Mũ Miện Lưu) và Quan Viên 3 cấp.
 * Sẵn sàng thay thế bằng GLB thông qua đường dẫn `/assets/characters/chibi_official.glb`.
 */
export const Player: React.FC<PlayerProps> = ({
  rank: propRank,
  animationState: propAnimState,
}) => {
  const storeRank = useGameStore((s) => s.characterRank);
  const storeAnim = useGameStore((s) => s.animationState);
  const previewAnimOverride = useGameStore((s) => s.previewAnimOverride);
  const holdingJadeTablet = useGameStore((s) => s.holdingJadeTablet);
  const showWireframe = useGameStore((s) => s.showWireframe);
  const currentQuestStep = useGameplayStore((s) => s.currentQuestStep);
  const hasCourierScroll = currentQuestStep === 2;

  const activeRank = propRank ?? storeRank;
  const activeAnim = previewAnimOverride ?? propAnimState ?? storeAnim;
  const outfit = RANK_OUTFITS[activeRank];

  // Refs cho hệ thống khớp Chibi
  const rootRef = useRef<THREE.Group>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftArmGroupRef = useRef<THREE.Group>(null);
  const rightArmGroupRef = useRef<THREE.Group>(null);
  const leftLegGroupRef = useRef<THREE.Group>(null);
  const rightLegGroupRef = useRef<THREE.Group>(null);
  const frontTasselGroupRef = useRef<THREE.Group>(null);
  const backTasselGroupRef = useRef<THREE.Group>(null);
  const leftWingMeshRef = useRef<THREE.Mesh>(null);
  const rightWingMeshRef = useRef<THREE.Mesh>(null);
  const leftEyeGroupRef = useRef<THREE.Group>(null);
  const rightEyeGroupRef = useRef<THREE.Group>(null);

  // Vật liệu nhân vật được cache và tự động dispose khi đổi phẩm cấp hoặc unmount
  const materials = useMemo(() => {
    const robeTex = createRobeTexture(outfit);

    const skin = new THREE.MeshStandardMaterial({
      color: '#FFE1C9',
      roughness: 0.52,
      metalness: 0.02,
      wireframe: showWireframe,
    });

    const blush = new THREE.MeshStandardMaterial({
      color: '#F28F85',
      roughness: 0.65,
      transparent: true,
      opacity: 0.68,
      wireframe: showWireframe,
    });

    const hair = new THREE.MeshStandardMaterial({
      color: '#1A1412',
      roughness: 0.45,
      metalness: 0.1,
      wireframe: showWireframe,
    });

    const eyeDark = new THREE.MeshStandardMaterial({
      color: '#1F130E',
      roughness: 0.15,
      metalness: 0.1,
      wireframe: showWireframe,
    });

    const eyeIris = new THREE.MeshStandardMaterial({
      color: activeRank === 'emperor' ? '#5E3818' : '#3B2314',
      roughness: 0.2,
      wireframe: showWireframe,
    });

    const eyeHighlight = new THREE.MeshBasicMaterial({
      color: '#FFFFFF',
    });

    const robeMain = new THREE.MeshStandardMaterial({
      map: robeTex,
      roughness: 0.42,
      metalness: activeRank === 'emperor' ? 0.22 : 0.08,
      wireframe: showWireframe,
    });

    const robePrimarySolid = new THREE.MeshStandardMaterial({
      color: outfit.primaryColor,
      roughness: 0.42,
      metalness: activeRank === 'emperor' ? 0.22 : 0.08,
      wireframe: showWireframe,
    });

    const robeSecondary = new THREE.MeshStandardMaterial({
      color: outfit.secondaryColor,
      roughness: 0.45,
      metalness: 0.12,
      wireframe: showWireframe,
    });

    const goldTrim = new THREE.MeshStandardMaterial({
      color: outfit.trimColor,
      roughness: 0.24,
      metalness: 0.76,
      wireframe: showWireframe,
    });

    const innerCollar = new THREE.MeshStandardMaterial({
      color: '#F8F4EA',
      roughness: 0.5,
      wireframe: showWireframe,
    });

    const crownBlack = new THREE.MeshStandardMaterial({
      color: '#1C1614',
      roughness: 0.3,
      metalness: 0.25,
      wireframe: showWireframe,
    });

    const jadeWhite = new THREE.MeshStandardMaterial({
      color: '#E6F4EA',
      roughness: 0.18,
      metalness: 0.15,
      emissive: '#4F7D68',
      emissiveIntensity: 0.15,
      wireframe: showWireframe,
    });

    const pearlRed = new THREE.MeshStandardMaterial({
      color: '#D62828',
      roughness: 0.2,
      metalness: 0.2,
      wireframe: showWireframe,
    });

    const bootBlack = new THREE.MeshStandardMaterial({
      color: '#1E1A18',
      roughness: 0.45,
      wireframe: showWireframe,
    });

    const list = [
      skin,
      blush,
      hair,
      eyeDark,
      eyeIris,
      eyeHighlight,
      robeMain,
      robePrimarySolid,
      robeSecondary,
      goldTrim,
      innerCollar,
      crownBlack,
      jadeWhite,
      pearlRed,
      bootBlack,
    ];

    return {
      skin,
      blush,
      hair,
      eyeDark,
      eyeIris,
      eyeHighlight,
      robeMain,
      robePrimarySolid,
      robeSecondary,
      goldTrim,
      innerCollar,
      crownBlack,
      jadeWhite,
      pearlRed,
      bootBlack,
      dispose: () => {
        robeTex.dispose();
        list.forEach((m) => m.dispose());
      },
    };
  }, [outfit, activeRank, showWireframe]);

  useEffect(() => {
    return () => {
      materials.dispose();
    };
  }, [materials]);

  const frameCountRef = useRef(0);

  useFrame(({ clock, camera }, delta) => {
    if (!rootRef.current) return;
    frameCountRef.current++;

    // Tối ưu hóa chuyển động theo khoảng cách (Distance-based Animation LOD):
    // 1. Gần (< 10m): Cập nhật 60 FPS mượt mà
    // 2. Trung bình (10m - 24m): Giảm tần suất cập nhật (mỗi 2 frames)
    // 3. Xa (24m - 42m): Cập nhật mỗi 4 frames
    // 4. Rất xa (> 42m): Đóng băng animation, tiết kiệm tuyệt đối CPU/GPU
    const worldPos = rootRef.current.getWorldPosition(new THREE.Vector3());
    const distToCam = camera.position.distanceTo(worldPos);

    if (distToCam > 42) {
      return;
    }
    if (distToCam > 24 && frameCountRef.current % 4 !== 0) {
      return;
    }
    if (distToCam > 10 && frameCountRef.current % 2 !== 0) {
      return;
    }

    const rig: ChibiRigRefs = {
      root: rootRef.current,
      bodyGroup: bodyGroupRef.current,
      headGroup: headGroupRef.current,
      leftArmGroup: leftArmGroupRef.current,
      rightArmGroup: rightArmGroupRef.current,
      leftLegGroup: leftLegGroupRef.current,
      rightLegGroup: rightLegGroupRef.current,
      frontTasselGroup: frontTasselGroupRef.current,
      backTasselGroup: backTasselGroupRef.current,
      leftWingMesh: leftWingMeshRef.current,
      rightWingMesh: rightWingMeshRef.current,
      leftEyeGroup: leftEyeGroupRef.current,
      rightEyeGroup: rightEyeGroupRef.current,
    };

    updateChibiAnimation(rig, activeAnim, clock.getElapsedTime(), delta);
  });

  return (
    <group ref={rootRef} name={`ChibiCharacter_${activeRank}`}>
      {/* Vòng hào quang chân nhân vật (Giúp định vị rõ trên sàn gỗ/thảm đỏ MMORPG) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[0.42, 0.52, 32]} />
        <meshBasicMaterial
          color={activeRank === 'emperor' ? '#FBE088' : '#63B3ED'}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ================================================================= */}
      {/* CHÂN NGẮN CHIBI & HIA CỔ TRANG (Y = 0.0 -> 0.34m)                 */}
      {/* ================================================================= */}
      <group ref={leftLegGroupRef} position={[-0.14, 0.32, 0]}>
        <mesh position={[0, -0.14, 0]} material={materials.bootBlack} castShadow>
          <capsuleGeometry args={[0.075, 0.14, 8, 12]} />
        </mesh>
        {/* Mũi hia đế trắng cổ trang */}
        <mesh position={[0, -0.26, 0.05]} material={materials.bootBlack} castShadow>
          <boxGeometry args={[0.15, 0.09, 0.24]} />
        </mesh>
        <mesh position={[0, -0.3, 0.05]} material={materials.innerCollar}>
          <boxGeometry args={[0.155, 0.035, 0.25]} />
        </mesh>
      </group>

      <group ref={rightLegGroupRef} position={[0.14, 0.32, 0]}>
        <mesh position={[0, -0.14, 0]} material={materials.bootBlack} castShadow>
          <capsuleGeometry args={[0.075, 0.14, 8, 12]} />
        </mesh>
        <mesh position={[0, -0.26, 0.05]} material={materials.bootBlack} castShadow>
          <boxGeometry args={[0.15, 0.09, 0.24]} />
        </mesh>
        <mesh position={[0, -0.3, 0.05]} material={materials.innerCollar}>
          <boxGeometry args={[0.155, 0.035, 0.25]} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* THÂN NHỏ CHIBI & LONG BÀO / QUAN PHỤC (Y = 0.24 -> 0.98m)         */}
      {/* ================================================================= */}
      <group ref={bodyGroupRef}>
        {/* Thân Long Bào / Quan Phục hình chuông bầu bĩnh */}
        <mesh position={[0, 0.6, 0]} material={materials.robeMain} castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.38, 0.72, 24]} />
        </mesh>

        {/* Bầu vai bo tròn mềm mại */}
        <mesh
          position={[0, 0.88, 0]}
          scale={[1.15, 0.55, 0.92]}
          material={materials.robePrimarySolid}
          castShadow
        >
          <sphereGeometry args={[0.25, 20, 14]} />
        </mesh>

        {/* Cổ áo Giao Lĩnh (Lớp lụa trắng bên trong + Viền gấm vàng/đỏ bên ngoài) */}
        <mesh
          position={[0, 0.95, 0.02]}
          rotation={[0.15, 0, 0]}
          material={materials.innerCollar}
        >
          <cylinderGeometry args={[0.16, 0.19, 0.14, 18]} />
        </mesh>
        <mesh
          position={[0, 0.93, 0.03]}
          rotation={[0.2, 0, 0]}
          material={materials.goldTrim}
        >
          <torusGeometry args={[0.175, 0.028, 10, 24]} />
        </mesh>

        {/* Đai Ngọc Bội Hoàng Gia (Jade Belt) ngang eo */}
        <group position={[0, 0.58, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.robeSecondary}>
            <torusGeometry args={[0.315, 0.036, 10, 28]} />
          </mesh>
          {/* Các phiến ngọc bội đính quanh đai */}
          {[0, 0.65, -0.65, 1.35, -1.35, Math.PI].map((angle, idx) => (
            <mesh
              key={`jade-plaque-${idx}`}
              position={[Math.sin(angle) * 0.33, 0, Math.cos(angle) * 0.33]}
              rotation={[0, angle, 0]}
              material={idx === 0 ? materials.jadeWhite : materials.goldTrim}
            >
              <boxGeometry args={[0.085, 0.075, 0.025]} />
            </mesh>
          ))}
        </group>

        {/* Bế Tất (Tấm蔽膝 thêu rồng rủ trước bụng Long Bào) */}
        <mesh
          position={[0, 0.4, 0.33]}
          rotation={[-0.14, 0, 0]}
          material={materials.robeSecondary}
          castShadow
        >
          <boxGeometry args={[0.22, 0.34, 0.025]} />
        </mesh>
        <mesh
          position={[0, 0.4, 0.345]}
          rotation={[-0.14, 0, 0]}
          material={materials.goldTrim}
        >
          <boxGeometry args={[0.16, 0.28, 0.015]} />
        </mesh>

        {/* Dây Ngọc Bội treo hai bên hông */}
        {[-0.29, 0.29].map((xHip, idx) => (
          <group key={`hip-jade-${idx}`} position={[xHip, 0.45, 0.1]}>
            <mesh material={materials.jadeWhite}>
              <cylinderGeometry args={[0.035, 0.035, 0.018, 12]} />
            </mesh>
            <mesh position={[0, -0.09, 0]} material={materials.pearlRed}>
              <cylinderGeometry args={[0.012, 0.028, 0.14, 8]} />
            </mesh>
          </group>
        ))}

        {/* =============================================================== */}
        {/* TAY ÁO THỤNG CỔ TRANG & BÀN TAY CHIBI                           */}
        {/* =============================================================== */}
        {/* Tay Trái */}
        <group ref={leftArmGroupRef} position={[-0.28, 0.86, 0]}>
          {/* Ống tay áo rộng cổ trang */}
          <mesh
            position={[-0.06, -0.18, 0.02]}
            rotation={[0, 0, 0.18]}
            material={materials.robePrimarySolid}
            castShadow
          >
            <cylinderGeometry args={[0.085, 0.165, 0.36, 16]} />
          </mesh>
          {/* Viền cổ tay áo gấm đỏ/vàng */}
          <mesh
            position={[-0.09, -0.34, 0.02]}
            rotation={[0, 0, 0.18]}
            material={materials.robeSecondary}
          >
            <cylinderGeometry args={[0.155, 0.17, 0.06, 16]} />
          </mesh>
          <mesh
            position={[-0.095, -0.37, 0.02]}
            rotation={[0, 0, 0.18]}
            material={materials.goldTrim}
          >
            <cylinderGeometry args={[0.168, 0.172, 0.025, 16]} />
          </mesh>
          {/* Bàn tay tròn Chibi */}
          <mesh position={[-0.1, -0.41, 0.04]} material={materials.skin} castShadow>
            <sphereGeometry args={[0.072, 14, 14]} />
          </mesh>
        </group>

        {/* Tay Phải (Có thể cầm Ngọc Khuê Trấn Quốc / Hốt Triều) */}
        <group ref={rightArmGroupRef} position={[0.28, 0.86, 0]}>
          <mesh
            position={[0.06, -0.18, 0.02]}
            rotation={[0, 0, -0.18]}
            material={materials.robePrimarySolid}
            castShadow
          >
            <cylinderGeometry args={[0.085, 0.165, 0.36, 16]} />
          </mesh>
          <mesh
            position={[0.09, -0.34, 0.02]}
            rotation={[0, 0, -0.18]}
            material={materials.robeSecondary}
          >
            <cylinderGeometry args={[0.155, 0.17, 0.06, 16]} />
          </mesh>
          <mesh
            position={[0.095, -0.37, 0.02]}
            rotation={[0, 0, -0.18]}
            material={materials.goldTrim}
          >
            <cylinderGeometry args={[0.168, 0.172, 0.025, 16]} />
          </mesh>
          {/* Bàn tay phải */}
          <mesh position={[0.1, -0.41, 0.04]} material={materials.skin} castShadow>
            <sphereGeometry args={[0.072, 14, 14]} />
          </mesh>

          {/* Ngọc Khuê (Hoàng Đế) hoặc Hốt Ngà (Quan Viên) cầm trên tay */}
          {holdingJadeTablet && (
            <group position={[0.1, -0.38, 0.16]} rotation={[0.75, -0.2, 0.1]}>
              <mesh
                material={
                  activeRank === 'emperor' ? materials.jadeWhite : materials.innerCollar
                }
                castShadow
              >
                <boxGeometry args={[0.075, 0.34, 0.024]} />
              </mesh>
              <mesh position={[0, -0.14, 0]} material={materials.goldTrim}>
                <boxGeometry args={[0.082, 0.07, 0.03]} />
              </mesh>
            </group>
          )}

          {/* Cuộn Văn Thư Mật Tấu cầm trên tay khi đang làm Nhiệm Vụ 2 chuyển giao văn thư */}
          {hasCourierScroll && !holdingJadeTablet && (
            <group position={[0.09, -0.36, 0.14]} rotation={[0.65, -0.25, 0.3]}>
              {/* Thân cuộn văn thư bằng gấm hoàng gia */}
              <mesh material={materials.robeSecondary} castShadow>
                <cylinderGeometry args={[0.034, 0.034, 0.28, 16]} />
              </mesh>
              {/* Hai đầu trục cuộn văn thư mạ vàng */}
              {[-0.145, 0.145].map((yEnd, eIdx) => (
                <mesh key={`scroll-tip-${eIdx}`} position={[0, yEnd, 0]} material={materials.goldTrim}>
                  <cylinderGeometry args={[0.044, 0.044, 0.02, 16]} />
                </mesh>
              ))}
              {/* Dải ruy băng buộc văn thư màu đỏ thắm */}
              <mesh position={[0, 0, 0]} material={materials.pearlRed}>
                <cylinderGeometry args={[0.038, 0.038, 0.04, 16]} />
              </mesh>
            </group>
          )}
        </group>

        {/* =============================================================== */}
        {/* ĐẦU LỚN CHIBI BIG HEAD (Tỷ lệ ~43% chiều cao nhân vật!)         */}
        {/* Tâm đầu tại Y = 1.36m, đường kính ~0.74m                        */}
        {/* =============================================================== */}
        <group ref={headGroupRef} position={[0, 1.35, 0]}>
          {/* Khối đầu Chibi bầu bĩnh (Hơi nở nhẹ ở phần má dễ thương) */}
          <mesh scale={[1.04, 0.98, 0.98]} material={materials.skin} castShadow receiveShadow>
            <sphereGeometry args={[0.37, 28, 24]} />
          </mesh>

          {/* Đôi tai tròn Chibi */}
          {[-0.365, 0.365].map((xEar, idx) => (
            <mesh
              key={`ear-${idx}`}
              position={[xEar, -0.02, -0.02]}
              scale={[0.45, 0.72, 0.55]}
              material={materials.skin}
              castShadow
            >
              <sphereGeometry args={[0.11, 12, 12]} />
            </mesh>
          ))}

          {/* Tóc mai & Tóc gáy cổ trang */}
          <mesh
            position={[0, 0.05, -0.04]}
            scale={[1.06, 1.0, 1.02]}
            material={materials.hair}
            castShadow
          >
            <sphereGeometry
              args={[0.365, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.58]}
            />
          </mesh>
          {/* Tóc mai hai bên thái dương */}
          {[-0.31, 0.31].map((xLock, idx) => (
            <mesh
              key={`sidelock-${idx}`}
              position={[xLock, -0.05, 0.16]}
              rotation={[0.12, 0, xLock < 0 ? 0.15 : -0.15]}
              material={materials.hair}
            >
              <capsuleGeometry args={[0.038, 0.18, 6, 8]} />
            </mesh>
          ))}

          {/* ============================================================= */}
          {/* KHUÔN MẶT CHIBI BIỂU CẢM RÕ RÀNG (Mắt to long lanh, má hồng)  */}
          {/* ============================================================= */}
          {/* Lông mày kiếm uy nghiêm của bậc Đế Vương */}
          {[-0.14, 0.14].map((xBrow, idx) => (
            <mesh
              key={`eyebrow-${idx}`}
              position={[xBrow, 0.11, 0.335]}
              rotation={[0, xBrow < 0 ? -0.22 : 0.22, xBrow < 0 ? 0.16 : -0.16]}
              material={materials.hair}
            >
              <boxGeometry args={[0.12, 0.026, 0.02]} />
            </mesh>
          ))}

          {/* Điểm Chu Sa / Ấn Đường Hoàng Tộc giữa trán (Dành riêng cho Hoàng Đế) */}
          {activeRank === 'emperor' && (
            <mesh position={[0, 0.135, 0.358]} material={materials.pearlRed}>
              <octahedronGeometry args={[0.024, 0]} />
            </mesh>
          )}

          {/* Mắt Trái Lớn Chibi */}
          <group ref={leftEyeGroupRef} position={[-0.135, -0.01, 0.335]}>
            {/* Tròng mắt đen to */}
            <mesh scale={[0.92, 1.15, 0.45]} material={materials.eyeDark}>
              <sphereGeometry args={[0.068, 16, 16]} />
            </mesh>
            {/* Con ngươi hổ phách ấm */}
            <mesh
              position={[0, -0.012, 0.018]}
              scale={[0.72, 0.85, 0.35]}
              material={materials.eyeIris}
            >
              <sphereGeometry args={[0.055, 14, 14]} />
            </mesh>
            {/* Đốm sáng mắt lớn (Main Catchlight) */}
            <mesh position={[-0.018, 0.024, 0.032]} material={materials.eyeHighlight}>
              <sphereGeometry args={[0.02, 10, 10]} />
            </mesh>
            {/* Đốm sáng mắt nhỏ (Secondary Catchlight) */}
            <mesh position={[0.018, -0.022, 0.032]} material={materials.eyeHighlight}>
              <sphereGeometry args={[0.01, 8, 8]} />
            </mesh>
          </group>

          {/* Mắt Phải Lớn Chibi */}
          <group ref={rightEyeGroupRef} position={[0.135, -0.01, 0.335]}>
            <mesh scale={[0.92, 1.15, 0.45]} material={materials.eyeDark}>
              <sphereGeometry args={[0.068, 16, 16]} />
            </mesh>
            <mesh
              position={[0, -0.012, 0.018]}
              scale={[0.72, 0.85, 0.35]}
              material={materials.eyeIris}
            >
              <sphereGeometry args={[0.055, 14, 14]} />
            </mesh>
            <mesh position={[-0.018, 0.024, 0.032]} material={materials.eyeHighlight}>
              <sphereGeometry args={[0.02, 10, 10]} />
            </mesh>
            <mesh position={[0.018, -0.022, 0.032]} material={materials.eyeHighlight}>
              <sphereGeometry args={[0.01, 8, 8]} />
            </mesh>
          </group>

          {/* Đôi má hồng Chibi dễ thương */}
          {[-0.21, 0.21].map((xCheek, idx) => (
            <mesh
              key={`blush-${idx}`}
              position={[xCheek, -0.085, 0.305]}
              rotation={[0, xCheek < 0 ? -0.35 : 0.35, 0]}
              scale={[1.2, 0.72, 0.3]}
              material={materials.blush}
            >
              <sphereGeometry args={[0.048, 12, 12]} />
            </mesh>
          ))}

          {/* Chiếc mũi nhỏ nhắn */}
          <mesh position={[0, -0.055, 0.372]} material={materials.skin}>
            <sphereGeometry args={[0.024, 10, 10]} />
          </mesh>

          {/* Khuôn miệng mỉm cười điềm đạm */}
          <mesh
            position={[0, -0.135, 0.352]}
            rotation={[Math.PI, 0, 0]}
            material={materials.eyeDark}
          >
            <torusGeometry args={[0.036, 0.008, 8, 16, Math.PI]} />
          </mesh>

          {/* ============================================================= */}
          {/* MŨ HOÀNG ĐẾ (MIỆN LƯU CỬU LONG) HOẶC MŨ QUAN (Ô SA MẠO)      */}
          {/* ============================================================= */}
          {outfit.hatType === 'mien_luu' ? (
            <group name="ImperialMienLuuCrown" position={[0, 0.33, 0]}>
              {/* Đai vàng kim cô ôm đỉnh đầu */}
              <mesh position={[0, 0.0, 0]} material={materials.goldTrim} castShadow>
                <cylinderGeometry args={[0.25, 0.27, 0.09, 24]} />
              </mesh>
              {/* Ngọc khuê đỏ đính chính tâm mũ */}
              <mesh position={[0, 0.0, 0.265]} material={materials.pearlRed}>
                <sphereGeometry args={[0.035, 12, 12]} />
              </mesh>

              {/* Khối trụ Mão (Mạo đinh) sơn đen viền rồng vàng */}
              <mesh position={[0, 0.1, 0]} material={materials.crownBlack} castShadow>
                <cylinderGeometry args={[0.22, 0.24, 0.16, 24]} />
              </mesh>

              {/* Trâm Vàng (Kim Trâm) xuyên ngang búi tóc & mão */}
              <mesh
                position={[0, 0.1, 0]}
                rotation={[0, 0, Math.PI / 2]}
                material={materials.goldTrim}
              >
                <cylinderGeometry args={[0.018, 0.018, 0.68, 10]} />
              </mesh>
              {[-0.35, 0.35].map((xPin, idx) => (
                <mesh
                  key={`hairpin-end-${idx}`}
                  position={[xPin, 0.1, 0]}
                  material={materials.goldTrim}
                >
                  <sphereGeometry args={[0.032, 10, 10]} />
                </mesh>
              ))}

              {/* Thiên Bản / Diên Bản (Tấm bảng phẳng trên đỉnh Mũ Miện Lưu, hơi nghiêng về trước biểu thị lòng khiêm cung của Thiên Tử) */}
              <group position={[0, 0.2, 0.02]} rotation={[0.06, 0, 0]}>
                <mesh material={materials.crownBlack} castShadow>
                  <boxGeometry args={[0.68, 0.032, 0.88]} />
                </mesh>
                {/* Viền vàng bọc quanh Thiên Bản */}
                <mesh position={[0, 0.002, 0]} material={materials.goldTrim}>
                  <boxGeometry args={[0.7, 0.022, 0.9]} />
                </mesh>
                {/* Lớp lót lụa đỏ phía dưới Thiên Bản */}
                <mesh position={[0, -0.015, 0]} material={materials.robeSecondary}>
                  <boxGeometry args={[0.66, 0.01, 0.86]} />
                </mesh>

                {/* 9 Chuỗi Ngọc Miện Lưu phía trước trán (Đung đưa theo nhịp bước) */}
                <group ref={frontTasselGroupRef} position={[0, -0.015, 0.43]}>
                  {PEARL_COLUMNS.map((xCol, cIdx) => (
                    <group key={`front-strand-${cIdx}`} position={[xCol, 0, 0]}>
                      {/* Sợi tơ vàng nối chuỗi ngọc */}
                      <mesh position={[0, -0.11, 0]} material={materials.goldTrim}>
                        <cylinderGeometry args={[0.004, 0.004, 0.22, 6]} />
                      </mesh>
                      {PEARL_ROWS.map((yDrop, rIdx) => (
                        <mesh
                          key={`f-pearl-${cIdx}-${rIdx}`}
                          position={[0, -yDrop, 0]}
                          material={
                            rIdx % 2 === 0
                              ? materials.jadeWhite
                              : rIdx === 1
                                ? materials.pearlRed
                                : materials.goldTrim
                          }
                        >
                          <sphereGeometry args={[0.016, 8, 8]} />
                        </mesh>
                      ))}
                    </group>
                  ))}
                </group>

                {/* 9 Chuỗi Ngọc Miện Lưu phía sau gáy */}
                <group ref={backTasselGroupRef} position={[0, -0.015, -0.43]}>
                  {PEARL_COLUMNS.map((xCol, cIdx) => (
                    <group key={`back-strand-${cIdx}`} position={[xCol, 0, 0]}>
                      <mesh position={[0, -0.1, 0]} material={materials.goldTrim}>
                        <cylinderGeometry args={[0.004, 0.004, 0.2, 6]} />
                      </mesh>
                      {PEARL_ROWS.slice(0, 3).map((yDrop, rIdx) => (
                        <mesh
                          key={`b-pearl-${cIdx}-${rIdx}`}
                          position={[0, -yDrop, 0]}
                          material={
                            rIdx % 2 === 0 ? materials.jadeWhite : materials.goldTrim
                          }
                        >
                          <sphereGeometry args={[0.015, 8, 8]} />
                        </mesh>
                      ))}
                    </group>
                  ))}
                </group>
              </group>
            </group>
          ) : (
            /* Mũ Ô Sa Cánh Chuồn dành cho Đại Thần & Quan Viên */
            <group name="OfficialOSaMaoHat" position={[0, 0.31, 0]}>
              {/* Vành mũ trước */}
              <mesh position={[0, 0.03, 0.02]} material={materials.crownBlack} castShadow>
                <cylinderGeometry args={[0.26, 0.28, 0.11, 22]} />
              </mesh>
              <mesh position={[0, 0.0, 0.02]} material={materials.goldTrim}>
                <cylinderGeometry args={[0.275, 0.285, 0.03, 22]} />
              </mesh>
              {/* Chóp mũ cao phía sau (Bác sơn) */}
              <mesh position={[0, 0.14, -0.05]} material={materials.crownBlack} castShadow>
                <cylinderGeometry args={[0.21, 0.24, 0.18, 20]} />
              </mesh>
              {/* Hai cánh chuồn vươn ngang hai bên */}
              <mesh
                ref={leftWingMeshRef}
                position={[-0.42, 0.1, -0.08]}
                rotation={[0, 0, 0.12]}
                material={materials.crownBlack}
                castShadow
              >
                <boxGeometry args={[0.42, 0.08, 0.022]} />
              </mesh>
              <mesh
                ref={rightWingMeshRef}
                position={[0.42, 0.1, -0.08]}
                rotation={[0, 0, -0.12]}
                material={materials.crownBlack}
                castShadow
              >
                <boxGeometry args={[0.42, 0.08, 0.022]} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
};
