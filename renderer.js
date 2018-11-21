const electron = require('electron');
const path = require('path');
const fs = require('fs');
const clipboard = require('electron-clipboard-extended');
const { ipcRenderer } = require('electron');
const userDataPath = (electron.app || electron.remote.app).getPath('userData');

window.$ = window.jQuery = require('jquery');
window.Tether = require('tether');
window.Bootstrap = require('bootstrap');

var clipPath2_ = path.join(userDataPath, "db");
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

function updateCliboard(trenutniClip, pisiDatoteku, brojac_) {
    let historyClipboard_=document.getElementById('historyClipboard');
    
    for(const li_ of historyClipboard_.getElementsByTagName("li")) {
        var li = li_.cloneNode(true);

        for (var i=li.childNodes.length-1; i>=0; i--) {
            if (li.childNodes[i].tagName) li.removeChild(li.childNodes[i]);
        }

        var content = li['innerText' in li ? 'innerText' : 'textContent'];
        
        if(trenutniClip==content) {
            historyClipboard_.removeChild(li_);
            var b_=li_.getAttribute('brojac');

            fs.unlinkSync(path.join(clipPath2_, b_ + '.db'));
        }
    } 

    var brojac = brojac_==null ? Date.now() : brojac_;
    var textnode = document.createTextNode(trenutniClip);    
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
        var node_=historyClipboard_.childNodes[historyClipboard_.getElementsByTagName("li").length-1];
        historyClipboard_.removeChild(node_);
        var b_=node_.getAttribute('brojac');

        fs.unlinkSync(path.join(clipPath2_, b_ + '.db'));
    } 

    if(pisiDatoteku) {
        dampajDatoteku2(node);
    }
}

function dampajDatoteku2(node) {
    var datoteka= path.join(clipPath2_, node.getAttribute('brojac') + ".db");
    var li = node.cloneNode(true);

    for (var i=li.childNodes.length-1; i>=0; i--) {
        if (li.childNodes[i].tagName) li.removeChild(li.childNodes[i]);
    }

    var content = li['innerText' in li ? 'innerText' : 'textContent'];

    fs.writeFile(datoteka, content, (err) => {
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
    if (!fs.existsSync(clipPath2_)){
        fs.mkdirSync(clipPath2_);
    }

    var datoteke=fs.readdirSync(clipPath2_);

    for(var d of datoteke) {
        var sadrzaj=fs.readFileSync(path.join(clipPath2_, d), 'utf-8');
        
        updateCliboard(sadrzaj, false, path.parse(d).name);
    }
    
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

            fs.unlinkSync(path.join(clipPath2_, tretutniBrojac + '.db'));

            break zavrsi;
        }
    }
}