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

        // add simple cube in the middle of the scene that reacts to sound
        geometryCube = new THREE.BoxGeometry(800 , 800, 800);
        materialCube = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe:true });

        meshCube = new THREE.Mesh(geometryCube, materialCube);
        scene.add(meshCube);

        //add green grass plane

        geometryPlane = new THREE.BoxGeometry(10000,300,10000);
        materialPlane = new THREE.MeshPhongMaterial({color: 0x99FF33 });
        //THREE.ImageUtils.loadTexture( "textures/Grass.jpg" )
        meshPlane = new THREE.Mesh(geometryPlane, materialPlane);
        
        meshPlane.position.y = -2700;
        scene.add(meshPlane);

        // add artistic render effect
        artisticRendering(meshCube);


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

    function artisticRendering (target) {

    console.log(target);
    console.log(target.geometry.faces);

    var targetFaces = target.geometry.faces;
    var targetVertices = target.geometry.vertices;

    // create the particle variables
    var particleCount = 1800,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.PointsMaterial({
          color: 0xFFFFFF,
          size: 20
        });

    
    var i;
    for (i = 0; i < targetFaces.length; ++i){
        // Get copy the defining vertices for the current face
        var face = targetFaces[i],
            vec3_a = targetVertices[face.a],
            vec3_b = targetVertices[face.b],
            vec3_c = targetVertices[face.c];

        vec3_a = new THREE.Vector3(vec3_a.x, vec3_a.y, vec3_a.z); 
        vec3_b = new THREE.Vector3(vec3_b.x, vec3_b.y, vec3_b.z);
        vec3_c = new THREE.Vector3(vec3_c.x, vec3_c.y, vec3_c.z);

        particles.vertices.push(new THREE.Vector3(vec3_a.x, vec3_a.y, vec3_a.z));
        particles.vertices.push(new THREE.Vector3(vec3_b.x, vec3_b.y, vec3_b.z));
        particles.vertices.push(new THREE.Vector3(vec3_c.x, vec3_c.y, vec3_c.z));

        var edgeAB = interpolate(vec3_a, vec3_b, 10),
            edgeAC = interpolate(vec3_a, vec3_c, 10);

        var j;
        for(j = 0; j < edgeAB.length; ++j){
            particles.vertices.push(new THREE.Vector3(edgeAB[j].x, edgeAB[j].y, edgeAB[j].z));
            particles.vertices.push(new THREE.Vector3(edgeAC[j].x, edgeAC[j].y, edgeAC[j].z));
        }



    }

    // create the particle system
    var particleSystem = new THREE.Points(
        particles,
        pMaterial);

    // add it to the scene
    scene.add(particleSystem);
    }

    function interpolate(vec3_a, vec3_b, resultLength){

        var vec3_current, denominator, step, result;
        
        // create copies of parameters
        vec3_current = new THREE.Vector3(vec3_a.x, vec3_a.y, vec3_a.z);
        vec3_a = new THREE.Vector3(vec3_a.x, vec3_a.y, vec3_a.z);
        vec3_b = new THREE.Vector3(vec3_b.x, vec3_b.y, vec3_b.z);

        denominator = Math.max(resultLength-1, 1);
        step = (vec3_a.sub(vec3_b)).divideScalar(denominator);

        var index;
        result = [];
        for (index = 0; index < resultLength; ++index)
        {
            var pos = new THREE.Vector3();
            pos.copy(vec3_current);
            result[index] = pos;
            vec3_current.sub(step);
        }

        return result;
    }

 

