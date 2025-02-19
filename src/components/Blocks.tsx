// components/Blocks.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import DeleteButton from './DeleteButton';
import Slider from './Slider';

const Blocks = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Three.jsオブジェクトをuseRefで管理
    const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const rendererRef = useRef<THREE.WebGLRenderer>(null);
    const cubesRef = useRef<THREE.Mesh[]>([]);
    const groundHeightRef = useRef<number>(0);
    const isDeletingRef = useRef<boolean>(false);
    const cubeGenerationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // スライダーの値の状態を管理
    const [sliderValue, setSliderValue] = useState(3000);

    // 指定時間待機する関数（非同期）
    function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ランダムな色を生成する関数
    function getRandomColor(): THREE.ColorRepresentation {
        const colors: THREE.ColorRepresentation[] = [0x3D8D7A, 0xB3D8A8, 0xFBFFE4, 0xA3D1C6];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // ランダムなキューブを作成する関数
    function createCube() {
        if (isDeletingRef.current) return; // 削除中は新しいキューブを作成しない
        const size = 80; // キューブのサイズ
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({
            color: getRandomColor(),
            transparent: true,
            opacity: 0.75,
        });
        const cube = new THREE.Mesh(geometry, material);

        // 初期位置（画面上部からランダムなX座標）
        cube.position.x = (Math.random() - 0.5) * (window ? window.innerWidth : 640);
        cube.position.y = (window ? window.innerHeight : 480) / 2;
        cube.userData = { velocityY: -2, size, isStatic: false };

        if (cubesRef.current.length >= 100) {
            return;
        }

        cubesRef.current.push(cube);
        sceneRef.current.add(cube);
    }

    // 他のキューブとの衝突をチェックする関数
    function checkCollision(cube: THREE.Mesh): boolean {
        return cubesRef.current.some(other =>
            other !== cube &&
            other.userData.isStatic &&
            Math.abs(cube.position.x - other.position.x) < cube.userData.size &&
            Math.abs(cube.position.y - other.position.y) < (cube.userData.size + other.userData.size) / 2
        );
    }

    // 最も高いキューブのY座標を取得する関数
    function getHighestCubeY(cube: THREE.Mesh): number {
        return cubesRef.current.reduce((highestY, other) =>
            other !== cube && other.userData.isStatic && Math.abs(cube.position.x - other.position.x) < cube.userData.size
                ? Math.max(highestY, other.position.y)
                : highestY,
            groundHeightRef.current
        );
    }

    // キューブを整列させる関数
    function alignCubes() {
        if (cubesRef.current.length === 0) {
            return;
        }

        const size = 80; // 固定値を使用
        const cubesPerRow = Math.floor((window ? window.innerWidth : 640) / (size * 1.25));
        const xOffset = -Math.floor((window ? window.innerWidth : 640) / 2);
        const yOffset = groundHeightRef.current + size / 2;
        let currentRow = 0;
        let currentCol = 0;

        cubesRef.current.forEach((cube) => {
            // 整列後の位置を計算
            const targetX = xOffset + currentCol * size * 1.25;
            const targetY = yOffset + currentRow * size;

            // キューブを小さくして消えるアニメーション
            const shrinkInterval = setInterval(() => {
                cube.scale.x -= 0.1;
                cube.scale.y -= 0.1;
                cube.scale.z -= 0.1;

                if (cube.scale.x <= 0) {
                    clearInterval(shrinkInterval);

                    // キューブを整列位置に移動
                    cube.position.x = targetX;
                    cube.position.y = targetY;

                    // キューブを大きくして現れるアニメーション
                    const growInterval = setInterval(() => {
                        cube.scale.x += 0.1;
                        cube.scale.y += 0.1;
                        cube.scale.z += 0.1;

                        if (cube.scale.x >= 1) {
                            clearInterval(growInterval);
                            cube.userData.isStatic = true; // 静的なオブジェクトとして扱う
                            cube.userData.velocityY = 0; // 落下を停止
                        }
                    }, 16); // アニメーション間隔（約60FPS）
                }
            }, 16); // アニメーション間隔（約60FPS）

            currentCol++;
            if (currentCol > cubesPerRow) {
                currentCol = 0;
                currentRow++;
            }
        });
    }

    // キューブをすべて削除
    const deleteBlocks = () => {
        isDeletingRef.current = true;
        let pos = 0;

        while (cubesRef.current.length > 0) {
            const cube = cubesRef.current.shift();
            if (!cube) return;

            setTimeout(() => {
                const fallInterval = setInterval(() => {
                    cube.position.y -= 10;
                    cube.rotation.x += 0.1;
                    cube.rotation.y += 0.1;

                    if (cube.position.y < -(window ? window.innerHeight : 480) / 2 - 80) { // cube.userData.sizeの代わりに固定値を使用
                        clearInterval(fallInterval);
                        sceneRef.current.remove(cube);
                        if (cubesRef.current.length === 0) {
                            sleep(1000).then(() => {
                                isDeletingRef.current = false;
                            });
                        }
                    }
                }, 16);
            }, pos * 50);

            pos++;
        }
    }

    const clickDeleteButton = (event: React.MouseEvent) => {
        event.preventDefault();
        deleteBlocks();
    };

    // **右クリック**
    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        deleteBlocks();
    };

    useEffect(() => {
        if (containerRef.current) {
            // 基本設定
            const width = window ? window.innerWidth : 640;
            const height = window ? window.innerHeight : 480;

            cameraRef.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
            rendererRef.current.setSize(width, height);
            containerRef.current.appendChild(rendererRef.current.domElement);

            // カメラの位置を調整
            cameraRef.current.position.z = 600;

            // シーンの背景色を設定
            sceneRef.current.background = new THREE.Color(0xf0f0f0);

            // 地面の高さを定義
            groundHeightRef.current = -height / 2;

            // アニメーションループ
            const animate = () => {
                requestAnimationFrame(animate);

                cubesRef.current.forEach(cube => {
                    if (!cube.userData.isStatic) {
                        cube.userData.velocityY -= 0.1; // 重力効果
                        cube.position.y += cube.userData.velocityY;

                        // 地面または他のキューブに衝突した場合
                        if (cube.position.y - 80 <= groundHeightRef.current || checkCollision(cube)) {  // cube.userData.sizeの代わりに固定値を使用
                            cube.position.y = Math.max(
                                groundHeightRef.current + 80,
                                getHighestCubeY(cube) + 80
                            );
                            cube.userData.isStatic = true; // 静的状態に設定
                            cube.userData.velocityY = 0; // 落下停止
                        }
                    }
                });

                rendererRef.current.render(sceneRef.current, cameraRef.current);
            };

            animate();

            // イベントリスナーを追加
            document.addEventListener('contextmenu', handleContextMenu);
            document.addEventListener('click', alignCubes);

            // スライダーの値によってキューブ生成のインターバルを設定
            cubeGenerationIntervalRef.current = setInterval(createCube, sliderValue);

            // クリーンアップ関数
            return () => {
                clearInterval(cubeGenerationIntervalRef.current);
                document.removeEventListener('contextmenu', handleContextMenu);
                document.removeEventListener('click', alignCubes);
            };
        }
    }, []);

    // スライダーの値が変更されたときに実行される関数
    const handleSliderChange = (value: number) => {
        setSliderValue(value);
        clearInterval(cubeGenerationIntervalRef.current); // 古いインターバルをクリア
        cubeGenerationIntervalRef.current = setInterval(createCube, value); // valueを使用
    };

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100dvh' }}>
            <DeleteButton onClick={clickDeleteButton} />
            <Slider value={sliderValue} onChange={handleSliderChange} min={500} max={5000} />
        </div>
    );
};

export default Blocks;
