    var scene, camera, renderer, controls;
    var geometry, material, mesh;


    init();
    animate();

    function init() {

        scene = new THREE.Scene();

        //light to make texture visible
        var ambient = new THREE.AmbientLight( 0x404040 );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 0, 1 ).normalize();
        scene.add( directionalLight );

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 400000 );
        camera.position.z = 7500;

        // Add the skybox
        // load the cube textures
        var urlPrefix   = "Images/skycartoon/";
        var urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
            urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
            urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];

        // var urlPrefix   = "Images/skycartoon/";
        // var urls = [ urlPrefix + "posx.png", urlPrefix + "negx.png",
        //     urlPrefix + "posy.png", urlPrefix + "negy.png",
        //     urlPrefix + "posz.png", urlPrefix + "negz.png" ];



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

        skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 200000, 200000, 200000 ), material );

        scene.add( skyboxMesh );

        // Model of window
        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) {
        };


        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );


        var loader = new THREE.OBJMTLLoader();
        loader.load( 'model/windowframe.obj', 'model/windowframe.mtl', function ( object ) {

            object.position.x = 0;
            object.position.y = -2500;
            object.position.z = 4000;
            //object.rotation.y = Math.PI;
            object.scale.x = 200;
            object.scale.y = 100;
            object.scale.z = 100;
            obj = object
            scene.add( obj );

        }, onProgress, onError );

       // Model of bridge
        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) {
        };


        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );


        var loader = new THREE.OBJMTLLoader();
        loader.load( 'model/bridge.obj', 'model/bridge.mtl', function ( object ) {

            object.position.x = -2000;
            object.position.y = -2700;
            object.position.z = -2000;
            object.rotation.y = -90;
            object.scale.x = 75;
            object.scale.y = 75;
            object.scale.z = 75;
            obj = object
            scene.add( obj );

        }, onProgress, onError );



        // add simple cube in the middle of the scene that reacts to sound
        geometryCube = new THREE.BoxGeometry(800 , 800, 800);
        materialCube = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe:true });

        meshCube = new THREE.Mesh(geometryCube, materialCube);
        scene.add(meshCube);

        //add green grass plane

        geometryPlane1 = new THREE.BoxGeometry(100000,50,100000);
        //materialPlane1 = new THREE.MeshPhongMaterial({color: 'green' });
        var imgTexture1 = THREE.ImageUtils.loadTexture( "textures/Grass.jpg" )
        materialPlane1 = new THREE.MeshBasicMaterial({
          map: imgTexture1,

        });
        meshPlane1 = new THREE.Mesh(geometryPlane1, materialPlane1);

        meshPlane1.position.x = 50000;
        meshPlane1.position.y = -2700;
        meshPlane1.position.z = -45000;
        scene.add(meshPlane1);

        geometryPlane2 = new THREE.BoxGeometry(100000,50,100000);
        //materialPlane2 = new THREE.MeshPhongMaterial({color: 'green' });
        var imgTexture2 = THREE.ImageUtils.loadTexture( "textures/Grass.jpg" )
        materialPlane2 = new THREE.MeshBasicMaterial({
          map: imgTexture2,

        });
        meshPlane2 = new THREE.Mesh(geometryPlane2, materialPlane2);

        meshPlane2.position.x = -55000;
        meshPlane2.position.y = -2700;
        meshPlane2.position.z = -45000;
        scene.add(meshPlane2);

        waterPlane = new THREE.BoxGeometry(25000,10,100000);
        materialWater = new THREE.MeshBasicMaterial({color: '#13BFE3' });
        //THREE.ImageUtils.loadTexture( "textures/Grass.jpg" )
        waterMesh = new THREE.Mesh(waterPlane, materialWater);

        waterMesh.position.y = -2800;
        waterMesh.position.z = -45000;
        scene.add(waterMesh);


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


      //meshCube.material = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe:true });


        requestAnimationFrame( animate );
        if(meter != null){

            if (meter.checkClipping() && recentclip == 0 ){
              meshCube.material = new THREE.MeshBasicMaterial({color: '#'+Math.floor(Math.random()*16777215).toString(16), wireframe:true });
              recentclip = 1;
            }
            else
            {
              recentclip = 0;
            }

            meshCube.rotation.x += meter.volume/2;
            meshCube.rotation.y += meter.volume/2;
        }

        controls.update() // update the OrbitControls

        renderer.render( scene, camera );

    }



