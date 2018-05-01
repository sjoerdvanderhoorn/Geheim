// Tie browser icon to event
chrome.browserAction.onClicked.addListener(function(activeTab)
{
	chrome.tabs.create({url: "settings-home.html"});
});

// Tie page popup events to open settings pages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if (request.action == "OpenSettings")
	{
		var settingsAdd = chrome.tabs.create(
		{
			url: "settings-home.html",
			index: sender.tab.index + 1,
			openerTabId: sender.tab.id
		});
	}
	if (request.action == "AddKey")
	{
		var settingsAdd = chrome.tabs.create(
		{
			url: "settings-add.html",
			index: sender.tab.index + 1,
			openerTabId: sender.tab.id
		});
	}
});


var defaultSettings = 
{
	"methods":
	[
		{
			"id": "b64",
			"name": "Base 64",
			"encrypt": "function(data, key){return btoa(data);}",
			"decrypt": "function(data, key){return atob(data);}",
			"generateKeys": "function(){return {encrypt:0, decrypt:0}}"
		},
		{
			"id": "b85",
			"name": "Base 85",
			"encrypt": "function(data, key){return btoa(data);}",
			"decrypt": "function(data, key){return atob(data);}",
			"generateKeys": "function(){return {encrypt:0, decrypt:0}}"
		},
		{
			"id": "asc",
			"name": "ASCII",
			"encrypt": "function(data, key){return btoa(data);}",
			"decrypt": "function(data, key){return atob(data);}",
			"generateKeys": "function(){return {encrypt:0, decrypt:0}}"
		}
	],
	"keys":
	[
		{"id": "10000", "name": "First Key", "methodid": "b64", "encryptkey": "aaaaaaaa", "decryptkey": "aaaaaaaa"},
		{"id": "20000", "name": "Second Key", "methodid": "b64", "encryptkey": "bbbbbbbb", "decryptkey": "bbbbbbbb"},
		{"id": "30000", "name": "Third Key", "methodid": "b64", "encryptkey": "cccccccc", "decryptkey": "cccccccc"},
		{"id": "40000", "name": "ASC Key", "methodid": "asc", "encryptkey": "cccccccc", "decryptkey": "cccccccc"}
	]
}
