var scene, camera, renderer, controls;
    var geometry, material, mesh;

    init();
    animate();

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
        camera.position.z = 200;

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

        skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), material );
        skyboxMesh.position.x = 0;
        skyboxMesh.position.y = 0;
        skyboxMesh.position.z = 0;

        scene.add( skyboxMesh );

        //load window frame .obj
        //texture
        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {

            console.log( item, loaded, total );

        };

        var texture = new THREE.Texture();

        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) {
        };


        var loader = new THREE.ImageLoader( manager );
        loader.load( 'textures/brick_diffuse.jpg', function ( image ) {

            texture.image = image;
            texture.needsUpdate = true;

        } );

        // model
        var loader = new THREE.OBJLoader( manager );
        loader.load( 'windowframe.obj', function ( object ) {

            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {

                    child.material.map = texture;

                }

        } );

        object.position.x = 0;
        object.position.y = -2500;
        object.position.z = 5000;
        // object.rotation.x = 20* Math.PI / 180;
        object.rotation.y = Math.PI;
        object.scale.x = 100
        object.scale.y = 100;
        object.scale.z = 100;
        obj = object
        scene.add( obj );

        }, onProgress, onError );

       
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

        controls.update() // update the OrbitControls

        renderer.render( scene, camera );

    }