const fs = require("fs");
global.window = {};
require("./equipment");
require("./monsters");

const slots = Object.keys(window.equipment);
let monsters = Object.keys(window.monsters);

const new_equipment = {}
const new_monsters = {}

slots.forEach(slot => {
  new_equipment[slot] = {}
  const slot_data = window.equipment[slot];
  let weapons = Object.keys(slot_data);
  weapons = weapons.sort();
  weapons.forEach(weapon_name => {
    const weapon = slot_data[weapon_name];
    new_equipment[slot][weapon_name] = weapon;
  })
})

const equipment_output = "window.equipment = " + JSON.stringify(new_equipment);

fs.writeFile("./weapons_new.js", equipment_output, err => { console.log(err) });

monsters = monsters.sort();

monsters.forEach(monster_name => {
  new_monsters[monster_name] = window.monsters[monster_name]
})

const monsters_output = "window.monsters = " + JSON.stringify(new_monsters);

fs.writeFile("./monsters_new.js", monsters_output, err => { console.log(err) });