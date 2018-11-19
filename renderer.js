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
var brojac=0;

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

var ima='<li id="LIgumb" class="list-group-item list-group-item-action py-0 text-truncate" onclick="oznaceniClipboard(\'LItext\')" data-toggle="tooltip" title="LItext"> LItext <button type="button" class="close" aria-label="Close" onclick="obrisiClipboard(\'LItext\')">    <span aria-hidden="true">&times;</span>  </button> </li>';

function updateCliboard(trenutniClip, pisiDatoteku) {
    let historyClipboard_=document.getElementById('historyClipboard');
    
    for(const li of historyClipboard_.getElementsByTagName("li")) {
        if(trenutniClip==li.textContent) {
            historyClipboard_.removeChild(li);
        }
    }

    var textnode = document.createTextNode(trenutniClip);

    brojac++;
    var node = document.createElement("LI");
    node.className="list-group-item list-group-item-action py-0 text-truncate";
    node.innerHTML=`<button type="button" class="close" aria-label="Close" onclick="obrisiClipboard(${brojac})"> <span aria-hidden="true">&times;</span> </button>`;
    node.appendChild(textnode);
    node.addEventListener("click", function() { 
        oznaceniClipboard(trenutniClip);
    });
    node.setAttribute('data-toggle', 'tooltip');
    node.setAttribute('title', trenutniClip.replace(new RegExp('"', 'g'), ' '));   
    node.setAttribute('brojac', brojac);

    historyClipboard_.insertBefore(node, historyClipboard_.firstChild); 

    while(historyClipboard_.getElementsByTagName("li").length>150) {
        historyClipboard_.removeChild(historyClipboard_.childNodes[historyClipboard_.getElementsByTagName("li").length-1]);
    }

    if(pisiDatoteku) {
        dampajDatoteku(historyClipboard_);
    }
}

function dampajDatoteku(historyClipboard_) {
    var content = "";

    for(var li of historyClipboard_.getElementsByTagName("li")) {
        li = li.cloneNode(true);

        for (var i=li.childNodes.length-1; i>=0; i--) {
            if (li.childNodes[i].tagName) li.removeChild(li.childNodes[i]);
        }
        
        var innerText = li['innerText' in li ? 'innerText' : 'textContent'];

        content+=innerText.replace(new RegExp(newLine, 'g'), hes) + newLine;
    }
    
    fs.writeFile(clipPath_, content, (err) => {
        if (err) {
            console.log(err);
            alert("An error ocurred updating the file" + err.message);
            return;
        }
    });
}

function oznaceniClipboard(tekst) {
    clipboard.writeText(tekst);

    ponistiSeach();  

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

function trazi() {
    var traziBlock_=document.getElementById("traziBlock");
    
    if(traziBlock_.style['display']=='none') {
        traziBlock_.style['display'] = 'block';   
    } else {
        ponistiSeach();   
    }
}

function ponistiSeach() {
    $("#traziPolje").val('');
    
    $("#historyClipboard li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf('') > -1)
    });
         
    var traziBlock_=document.getElementById("traziBlock");
    traziBlock_.style['display'] = 'none';  
}

function pretraziListu() {
    $(document).ready(function(){
        $("#traziPolje").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            
            $("#historyClipboard li").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });
}

pretraziListu();

function obrisiClipboard(tretutniBrojac) {
    event.stopPropagation();
    
    let historyClipboard_=document.getElementById('historyClipboard');
    var liList = historyClipboard_.getElementsByTagName("li");

    zavrsi: 
    for(var item of liList) {
        if(item.getAttribute('brojac')==tretutniBrojac) {
            historyClipboard_.removeChild(item);

            break zavrsi;
        }
    }

    dampajDatoteku(historyClipboard_);
}