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
    let historyClipboard_=document.getElementById('historyClipboard');

    var node = document.createElement("LI");
    node.className="list-group-item";
    var textnode = document.createTextNode(trenutniClip);
    node.appendChild(textnode);
    historyClipboard_.insertBefore(node, historyClipboard_.firstChild);
}
