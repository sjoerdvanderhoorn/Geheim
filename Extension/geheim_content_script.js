// Settings

var settings = {methods: [], keys: []};

chrome.storage.sync.get(["geheimSettings"], function(data)
{
	if(data["geheimSettings"])
	{
		settings = JSON.parse(data["geheimSettings"]);
	}
});
/*
var settings = 
{
	methods:
	[
		{
			id: "b64",
			name: "Base 64",
			encrypt: "function(data, key){return btoa(data);}",
			decrypt: "function(data, key){return atob(data);}",
			generateKeys: "function(){return {encrypt:0, decrypt:0}}"
		},
		{
			id: "b85",
			name: "Base 85",
			encrypt: "function(data, key){return btoa(data);}",
			decrypt: "function(data, key){return atob(data);}",
			generateKeys: "function(){return {encrypt:0, decrypt:0}}"
		},
		{
			id: "asc",
			name: "ASCII",
			encrypt: "function(data, key){return btoa(data);}",
			decrypt: "function(data, key){return atob(data);}",
			generateKeys: "function(){return {encrypt:0, decrypt:0}}"
		}
	],
	keys:
	[
		{id: "10000", name: "First Key", methodid: "b64", encryptkey: "aaaaaaaa", decryptkey: "aaaaaaaa"},
		{id: "20000", name: "Second Key", methodid: "b64", encryptkey: "bbbbbbbb", decryptkey: "bbbbbbbb"},
		{id: "30000", name: "Third Key", methodid: "b64", encryptkey: "cccccccc", decryptkey: "cccccccc"},
		{id: "40000", name: "ASC Key", methodid: "asc", encryptkey: "cccccccc", decryptkey: "cccccccc"}
	]
}
*/


// Inject script into page

fetch(chrome.extension.getURL("geheim_content_script_inject.js")).then(function(response)
{
	return response.text();
}).then(function(data)
{
	var s = document.createElement("SCRIPT");
	s.setAttribute('type', 'text/javascript');
	s.textContent = "(function(settings){" + data + "})(" + JSON.stringify(settings) + ")";
	(document.head || document.documentElement).appendChild(s);
	s.remove();
});
