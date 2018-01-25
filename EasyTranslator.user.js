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
        method: "GET",
        url: "https://sp1.baidu.com/5b11fzupBgM18t7jm9iCKT-xh_/sensearch/selecttext?q="+word,
        onload: function(response) {
            result = JSON.parse(response.responseText).data.result[0].cont;
            console.log(result);
            if(result !== undefined) {
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
    console.log(word);
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

