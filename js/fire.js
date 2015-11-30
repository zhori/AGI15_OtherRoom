fireParticles = [];

geometryFire = new THREE.SphereGeometry(750, 10, 10);
materialFire = new THREE.MeshLambertMaterial( {color: 'black',wireframe: false} );
meshFire = new THREE.Mesh(geometryFire, materialFire);
scene.add(meshFire);

meshFire.position.x = 4000;
meshFire.position.y = -2000;

makeParticles();

function fireAnimate(){
  meshFire.rotation.y += 0.02;
  updateParticles();
}

function makeParticles() {

				var particle, material;
				// we're gonna move from z position -1000 (far away)
				// to 1000 (where the camera is) and add a random particle at every pos.
				for ( var ypos= -1800; ypos < 0; ypos+=1 ) {

					// we make a particle material and pass through the
					// colour and custom particle render function we defined.
          var partColors = ['#ffa500','#e59400','#cc8400','#b27300','#996300','#7f5200','#664200','#4c3100','#332100','#191000'];
          var rC = Math.floor(Math.random() * 10);

					material = new THREE.SpriteMaterial( { color: partColors[rC] } );
					// make the particle
					particle = new THREE.Particle(material);

					// give it a random x and y position between -750 and 750
					particle.position.x = Math.floor(Math.random() * 1500 - 750);
					particle.position.z = Math.floor(Math.random() * 1500 - 750);
          particle.position.x += 4000;

					// set its z position
					particle.position.y = ypos;

					// scale it up a bit
					particle.scale.x = particle.scale.y = 40;

					// add it to the scene
					scene.add( particle );

					// and to the array of particles.
					fireParticles.push(particle);
				}

			}

function updateParticles() {

			// iterate through every particle
			for(var i=0; i<fireParticles.length; i++) {

					particle = fireParticles[i];

					// and move it forward dependent on the mouseY position.
					particle.position.y += 10 + meter.volume * 100;

          if( particle.position.x > 0 ){
            particle.position.x -= 2;
          }
          else if(particle.position.x < 0){
            particle.position.x += 2;
          }
         else{
            particle.position.x = (Math.floor(Math.random() * 1500 - 750))+4000;
					  particle.position.z = Math.floor(Math.random() * 1500 - 750);
            //particle.position.y-=1000;
          }

          if( particle.position.z > 0 ){
            particle.position.z -= 2;
          }
          else if(particle.position.z < 0){
            particle.position.z += 2;
          }
          else{
            particle.position.x = (Math.floor(Math.random() * 1500 - 750))+4000;
					  particle.position.z = Math.floor(Math.random() * 1500 - 750);
            //particle.position.y-=1000;
          }

					// if the particle is too close move it to the back
					if(particle.position.y > -1000){
            var kill = Math.random();
            if(kill < 0.05){
              particle.position.x = (Math.floor(Math.random() * 1500 - 750))+4000;
					    particle.position.z = Math.floor(Math.random() * 1500 - 750);
              particle.position.y -= 1000;
            }

          }


			}
}


