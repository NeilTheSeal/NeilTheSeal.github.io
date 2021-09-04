window.globals = {
  attack_style : "melee",
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
    console.log(select_input_container);
    select_input_container.classList.remove("list-hidden");
  })
})

document.body.addEventListener("click", function(e) {
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
  console.log(e.keyCode);
  if( e.keyCode === 13 ) {
    const hide = document.getElementsByClassName("gear-label");
    for(let i = 0; i < hide.length; i++) {
      hide[i].classList.add("list-hidden");
    }
  }
})