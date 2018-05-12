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

fetch(chrome.extension.getURL('settings-popup.html')).then(function(response)
{
	return response.text();
}).then(function(data)
{
    document.body.innerHTML += data;
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

fetch(chrome.extension.getURL("page.js")).then(function(response)
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