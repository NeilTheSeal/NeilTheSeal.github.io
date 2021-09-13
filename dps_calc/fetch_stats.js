const fetch_stats_button = document.getElementById("fetch-stats");

const uri = encodeURIComponent();

function fetch_stats() {
  let username = document.getElementById("display-name").value;
  if(username == "") return
  username = encodeURIComponent(username);
  const URL = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${username}`;

  var request = new Request(URL);

  fetch(request).then(function(response) {
      // Convert to JSON
      return response.json();
  }).then(function(j) {
      // Yay, `j` is a JavaScript object
      console.log(JSON.stringify(j));
  }).catch(function(error) {
      console.log('Request failed', error)
  });
}

fetch_stats_button.addEventListener("click", fetch_stats);
