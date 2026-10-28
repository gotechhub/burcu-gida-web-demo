"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAspect } from "@react-three/drei";
import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  Color,
  LinearFilter,
  MathUtils,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  type Texture,
} from "three";

export interface FluidBackdropProps {
  /** A background photograph only. Never pass a product packshot or logo. */
  imageUrl: string;
  tint?: string;
  strength?: number;
  transitionKey?: string;
}

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uPhoto;
  uniform vec2 uPointer;
  uniform vec2 uVisibleUv;
  uniform vec3 uTint;
  uniform float uTintAmount;
  uniform float uStrength;
  uniform float uEnergy;
  uniform float uTime;
  uniform float uReveal;
  varying vec2 vUv;

  void main() {
    vec2 local = (vUv - uPointer) / max(uVisibleUv, vec2(0.001));
    float falloff = exp(-dot(local, local) * 7.0);
    float wave = sin(local.y * 15.0 + uTime * 1.6)
               * cos(local.x * 12.0 - uTime * 1.1);
    vec2 ripple = vec2(wave, sin(local.x * 13.0 + uTime * 1.3));
    vec2 offset = ripple * falloff * uStrength * uEnergy * uVisibleUv;
    vec2 sampleUv = clamp(vUv + offset, vec2(0.001), vec2(0.999));
    vec4 photo = texture2D(uPhoto, sampleUv);
    vec3 rgb = mix(photo.rgb, photo.rgb * uTint, uTintAmount);
    gl_FragColor = vec4(rgb, photo.a * smoothstep(0.0, 1.0, uReveal));
    #include <colorspace_fragment>
  }
`;

interface PhotoPlaneProps {
  texture: Texture;
  imageWidth: number;
  imageHeight: number;
  active: boolean;
  host: RefObject<HTMLDivElement | null>;
  tint?: string;
  strength: number;
  transitionKey?: string;
}

function PhotoPlane({
  texture,
  imageWidth,
  imageHeight,
  active,
  host,
  tint,
  strength,
  transitionKey,
}: PhotoPlaneProps) {
  const scale = useAspect(imageWidth, imageHeight);
  const viewport = useThree((state) => state.viewport);
  const invalidate = useThree((state) => state.invalidate);
  const target = useRef(new Vector2(0.5, 0.5));

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          uPhoto: { value: texture },
          uPointer: { value: new Vector2(0.5, 0.5) },
          uVisibleUv: { value: new Vector2(1, 1) },
          uTint: { value: new Color("#ffffff") },
          uTintAmount: { value: 0 },
          uStrength: { value: 0 },
          uEnergy: { value: 0 },
          uTime: { value: 0 },
          uReveal: { value: 0 },
        },
      }),
    [texture],
  );

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    material.uniforms.uVisibleUv.value.set(
      viewport.width / scale[0],
      viewport.height / scale[1],
    );
    material.uniforms.uStrength.value = strength;
    material.uniforms.uTint.value.set(tint ?? "#ffffff");
    material.uniforms.uTintAmount.value = tint ? 0.035 : 0;
    if (active) invalidate();
  }, [active, invalidate, material, scale, strength, tint, viewport]);

  useEffect(() => {
    material.uniforms.uReveal.value = 0;
    if (active) invalidate();
  }, [active, invalidate, material, transitionKey]);

  useEffect(() => {
    const scene = host.current?.closest<HTMLElement>("[data-fluid-scene], section")
      ?? host.current?.parentElement;
    if (!scene || !active) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = scene.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;
      const visibleUv = material.uniforms.uVisibleUv.value as Vector2;
      target.current.set(
        0.5 + (MathUtils.clamp((event.clientX - bounds.left) / bounds.width, 0, 1) - 0.5) * visibleUv.x,
        0.5 + (0.5 - MathUtils.clamp((event.clientY - bounds.top) / bounds.height, 0, 1)) * visibleUv.y,
      );
      material.uniforms.uEnergy.value = 1;
      invalidate();
    };
    const leave = () => {
      target.current.set(0.5, 0.5);
      invalidate();
    };

    scene.addEventListener("pointermove", move, { passive: true });
    scene.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerleave", leave);
    };
  }, [active, host, invalidate, material]);

  useFrame((_state, frameDelta) => {
    if (!active) return;
    const delta = Math.min(frameDelta, 1 / 30);
    const pointer = material.uniforms.uPointer.value as Vector2;
    const difference = pointer.distanceToSquared(target.current);
    pointer.lerp(target.current, 1 - Math.exp(-delta * 9));
    material.uniforms.uEnergy.value = MathUtils.damp(
      material.uniforms.uEnergy.value as number,
      0,
      3.5,
      delta,
    );
    material.uniforms.uReveal.value = Math.min(
      1,
      (material.uniforms.uReveal.value as number) + delta * 2.5,
    );
    material.uniforms.uTime.value += delta;

    // Demand rendering stops after the ripple and the short photo reveal settle.
    if (
      difference > 0.000001
      || (material.uniforms.uEnergy.value as number) > 0.003
      || (material.uniforms.uReveal.value as number) < 1
    ) {
      invalidate();
    }
  });

  return (
    <mesh scale={scale} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

interface LoadedPhoto {
  url: string;
  texture: Texture;
  width: number;
  height: number;
}

function OwnedPhoto({
  imageUrl,
  onFailure,
  ...props
}: Omit<PhotoPlaneProps, "texture" | "imageWidth" | "imageHeight"> & {
  imageUrl: string;
  onFailure: () => void;
}) {
  const [photo, setPhoto] = useState<LoadedPhoto | null>(null);

  useEffect(() => {
    let cancelled = false;
    // This texture is instance-owned: no global cache/preload retains old scenes.
    const texture = new TextureLoader().load(
      imageUrl,
      (loaded) => {
        if (cancelled) {
          loaded.dispose();
          return;
        }
        loaded.colorSpace = SRGBColorSpace;
        loaded.generateMipmaps = false;
        loaded.minFilter = LinearFilter;
        loaded.magFilter = LinearFilter;
        loaded.needsUpdate = true;
        const image = loaded.image as HTMLImageElement;
        setPhoto({
          url: imageUrl,
          texture: loaded,
          width: image.naturalWidth || image.width,
          height: image.naturalHeight || image.height,
        });
      },
      undefined,
      () => {
        if (!cancelled) onFailure();
      },
    );
    return () => {
      cancelled = true;
      texture.dispose();
    };
  }, [imageUrl, onFailure]);

  if (!photo || photo.url !== imageUrl) return null;
  return (
    <PhotoPlane
      {...props}
      texture={photo.texture}
      imageWidth={photo.width}
      imageHeight={photo.height}
    />
  );
}

function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    const previousShaderError = gl.debug.onShaderError;
    const shaderError = () => onFailure();
    gl.debug.onShaderError = shaderError;
    canvas.addEventListener("webglcontextlost", lost);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      if (gl.debug.onShaderError === shaderError) {
        gl.debug.onShaderError = previousShaderError;
      }
    };
  }, [gl, onFailure]);
  return null;
}

class BackdropBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function FluidBackdrop({
  imageUrl,
  tint,
  strength = 0.012,
  transitionKey,
}: FluidBackdropProps) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const onFailure = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const visibility = () => setPageVisible(document.visibilityState === "visible");
    const dialogs = () => setModalOpen(Boolean(document.querySelector("dialog[open]")));
    const dialogObserver = new MutationObserver((records) => {
      const changed = records.some((record) => record.type === "attributes"
        ? record.target instanceof HTMLDialogElement
        : [...record.addedNodes, ...record.removedNodes].some((node) =>
          node instanceof Element && (node.matches("dialog") || Boolean(node.querySelector("dialog"))),
        ));
      if (changed) dialogs();
    });
    dialogObserver.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["open"],
    });
    visibility();
    dialogs();
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inside = Boolean(entry?.isIntersecting);
        setVisible(inside);
        if (inside) setEntered(true);
      },
      { threshold: 0.01 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      dialogObserver.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  const active = visible && pageVisible && !modalOpen && !failed;
  const safeStrength = Number.isFinite(strength)
    ? MathUtils.clamp(strength, 0, 0.025)
    : 0.012;

  return (
    <div
      ref={host}
      aria-hidden="true"
      data-fluid-backdrop=""
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      {entered && !failed && (
        <BackdropBoundary onFailure={onFailure}>
          <Canvas
            orthographic
            flat
            camera={{ position: [0, 0, 2], zoom: 100, near: 0.1, far: 10 }}
            dpr={[1, 1.5]}
            frameloop={active ? "demand" : "never"}
            gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
            fallback={null}
            style={{ pointerEvents: "none" }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <ContextGuard onFailure={onFailure} />
            <OwnedPhoto
              imageUrl={imageUrl}
              host={host}
              active={active}
              tint={tint}
              strength={safeStrength}
              transitionKey={transitionKey}
              onFailure={onFailure}
            />
          </Canvas>
        </BackdropBoundary>
      )}
    </div>
  );
}

