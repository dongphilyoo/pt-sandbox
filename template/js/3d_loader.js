var renderer, scene, camera;

var spotLight, lightHelper, shadowCameraHelper;

var gui;

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(15, 40, 35);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.05;
    spotLight.decay = 2;
    spotLight.distance = 200;

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    scene.add(spotLight);
    lightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(lightHelper);
    shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    scene.add(shadowCameraHelper);
    scene.add(new THREE.AxesHelper(10));


    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath('./assets/');
    mtlLoader.setPath('./assets/');
    mtlLoader.load('Beryl.mtl', function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('./assets/');
        objLoader.load('Beryl.obj', function (object) {

            scene.add(object);
            // object.position.y -= 60;
            object.traverse(function (child) {
                child.castShadow = true;
            });
        });
    });

    controls.update();

}

function render() {

    requestAnimationFrame(render);
    lightHelper.update();
    shadowCameraHelper.update();
    renderer.render(scene, camera);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.shadowMapSoft = true;

}


function buildGui() {

    gui = new dat.GUI();

    var params = {
        'light color': spotLight.color.getHex(),
        intensity: spotLight.intensity,
        distance: spotLight.distance,
        angle: spotLight.angle,
        penumbra: spotLight.penumbra,
        decay: spotLight.decay,
        'position.x' : spotLight.position.x,
        'position.y' : spotLight.position.y,
        'position.z' : spotLight.position.z,
    };

    gui.add(params, 'position.x', -500, 500).onChange(function (val) {
        spotLight.position.x = val;
        render();
    });

    gui.add(params, 'position.y', -500, 500).onChange(function (val) {
        spotLight.position.y = val;
        render();
    });

    gui.add(params, 'position.z', -500, 500).onChange(function (val) {
        spotLight.position.z = val;
        render();
    });

    gui.addColor(params, 'light color').onChange(function (val) {
        spotLight.color.setHex(val);
        render();
    });

    gui.add(params, 'intensity', 0, 2).onChange(function (val) {
        spotLight.intensity = val;
        render();
    });

    gui.add(params, 'distance', 50, 20000).onChange(function (val) {
        spotLight.distance = val;
        render();
    });

    gui.add(params, 'angle', 0, Math.PI / 3).onChange(function (val) {
        spotLight.angle = val;
        render();
    });

    gui.add(params, 'penumbra', 0, 1).onChange(function (val) {
        spotLight.penumbra = val;
        render();
    });

    gui.add(params, 'decay', 1, 2).onChange(function (val) {
        spotLight.decay = val;
        render();
    });

    gui.open();

}

init();
buildGui();
render();

/*

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 500;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;


// ambient light added
var ambient = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambient);


var spotLight = new THREE.SpotLight(0xffffff, 1, 200, 1.05, 1, 2);
spotLight.position.set(15, 10, -350);
spotLight.penumbra = 0.05;
spotLight.angle = Math.PI / 4;
spotLight.distance = 10000;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 10;
spotLight.shadow.camera.far = 200;
spotLight.decay = 2;

scene.add(spotLight);


lightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(lightHelper);

var pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(50, 50, 100);
pointLight.castShadow = true;
pointLight.shadowDarkness = 1;

// var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
// keyLight.position.set(-100, -50, 100);

// var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
// fillLight.position.set(100, 0, 10);

// var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
// backLight.position.set(100, 0, -100).normalize();

// light.castShadow = true;
// light.shadowDarkness = 1;


// scene.add(keyLight);
// scene.add(fillLight);
// scene.add(backLight);
// scene.add(pointLight);

var mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath('./assets/');
mtlLoader.setPath('./assets/');
mtlLoader.load('Beryl1.mtl', function (materials) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('./assets/');
    objLoader.load('Beryl1.obj', function (object) {

        scene.add(object);
        // object.position.y -= 60;
        object.traverse(function (child) {
            child.castShadow = true;
        });

    });

});

var render = function () {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;


    renderer.shadowMapSoft = true;
    // floor.receiveShadow = true;


};

// var gui = new dat.GUI({height: 5 * 32 -1});

function buildGui() {
    gui = new dat.GUI();
    var params = {
        'light color': spotLight.color.getHex(),
        intensity: spotLight.intensity,
        distance: spotLight.distance,
        angle: spotLight.angle,
        penumbra: spotLight.penumbra,
        decay: spotLight.decay
    };
    gui.addColor(params, 'light color').onChange(function (val) {
        spotLight.color.setHex(val);
        render();
    });
    gui.add(params, 'intensity', 0, 2).onChange(function (val) {
        spotLight.intensity = val;
        render();
    });
    gui.add(params, 'distance', 50, 200).onChange(function (val) {
        spotLight.distance = val;
        render();
    });
    gui.add(params, 'angle', 0, Math.PI / 3).onChange(function (val) {
        spotLight.angle = val;
        render();
    });
    gui.add(params, 'penumbra', 0, 1).onChange(function (val) {
        spotLight.penumbra = val;
        render();
    });
    gui.add(params, 'decay', 1, 2).onChange(function (val) {
        spotLight.decay = val;
        render();
    });
    gui.open();
}

buildGui();

render();

*/