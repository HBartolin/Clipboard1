'use strict'

window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')

const clipboard = require('electron-clipboard-extended')
 
var clipboard_=clipboard
.on('text-changed', () => {
    let currentText = clipboard.readText();

    updateCliboard(currentText);
})
/* .on('image-changed', () => {
    let currentIMage = clipboard.readImage();
    console.log(currentIMage);
    updateCliboard(currentIMage);
}) */;

clipboard_.startWatching();

//var c1=updateCliboard("Cras justo odio");
//c1;
//var c2=updateCliboard("Bddd");
//c2;

function updateCliboard(trenutniClip) {
    let historyClipboard_=document.getElementById('historyClipboard');
    
    for (const li of historyClipboard_.getElementsByTagName("li")) {
        if(trenutniClip==li.textContent) {
            historyClipboard_.removeChild(li);
        }
    }

    var textnode = document.createTextNode(trenutniClip);

    var node = document.createElement("LI");
    node.className="list-group-item list-group-item-action py-0 text-nowrap";
    node.appendChild(textnode);
    node.addEventListener("click", function() { 
        oznaceniClipboard(trenutniClip) 
    });

    historyClipboard_.insertBefore(node, historyClipboard_.firstChild); 

    while(historyClipboard_.getElementsByTagName("li").length>50) {
        historyClipboard_.removeChild(historyClipboard_.childNodes[historyClipboard_.getElementsByTagName("li").length-1]);
    }
}

function oznaceniClipboard(tekst) {
    console.log("oznaceniClipboard_: " + tekst);
    clipboard.writeText(tekst);
}
