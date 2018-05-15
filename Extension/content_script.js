// Settings
var settings = {methods: [], keys: []};

chrome.storage.local.get(["geheimSettings"], function(data)
{
	if(data["geheimSettings"])
	{
		settings = JSON.parse(data["geheimSettings"]);
	}
});


// Inject script into page
fetch(chrome.extension.getURL("page.js")).then(function(response)
{
	return response.text();
}).then(function(data)
{
	var s = document.createElement("SCRIPT");
	s.setAttribute('type', 'text/javascript');
	// Run code in private namespace using IIFE
	s.textContent = "(function(settings){" + data + "})(" + JSON.stringify(settings) + ");";
	(document.head || document.documentElement).appendChild(s);
	s.remove();
});


// Inject settings popup HTML and javascript 
window.addEventListener("load", function(event)
{
	fetch(chrome.extension.getURL('settings-popup.html')).then(function(response)
	{
		return response.text();
	}).then(function(data)
	{
		document.body.insertAdjacentHTML("beforeend", data);
	});
	fetch(chrome.extension.getURL("settings-popup.js")).then(function(response)
	{
		return response.text();
	}).then(function(data)
	{
		var s = document.createElement("SCRIPT");
		s.setAttribute('type', 'text/javascript');
		s.textContent = data;
		(document.head || document.documentElement).appendChild(s);
		s.remove();
	});
});


// Listen for messages
window.addEventListener("message", function(event)
{
	if (event.source != window)
	{
		return;
	}
	if (event.data.type && (event.data.type == "FROM_PAGE"))
	{
		// Relay message to background script
		chrome.runtime.sendMessage({action: event.data.text});
	}
});