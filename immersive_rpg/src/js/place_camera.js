function place_camera() {
  const player_object = window.g.player;
  const player_coords = player_object.coords;
  const cam = player_object.camera;

  const cx = player_coords.x;
  const cy = player_coords.y;
  const cz = player_coords.z;

  const player_theta = player_coords.player_theta;
  const camera_theta = player_object.camera.camera_theta;

  cam.centerX = cx;
  cam.centerY = cy - 50;
  cam.centerZ = cz;

  const distance_behind = 350;
  const camera_height = 120;

  cam.x = player_coords.x + Math.sin(camera_theta) * distance_behind;
  cam.y = player_coords.y - camera_height;
  cam.z = player_coords.z - Math.cos(camera_theta) * distance_behind;
  
  cam.upX = 0;
  cam.upY = 1;
  cam.upZ = 0;

  camera(
    cam.x,
    cam.y,
    cam.z,
    cam.centerX,
    cam.centerY,
    cam.centerZ,
    cam.upX,
    cam.upY,
    cam.upZ
  )

  let current_delta = camera_theta - player_theta;
  let target_delta = 19 * current_delta / 20;
  if(target_delta < -1 * Math.PI / 4) { target_delta = -1 * Math.PI / 4 }
  if(target_delta > Math.PI / 4 )     { target_delta = Math.PI / 4 }
  player_object.camera.camera_theta = player_coords.player_theta + target_delta;

}

module.exports = place_camera;