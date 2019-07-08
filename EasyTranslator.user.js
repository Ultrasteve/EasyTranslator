// ==UserScript==
// @name         EasyTranslator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  双击屏幕取词
// @author       Nebulus
// @include      *
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var trsBlock = createBlock();
    document.body.appendChild(trsBlock);
    window.onmousedown = () => hideElement(trsBlock);
    window.onmouseup = (e) => translation(getWord(), trsBlock, e);
})();

function createBlock() {
    var block = document.createElement("DIV");
    block.style.cssText = "position: absolute; z-index: 999999; background-color: black; color: white;";
    return block;
}

function hideElement(el) {
    el.style.display = "none";
    el.innerHTML = "";
}

function translation(word, el, e) {
    if(word === null || word === undefined)
        return null;
    var result = "";
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://fanyi.baidu.com/sug",
        data: "kw="+word,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            re = JSON.parse(response.responseText).data[0];
            let result = re.v;
            console.log(result.indexOf("undefined")>=0);
            if(result.indexOf("undefined")<0) {
                el.style.left = ""+e.pageX+"px";
                el.style.top = ""+e.pageY+"px";
                el.innerHTML = result;
                el.style.display = "block";
            }
        }
    });
    return result;
}
function getWord() {
    var word = window.getSelection().toString();
    if(word === "")
        return;
    return word;
}

function mouseCoords(ev) {
        if (ev.pageX || ev.pageY) {
            return {x: ev.pageX, y: ev.pageY};
        }
        return {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.body.scrollTop - document.body.clientTop
        };
}
