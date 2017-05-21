
/*
Send options to tab, then embed and execute pseudo.js within tab.
*/

chrome.browserAction.onClicked.addListener(function (tab) {

    chrome.storage.sync.get(['accent', 'pad', 'bidi', 'dir'], function(items) { 
        var optionObj = {
            accent: items.accent,
            pad: items.pad,
            bidi: items.bidi,
            tabid: tab.id,
            dir: items.dir
        }
        chrome.tabs.sendMessage(tab.id, {options: optionObj});
    });
    
});




