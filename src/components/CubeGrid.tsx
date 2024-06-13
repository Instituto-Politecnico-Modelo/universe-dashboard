"use client"

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Scene } from "three";

function CubeGrid({width, height, depth, spacing = 2, size = 1}: {width: number, height: number, depth: number, spacing?: number, size?: number}) {
    const cubeGrid = new Group();
    cubeGrid.name = "CubeGrid";
    for (var h=0; h<width; h+=1) {
        for (var v=0; v<height; v+=1) {
            for (var d=0; d<depth; d+=1){
                var box = new Mesh(new BoxGeometry(size,size,size),
                            new MeshBasicMaterial());
                box.position.x = (h-width/2) * spacing;
                box.position.y = (v-height/2) * spacing;
                box.position.z = (d-depth/2) * spacing;
                cubeGrid.add(box);
            }
        }
    }
    const scene = new Scene();
    scene.add(cubeGrid)
    return (
        <div className="flex justify-center items-center h-screen w-screen" >
           <Canvas className="h-screen w-screen">
             <OrbitControls />
             <PerspectiveCamera makeDefault position={[0, 0, 10]} />
             <primitive object={scene} />
            </Canvas>
        </div>
        );
}

export default CubeGrid;