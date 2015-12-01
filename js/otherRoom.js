    var scene, camera, renderer, controls;
    var geometry, material, mesh, meshFire;
    var light;

    var grassMaterial, grassGeometry, grassMeshes = [], grassMeshes2 = [];

	var grassHeight = 4, grassWidth = 2;
	var grassCount1 = 2000;
  var grassCount2 = 1000;
	var clock = new THREE.Clock();

    var grassWiggler = 0;


    //water parameters
    var parameters = {
        width: 8000,
        height: 25000,
        widthSegments: 250,
        heightSegments: 250,
        depth: 1500,
        param: 4,
        filterparam: 1
    };

    var waterNormals;

    init();
    animate();

    function init() {

        scene = new THREE.Scene();

        lightScene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 400000 );
        camera.position.z = 7500;

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
         // renderer.render( scene, camera );
        document.body.appendChild( renderer.domElement );

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
        skyboxMesh.position.y = -20000;
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

            object.position.x = -5200;
            object.position.y = -2700;
            object.position.z = -2000;
            object.rotation.y = -90;
            object.scale.x = 75;
            object.scale.y = 75;
            object.scale.z = 75;
            obj = object
            scene.add( obj );

        }, onProgress, onError );


        //add green grass plane


        geometryPlane1 = new THREE.BoxGeometry(25000,50,25000);
        //materialPlane1 = new THREE.MeshPhongMaterial({color: 'green' });
        var imgTexture1 = THREE.ImageUtils.loadTexture( "textures/Grassmud.jpg" )

        imgTexture1.wrapS = THREE.RepeatWrapping;
	      imgTexture1.wrapT = THREE.RepeatWrapping;
	      imgTexture1.repeat.set(5,5);
        materialPlane1 = new THREE.MeshLambertMaterial({
          map: imgTexture1,

        });
        meshPlane1 = new THREE.Mesh(geometryPlane1, materialPlane1);

        meshPlane1.position.x = 9500;
        meshPlane1.position.y = -2700;
        meshPlane1.position.z = -7500;

        scene.add(meshPlane1);

        //grassGeometry
        grassGeometry = new THREE.PlaneGeometry( 2500, 2500, grassWidth - 1, grassHeight - 1 );
				grassGeometry.dynamic = true;
				grassGeometry.vertices[ 3 ].z = 1;


      	var grassMap = THREE.ImageUtils.loadTexture( 'textures/thingrass.png' );

				grassMaterial = new THREE.MeshPhongMaterial( { map: grassMap, alphaTest: 0.8, side: THREE.DoubleSide } );


      	for ( var i = 0, l = grassCount1; i < l; i++ ) {
					grassMeshes[i] = new THREE.Mesh( grassGeometry, grassMaterial );
          var x = Math.random() * 24000 - 12000;
          var z = Math.random() * 24000 - 12000;
          if( (z < 7000 || z > 10000) || (x < -7000 || x > -4000) ){ //x < -7000 || x > -4000
            grassMeshes[i].position.x = x;
					  grassMeshes[i].position.z = z;
					  grassMeshes[i].rotation.y = Math.random() * Math.PI;
            grassMeshes[i].position.x += 9500;
            grassMeshes[i].position.y += -1600;
            grassMeshes[i].position.z += -8900;
					  scene.add( grassMeshes[i] );
          }



				}

        geometryPlane2 = new THREE.BoxGeometry(25000,50,25000);
        //materialPlane2 = new THREE.MeshPhongMaterial({color: 'green' });
        var imgTexture2 = THREE.ImageUtils.loadTexture( "textures/Grassmud.jpg" )
        imgTexture2.wrapS = THREE.RepeatWrapping;
        imgTexture2.wrapT = THREE.RepeatWrapping;
        imgTexture2.repeat.set(5,5);
        materialPlane2 = new THREE.MeshLambertMaterial({
          map: imgTexture2,

        });
        meshPlane2 = new THREE.Mesh(geometryPlane2, materialPlane2);

        meshPlane2.position.x = -20500;
        meshPlane2.position.y = -2700;
        meshPlane2.position.z = -7400;
        scene.add(meshPlane2);

        for ( var i = grassCount1, l = grassCount1+grassCount2; i < l; i++ ) {
					grassMeshes[i] = new THREE.Mesh( grassGeometry, grassMaterial );
					grassMeshes[i].position.x = Math.random() * 24000 - 12000;
					grassMeshes[i].position.z = Math.random() * 24000 - 12000;
					grassMeshes[i].rotation.y = Math.random() * Math.PI;
          grassMeshes[i].position.x += -20500;
          grassMeshes[i].position.y += -1600;
          grassMeshes[i].position.z += -8900;

					scene.add( grassMeshes[i] );
				}
        //water
        waterNormals = new THREE.ImageUtils.loadTexture( 'textures/waternormals.jpg' );
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

        water = new THREE.Water( renderer, camera, scene, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha:  1.0,
            sunDirection: light.position.clone().normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 50.0,
        } );

        mirrorMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( parameters.width, parameters.height),
            water.material
        );

        mirrorMesh.add( water );
        mirrorMesh.rotation.x = - Math.PI * 0.5;
        scene.add( mirrorMesh );
        mirrorMesh.position.x = -5000;
        mirrorMesh.position.y = -2700;
        mirrorMesh.position.z = -7500;

        waterPlane = new THREE.BoxGeometry(10000,10,25000);
        materialWater = new THREE.MeshLambertMaterial({color: '#13BFE3' });
        //THREE.ImageUtils.loadTexture( "textures/Grass.jpg" )
        waterMesh = new THREE.Mesh(waterPlane, materialWater);
        //waterMesh.add(water);
        waterMesh.position.x = -5000;
        waterMesh.position.y = -2800;
        waterMesh.position.z = -7500;
        scene.add(waterMesh);


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
        //Grassthingie animation
        for ( var i = 0, il = grassGeometry.vertices.length / 2 - 1; i <= il; i ++ ) {
          for ( var j = 0, jl = grassWidth, f = (il - i) / il; j < jl; j++ ) {
            if(grassWiggler == 0){
              grassGeometry.vertices[ jl * i + j ].z += 10*f + f * meter.volume * 30;
              if (grassGeometry.vertices[ jl * i + j ].z > 950){
              grassWiggler = 1;}}
              else if(grassWiggler ==1){
                grassGeometry.vertices[ jl * i + j ].z -= 10*f + f * meter.volume * 30;
              if (grassGeometry.vertices[ jl * i + j ].z <-950){
              grassWiggler = 0;}
              //console.log (grassGeometry.vertices[ jl * i + j ].z);

            }
          }
          grassGeometry.verticesNeedUpdate = true;
        }

        /* FIRE Animate() */
        if(meshFire != null){
            fireAnimate();
        }
        /* End of FIRE Animate() */
       }

        //water animation
        waterrender();
        renderer.render( scene, camera );
    }

      function lightScene() {

        //light to make texture visible
        var ambient = new THREE.AmbientLight( 0x404040 );
        //scene.add( ambient );

        // var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        // directionalLight.position.set( 0, 1, 1 ).normalize();
        // scene.add( directionalLight );

        light = new THREE.PointLight( 0x0066FF, 2, 0 );
        light.position.set( 0, 3000, 0 );
        scene.add( light );

        var firelight = new THREE.PointLight( 0xFF6200, 7, 6000 );
        firelight.position.set( 3500, 0, 2500 );
        scene.add( firelight );

      }

      function waterrender() {
        water.material.uniforms.time.value += 1.0/4;
        water.render();
    }


