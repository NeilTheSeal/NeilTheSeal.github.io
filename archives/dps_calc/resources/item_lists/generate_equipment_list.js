global.equipment = {};
require("./items-2h");
require("./items-ammo");
require("./items-body");
require("./items-cape");
require("./items-feet");
require("./items-head");
require("./items-legs");
require("./items-neck");
require("./items-ring");
require("./items-shield");
require("./items-weapon");
require("./items-hands");
const fs = require("fs");

const slots = Object.keys(equipment);
const equipment_new = {};

slots.forEach(slot_name => {
  const slot = equipment[slot_name];
  const items = Object.keys(slot);
  equipment_new[slot_name] = {}
  items.forEach((item_name, i) => {
    const item = slot[item_name];
    const name = item.name;
    const wiki_name = item.wiki_name;
    const image_data = item.icon;
    const wiki_url = item.wiki_url;
    const stab_atk = item.equipment.attack_stab;
    const slash_atk = item.equipment.attack_slash;
    const crush_atk = item.equipment.attack_crush;
    const magic_atk = item.equipment.attack_magic;
    const ranged_atk = item.equipment.attack_ranged;
    const stab_def = item.equipment.defence_stab;
    const slash_def = item.equipment.defence_slash;
    const crush_def = item.equipment.defence_crush;
    const magic_def = item.equipment.defence_magic;
    const ranged_def = item.equipment.defence_ranged;
    const melee_str = item.equipment.melee_strength;
    const ranged_str = item.equipment.ranged_strength;
    const magic_str = item.equipment.magic_damage;
    const prayer = item.equipment.prayer;
    const weapon_info = item.weapon;
    const equipable = item.equipable;

    if(equipable) {
      equipment_new[slot_name][name] = {
        "image_data": image_data,
        "wiki_url": wiki_url,
        "stab_atk": stab_atk,
        "slash_atk": slash_atk,
        "crush_atk": crush_atk,
        "magic_atk": magic_atk,
        "ranged_atk": ranged_atk,
        "stab_def": stab_def,
        "slash_def": slash_def,
        "crush_def": crush_def,
        "magic_def": magic_def,
        "ranged_def": ranged_def,
        "melee_str": melee_str,
        "ranged_str": ranged_str,
        "magic_str": magic_str,
        "prayer": prayer,
        "wiki_name": wiki_name,
        "weapon_info": weapon_info,
      }
    }
  });
});

const equipment_new_json = JSON.stringify(equipment_new);

fs.writeFile("./equipment_list_new.js", equipment_new_json, err => {
  if(err) {
    console.error(err);
    return;
  }
})

// "Adamant arrow (p)": {
//   "image_url": "https://oldschool.runescape.wiki/images/1/1d/Adamant_arrow%28p%29_1.png?6f7d3",
//   "wiki_url": "https://oldschool.runescape.wiki/w/Adamant_arrow (p)",
//   "stab_atk": "+0",
//   "slash_atk": "+0",
//   "crush_atk": "+0",
//   "magic_atk": "+0",
//   "ranged_atk": "+0",
//   "stab_def": "+0",
//   "slash_def": "+0",
//   "crush_def": "+0",
//   "magic_def": "+0",
//   "ranged_def": "+0",
//   "melee_str": "+0",
//   "ranged_str": "+31",
//   "magic_str": "+0",
//   "prayer": "+0",
// },