// Load default settings
var settings = chrome.extension.getBackgroundPage().defaultSettings;

// Overwrite default settings with settings from storage
chrome.storage.sync.get(["geheimSettings"], function(data)
{
	if(data["geheimSettings"])
	{
		settings = JSON.parse(data["geheimSettings"]);
		getMethods();
		getKeys();
	}
});

function saveMethod()
{
	chrome.storage.sync.set(
	{
		"geheimSettings": JSON.stringify(settings)
	});
	window.close();
}

function cancelMethod()
{
	window.close();
}

document.addEventListener("DOMContentLoaded", function()
{
	document.getElementById("save").onclick = saveMethod;
	document.getElementById("cancel").onclick = cancelMethod;
});