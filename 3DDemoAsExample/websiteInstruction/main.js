// 3DDemoAsExample/websiteInstruction/main.js
// 废话
import * as THREE from 'https://unpkg.com/three@0.166.0/build/three.module.js';

// 创建场景、相机和渲染器（LLM自动生成）
const scene = new THREE.Scene();

// “唯物论”物体
const geometryCube = new THREE.BoxGeometry( 1, 1, 1 );
const materialCube = new THREE.MeshBasicMaterial( { color: 0x00ff00, shininess: 200, } );
const cube = new THREE.Mesh( geometryCube, materialCube  );
scene.add( cube ); 

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, shininess: 200, } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube ); 

// 渲染
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// 相机位置
const camera = new THREE.PerspectiveCamera(
     75, 
     window.innerWidth / window.innerHeight, 
     0.1, 
     1000 
    );
camera.position.z = 5;

// 光源
const light = new THREE.DirectionalLight(
    0xffffff,
    2
);

light.position.set(5, 5, 5); 
scene.add(light);

// 运行
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.y += 0.01; 

    renderer.render(scene, camera); 
} 

animate();