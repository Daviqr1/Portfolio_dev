import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
// Importar o modelo de forma a garantir que o Vite o inclua no build
import spacemanScene from "../assets/3d/spaceman.glb";
import CanvasLoader from "./Loader";

const Spaceman = ({ scale, position, rotationX, rotationY }) => {
  const spacemanRef = useRef();
  const { scene, animations } = useGLTF(spacemanScene);
  const { actions } = useAnimations(animations, spacemanRef);

  useEffect(() => {
    if (actions["Idle"]) {
      actions["Idle"].play();
    }
  }, [actions]);

  return (
    <mesh 
      ref={spacemanRef} 
      position={position} 
      scale={scale} 
      rotation={[rotationX || 0, 2.2, rotationY || 0]}
    >
      <primitive object={scene} />
    </mesh>
  );
};

const SpacemanCanvas = ({ scrollContainer }) => {
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [scale, setScale] = useState([2, 2, 2]);
  const [position, setPosition] = useState([0.2, -0.7, 0]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainer || !scrollContainer.current) {
        // Usar window.scrollY se scrollContainer não estiver disponível
        const scrollTop = window.scrollY;
        const rotationXValue = scrollTop * -0.0006;
        const rotationYValue = scrollTop * -0.00075;
        setRotationX(rotationXValue);
        setRotationY(rotationYValue);
        return;
      }
      
      const scrollTop = scrollContainer.current.scrollTop;
      const rotationXValue = scrollTop * -0.0006;
      const rotationYValue = scrollTop * -0.00075;
      setRotationX(rotationXValue);
      setRotationY(rotationYValue);
    };

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale([1, 1, 1]);
        setPosition([0.2, -0.1, 0]);
      } else if (window.innerWidth < 1024) {
        setScale([1.33, 1.33, 1.33]);
        setPosition([0.2, -0.3, 0]);
      } else if (window.innerWidth < 1280) {
        setScale([1.5, 1.5, 1.5]);
        setPosition([0.2, -0.4, 0]);
      } else if (window.innerWidth < 1536) {
        setScale([1.66, 1.66, 1.66]);
        setPosition([0.2, -0.5, 0]);
      } else {
        setScale([2, 2, 2]);
        setPosition([0.2, -0.7, 0]);
      }
    };

    handleResize();
    
    // Garantir que o scroll funcione mesmo sem scrollContainer
    if (scrollContainer && scrollContainer.current) {
      scrollContainer.current.addEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }
    
    window.addEventListener("resize", handleResize);

    return () => {
      if (scrollContainer && scrollContainer.current) {
        scrollContainer.current.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollContainer]);

  return (
    <Canvas className="w-full h-screen bg-transparent z-10" camera={{ near: 0.1, far: 1000 }}>
      <Suspense fallback={<CanvasLoader />}>
        <directionalLight position={[1, 1, 1]} intensity={2} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 5, 10]} intensity={2} />
        <spotLight position={[0, 50, 10]} angle={0.15} penumbra={1} intensity={2} />
        <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />

        <Spaceman 
          rotationX={rotationX} 
          rotationY={rotationY} 
          scale={scale} 
          position={position} 
        />
      </Suspense>
    </Canvas>
  );
};

export default SpacemanCanvas;
