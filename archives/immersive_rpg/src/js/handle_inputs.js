function handle_inputs() {
  const player = window.g.player;
  const theta = player.coords.player_theta;
  const dtheta = player.velocity.max_rotation_speed;
  let speed = player.velocity.max_velocity;
  if( keyIsPressed ) {

    let directions = [false, false, false, false]; // left, right, up, down

    if ( keyIsDown(16) ) { // shift to go super-speed
      speed *= 5;
    }

    if ( keyIsDown(32) ) { // space bar to jump
      player.velocity.z += player.jump_height;
      player.velocity.z = Math.max(player.velocity.z, player.jump_height);
    }

    if ( keyIsDown(87) ) { // W
      directions[2] = true
    }
    if ( keyIsDown(65) ) { // A
      directions[0] = true
    }
    if ( keyIsDown(83) ) { // S
      directions[3] = true
    }
    if ( keyIsDown(68) ) { // D
      directions[1] = true
    }

    if( directions[2] && !directions[3] ) { // forward movement
      player.velocity.x = Math.sin(theta) * speed;
      player.velocity.y = -1 * Math.cos(theta) * speed;
    }

    if( !directions[2] && directions[3] ) { // backwards movement
      player.velocity.x = -1 * Math.sin(theta) * speed;
      player.velocity.y = Math.cos(theta) * speed;
    }

    if( directions[0] && !directions[1] ) { // turn left
      player.coords.player_theta -= dtheta;
    }

    if( !directions[0] && directions[1] ) { // turn right
      player.coords.player_theta += dtheta;
    }

  } else {
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.isJumping = false;
  }
}

module.exports = handle_inputs;