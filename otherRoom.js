var scene, camera, renderer;
    var geometry, material, mesh;

    init();
    //animate();

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
        //camera.position.z = 1000;

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
        var material = new THREE.ShaderMaterial({
            fragmentShader  : shader.fragmentShader,
            vertexShader    : shader.vertexShader,
            uniforms    : uniforms
        });

        //geometry = new THREE.BoxGeometry( 400, 400, 400 );
        geometry = new THREE.CubeGeometry( 100000, 100000, 100000, 1, 1, 1, null, true )
        //material = new THREE.MeshBasicMaterial( { color: 0xff0000} );

        skyboxMesh  = new THREE.Mesh( geometry, material );
        scene.add( skyboxMesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.render( scene, camera );

        document.body.appendChild( renderer.domElement );


    }

    function animate() {

        requestAnimationFrame( animate );

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    }