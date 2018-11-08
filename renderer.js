'use strict'


window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')

const clipboard = require('electron-clipboard-extended')
 
clipboard
.on('text-changed', () => {
    let currentText = clipboard.readText();
    console.log(currentText);
    updateCliboard(currentText);
})
/* .on('image-changed', () => {
    let currentIMage = clipboard.readImage();
    console.log(currentIMage);
    updateCliboard(currentIMage);
}) */
.startWatching()

function updateCliboard(trenutniClip) {
    var textnode = document.createTextNode(trenutniClip);

    var node = document.createElement("LI");
    node.className="list-group-item list-group-item-action py-0";
    node.appendChild(textnode);
    node.addEventListener("click", oznaceniClipboard_);

    let historyClipboard_=document.getElementById('historyClipboard');
    historyClipboard_.insertBefore(node, historyClipboard_.firstChild); 
}

var oznaceniClipboard_=function() {
    console.log("oznaceniClipboard_");
}
