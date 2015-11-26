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

        // add Icosahedron to the scene
        geometryIco  = new THREE.IcosahedronGeometry( 200, 1 );

        var meshIco = THREE.SceneUtils.createMultiMaterialObject( geometryIco, [

        new THREE.MeshLambertMaterial( { color: 0xffffff} ),
        new THREE.MeshBasicMaterial( { color: 0x222222, wireframe: true} )

        ]);


        scene.add(meshIco);

        // add artistic render effect
        console.log(meshIco);
        artisticRendering(meshIco.children[0]);


        //add green grass plane

        geometryPlane = new THREE.BoxGeometry(10000,300,10000);
        materialPlane = new THREE.MeshPhongMaterial({color: 0x99FF33 });
        //THREE.ImageUtils.loadTexture( "textures/Grass.jpg" )
        meshPlane = new THREE.Mesh(geometryPlane, materialPlane);
        
        meshPlane.position.y = -2700;
        scene.add(meshPlane);

        

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

    var targetFaces = target.geometry.faces;
    var targetVertices = target.geometry.vertices;

    // create the particle variables
    var particleGeometry = new THREE.BufferGeometry(),
        particleVectors = [];

    for (var i = 0; i < targetFaces.length; ++i){
        // Get copy of the defining vertices for the current face
        var face = targetFaces[i],
            vec3_a = targetVertices[face.a],
            vec3_b = targetVertices[face.b],
            vec3_c = targetVertices[face.c];

        vec3_a = new THREE.Vector3(vec3_a.x, vec3_a.y, vec3_a.z); 
        vec3_b = new THREE.Vector3(vec3_b.x, vec3_b.y, vec3_b.z);
        vec3_c = new THREE.Vector3(vec3_c.x, vec3_c.y, vec3_c.z);

        // Calculate area of the triangular face using Herons formula
        var ABdist = vec3_a.distanceTo(vec3_b),
            ACdist = vec3_a.distanceTo(vec3_c),
            BCdist = vec3_b.distanceTo(vec3_c);

        var s = (ABdist + ACdist + BCdist)/2; //half triangle perimeter
        var area = Math.sqrt(s*(s-ABdist)*(s-ACdist)*(s-BCdist));

        var inverseDensity = 320,
            nPoints = area/inverseDensity;

        for(var j = 0; j < nPoints; ++j){
            var point = fill(vec3_a, vec3_b, vec3_c);
            particleVectors.push(new THREE.Vector3(point.x, point.y, point.z));
        }

    }

    // add all particle attributes to the BufferGeometry
    var nParticles = particleVectors.length;
    var positions = new Float32Array( nParticles * 3 );
    var colors = new Float32Array( nParticles * 3 );
    var sizes = new Float32Array( nParticles );

    for(var i = 0, i3 = 0; i < nParticles; ++i, i3 += 3){

        positions[ i3 + 0 ] = particleVectors[i].x;
        positions[ i3 + 1 ] = particleVectors[i].y;
        positions[ i3 + 2 ] = particleVectors[i].z;

        // color.setHSL( i / nParticles, 1.0, 0.5 );

        // colors[ i3 + 0 ] = color.r;
        // colors[ i3 + 1 ] = color.g;
        // colors[ i3 + 2 ] = color.b;

        sizes[ i ] = Math.random()*20;
    }

    particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    //geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    particleGeometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

    // uniforms
    uniforms = {

        color: { type: "c", value: new THREE.Color( 0x00ff00 ) },
        alpha: { type: "f", value: 1.0 },
        texture:{ type: "t", value: THREE.ImageUtils.loadTexture( "Images/dot.png" ) }

    };

    // point cloud material
    var shaderMaterial = new THREE.ShaderMaterial( {

        uniforms:       uniforms,
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

        //blending:       THREE.AdditiveBlending,
        alphaTest: 0.5,
        //depthTest: false,
        transparent:    true

    });

    // create the particle system
    var particleSystem = new THREE.Points(
        particleGeometry,
        shaderMaterial);

    // add it to the scene
    scene.add(particleSystem);
    }

    function fill(vec3A, vec3B, vec3C){
        // Use Barycentric coordinates to get random points within the triangle

        // create vectors A to B and A to C
        var vec3AB = new THREE.Vector3(vec3A.x - vec3B.x,vec3A.y - vec3B.y,vec3A.z - vec3B.z),
            vec3AC = new THREE.Vector3(vec3A.x - vec3C.x,vec3A.y - vec3C.y,vec3A.z - vec3C.z);

        var R = Math.random(),
            S = Math.random();

        if((R + S) > 1){
            R = 1 - R;
            S = 1- S;
        }

        var randomPoint = new THREE.Vector3(vec3A.x, vec3A.y, vec3A.z),
            vec3ABpart = new THREE.Vector3(vec3AB.x,vec3AB.y,vec3AB.z),
            vec3ACpart = new THREE.Vector3(vec3AC.x,vec3AC.y,vec3AC.z);

        vec3ABpart.multiplyScalar(R);
        vec3ACpart.multiplyScalar(S);

        randomPoint.sub(vec3ABpart);
        randomPoint.sub(vec3ACpart);

        return randomPoint;
    }

 

