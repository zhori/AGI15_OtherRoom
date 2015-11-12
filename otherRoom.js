var scene, camera, renderer, controls;
    var geometry, material, mesh;

    init();
    animate();

    function init() {

        scene = new THREE.Scene();

        //light to make texture visible
        var ambient = new THREE.AmbientLight( 0x444444 );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 0, 1 ).normalize();
        scene.add( directionalLight );

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
        camera.position.z = 200;

        // Add the skybox
        // load the cube textures
        var urlPrefix   = "Images/canary/";
        var urls = [ urlPrefix + "posx.png", urlPrefix + "negx.png",
            urlPrefix + "posy.png", urlPrefix + "negy.png",
            urlPrefix + "posz.png", urlPrefix + "negz.png" ];

        var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
        reflectionCube.format = THREE.RGBFormat;

        var refractionCube = THREE.ImageUtils.loadTextureCube( urls );
        refractionCube.mapping = THREE.CubeRefractionMapping;
        refractionCube.format = THREE.RGBFormat;


        // init the cube shadder
        var shader  = THREE.ShaderLib["cube"];
        shader.uniforms[ "tCube" ].value = reflectionCube;

        var material = new THREE.ShaderMaterial( {

                    fragmentShader: shader.fragmentShader,
                    vertexShader: shader.vertexShader,
                    uniforms: shader.uniforms,
                    depthWrite: false,
                    side: THREE.BackSide

        } );

        skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 1000, 1000, 1000 ), material );
       
        scene.add( skyboxMesh );

        // // Model of window
        // var onProgress = function ( xhr ) {
        //     if ( xhr.lengthComputable ) {
        //         var percentComplete = xhr.loaded / xhr.total * 100;
        //         console.log( Math.round(percentComplete, 2) + '% downloaded' );
        //     }
        // };

        // var onError = function ( xhr ) {
        // };


        // THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

        // var loader = new THREE.OBJMTLLoader();
        // loader.load( 'model/windowframe.obj', 'model/windowframe.mtl', function ( object ) {

        //     object.position.x = 0;
        //     object.position.y = -500;
        //     object.position.z = 500;
        //     //object.rotation.y = Math.PI;
        //     object.scale.x = 20
        //     object.scale.y = 20;
        //     object.scale.z = 20;
        //     scene.add( object );

        // }, onProgress, onError );

        // add simple cube in the middle of the scene that reacts to sound
        geometryCube = new THREE.BoxGeometry(40,40,40);
        materialCube = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe:true });

        meshCube = new THREE.Mesh(geometryCube, materialCube);
        scene.add(meshCube);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.render( scene, camera );

        document.body.appendChild( renderer.domElement );

        // Setup the controls
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.keyPanSpeed = 50.0;

        window.addEventListener( 'resize', onWindowResize, false );


    }

    function onWindowResize() {
        // update the camera
        camera.aspect   = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        // notify the renderer of the size change
        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

        requestAnimationFrame( animate );

        if(meter != null){
            meshCube.rotation.x += meter.volume*3;
            meshCube.rotation.y += meter.volume*3;
        }

        controls.update() // update the OrbitControls

        renderer.render( scene, camera );

    }

