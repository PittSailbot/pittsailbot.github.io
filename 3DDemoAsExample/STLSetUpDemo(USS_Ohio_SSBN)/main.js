// Credit: https://threejs.org/docs/#STLLoader
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 初始化
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x888888);

// 加载 STL 模型
const loader = new STLLoader();
const geometry = await loader.loadAsync( './FullAssem.STL' )
const material = new THREE.MeshStandardMaterial( { color: 0x0000FF } );
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );
geometry.center(); // 将几何体的中心移动到原点

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 1, 1, 1 ).normalize();
scene.add( directionalLight );

// 相机
const position = new THREE.Vector3( 3000 , 3000 , 3000 );
const camera = new THREE.PerspectiveCamera(
  50, 
  1920/ 1080, 
  0.1, 
  5000 );
camera.position.copy( position );
scene.add( camera );

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize( 1920, 1080 );
document.body.appendChild( renderer.domElement );

// Orbital controls, credit: https://threejs.org/docs/?q=OrbitControls#OrbitControls
const controls = new OrbitControls( camera, renderer.domElement );
// controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();
function animate() {
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
  requestAnimationFrame( animate );
}
animate();
// End of script