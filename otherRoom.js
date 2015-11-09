var scene, camera, renderer;
    var geometry, material, mesh;

    init();
    animate();

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
        camera.position.z = 100;

        // load the cube textures
        var urlPrefix   = "Images/";
        var urls = [ urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
            urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
            urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];
        var textureCube = THREE.ImageUtils.loadTextureCube( urls );

        // init the cube shadder
        var shader  = THREE.ShaderLib["cube"];
        var uniforms    = THREE.UniformsUtils.clone( shader.uniforms );
        uniforms['tCube'].texture= textureCube;
        var material1 = new THREE.ShaderMaterial({
            fragmentShader  : shader.fragmentShader,
            vertexShader    : shader.vertexShader,
            uniforms    : uniforms
        });

        var material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );

        //geometry = new THREE.BoxGeometry( 40, 40, 40 );
        geometry = new THREE.CubeGeometry( 100000, 100000, 100000, 1, 1, 1, null, true )
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true} );


        skyboxMesh  = new THREE.Mesh( geometry, material2 );
        skyboxMesh.material.side = THREE.BackSide;
        scene.add( skyboxMesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.render( scene, camera );

        document.body.appendChild( renderer.domElement );


    }

    function animate() {

        requestAnimationFrame( animate );

        //skyboxMesh.rotation.x += 0.01;
        //skyboxMesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    }