const cards = document.getElementsByClassName("card");

for (let i = 0; i < cards.length; i++) {
  const destination = cards[i].getAttribute("target-page");
  cards[i].addEventListener("click", function () {
    window.location.href = destination;
  });
}
