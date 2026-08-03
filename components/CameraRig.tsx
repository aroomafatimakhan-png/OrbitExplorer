"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Reproduces the reference composition: Sun toward one side, planets receding
// in a shallow diagonal row, orbit ellipses visible in perspective.
export default function CameraRig() {
  const { camera, size } = useThree();
  const applied = useRef(false);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const mobile = size.width < 640;
    const tablet = size.width < 1024;

    cam.fov = mobile ? 62 : tablet ? 54 : 42;
    const pullback = mobile ? 1.7 : tablet ? 1.35 : 1;
    cam.position.set(-28 * pullback, 10 * pullback, 32 * pullback);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
    applied.current = true;
  }, [camera, size.width]);

  return null;
}
