const loader = new GLTFLoader();
// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '3DDemoAsExample/demo/draco/' );
loader.setDRACOLoader( dracoLoader );
const gltf = await loader.loadAsync( '3DDemoAsExample/demo/sailboat.glb' );
scene.add( gltf.scene );
