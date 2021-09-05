window.globals = {
  attack_style : "melee",
  helm : "",
  cape : "",
  necklace : "",
  ammunition : "",
  weapon : "",
  body : "",
  shield : "",
  legs : "",
  hands : "",
  feet : "",
  ring : "",
}

const select_combat_button = document.getElementById("combat-styles").children;
for( let i = 0; i < 3; i++ ) {
  const icon = select_combat_button[i];
  icon.addEventListener("click", function() {
    const value = icon.getAttribute("value");
    globals.attack_style = value;
    const dropdowns = document.getElementsByClassName("select-style");
    for(let j = 0; j < dropdowns.length; j++) {
      dropdowns[j].classList.add("select-hidden");
    }
    if(value == "melee") {
      select_combat_button[0].children[0].classList.add("selected");
      select_combat_button[1].children[0].classList.remove("selected");
      select_combat_button[2].children[0].classList.remove("selected");
      const dropdown = document.getElementsByClassName("select melee")[0];
      dropdown.classList.remove("select-hidden");
    } else if (value == "ranged") {
      select_combat_button[0].children[0].classList.remove("selected");
      select_combat_button[1].children[0].classList.add("selected");
      select_combat_button[2].children[0].classList.remove("selected");
      const dropdown = document.getElementsByClassName("select ranged")[0];
      dropdown.classList.remove("select-hidden");
    } else {
      select_combat_button[0].children[0].classList.remove("selected");
      select_combat_button[1].children[0].classList.remove("selected");
      select_combat_button[2].children[0].classList.add("selected");
      const dropdown = document.getElementsByClassName("select magic")[0];
      dropdown.classList.remove("select-hidden");
    }
  })
}

["helmet", "cape", "necklace", "ammunition", "weapon", "body", "shield", "legs", "hands", "feet", "ring"].forEach(name => {
  const select_name = `select-${name}`;
  const select = document.getElementById(select_name);
  const select_input = document.getElementById(`select-${name}-input`);
  const select_input_container = document.getElementById(`select-${name}-datalist-container`);
  const slot_equipment = equipment[name];
  const gear_list = Object.keys(slot_equipment);
  for( let i = 0; i < gear_list.length; i++ ) {
    const option = document.createElement("option");
    option.value = gear_list[i];
    // option.innerHTML = gear_list[i];
    select.appendChild(option);
  };
  const container_name = `select-${name}-container`;
  const container = document.getElementById(container_name);
  container.addEventListener("click", function() {
    const hide = document.getElementsByClassName("gear-label");
    for(let i = 0; i < hide.length; i++) {
      hide[i].classList.add("list-hidden");
    }
    select_input_container.classList.remove("list-hidden");
  })
})

document.body.addEventListener("mousedown", function(e) {
  let exit = true;
  let target = e.target;
  if(e.target.classList.contains("input-select") || e.target.classList.contains("gear-image-container")) {
    exit = false;
  }
  if(exit) {
    const hide = document.getElementsByClassName("gear-label");
    for(let i = 0; i < hide.length; i++) {
      hide[i].classList.add("list-hidden");
    }
  }
});

document.body.addEventListener("keyup", function(e) {
  if( e.code === "Enter" ) {
    const hide = document.getElementsByClassName("gear-label");
    for(let i = 0; i < hide.length; i++) {
      hide[i].classList.add("list-hidden");
    }
  }
})

const input_selects = document.getElementsByClassName("input-select");

for ( let i = 0; i < input_selects.length; i++ ) {
  const select = input_selects[i];
  select.addEventListener("change", function() {
    const hide = document.getElementsByClassName("gear-label");
    const equipment_piece = select.value;
    for(let i = 0; i < hide.length; i++) {
      hide[i].classList.add("list-hidden");
    };
    const slot = select.getAttribute("name");
    globals[slot] = select.value;
    const img_elt = document.getElementById(`${slot}-thumbnail`);
    const data = equipment[slot][equipment_piece];
    let img_src, wiki_url;
    if(data == undefined) {
      img_src = "none";
      wiki_src = "";
    } else {
      img_src = data.image_url;
      wiki_url = data.wiki_url;
    }
    
    img_elt.setAttribute("src", img_src);

  })
}