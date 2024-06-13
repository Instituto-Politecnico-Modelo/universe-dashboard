"use client";

import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";

function Floorplan(props: object){

    const [hovered, setHovered] = useState(false);

    function MeshComponent(props: object) {
        const { scene } = useGLTF('/scene.gltf');

        // rotate
        useFrame((state, delta) => {
            if (!hovered)
                (scene.rotation.y += Math.sin(delta) * (Math.PI / 8))
        });
    
        // add a cube mesh at  0,0,0
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    
        scene.add(mesh);
        
        return <primitive object={scene} {...props} />;
    }

    function handleMouseEnter() {
        setHovered(true);
    }

    function handleMouseExit() {
        setHovered(false);
    }

    return(
        <div className="flex justify-center items-center h-screen w-screen">
            <Canvas className="h-2xl w-2xl" onMouseEnter={handleMouseEnter} onMouseOut={handleMouseExit}>
                <OrbitControls />
                <MeshComponent {...props} />
            </Canvas>
        </div>
    );

}

export default Floorplan;
