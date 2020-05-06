chrome.browserAction.onClicked.addListener((tab) => {

    chrome.tabs.create({ url: "https://edpuzzle.com/" });
    
});

chrome.notifications.create("greet", {type: "basic", title: "EP+ Is Running!", message: "Go to any Edpuzzle assignment to start getting answers!", iconUrl: "assets/images/128.png"});