let sound = null;
const doc = id => document.getElementById(id);
const graph = id => [`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, id];
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  background: "purple",
  timer: 3*1000,
  confirmButtonColor: "#aa00ff",
  showCancelButton: false,
  timerProgressBar: true,
  didOpen (toast){
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

async function showResult(base, title, message, icon = "success", json = {}, result = () => {}) {
  icon = icon.toLowerCase() || icon;
  base.fire({
    title,
    icon,
    html: message,
    background: "purple",
    showCancelButton: base !== Toast,
    confirmButtonColor: "#aa00ff",
    confirmButtonText: "Okay",
    ...json
  }).then(result);
}

function playMusic(url, isalang, isLoop) {
  if (sound != null) {
    sound.stop();
    sound.unload();
    sound = null;
  }
  sound = new Howl({
    src: [url],
    loop: isLoop,
    format: ['mp3'],
    volume: 1,
    onend: () => {}
  });
  if (isalang){
  sound.play();
  }
}

function playShortAudio(url) {
  const s = new Howl({
    src: [url],
    loop: false,
    volume: 1,
    autoplay: true
  });
  s.play();
}
const
  botInfo = doc("botInfo"),
  devInfo = doc("devInfo");
async function add(classs, title, msg) {
  const container = document.createElement('div');
  const li = document.createElement('li');
  li.innerHTML = `${title}: ${msg}`;
  container.appendChild(li);
  classs.appendChild(container);
}

const pageImgs = doc("pageAdmins");
async function addImg(imgSrc, devName) {
  const container = document.createElement('div');
  container.classList.add("divAdmin");
  const img = document.createElement('img');
  const name = document.createElement('label');
  img.src = imgSrc[0];
  img.width = 30;
  img.height = 30;
  name.style.fontSize = "9px";
  name.style.marginLeft = "3px";
  name.innerHTML = devName;
  container.appendChild(img);
  container.appendChild(name);
  container.onclick = () => window.location.href = `https://www.facebook.com/profile.php?id=${imgSrc[1]}`
  pageImgs.appendChild(container);
}
async function runningAdd() {
  let txt = "";
  txt += "<li>Browser CodeName: " + navigator.appCodeName + "</li>";
  txt += "<li>Browser Name: " + navigator.appName + "</li>";
  txt += "<li>Cookies Enabled: " + navigator.cookieEnabled + "</li>";
  /*const ipData = await fetch("https://api.ipify.org/?format=json"),
  ipJson = await ipData.json();
  txt += "<li>IP Address: " + ipJson.ip + "</li>";*/
  txt += "<li>Browser Language: " + navigator.language + "</li>";
  txt += "<li>Browser Online: " + navigator.onLine + "</li>";
  txt += "<li>Platform: " + navigator.platform + "</li>";
  txt += "<li>User-agent: " + navigator.userAgent + "</li>";
  const text_el = document.querySelector("div#runningInfo"),
  text_dt = document.querySelector("div#runningDt"),
  arrBulan = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  text_el.innerHTML = txt;
  txt = null;
  setInterval(() => {
    const d = new Date(),
    jam = d.getHours().toString().padStart(2, 0),
    menit = d.getMinutes().toString().padStart(2, 0),
    detik = d.getSeconds().toString().padStart(2, 0);
    text_dt.innerHTML = "<li>Date: " + arrBulan[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear() + "</li>" + "<li>Time: " + jam + ":" + menit + ":" + detik + "</li>";
  }, 1 * 1000);
}

async function botAdd() {
  const info = (await axios.get("/json")).data;
  add(botInfo, "Bot Commands", info.commands.length);
  add(botInfo, "Bot Prefix", info.prefix);
  add(botInfo, "Server Uptime", info.uptime);
  add(botInfo, "Server CPU", info.server.cpu[0].model);
  add(botInfo, "Server Memory", info.server.memory);
}

async function music() {
  let muswitch = false;
  const file = "bgm",
  nameFile = "blue.mp3",
  mus = doc("playMusic"),
  mustore = localStorage.getItem(file),
  switchMusic = b => {
    playMusic(nameFile, b, true);
    mus.innerHTML = `${b ? "Stop" : "Play"} Music`;
  }
  mus.addEventListener("click", async () => {
    muswitch = !muswitch;
    switchMusic(muswitch);
    localStorage.setItem(file, muswitch ? "1" : "0");
    return;
  });
  muswitch = mustore === "1";
  switchMusic(muswitch);
}
addEventListener("DOMContentLoaded", async (event) => {
  doc("main").src = "favicon.png"
  doc("restartBot").onclick = () =>
  showResult(Swal, "Admin Access", "Please enter password to proceed.", "info", {
    input: "password",
    confirmButtonText: "Restart"
  }, async (result) => {
    try {
    if (result.isConfirmed){
    const restart = await axios.get("/restart", {
      params: {
        pass: result.value
      }
    });
    if (!restart) throw new Error();
    if (restart.data.error) throw new Error(restart.data.error);
    showResult(Toast, "", restart.data.status);
    }
    } catch (error){
      showResult(Toast, "", error.message || error, "error");
    }
  });
  music();
  runningAdd();
  botAdd();
  
  /*
  YOU ARE FEEL FREE
  TO MODIFY THE FILE!
  */
  
  // add developer info here
  await add(devInfo, "Name", "Kenneth Aceberos");
  await add(devInfo, "Age", "17 y/o");
  await add(devInfo, "Address", "Duero, Bohol");
  // add your page admins here
  await addImg(graph("100015801404865"), "Neth Aceberos");
  await addImg(graph("100029350902119"), "Wiegine S. Echavez");
  setTimeout(() => window.scrollTo({top: 0, behavior: "smooth"}), 500);
});