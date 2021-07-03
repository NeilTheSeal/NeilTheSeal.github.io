var t=-30;
var countDownDate = new Date("Jan 1, 2000 00:00:00").getTime();
var j;
var video1;
var video2;
var video3;
var video4;
var jazz;
var vidsContainer;
var mainButton;
var player1;
var player2;
var player3;
var player4;
let countdown;
let running = false;

var pic1;
var pic2;
var pic3;
var pic4;

var rot1 = 1;
var rot2 = 1;
var rot3 = 1;
var rot4 = 1;

var choice = 0;

document.addEventListener("DOMContentLoaded", function() {
    video1 = document.getElementById('vid1');
    video2 = document.getElementById('vid2');
    video3 = document.getElementById('vid3');
    video4 = document.getElementById('vid4');
    jazz = document.getElementById('jazz');
    player1 = document.getElementById('player1');
    player2 = document.getElementById('player2');
    player3 = document.getElementById('player3');
    player4 = document.getElementById('player4');
    vidsContainer = document.getElementById('vidsContainer');
    countdown = document.getElementById('countdown');
    video1.muted = true;
    video2.muted = true;
    video3.muted = true;
    video4.muted = true;
    video1.currentTime = (14*60 + 36);
    video2.currentTime = (17*60 + 56);
    video3.currentTime = (21*60 + 12);
    video4.currentTime = (24*60 + 39.5);
    vidsContainer.classList.add('mini');
  });

function beginZulrah() {
    clearInterval(j);
    if (running == false) {
    running = true;
    t=-30;
    j = setInterval(function() {   
        if (t < 0) {
            if (t % 10 == 0) {
                countdown.innerText = `${Math.round(-t/10)}`;
            }
        } else if (t == 0) {
            countdown.innerText = "GO!";
            video1.muted = true;
            video2.muted = true;
            video3.muted = true;
            video4.muted = true;
            video1.play();
            video2.play();
            video3.play();
            video4.play();}
        if ([180,298,410,652,792,919,1093,1315,1585,1740].includes(t)) {
            rot1=Math.min(11,rot1+1);
            $("#pic1").css("background-image", `url('media/rotations/1${rot1}.png')`);
            $("#islandOverlay").css("background-image", `url('media/islandPics/Tile${rot1}.png')`);
        }
        if ([176,309,417,592,831,972,1097,1318,1565,1743].includes(t)) {
            rot2=Math.min(11,rot2+1)
            $("#pic2").css("background-image", `url('media/rotations/2${rot2}.png')`);
        }
        if ([176,360,622,740,870,992,1150,1272,1498,1716].includes(t)) {
            rot3=Math.min(10,rot3+1)
            $("#pic3").css("background-image", `url('media/rotations/3${rot3}.png')`);
        }
        if ([183,406,557,742,911,1020,1233,1428,1563,1728,1910].includes(t)) {
            rot4=Math.min(12,rot4+1)
            $("#pic4").css("background-image", `url('media/rotations/4${rot4}.png')`);
        }
        switch(choice) {
            case 0:
                break;
            case 1:
                if(t < 245) {$("#tile1").css("z-index","2");}
                switch(t) {
                    case 245:
                        tileFlash(2);
                        break;
                    case 300:
                        prayerFlash("magic");
                        break;
                    case 405:
                        tileFlash(5);
                        prayerFlash("range");
                        break;
                    case 567:
                        prayerFlash("hide");
                        break;
                    case 755:
                        prayerFlash("magic");
                        break;
                    case 896:
                        tileFlash(3);
                        prayerFlash("range");
                        break;
                    case 1085:
                        prayerFlash("magic");
                        break;
                    case 1186:
                        tileFlash(4);
                        break;
                    case 1280:
                        prayerFlash("range");
                        break;
                    case 1308:
                        video1.muted = true;
                        jazz.currentTime = 16.9;
                        jazz.volume = 0.2;
                        jazz.play();
                        break;
                    case 1500:
                        jazz.pause();
                        video1.muted = false;
                        tileFlash(1);
                        prayerFlash("hide");
                        break;
                    case 1690:
                        tileFlash(2);
                        break;
                    case 1730:
                        video1.muted = true;
                        loopZulrah();
                        break;
                    default:
                        break;
                }
                break;
            case 2:
                if(t < 245) {$("#tile1").css("z-index","2");}
                switch(t) {
                    case 245:
                        tileFlash(2);
                        break;
                    case 296:
                        prayerFlash("magic");
                        break;
                    case 405:
                        prayerFlash("range");
                        tileFlash(5);
                        break;
                    case 585:
                        prayerFlash("magic");
                        break;
                    case 760:
                        prayerFlash("hide");
                        break;
                    case 956:
                        tileFlash(3);
                        prayerFlash("range");
                        break;
                    case 1097:
                        tileFlash(4);
                        prayerFlash("magic");
                        break;
                    case 1274:
                        prayerFlash("range");
                        break;
                    case 1320:
                        video2.muted = true;
                        jazz.currentTime = 16.9;
                        jazz.volume = 0.2;
                        jazz.play();
                        break;
                    case 1495:
                        jazz.pause();
                        video2.muted = false;
                        tileFlash(1);
                        prayerFlash("hide");
                        break;
                    case 1680:
                        tileFlash(2);
                        break;
                    case 1730:
                        video2.muted = true;
                        loopZulrah();
                        break;
                    default:
                        break;
                }
                break;
            case 3:
                if(t == 2000) {loopZulrah();}
                break;
            case 4:
                if(t == 2000) {loopZulrah();}
                break;
            default:
                break;
        }
        t++;
      }, 100);
    }
}

function logit() {
    console.log(t);
}

function loopZulrah() {
    $(".btn.custom").show();
    $(".pic.tiny").show();
    let add = 5;
    video1.muted = true;
    video2.muted = true;
    video3.muted = true;
    video4.muted = true;
    video1.currentTime = (14*60 + 36) + add;
    video2.currentTime = (17*60 + 56) + add;
    video3.currentTime = (21*60 + 12) + add;
    video4.currentTime = (24*60 + 39.5) + add;
    rot1=1;rot2=1;rot3=1;rot4=1;t=0;
    player1.style.display="block";player2.style.display = "block";player3.style.display = "block";player4.style.display = "block";
    if (vidsContainer.classList.contains('large')) {vidsContainer.classList.remove('large');}
    if (!vidsContainer.classList.contains('mini')) {vidsContainer.classList.add('mini');}
    $("#imageContainer").hide();   
    $("#pic1").css("background-image", `url('media/rotations/11.png')`);
    $("#pic2").css("background-image", `url('media/rotations/21.png')`);
    $("#pic3").css("background-image", `url('media/rotations/31.png')`);
    $("#pic4").css("background-image", `url('media/rotations/41.png')`);
    choice = 0;
    prayerFlash("hide");
    beginZulrah();
}

function resetZulrah() {
    running = false;
    $(".btn.custom").show();
    $(".pic.tiny").show();
    video1.pause();
    video2.pause();
    video3.pause();
    video4.pause();
    jazz.pause();
    video1.currentTime = (14*60 + 36);
    video2.currentTime = (17*60 + 56);
    video3.currentTime = (21*60 + 12);
    video4.currentTime = (24*60 + 39);
    clearInterval(j);
    countdown.innerText = "Waiting . . .";
    player1.style.display="block";player2.style.display = "block";player3.style.display = "block";player4.style.display = "block";
    if (vidsContainer.classList.contains('large')) {vidsContainer.classList.remove('large');}
    if (!vidsContainer.classList.contains('mini')) {vidsContainer.classList.add('mini');}
    $("#imageContainer").hide();
    prayerFlash("hide");
    $("#pic1").css("background-image", `url('media/rotations/11.png')`);
    $("#pic2").css("background-image", `url('media/rotations/21.png')`);
    $("#pic3").css("background-image", `url('media/rotations/31.png')`);
    $("#pic4").css("background-image", `url('media/rotations/41.png')`);
    t=-30;
}

function choose(v) {
    switch(v) {
        case 1:
            video1.muted = false;
            video2.pause();video3.pause();video4.pause();
            displayLarge();
            player1.style.display = "block";
            choice = 1;
            break;
        case 2:
            video2.muted = false;
            video1.pause();video3.pause();video4.pause();
            displayLarge();
            player2.style.display = "block";
            choice = 2;
            break;
        case 3:
            video3.muted = false;
            video1.pause();video2.pause();video4.pause();
            displayLarge();
            player3.style.display = "block";
            choice = 3;
            break;
        case 4:
            video4.muted = false;
            video1.pause();video2.pause();video3.pause();
            displayLarge();
            player4.style.display = "block";
            choice = 4;
            break;
    }
}

function displayLarge() {
    player1.style.display = "none";
    player2.style.display = "none";
    player3.style.display = "none";
    player4.style.display = "none";
    $(".pic.tiny").hide();
    $("#imageContainer").show();
    $(".btn.custom").hide();
    if (vidsContainer.classList.contains('mini')) {vidsContainer.classList.remove('mini');}
    if (!vidsContainer.classList.contains('large')) {vidsContainer.classList.add('large');}
}

function displayAs(n) {
    if(n==1){
    $(".appWrapper").css("grid-template-columns", "100%");}
    else {$(".appWrapper").css("grid-template-columns", "50% 50%");}
}

function tileFlash(n) {
    let i=1;
    for(i=1;i<7;i++){if(i != n){$(`#tile${i}`).css("z-index", "-1");}}
    $(`#tile${n}`).css("z-index", "2");
    $(`#tile${n}`).fadeTo(150, 0).fadeTo(150, 1).fadeTo(150, 0).fadeTo(150, 1).fadeTo(150, 0).fadeTo(150, 1).fadeTo(150, 0).fadeTo(150, 1);
}

function prayerFlash(prayer) {
    let p = prayer;
    if (typeof p == "string" && p == "magic") {
    $("#rangeOverlay").css("z-index", "-1");
    $("#magicOverlay").css("z-index", "2").fadeTo(150, 0.25).fadeTo(150, 1).fadeTo(150, 0.25).fadeTo(150, 1).fadeTo(150, 0.25).fadeTo(150, 1).fadeTo(150, 0.25).fadeTo(150, 1);
    }
    if (typeof p == "string" && p == "range") {
    $("#magicOverlay").css("z-index", "-1");
    $("#rangeOverlay").css("z-index", "2").fadeTo(150, 0.25).fadeTo(150, 1).fadeTo(150, 0.25).fadeTo(150, 1).fadeTo(150, 0.25).fadeTo(150, 1).fadeTo(150, 0.25).fadeTo(150, 1);
    }
    if (typeof p == "string" && p == "hide") {
    $("#rangeOverlay").css("z-index", "-1");
    $("#magicOverlay").css("z-index", "-1");
    }
}