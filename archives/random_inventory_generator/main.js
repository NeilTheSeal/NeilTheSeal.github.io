window.app_settings = {
  number_to_generate: 28,
  minimum_value: 0,
  maximum_value: 2147483648,
  value_setting: "grand exchange",
  equippable_only: false,
  include_duplicates: true,
}

window.generated_items = [];

const number_slider = document.getElementById("select-number");
const number_display = document.getElementById("display-number");

number_slider.addEventListener("input", function() {
  const n = Number(Number.parseInt(number_slider.value));
  window.app_settings.number_to_generate = n;
  number_display.innerHTML = n;
})

const minimum_slider = document.getElementById("select-minimum");
const minimum_display = document.getElementById("display-minimum");

const maximum_slider = document.getElementById("select-maximum");
const maximum_display = document.getElementById("display-maximum");

minimum_slider.addEventListener("input", function() {
  const min_exp = Number(minimum_slider.value);
  const min_precise = Math.exp(21.5 * min_exp) - 1;
  const min_toPrec = min_precise.toPrecision(2);
  const min_truncd = Math.trunc(min_toPrec);
  window.app_settings.minimum_value = min_truncd;

  let number_text = "";

  if ( min_truncd < 10000 ) {
    number_text = `${min_truncd}`;
  } else if ( min_truncd < 1e6 ) {
    number_text = `${min_truncd/1e3}k`
  } else if ( min_truncd < 1e9 ) {
    number_text = `${min_truncd/1e6}m`
  } else {
    number_text = `${min_truncd/1e9}b`
  }

  minimum_display.innerHTML = number_text;

  if ( window.app_settings.maximum_value <= window.app_settings.minimum_value ) {
    window.app_settings.maximum_value = Math.max(window.app_settings.minimum_value, 1);
    maximum_display.innerHTML = number_text == "0" ? "1" : number_text;
    maximum_slider.value = Math.log(window.app_settings.minimum_value) / 21.5;
  }
});

maximum_slider.addEventListener("input", function() {
  const max_exp = Number(maximum_slider.value);
  let max_precise = Math.exp(21.5 * max_exp) - 1;
  max_precise = Math.max(window.app_settings.minimum_value, max_precise);
  const max_toPrec = max_precise.toPrecision(2);
  const max_truncd = Math.trunc(max_toPrec);
  window.app_settings.maximum_value = max_truncd;

  let number_text = "";

  if ( max_truncd < 10000 ) {
    number_text = `${max_truncd}`;
  } else if ( max_truncd < 1e6 ) {
    number_text = `${max_truncd/1e3}k`
  } else if ( max_truncd < 1e9 ) {
    number_text = `${max_truncd/1e6}m`
  } else {
    number_text = `${max_truncd/1e9}b`
  }

  maximum_display.innerHTML = number_text;
});

const select_value_type = document.getElementsByName("select-value");

for (let i = 0; i < select_value_type.length; i++) {
  select_value_type[i].addEventListener('change', function() {
    if ( select_value_type[0].checked ) {
      window.app_settings.value_setting = "grand exchange";
    } else {
      window.app_settings.value_setting = "high alchemy";
    }
  });
}

const equippable_only = document.getElementById("equippable_only");

equippable_only.addEventListener("change", function() {
  if ( equippable_only.checked ) {
    window.app_settings.equippable_only = true
  } else {
    window.app_settings.equippable_only = false
  }
});

const allow_duplicates = document.getElementById("duplicates_allowed");

allow_duplicates.addEventListener("change", function() {
  if ( allow_duplicates.checked ) {
    window.app_settings.include_duplicates = true
  } else {
    window.app_settings.include_duplicates = false
  }
});

const items_wrapper = document.getElementById("items-wrapper");

for ( let i = 0; i < 28; i++ ) {
  const img = document.createElement("img");
  img.id = `item-${i + 1}`;
  img.classList.add("item-img");
  img.src = "";

  img.addEventListener("mouseover", function(ev) {
    try {
      const tooltipX = img.getBoundingClientRect().left;
      const tooltipY = img.getBoundingClientRect().top;
      const text = img.getAttribute("tooltip-text");
      const tt_elt = document.getElementById("tooltip");
      
      tt_elt.innerHTML = text;
      tt_elt.style.display = "block";
      tt_elt.style.left = `${tooltipX + 30}px`;
      tt_elt.style.top = `${tooltipY - 40}px`;
    } catch(e) {

    }
  });

  img.addEventListener("mouseleave", function() {
    try {
      const tt_elt = document.getElementById("tooltip");
      tt_elt.style.display = "none";
    } catch(e) {

    }
  });

  const anchor = document.createElement("a");
  anchor.classList.add("img-container");
  anchor.setAttribute("target", "_blank");
  anchor.appendChild(img);

  items_wrapper.appendChild(anchor);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const generate_button = document.getElementById("generate");

generate_button.addEventListener("click", function() {

  const img_elts = document.getElementsByClassName("item-img");
  for ( let i = 0; i < img_elts.length; i++ ) {
    img_elts[i].style.display = "none";
  }

  window.generated_items = [];
  const possible_items = [];
  const all_item_names = Object.keys(window.items_list);

  const items_list = document.getElementById("items-list");
  items_list.innerHTML = "";

  for ( let i = 0; i < all_item_names.length; i++ ) {
    const item = window.items_list[all_item_names[i]];
    let item_value;
    if ( window.app_settings.value_setting == "high alchemy" ) {
      item_value = item.ha_value;
    } else {
      item_value = item.ge_value;
    }
    if ( item_value >= window.app_settings.minimum_value && item_value <= window.app_settings.maximum_value ) {
      if ( window.app_settings.equippable_only ) {
        if ( item.equippable ) { possible_items.push( item ) }
      } else {
        possible_items.push(item);
      }
    }
  }
  
  if ( window.app_settings.include_duplicates ) {
    for ( let i = 0; i < window.app_settings.number_to_generate; i++ ) {
      const index = Math.round( Math.random() * possible_items.length );
      const item = possible_items[index];
      window.generated_items.push(item);
    }
  } else {
    const shuffled_array = shuffle(possible_items);
    const number_available = Math.min(window.app_settings.number_to_generate, shuffled_array.length);
    for ( let i = 0; i < number_available; i++ ) {
      const item = shuffled_array[i];
      window.generated_items.push(item);
    }
  }

  for ( let i = 0; i < window.generated_items.length; i++ ) {
    try {
      const item = generated_items[i];
      const item_number = i + 1;
      const img_elt = document.getElementById(`item-${item_number}`);
      img_elt.setAttribute("src", item.img_url);
      img_elt.setAttribute("tooltip-text", `<b>${item.name}</b> <br> <div style=\"margin-top:5px;margin-bottom:0px;\">G.E. value: ${item.ge_value} <br> H.A. value: ${item.ha_value}</div> <div style=\"margin-top:5px;\">Click to view on Wiki</div>`);

      const parent = img_elt.parentElement;
      parent.setAttribute("href", `${item.url}`);

      console.log(img_elt);
      items_list.innerHTML += `${i+1}. ${item.name}<br>`;
    } catch(e) {

    }
  }

  for ( let i = 0; i < window.generated_items.length; i++ ) {
    try {
      const item_number = i + 1;
      const img_elt = document.getElementById(`item-${item_number}`);
      window.setTimeout(function() { img_elt.style.display = "block" }, 500);
    } catch(e) {
      
    }
  }

});