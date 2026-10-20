const scene = new THREE.Scene(); 
// 创建一个场景，一个三维空间的容器，用于存放所有的物体、光源和相机等元素。

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
// 创建一个透视相机，参数分别为视野角度、宽高比、近裁剪面和远裁剪面。
// 但是这是固定的？

const renderer = new THREE.WebGLRenderer();

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);
// 设置渲染器的尺寸为浏览器窗口的宽度和高度。
// 这玩意是Three.js自带的吗？
// const什么意思？

document.body.appendChild(renderer.domElement);
// 什么意思？

const geometry = new THREE.BoxGeometry(1, 1, 1);
// 创建一个立方体几何体，参数分别为宽度、高度和深度。

const material = new THREE.MeshStandardMaterial({
    color: 0x808080
});// 这是什么的颜色？

const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

const light = new THREE.DirectionalLight(
    0xffffff,
    2
);

light.position.set(5, 5, 5);
scene.add(light);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
// 运行？


// js教我一下？我学过Java但是js不太懂