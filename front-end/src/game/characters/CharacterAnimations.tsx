import * as THREE from 'three';

export type CharacterAnimationState = 'idle' | 'walk' | 'run';

export interface ChibiRigRefs {
  root: THREE.Group | null;
  bodyGroup: THREE.Group | null;
  headGroup: THREE.Group | null;
  leftArmGroup: THREE.Group | null;
  rightArmGroup: THREE.Group | null;
  leftLegGroup: THREE.Group | null;
  rightLegGroup: THREE.Group | null;
  frontTasselGroup: THREE.Group | null;
  backTasselGroup: THREE.Group | null;
  leftWingMesh: THREE.Mesh | null;
  rightWingMesh: THREE.Mesh | null;
  leftEyeGroup: THREE.Group | null;
  rightEyeGroup: THREE.Group | null;
}

/**
 * Hệ thống xử lý chuyển động Procedural Animation mượt mà (không phụ thuộc frame rate):
 * - Idle: Thở nhẹ, đầu nghiêng uy nghiêm, tua rua miện lưu đung đưa nhẹ, mắt chớp tự nhiên.
 * - Walk: Bước chân khoan thai của bậc Đế Vương / Quan Viên, tay áo thụng vung nhẹ.
 * - Run: Chạy nhanh chibi năng động, độ nảy cơ thể rõ ràng, tay chân vung biên độ lớn.
 */
export function updateChibiAnimation(
  rig: ChibiRigRefs,
  state: CharacterAnimationState,
  elapsedTime: number,
  delta: number
): void {
  const lerpSpeed = 1 - Math.exp(-12 * delta);

  let targetBodyY = 0;
  let targetBodyPitch = 0;
  let targetBodyRoll = 0;

  let targetHeadPitch = 0;
  let targetHeadYaw = 0;
  let targetHeadRoll = 0;

  let targetLeftArmX = 0;
  let targetRightArmX = 0;
  let targetLeftArmZ = 0.14;
  let targetRightArmZ = -0.14;

  let targetLeftLegX = 0;
  let targetRightLegX = 0;

  let tasselSway = 0;

  if (state === 'idle') {
    const breathPhase = elapsedTime * 2.1;
    targetBodyY = Math.sin(breathPhase) * 0.018;
    targetHeadPitch = Math.sin(breathPhase - 0.5) * 0.025;
    targetHeadYaw = Math.sin(elapsedTime * 0.7) * 0.05;
    targetHeadRoll = Math.cos(elapsedTime * 0.85) * 0.02;

    targetLeftArmX = Math.sin(breathPhase) * 0.04;
    targetRightArmX = -Math.sin(breathPhase) * 0.04;
    tasselSway = Math.sin(elapsedTime * 2.4) * 0.035;
  } else if (state === 'walk') {
    const walkFreq = elapsedTime * 7.5;
    targetBodyY = Math.abs(Math.sin(walkFreq)) * 0.055;
    targetBodyPitch = 0.05;
    targetBodyRoll = Math.cos(walkFreq) * 0.035;

    targetHeadPitch = -0.02 + Math.abs(Math.sin(walkFreq)) * 0.03;
    targetHeadRoll = -Math.cos(walkFreq) * 0.03;

    targetLeftLegX = Math.sin(walkFreq) * 0.52;
    targetRightLegX = -Math.sin(walkFreq) * 0.52;

    targetLeftArmX = -Math.sin(walkFreq) * 0.42;
    targetRightArmX = Math.sin(walkFreq) * 0.42;
    targetLeftArmZ = 0.18;
    targetRightArmZ = -0.18;

    tasselSway = Math.sin(walkFreq) * 0.11;
  } else if (state === 'run') {
    const runFreq = elapsedTime * 13.0;
    targetBodyY = Math.abs(Math.sin(runFreq)) * 0.11;
    targetBodyPitch = 0.14;
    targetBodyRoll = Math.cos(runFreq) * 0.065;

    targetHeadPitch = -0.08 + Math.abs(Math.sin(runFreq)) * 0.05;
    targetHeadRoll = -Math.cos(runFreq) * 0.05;

    targetLeftLegX = Math.sin(runFreq) * 0.88;
    targetRightLegX = -Math.sin(runFreq) * 0.88;

    targetLeftArmX = -Math.sin(runFreq) * 0.78;
    targetRightArmX = Math.sin(runFreq) * 0.78;
    targetLeftArmZ = 0.26;
    targetRightArmZ = -0.26;

    tasselSway = Math.sin(runFreq) * 0.22;
  }

  // Nội suy mượt các khớp xương (Smooth blending)
  if (rig.bodyGroup) {
    rig.bodyGroup.position.y = THREE.MathUtils.lerp(
      rig.bodyGroup.position.y,
      targetBodyY,
      lerpSpeed
    );
    rig.bodyGroup.rotation.x = THREE.MathUtils.lerp(
      rig.bodyGroup.rotation.x,
      targetBodyPitch,
      lerpSpeed
    );
    rig.bodyGroup.rotation.z = THREE.MathUtils.lerp(
      rig.bodyGroup.rotation.z,
      targetBodyRoll,
      lerpSpeed
    );
  }

  if (rig.headGroup) {
    rig.headGroup.rotation.x = THREE.MathUtils.lerp(
      rig.headGroup.rotation.x,
      targetHeadPitch,
      lerpSpeed
    );
    rig.headGroup.rotation.y = THREE.MathUtils.lerp(
      rig.headGroup.rotation.y,
      targetHeadYaw,
      lerpSpeed
    );
    rig.headGroup.rotation.z = THREE.MathUtils.lerp(
      rig.headGroup.rotation.z,
      targetHeadRoll,
      lerpSpeed
    );
  }

  if (rig.leftArmGroup && rig.rightArmGroup) {
    rig.leftArmGroup.rotation.x = THREE.MathUtils.lerp(
      rig.leftArmGroup.rotation.x,
      targetLeftArmX,
      lerpSpeed
    );
    rig.leftArmGroup.rotation.z = THREE.MathUtils.lerp(
      rig.leftArmGroup.rotation.z,
      targetLeftArmZ,
      lerpSpeed
    );
    rig.rightArmGroup.rotation.x = THREE.MathUtils.lerp(
      rig.rightArmGroup.rotation.x,
      targetRightArmX,
      lerpSpeed
    );
    rig.rightArmGroup.rotation.z = THREE.MathUtils.lerp(
      rig.rightArmGroup.rotation.z,
      targetRightArmZ,
      lerpSpeed
    );
  }

  if (rig.leftLegGroup && rig.rightLegGroup) {
    rig.leftLegGroup.rotation.x = THREE.MathUtils.lerp(
      rig.leftLegGroup.rotation.x,
      targetLeftLegX,
      lerpSpeed
    );
    rig.rightLegGroup.rotation.x = THREE.MathUtils.lerp(
      rig.rightLegGroup.rotation.x,
      targetRightLegX,
      lerpSpeed
    );
  }

  // Chuyển động chuỗi ngọc Miện Lưu của Hoàng Đế
  if (rig.frontTasselGroup && rig.backTasselGroup) {
    rig.frontTasselGroup.rotation.x = THREE.MathUtils.lerp(
      rig.frontTasselGroup.rotation.x,
      tasselSway + Math.abs(targetBodyPitch) * 0.4,
      lerpSpeed
    );
    rig.backTasselGroup.rotation.x = THREE.MathUtils.lerp(
      rig.backTasselGroup.rotation.x,
      -tasselSway,
      lerpSpeed
    );
  }

  // Cánh chuồn mũ Ô Sa rung nhẹ khi di chuyển
  if (rig.leftWingMesh && rig.rightWingMesh) {
    const wingBounce = Math.sin(elapsedTime * 9) * (state === 'idle' ? 0.01 : 0.06);
    rig.leftWingMesh.rotation.z = 0.12 + wingBounce;
    rig.rightWingMesh.rotation.z = -0.12 - wingBounce;
  }

  // Hiệu ứng chớp mắt tự nhiên mỗi ~3.8 giây
  if (rig.leftEyeGroup && rig.rightEyeGroup) {
    const blinkCycle = elapsedTime % 3.8;
    const isBlinking = blinkCycle > 3.65;
    const targetEyeScaleY = isBlinking ? 0.12 : 1.0;
    rig.leftEyeGroup.scale.y = THREE.MathUtils.lerp(
      rig.leftEyeGroup.scale.y,
      targetEyeScaleY,
      0.45
    );
    rig.rightEyeGroup.scale.y = THREE.MathUtils.lerp(
      rig.rightEyeGroup.scale.y,
      targetEyeScaleY,
      0.45
    );
  }
}
