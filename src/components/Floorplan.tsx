'use client';
import { calculateGradientFromValue } from '@/services/utils';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
/* @ts-ignore */
import TWEEN from '@tweenjs/tween.js';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

export function MeshComponent({
    rotate,
    data,
    sceneFile,
    location,
    ...props
}: {
    rotate: boolean;
    location?: string;
    data: OccupancyData[];
    props?: object;
    sceneFile: string;
}) {
    const { scene } = useGLTF(sceneFile);

    // rotate
    useFrame((state, delta) => {
        if (rotate) scene.rotation.y += Math.sin(delta) * (Math.PI / 8);
    });

    const setAreaColorByOccupancy = (areaName: string, occupancy: number) => {
        const area = scene.getObjectByName(areaName + '_dec');
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
            areaMesh.material = new THREE.MeshBasicMaterial({
                color: color.getHex(),
                transparent: true,
                opacity: 0.5,
            });
        }
    };

    const setCubesByOccupancy = (areaName: string, occupancy: number, threshold: number) => {
        const area = scene.getObjectByName(areaName + '_dec');
        const center = scene.getObjectByName(areaName + '_cubo_central') as THREE.Mesh;
        const frame = scene.getObjectByName(areaName + '_f') as THREE.Mesh;
        if (!area || !center || !frame) {
            return;
        }
        const cubeGroup = scene.getObjectByName(areaName + '_cubos') as THREE.Group;
        if (!cubeGroup) {
            return;
        }

        // calculate max distance of frame to center
        const frameGeometry = frame.geometry as THREE.BufferGeometry;
        const frameVertices = frameGeometry.attributes.position.array;
        let maxDistance = 0;
        for (let i = 0; i < frameVertices.length; i += 3) {
            const x = frameVertices[i];
            const y = frameVertices[i + 1];
            const z = frameVertices[i + 2];
            const distance = Math.sqrt(x * x + y * y + z * z);
            if (distance > maxDistance) {
                maxDistance = distance;
            }
        }

        // change material, they all use the same one
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
        });

        cubeGroup.children.forEach((cube) => {
            const cubeMesh = cube as THREE.Mesh;
            /*
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
                cubeMesh.material = cubeMaterial;
                */
            // change scale based on occupancy ( max scale is 0.483) depending on distance to center
            const distanceToCenter = center.position.distanceTo(cubeMesh.position);
            // get the most distant point of the frame to the center as a reference
            // the closer to the center, the bigger the scale
            const scaledOcupancy = occupancy / threshold;
            const minScale = 0.0;
            const maxScale = 0.483;
            const XScale = minScale + (maxScale - minScale) * (1 - distanceToCenter / maxDistance) * scaledOcupancy;
            const newXScale = XScale < 0.001 ? 0 : XScale;

            const YScale = Math.pow(0.15, -Math.abs((1 - distanceToCenter / maxDistance) * scaledOcupancy));
            const newYScale = YScale - 1;

            // set scale
            //            cubeMesh.scale.set(newScale, newScale, newScale);

            // animate the change in scale from the old to the new
            cube.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
                const deltaScale = newYScale - cubeMesh.scale.y;
                const deltaXScale = newXScale - cubeMesh.scale.x;
                const scaleSpeed = 0.05;
                if (Math.abs(deltaScale) > 0.001) {
                    const newScale = cubeMesh.scale.y + deltaScale * scaleSpeed;
                    cubeMesh.scale.set(cubeMesh.scale.x, newScale, cubeMesh.scale.z);
                }
                if (Math.abs(deltaXScale) > 0.001) {
                    const newScale = cubeMesh.scale.x + deltaXScale * scaleSpeed;
                    cubeMesh.scale.set(newScale, cubeMesh.scale.y, newScale);
                    //  set y position based on scale
                    cubeMesh.position.y = cubeMesh.scale.y;
                }

                if (Math.abs(deltaXScale) < 0.001 && Math.abs(deltaScale) < 0.001) {
                    // delete callback
                    cube.onBeforeRender = () => {};
                }
            };

            // change color based on occupancy and scale
            const hexColor = calculateGradientFromValue(newXScale, 0, 0.483, [0x00ff00, 0xccff00, 0xff0000]);

            const color = new THREE.Color(hexColor);

            cubeMesh.material = new THREE.MeshBasicMaterial({
                color: color.getHex(),
            });
        });
    };

    useEffect(() => {
        data.forEach(({ location, personas, threshold }) => {
            setCubesByOccupancy(location, personas, threshold);
        });
    }, [...data.values()]);
    const [currentLocation, setCurrentLocation] = useState('');
    const [currentLerp, setCurrentLerp] = useState(0);
    const [currentSlerp, setCurrentSlerp] = useState(0);

    useFrame(({ gl, scene, camera }, delta) => {
        TWEEN.update();
        if (location) {
            // get the camera object
            const newCamera = scene.getObjectByName(location + '_camera') as THREE.PerspectiveCamera;

            // check if the camera exists and it is not already on the location
            if (newCamera && currentLocation !== location) {
                new TWEEN.Tween(camera.position)
                    .to({ x: newCamera.position.x, y: newCamera.position.y, z: newCamera.position.z })
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();

                new TWEEN.Tween(camera.rotation)
                    .to({ x: newCamera.rotation.x, y: newCamera.rotation.y, z: newCamera.rotation.z })
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start();

                setCurrentLocation(location);
            }
        }
        gl.render(scene, camera);
    }, 1);

    useThree(({ camera }) => {
        if (!location) {
            const cameraObject = scene.getObjectByName('FloorplanCamera') as THREE.PerspectiveCamera;

            // set it only if it exists and it is on the initial position
            // HACK: i have no idea why this is the initial position
            if (cameraObject && camera.position.equals(new THREE.Vector3(0, 3.061616997868383e-16, 5))) {
                camera.position.copy(cameraObject.position);
                camera.rotation.copy(cameraObject.rotation);
            }
        }
    });

    return <primitive object={scene} {...props} />;
}

function Floorplan({
    data,
    sceneFile,
    className,
    location,
    controls,
    ...props
}: {
    data: OccupancyData[];
    sceneFile: string;
    className?: string;
    location?: string;
    props?: object;
    controls?: boolean;
}) {
    const [rotate, setRotate] = useState(false);
    useEffect(() => {
        if (!location) {
            setRotate(true);
        }
    }, []);
    return (
        <Canvas
            className={className}
            // HACK: i should find a better solution for this
            onMouseEnter={() => !location && setRotate(false)}
            onMouseOut={() => !location && setRotate(true)}
        >
            {controls && <OrbitControls />}

            <MeshComponent rotate={rotate} data={data} sceneFile={sceneFile} location={location} />
        </Canvas>
    );
}

export default Floorplan;
