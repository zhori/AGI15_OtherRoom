       	geometryFire = new THREE.SphereGeometry(600, 10, 10);
        materialFire = new THREE.MeshLambertMaterial( {color: 'orange',wireframe:true} );

        meshFire = new THREE.Mesh(geometryFire, materialFire);
        scene.add(meshFire);
