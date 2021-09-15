window.globals = {
  attack_style: "melee",
  helm: {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  },
  cape: {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  },
  necklace: {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  },
  ammunition: {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  },
  weapon: {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  },
  body: {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  },
  shield: {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  },
  legs: {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  },
  hands: {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  },
  feet: {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  },
  ring: {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  },
  bonuses : {
    slash_atk: 0,
    stab_atk: 0,
    crush_atk: 0,
    ranged_atk: 0,
    magic_atk: 0,
    melee_str: 0,
    ranged_str: 0,
    magic_str: 0,
    slash_def: 0,
    stab_def: 0,
    crush_def: 0,
    ranged_def: 0,
    magic_def: 0,
    prayer: 0,
  }
}

const select_combat_button = document.getElementById("combat-styles").children;
for (let i = 0; i < 3; i++) {
  const icon = select_combat_button[i];
  icon.addEventListener("click", function () {
    const value = icon.getAttribute("value");
    globals.attack_style = value;
    const dropdowns = document.getElementsByClassName("select-style");
    for (let j = 0; j < dropdowns.length; j++) {
      dropdowns[j].classList.add("select-hidden");
    }
    if (value == "melee") {
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

["helm", "cape", "necklace", "ammunition", "weapon", "body", "shield", "legs", "hands", "feet", "ring"].forEach(name => {
  const select_name = `select-${name}`;
  const select = document.getElementById(select_name);
  const select_input = document.getElementById(`select-${name}-input`);
  select_input.value = "";
  const select_input_container = document.getElementById(`select-${name}-datalist-container`);
  const slot_equipment = equipment[name];
  const gear_list = Object.keys(slot_equipment);
  for (let i = 0; i < gear_list.length; i++) {
    const option = document.createElement("option");
    option.value = gear_list[i];
    select.appendChild(option);
  };
  if (name == "weapon") {
    const two_hand_gear_list = Object.keys(equipment.two_hand);
    for (let i = 0; i < gear_list.length; i++) {
      const option = document.createElement("option");
      option.value = two_hand_gear_list[i];
      select.appendChild(option);
    };
  }
  const container_name = `select-${name}-container`;
  const container = document.getElementById(container_name);
  container.addEventListener("click", function () {
    const hide = document.getElementsByClassName("gear-label");
    for (let i = 0; i < hide.length; i++) {
      hide[i].classList.add("list-hidden");
    }
    select_input_container.classList.remove("list-hidden");
  })
})

document.body.addEventListener("mousedown", function (e) {
  let exit = true;
  let target = e.target;
  if (e.target.classList.contains("input-select") || e.target.classList.contains("gear-image-container")) {
    exit = false;
  }
  if (exit) {
    const hide = document.getElementsByClassName("gear-label");
    for (let i = 0; i < hide.length; i++) {
      hide[i].classList.add("list-hidden");
    }
  }
});

const input_selects = document.getElementsByClassName("input-select");

for (let i = 0; i < input_selects.length; i++) {
  const select = input_selects[i];
  select.addEventListener("keyup", function (e) {
    if (e.code === "Enter") {
      const hide = document.getElementsByClassName("gear-label");
      for (let i = 0; i < hide.length; i++) {
        hide[i].classList.add("list-hidden");
      }
    }
  })
  select.addEventListener("change", function () {
    const hide = document.getElementsByClassName("gear-label");
    const equipment_piece = select.value;
    for (let i = 0; i < hide.length; i++) {
      hide[i].classList.add("list-hidden");
    };
    const slot = select.getAttribute("name");
    const img_elt = document.getElementById(`${slot}-thumbnail`);
    const default_stats = {
      slash_atk: 0,
      stab_atk: 0,
      crush_atk: 0,
      ranged_atk: 0,
      magic_atk: 0,
      melee_str: 0,
      ranged_str: 0,
      magic_str: 0,
      slash_def: 0,
      stab_def: 0,
      crush_def: 0,
      ranged_def: 0,
      magic_def: 0,
      prayer: 0,
    }
    const data = equipment[slot][equipment_piece] || equipment["two_hand"][equipment_piece] || default_stats;
    let img_src, wiki_url;
    if (data == undefined || data === default_stats) {
      img_src = "none";
      wiki_src = "";
    } else {
      img_src = data.image_url;
      wiki_url = data.wiki_url;
    }

    if(Object.keys(equipment["two_hand"]).includes(equipment_piece)) {
      const shield_input = document.getElementById("select-shield-input");
      shield_input.value = "";
      let evt = new CustomEvent('change');
      shield_input.dispatchEvent(evt);
    }

    img_elt.setAttribute("src", img_src);

    const bonuses = [
      "slash_atk",
      "stab_atk",
      "crush_atk",
      "ranged_atk",
      "magic_atk",
      "melee_str",
      "ranged_str",
      "magic_str",
      "slash_def",
      "stab_def",
      "crush_def",
      "ranged_def",
      "magic_def",
      "prayer",
    ];
    
    bonuses.forEach(bonus => {
      globals[slot][bonus] = Number(data[bonus]) || 0;
    })

    updateGearStatsText();
  })
  select.addEventListener("input", function (e) {
    if (e.inputType === "insertReplacementText") {
      let evt = new CustomEvent('change');
      select.dispatchEvent(evt);
    }
  })
}

document.getElementById("display-name").addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    fetch_stats()
  }
})

function updateGearStatsText() {

  const slots = [
    "helm",
    "cape",
    "necklace",
    "ammunition",
    "weapon",
    "body",
    "shield",
    "legs",
    "hands",
    "feet",
    "ring"
  ]

  const bonuses = [
    "slash_atk",
    "stab_atk",
    "crush_atk",
    "ranged_atk",
    "magic_atk",
    "melee_str",
    "ranged_str",
    "magic_str",
    "slash_def",
    "stab_def",
    "crush_def",
    "ranged_def",
    "magic_def",
    "prayer",
  ];

  const ids = [
    "slash-atk-value",
    "stab-atk-value",
    "crush-atk-value",
    "ranged-atk-value",
    "magic-atk-value",
    "melee-str-value",
    "ranged-str-value",
    "magic-str-value",
    "slash-def-value",
    "stab-def-value",
    "crush-def-value",
    "ranged-def-value",
    "magic-def-value",
    "prayer-value",
  ];

  bonuses.forEach((bonus, i) => {
    let value = 0;
    slots.forEach(slot => {
      value += Number(globals[slot][bonus]);
    })
    globals.bonuses[bonus] = value;
    let sign = value >= 0 ? "+" : "";
    value = sign + String(value);
    if(bonus === "magic_str") {value += "%"}
    document.getElementById(ids[i]).innerHTML = value;
  })

}