window.world = {
  current_chunk : [0, 0],
  visible_chunks : [],
  chunk_size : 1400,
  chunks : {},
  terrain_resolution : 200,
  terrain_noise_height : 2500,
  noise_resolution : 0.00025,
  generate_chunks : null,
  display_chunks : null,
}

world.coordinate_to_noise = function(x, y) {
  const mapped_x = x * world.noise_resolution;
  const mapped_y = y * world.noise_resolution;
  const n = noise(mapped_x, mapped_y);
  return map(n, 0, 1, 0, world.terrain_noise_height);
}

world.generate_chunks = function() {
  world.get_current_chunk();
  world.visible_chunks.forEach(chunk_name => {
    if( typeof ( world.chunks[chunk_name] ) !== "object" ) {
      world.chunks[chunk_name] = {
        chunk : [Number(chunk_name.split("&")[0]), Number(chunk_name.split("&")[1])],
        coordinates : []
      };
      const chunk = world.chunks[chunk_name];
      const min_x_coord = chunk.chunk[0] * world.chunk_size;
      const max_x_coord = (chunk.chunk[0] + 1) * world.chunk_size;
      const min_y_coord = chunk.chunk[1] * world.chunk_size;
      const max_y_coord = (chunk.chunk[1] + 1) * world.chunk_size;
      const interval = world.terrain_resolution;
      let i = 0;
      for( let x = min_x_coord; x <= max_x_coord; x += world.terrain_resolution ) {
        chunk.coordinates.push([]);
        for( let y = min_y_coord; y <= max_y_coord; y += world.terrain_resolution ) {
          let dxy = world.terrain_resolution;
          
          chunk.coordinates[i].push([x, y, world.coordinate_to_noise(x, y)]);
          chunk.coordinates[i].push([x + dxy, y, world.coordinate_to_noise(x + dxy, y)]);
          chunk.coordinates[i].push([x, y + dxy, world.coordinate_to_noise(x, y + dxy)]);
          chunk.coordinates[i].push([x + dxy, y + dxy, world.coordinate_to_noise(x + dxy, y + dxy)]);
        }
        i++;
      }
    }
  })
}

world.display_chunks = function() {
  const visible_chunks = world.visible_chunks;
  for(let i = 0; i < visible_chunks.length; i++) {
    const chunk_name = visible_chunks[i];
    const chunk = world.chunks[chunk_name];
    const coordinates = chunk.coordinates;
 
    for(let j = 0; j < coordinates.length; j++) {
      const list = coordinates[j];
      if(typeof(list) !== "undefined") {
        push();

        beginShape(TRIANGLE_STRIP);
      
        for(let k = 0; k < list.length; k++) {
          let point = list[k];
          vertex(point[0], point[1], point[2]);
        }

        endShape();
        pop();
      }
    }
  }
}

world.get_current_z = function() {

}

world.get_current_chunk = function() {
    const coords = window.g.player.coords;
    let x = coords.x;
    let y = coords.y;
    let x_chunk = Math.round( ( x - x % world.chunk_size ) / world.chunk_size );
    let y_chunk = Math.round( ( y - y % world.chunk_size ) / world.chunk_size );
    world.current_chunk = [x_chunk, y_chunk];
    world.visible_chunks = [];
    for(let i = world.current_chunk[0] - 1; i <= world.current_chunk[0] + 1; i++) {
      for(let j = world.current_chunk[1] - 1; j <= world.current_chunk[1] + 1; j++) {
        world.visible_chunks.push(`${i}&${j}`);
      }
    }
    window.g.player.coords.ground = world.coordinate_to_noise(window.g.player.coords.x, window.g.player.coords.y ) + 10;
    return world.current_chunk;
}

const display_terrain = function() { 

  world.generate_chunks();
  world.display_chunks();

}

module.exports = { display_terrain }