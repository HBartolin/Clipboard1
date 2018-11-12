'use strict'
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const clipboard = require('electron-clipboard-extended');
const { ipcRenderer } = require('electron');
const userDataPath = (electron.app || electron.remote.app).getPath('userData');

window.$ = window.jQuery = require('jquery');
window.Tether = require('tether');
window.Bootstrap = require('bootstrap');

var clipPath_ = path.join(userDataPath, "clipboard.db");
var fileSep = path.sep; 
var newLine = "\r\n";  
var hes="####";

var clipboard_=clipboard
.on('text-changed', () => {
    let currentText = clipboard.readText();

    updateCliboard(currentText, true);
})
/* .on('image-changed', () => {
    let currentIMage = clipboard.readImage();
    console.log(currentIMage);
    updateCliboard(currentIMage);
}) */;

clipboard_.startWatching();

function updateCliboard(trenutniClip, pisiDatoteku) {
    let historyClipboard_=document.getElementById('historyClipboard');
    
    for(const li of historyClipboard_.getElementsByTagName("li")) {
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

    if(pisiDatoteku) {
        var content = "";

        for(const li of historyClipboard_.getElementsByTagName("li")) {
            content+=li.textContent.replace(new RegExp(newLine, 'g'), hes) + newLine;
        }
        
        fs.writeFile(clipPath_, content, (err) => {
            if (err) {
                console.log(err);
                alert("An error ocurred updating the file" + err.message);
                return;
            }
        });
    }
}

function oznaceniClipboard(tekst) {
    clipboard.writeText(tekst);

    ipcRenderer.send('sakri');
}

function citaj() {
    fs.readFile(clipPath_, 'utf-8', (err, data) => {
        if(err){
            console.log(err);
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        var array = data.toString().split(newLine);

        for(var i=array.length-1; i >= 0; i--) {
            var redak=array[i].replace(new RegExp(hes, 'g'), newLine);
            updateCliboard(redak, false);
        }
    });
}

citaj();
