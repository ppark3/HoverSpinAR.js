//const fetch = require("node-fetch");

var echoDB;
var API_KEY = 'ENTER API KEY HERE';
var db;
var srcModel;
var srcMarker;
var scale;


// Query echoAR
fetch('https://console.echoar.xyz/query?key=' + API_KEY)
.then((response) => response.json())
.then((json) => {
    echoDB = json; 
    API_KEY = echoDB.apiKey;
    db = Object.values(echoDB.db);
    parseDB();
    createMarker();
    createModel();
})
.catch((error) => {
  console.error(error);
});

function parseDB(){
    var entries = []
    for (let entry of db) {
        srcModel = "https://console.echoar.xyz/query?key=" + API_KEY + "&file=";
        srcMarker = "https://console.echoar.xyz/query?key=" + API_KEY + "&file=";
        var typeFile = entry['hologram'].filename.toLowerCase().split('.').pop();
        switch (entry['hologram'].type) {
            case 'VIDEO_HOLOGRAM':
            case 'IMAGE_HOLOGRAM':
            srcModel += entry['hologram'].storageID;
            break;
            case 'MODEL_HOLOGRAM':
            switch (typeFile) {
                case 'glb':
                srcModel += entry['hologram'].storageID;
                break;
                case 'gltf':
                case 'obj':
                case 'fbx':
                srcModel += entry['additionalData'].glbHologramStorageID;
                break;
            }
            break;
        }
        srcMarker += entry['additionalData'].qrARjsTargetStorageID;
        scale = entry['additionalData'].scale;
    
        var x = (entry['additionalData'].x) ? parseFloat(entry['additionalData'].x) : 0;
    }
}

function createMarker(){
    let tag = document.createElement("a-marker");
    tag.setAttribute("id", "mark");
    tag.setAttribute("preset", "custom");
    tag.setAttribute("type", "pattern");
    tag.setAttribute("url", srcMarker);
    let scene = document.querySelector("#scene");
    scene.appendChild(tag);
}

function createModel(){
    let tag = document.createElement("a-entity");
    tag.setAttribute("id", "model");
    tag.setAttribute("position", "0 0 0");
    if(scale){
        tag.setAttribute("scale", "" + scale + " " + scale + " " + scale);
        let hoverHeight = (scale * 2) + 0.5;
        tag.setAttribute("animation", "property: position; from: 0 0.5 0; to: 0 " + hoverHeight + " 0; loop: true; dur: 1000; dir: alternate; easing: easeInOutSine");
    }
    else{
        tag.setAttribute("scale", "0.5 0.5 0.5");
        tag.setAttribute("animation", "property: position; from: 0 0.5 0; to: 0 1.5 0; loop: true; dur: 1000; dir: alternate; easing: easeInOutSine");
    }
    tag.setAttribute("gltf-model", srcModel);
    tag.setAttribute("animation__2", "property: rotation; to: 0 360 0; loop: true; dur: 3000; easing: linear");
    let mark = document.querySelector("#mark");
    mark.appendChild(tag);
}