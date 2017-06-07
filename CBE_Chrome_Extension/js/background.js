chrome.runtime.onMessage.addListener(function (msg, sender) {
  // First, validate the message's structure
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab
    chrome.pageAction.show(sender.tab.id);
  }
});


// need to fix this, as this seems to be running content.js each time
// this listner is activated, which in turn activates another listener
// continaed in the content.js script
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    chrome.tabs.executeScript(null,{file:"content.js"});
});

chrome.browserAction.onClicked.addListener(function(activeTab) {
    chrome.tabs.executeScript(null, {file: "content.js"});
});
