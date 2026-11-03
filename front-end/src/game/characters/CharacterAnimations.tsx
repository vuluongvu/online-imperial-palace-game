import * as THREE from 'three';

export type CharacterAnimationState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'sit'
  | 'write'
  | 'bow'
  | 'talk';

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
 * - Sit: Tư thế Ngự Triều trên Long Ngai hoặc ngồi ghế quan viên (gập chân, đặt tay lên tay vịn uy phong).
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

  if (state === 'sit') {
    const breathPhase = elapsedTime * 1.8;
    targetBodyY = -0.15 + Math.sin(breathPhase) * 0.012;
    targetBodyPitch = -0.03;
    targetHeadPitch = 0.04 + Math.sin(breathPhase) * 0.018;
    targetHeadYaw = Math.sin(elapsedTime * 0.55) * 0.06;

    // Hai tay đặt uy nghiêm lên tay vịn Long Ngai / Ghế Thái Sư
    targetLeftArmX = -0.58 + Math.sin(breathPhase) * 0.02;
    targetRightArmX = -0.58 + Math.sin(breathPhase) * 0.02;
    targetLeftArmZ = 0.26;
    targetRightArmZ = -0.26;

    // Hai chân gập vuông góc tư thế ngồi ngai vàng
    targetLeftLegX = -1.42;
    targetRightLegX = -1.42;

    tasselSway = Math.sin(elapsedTime * 2.0) * 0.028;
  } else if (state === 'idle') {
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
  } else if (state === 'write') {
    // Quan lại ngồi trước bàn viết văn thư / tấu chương / chấm thi
    const breathPhase = elapsedTime * 2.0;
    const writeCycle = elapsedTime * 4.2;
    targetBodyY = -0.15 + Math.sin(breathPhase) * 0.008;
    targetBodyPitch = 0.12; // Hơi cúi người về phía bàn làm việc
    targetHeadPitch = 0.32; // Đầu cúi chăm chú nhìn mặt giấy / sớ tấu
    targetHeadYaw = Math.sin(elapsedTime * 0.8) * 0.06; // Đảo mắt/nghiêng đầu đọc dòng chữ

    // Hai chân gập ngồi ghế
    targetLeftLegX = -1.42;
    targetRightLegX = -1.42;

    // Tay trái tỳ nhẹ lên bàn đè giấy
    targetLeftArmX = -0.72;
    targetLeftArmZ = 0.22;

    // Tay phải cầm bút lông đưa nét mực đều đặn
    targetRightArmX = -0.74 + Math.sin(writeCycle) * 0.06;
    targetRightArmZ = -0.22 + Math.cos(writeCycle * 1.4) * 0.05;

    tasselSway = Math.sin(elapsedTime * 1.5) * 0.015;
  } else if (state === 'bow') {
    // Cúi chào / Hành lễ cung đình (Chắp hai tay áo thụng trước ngực, cúi đầu)
    const breathPhase = elapsedTime * 1.5;
    targetBodyY = -0.05 + Math.sin(breathPhase) * 0.006;
    targetBodyPitch = 0.38; // Cúi người trang trọng về phía trước
    targetHeadPitch = 0.22; // Đầu cúi hành lễ
    targetHeadYaw = 0;

    // Hai chân đứng nghiêm trang
    targetLeftLegX = 0;
    targetRightLegX = 0;

    // Hai tay chắp trước ngực theo lễ tiết triều đình
    targetLeftArmX = -0.86;
    targetLeftArmZ = 0.36;
    targetRightArmX = -0.86;
    targetRightArmZ = -0.36;

    tasselSway = 0.06;
  } else if (state === 'talk') {
    // Quan lại đứng đàm đạo / trò chuyện (nghiêng đầu, vung tay nhẹ khi nói)
    const talkPhase = elapsedTime * 2.8;
    targetBodyY = Math.sin(talkPhase) * 0.014;
    targetBodyPitch = 0.02;
    targetHeadPitch = 0.04 + Math.sin(talkPhase * 1.4) * 0.05; // Gật đầu theo nhịp nói
    targetHeadYaw = Math.sin(elapsedTime * 1.2) * 0.14; // Hướng mặt về người nghe

    targetLeftLegX = 0;
    targetRightLegX = 0;

    // Tay trái xuôi tự nhiên bên hông
    targetLeftArmX = -0.15 + Math.sin(talkPhase * 0.8) * 0.03;
    targetLeftArmZ = 0.16;

    // Tay phải vung tay áo mở ra theo lời nói
    targetRightArmX = -0.46 + Math.sin(talkPhase) * 0.14;
    targetRightArmZ = -0.26 + Math.cos(talkPhase * 0.9) * 0.08;

    tasselSway = Math.sin(talkPhase) * 0.04;
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
    const wingBounce =
      Math.sin(elapsedTime * 9) * (state === 'idle' || state === 'sit' ? 0.01 : 0.06);
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
