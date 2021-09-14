const fetch_stats_button = document.getElementById("fetch-stats");
const attack_input = document.getElementById("attack-level");
const strength_input = document.getElementById("strength-level");
const defense_input = document.getElementById("defense-level");
const hitpoints_input = document.getElementById("hitpoints-level");
const magic_input = document.getElementById("magic-level");
const ranged_input = document.getElementById("ranged-level");
const prayer_input = document.getElementById("prayer-level");

function fetch_stats() {

  let username = document.getElementById("display-name").value;
  if (username == "") return

  fetch_stats_button.innerHTML = "Fetching . . .";
  fetch_stats_button.setAttribute("disabled", "yes");
  username = encodeURIComponent(username);
  const URL = `https://neil-hendren-web-services.herokuapp.com/hiscores_request?username=${username}`;

  fetch(URL).then(resp => {
    return resp.json();
  }).then(json => {
    const data = json.data;
    const player_stats = {
      attack: 1,
      strength: 1,
      defense: 1,
      hitpoints: 10,
      ranged: 1,
      magic: 1,
      prayer: 1,
    };
    if (data !== "bad request" && data !== undefined && typeof (data) !== "undefined" && data !== null) {
      const player = JSON.parse(data);
      const stats = player.main.skills;
      player_stats.attack = Number(stats.attack.level);
      player_stats.strength = Number(stats.strength.level);
      player_stats.defense = Number(stats.defence.level);
      player_stats.hitpoints = Number(stats.hitpoints.level);
      player_stats.ranged = Number(stats.ranged.level);
      player_stats.magic = Number(stats.magic.level);
      player_stats.prayer = Number(stats.prayer.level);
    }

    fetch_stats_button.innerHTML = "Fetch Stats";
    fetch_stats_button.removeAttribute("disabled");

    attack_input.value = player_stats.attack;
    strength_input.value = player_stats.strength;
    defense_input.value = player_stats.defense;
    hitpoints_input.value = player_stats.hitpoints;
    magic_input.value = player_stats.magic;
    ranged_input.value = player_stats.ranged;
    prayer_input.value = player_stats.prayer;
  })
}

fetch_stats_button.addEventListener("click", fetch_stats);