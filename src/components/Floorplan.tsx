"use client";

import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";

function Floorplan({data, ...props}: {data: Map<string, number>, props?: object}){

    const [hovered, setHovered] = useState(false);

    function MeshComponent(props?: object) {
        const { scene } = useGLTF('/scene.gltf');

        // rotate
        useFrame((state, delta) => {
            if (!hovered)
                (scene.rotation.y += Math.sin(delta) * (Math.PI / 8))
        });

        const setAreaColorByOccupancy = (areaName: string, occupancy: number) => {
            const area = scene.getObjectByName(areaName + "_area");
            if (area) {
                const areaMesh = area as THREE.Mesh;
                // change between shades of green, yellow, and red based on the occupancy
                // the color should be more intense as the occupancy increases
                const color = new THREE.Color(0x00ff00);
                if (occupancy <= 50) {
                    // green to yellow
                    color.setRGB(0, 1, 0);
                } else if (occupancy <= 75) {
                    color.setRGB(1, 1, 0);
                } else {
                    color.setRGB(1, 0, 0);
                }
                areaMesh.material = new THREE.MeshBasicMaterial({ color: color.getHex(), transparent: true, opacity: 0.5 });
            }
        }

        data.forEach((value, key) => {
            setAreaColorByOccupancy(key, value);
        });

        // find "camera" object and use it as the camera
        const camera = scene.getObjectByName("PerspectiveCamera");
        if (camera) {
            console.log("camera found")
            const cameraObject = camera as THREE.PerspectiveCamera;
            cameraObject.aspect = window.innerWidth / window.innerHeight;
            cameraObject.updateProjectionMatrix();
        }
    
        /*
        // add a cube mesh at  0,0,0
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        mesh.name = "cube";
    
        const patioArea = scene.getObjectByName("patio_area");
        if (patioArea) {
            const patioAreaMesh = patioArea as THREE.Mesh;
            patioAreaMesh.material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });

        }
        scene.add(mesh);
        */

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
