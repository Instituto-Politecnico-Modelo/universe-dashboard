"use client";

import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function MeshComponent(props: object) {
    const { scene } = useGLTF('/poli_p1.glb')

    // rotate
    useFrame((state, delta) => (scene.rotation.y += Math.sin(delta) * (Math.PI / 8)))
  
    // add a cube mesh at  0,0,0
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
  
    scene.add(mesh)
    
    return <primitive object={scene} {...props} />
 }

function Floorplan(props: object){
    return(
        <div className="flex justify-cneter items-center h-screen w-screen">
            <Canvas className="h-2xl w-2xl">
                <OrbitControls />
                <MeshComponent {...props} />
                <ambientLight intensity={3} />
                <pointLight position={[-10, 30, -10]} intensity={15} decay={0.2} />
                <PerspectiveCamera makeDefault fov={40} position={[0, 30, 40]} />
            </Canvas>
        </div>
    );

}

export default Floorplan;
