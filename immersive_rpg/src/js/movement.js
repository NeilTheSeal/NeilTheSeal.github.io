function move_player() {
  const player = window.g.player;
  const coords = player.coords;
  const velocity = player.velocity;
  const gravity = 10;
  const dg = gravity / frameRate();

  coords.x += velocity.x;
  coords.y += velocity.y;
  coords.z += velocity.z;

  if ( player.coords.y < player.coords.ground ) {
    velocity.y += dg;
  }

  if ( player.coords.y >= player.coords.ground ) {
    velocity.y = 0;
    player.coords.y = player.coords.ground;
    player.isJumping = false;
  }

}

module.exports = move_player;