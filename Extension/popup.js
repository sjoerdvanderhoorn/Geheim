function getCurrentTab(callback)
{
	var queryInfo = {active: true, currentWindow: true};
	chrome.tabs.query(queryInfo, function(tabs)
	{
		var tab = tabs[0];
		callback(tab);
	});
}

function saveMethod()
{
	chrome.storage.sync.set(
	{
		"active": document.getElementById("active").checked,
		"encryption-function": document.getElementById("encryption-function").value,
		"encryption-password": document.getElementById("encryption-password").value,
		"decryption-function": document.getElementById("decryption-function").value,
		"decryption-password": document.getElementById("decryption-password").value
	});
	window.close();
}

function cancelMethod()
{
	window.close();
}





document.addEventListener("DOMContentLoaded", function()
{
	chrome.storage.sync.get(["active", "encryption-function", "encryption-password", "decryption-function", "decryption-password"], function(data)
	{
		document.getElementById("active").checked = data["active"];
		document.getElementById("encryption-function").value = data["encryption-function"];
		document.getElementById("encryption-password").value = data["encryption-password"];
		document.getElementById("decryption-function").value = data["decryption-function"];
		document.getElementById("decryption-password").value = data["decryption-password"];
	});
	document.getElementById("save").onclick = saveMethod;
	document.getElementById("cancel").onclick = cancelMethod;

	getCurrentTab(function(tab)
	{
		document.getElementById('status').textContent = tab.title;
	});
});

