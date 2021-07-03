var selectedCreature;

var creatureList = fetch('../resources/aideddCreatures.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    creatureList = JSON.parse(JSON.stringify(myJson));
    $(document).ready(function(){

      $("#cTable").DataTable({
        data: creatureList,
        columns: [
          { data: 'Name' },
          { data: 'Size' },
          { data: 'AC' },
          { data: 'Dex' },
          { data: 'CR' }
        ],
        select: 'single',
        
        "scrollY": "50vh",
        "scrollCollapse": true,
        "paging": false
        });

      let cTable = $('#cTable').DataTable();
      $('#cTable tbody').on( 'click', 'tr', function () {
        selectedCreature = cTable.row( this ).data();
        frame();
      } );
      cTable.row( 0 ).select();
      selectedCreature = cTable.row( 0 ).data();

      $('#detailsModal').on('shown.bs.modal', function () {
        $('#deets').trigger('focus')
      });

      $('#loadingScreen').hide();
      $('#mainApp').show();
    });
  });

function frame() {
  $('#iframe').attr('src', `https://www.aidedd.org/dnd/monstres.php?vo=${selectedCreature["Value"]}`);
  let w = $(window).width();
  let divw = w - 20;
  let scale = 1;
  let Xshift = 0;
  let Yshift = 0;
  if(w < 576) {
    scale = divw / 520;
    Xshift = (520 - scale * 520) / 2 - 1;
    Yshift = (1000 - scale * 1000) / 2 - 1;
    $("iframe").css("width", "520px");
    $("iframe").css("transform", `translateX(${-Xshift}px) translateY(${-Yshift}px) scale(${scale}, ${scale})`);
  } else if (w < 992) {
    scale = 0.95;
    $("iframe").css("transform", `scale(${scale}, ${scale}) translateX(${-12}px) translateY(${-18}px)`);
  } else if (w >= 992) {
    scale = 0.98;
    $("iframe").css("transform", `scale(${scale}, ${scale}) translateX(${0}px) translateY(${0}px)`);
    $("iframe").css("width", "100%");
  }
}