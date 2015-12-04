var fireParticles = [];
var smokeParticles = [];
var partColors = ['#eec82b','#d6961c','#a96232','#9a2511','#560000'];


//geometryFire = new THREE.SphereGeometry(750, 10, 10);
//materialFire = new THREE.MeshLambertMaterial( {color: 'black',wireframe: false} );
//meshFire = new THREE.Mesh(geometryFire, materialFire);
//scene.add(meshFire);

//meshFire.position.x = 4000;
//meshFire.position.y = -2400;

makeParticles();

function fireAnimate(){
  //meshFire.rotation.y += 0.02;
  updateParticles();
}

function makeParticles() {

  var particle, material, smoke,smokeMaterial;
  // Move from z position -1000 (far away)
  // to 1000 (where the camera is) and add a random particle at every pos.
  for ( var i= 0; i < 200; i+=1 ) {

    // we make a particle material and pass through the
    // colour and custom particle render function we defined.

    var fireTexture = THREE.ImageUtils.loadTexture( 'smokeparticle.png' );

    material = new THREE.SpriteMaterial( { color: partColors[0] , map: fireTexture} );
    // make the particle
    particle = new THREE.Particle(material);

    // give it a random x and y position between -750 and 750
    particle.position.x = 4000;
    particle.position.z = 0;
    particle.position.y = -2700;

    // add it to the scene
    scene.add( particle );

    // and to the array of particles.
    fireParticles.push(particle);
  }

  for ( var j= 0; j < 30; j+=1 ) {

    // we make a particle material and pass through the
    // colour and custom particle render function we defined.

    var smokeTexture = THREE.ImageUtils.loadTexture( 'smokeparticle.png' );

    smokeMaterial = new THREE.SpriteMaterial( { color: partColors[0] , map: smokeTexture} );
    // make the particle
    smoke = new THREE.Particle(smokeMaterial);

    smoke.material.color = new THREE.Color("#8f8f8f",0.5);
    smoke.position.x = 4000;
    smoke.position.z = 0;
    smoke.position.y = -700;

    smoke.scale.x = smoke.scale.y = 1000;

    // add it to the scene
    scene.add( smoke );

    // and to the array of particles.
    smokeParticles.push(smoke);
  }

}

function updateParticles() {

  // iterate through every particle
  for(var i=0; i<fireParticles.length; i++) {

    particle = fireParticles[i];

    //
    particle.position.y += Math.random()*40 + 40;


    if( particle.position.y < -1600 ){
      if( particle.position.x > 4005 ){
        particle.position.x += Math.random()*160-40;
      }
      else if(particle.position.x < 3995){
        particle.position.x -= Math.random()*160-40;
      }
      else{
        particle.position.x += Math.random()*10-5;
      }
      if( particle.position.z > 5 ){
        particle.position.z += Math.random()*160-40;
      }
      else if(particle.position.z < -5){
        particle.position.z -= Math.random()*160-40;
      }
      else{
        particle.position.z += Math.random()*10-5;
      }

    }
    else{
      if( particle.position.x > 4005 ){
        particle.position.x -= Math.random()*80-20;
      }
      else if(particle.position.x < 3995){
        particle.position.x += Math.random()*80-20;
      }
      else{
        particle.position.x += Math.random()*10-5;
      }
      if( particle.position.z > 5 ){
        particle.position.z -= Math.random()*80-20;
      }
      else if(particle.position.z < -5){
        particle.position.z += Math.random()*80-20;
      }
      else{
        particle.position.z += Math.random()*10-5;
      }
    }

    var pX = particle.position.x;
    var pZ = particle.position.z;
    var pY = particle.position.y;

    if( (pX < 3400 || pX > 4600) || (pZ < -600 || pZ > 600) || pY > -100 ){
      particle.material.color = new THREE.Color(partColors[4]);
      particle.scale.x = particle.scale.y = 30;
    }
    else if( (pX < 3450 || pX > 4550) || (pZ < -550 || pZ > 550) || pY > -200 ){
      particle.material.color = new THREE.Color(partColors[3]);
      particle.scale.x = particle.scale.y = 50;
    }
    else if( (pX < 3500 || pX > 4500) || (pZ < -500 || pZ > 500) ){
      particle.material.color = new THREE.Color(partColors[2]);
      particle.scale.x = particle.scale.y = 600;
    }
    else if( (pX < 3600 || pX > 4400) || (pZ < -400 || pZ > 400) ){
      particle.material.color = new THREE.Color(partColors[1]);
      particle.scale.x = particle.scale.y = 750;
    }
    else{
      particle.material.color = new THREE.Color(partColors[0]);
      particle.scale.x = particle.scale.y = 900;
    }


    var kill = Math.random();
    // if the particle is too close move it to the back
    if(particle.position.y > -500){
      if(kill < 0.2){
        particle.position.x = 4000;
        particle.position.z = 0;
        particle.position.y = -2700;
      }

    }

  }

  for(var j=0; j<smokeParticles.length; j++) {
    smoke = smokeParticles[j];
    smoke.scale.x = smoke.scale.y = smoke.position.y/2+700;
    smoke.position.y += 100;
    smoke.position.x += Math.random()*100-50;
    smoke.position.z += Math.random()*100-50;


    var kill = Math.random();
    if(smoke.position.y > 3000){
      if(kill < 0.2){
        smoke.position.x = 4000;
        smoke.position.z = 0;
        smoke.position.y = -700;
        smoke.scale.x = smoke.scale.y = 1;
      }
    }
  }



}


