function move_player() {
  const player = window.g.player;
  const coords = player.coords;
  const velocity = player.velocity;
  const gravity = 15;
  const dg = gravity / frameRate();

  coords.x += velocity.x;
  coords.y += velocity.y;
  coords.z += velocity.z;

  if ( player.coords.z > player.coords.ground ) {
    velocity.z += -1 * dg;
    velocity.z = constrain(velocity.z, -1 * gravity, 1e9);
  }

  if ( player.coords.z <= player.coords.ground ) {
    velocity.z = 0;
    player.coords.z = player.coords.ground;
    player.isJumping = false;
  }

}

module.exports = move_player;