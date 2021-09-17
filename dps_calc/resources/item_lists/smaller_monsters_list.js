require("./monsters-list.js");
const fs = require('fs');

let new_monsters_list = {}

const monster_names = Object.keys(monsters);

for(let i = 0; i < monster_names.length; i++) {
  const m = monsters[monster_names[i]];
  new_monsters_list[`${m.name}`] = {
    "wiki_url": m.wiki_url,
    "attack_level": m.attack_level,
    "strength_level": m.strength_level,
    "defence_level": m.defence_level,
    "magic_level": m.magic_level,
    "ranged_level": m.ranged_level,
    "attack_bonus": m.attack_bonus,
    "strength_bonus": m.strength_bonus,
    "attack_magic": m.attack_magic,
    "magic_bonus": m.magic_bonus,
    "attack_ranged": m.attack_ranged,
    "ranged_bonus": m.ranged_bonus,
    "defence_stab": m.defence_stab,
    "defence_slash": m.defence_slash,
    "defence_crush": m.defence_crush,
    "defence_magic": m.defence_magic,
    "defence_ranged": m.defence_range,
    "combat_level": m.combat_level,
    "hitpoints": m.hitpoints,
    "max_hit": m.max_hit,
    "attack_type": m.attack_type,
    "attack_speed": m.attack_speed,
  };
}

let output = JSON.stringify(new_monsters_list);

fs.writeFile("./smaller_monsters_file.js", output, err => { console.log(err) });