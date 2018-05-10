// Load default settings
var settings = null;

// Page parameters
var currentUrl = new URL(window.location.href);
var methodid = currentUrl.searchParams.get("methodid");
var keyid = currentUrl.searchParams.get("keyid");

// Overwrite default settings with settings from storage
chrome.storage.local.get(["geheimSettings"], function(data)
{
	if(data["geheimSettings"])
	{
		settings = JSON.parse(data["geheimSettings"]);
	}
	getMethods();
	if (methodid && keyid)
	{
		getKey();
	}
});

function getMethods()
{
	var methodsEl = document.getElementById("methodid");
	settings.methods.sort(function(a, b){if (a.name < b.name){return -1;}else if (a.name > b.name){return 1;}else{return 0;}}).forEach(function(method)
	{
		var methodEl = document.createElement("option");
		methodEl.value = method.id;
		methodEl.innerHTML = method.name;
		methodsEl.appendChild(methodEl);
	});
}

function getKey()
{
	settings.keys.filter(k => k.methodid == methodid && k.id == keyid).find(function (key)
	{
		document.getElementById("methodid").value = key.methodid;
		document.getElementById("name").value = key.name;
		document.getElementById("id").value = key.id;
		document.getElementById("encryptkey").value = key.encryptkey;
		document.getElementById("decryptkey").value = key.decryptkey;
	});
}

function randomId()
{
	document.getElementById("id").value = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 8);
	return false;
}

function generateKeyPair()
{
	settings.methods.filter(m => m.id == document.getElementById("methodid").value).find(function (method)
	{
		var tempKeys = eval(method.generateKeys);
		document.getElementById("encryptkey").value = tempKeys.encrypt;
		document.getElementById("decryptkey").value = tempKeys.decrypt;
	});
	return false;
}

function saveMethod()
{
	if (!document.getElementById("methodid").value || !document.getElementById("name").value || !document.getElementById("id").value)
	{
		alert("Enter all required fields to save:\n\n- Method\n- Key name\n- Key code");
		return false;
	}
	if (methodid && keyid)
	{
		// Update
		settings.keys.filter(k => k.methodid == methodid && k.id == keyid).find(function (key)
		{
			key.id = document.getElementById("id").value;
			key.name = document.getElementById("name").value;
			key.methodid = document.getElementById("methodid").value;
			key.encryptkey = document.getElementById("encryptkey").value;
			key.decryptkey = document.getElementById("decryptkey").value;
		});
	}
	else
	{
		// Add
		settings.keys.push(
		{
			"id": document.getElementById("id").value,
			"name": document.getElementById("name").value,
			"methodid": document.getElementById("methodid").value,
			"encryptkey": document.getElementById("encryptkey").value,
			"decryptkey": document.getElementById("decryptkey").value
		});
	}
	chrome.storage.local.set(
	{
		"geheimSettings": JSON.stringify(settings)
	});
	if (window.history.length == 1)
	{
		window.close();
	}
	else
	{
		window.history.back();
	}
}

function deleteMethod()
{
	if (window.confirm("Are you sure you want to delete this key?"))
	{
		if (methodid && keyid)
		{
			// Delete
			for (var i=0; i < settings.keys.length; i++)
			{
				if (settings.keys[i].methodid == methodid && settings.keys[i].id == keyid)
				{
					settings.keys.splice(i, 1);
				}
			}
			chrome.storage.local.set(
			{
				"geheimSettings": JSON.stringify(settings)
			});
		}
		if (window.history.length == 1)
		{
			window.close();
		}
		else
		{
			window.history.back();
		}
	}
}

function cancelMethod()
{
	if (window.history.length == 1)
	{
		window.close();
	}
	else
	{
		window.history.back();
	}
}

document.addEventListener("DOMContentLoaded", function()
{
	document.getElementById("save").onclick = saveMethod;
	document.getElementById("delete").onclick = deleteMethod;
	document.getElementById("cancel").onclick = cancelMethod;
	document.getElementById("randomId").onclick = randomId;
	document.getElementById("generateKeyPair").onclick = generateKeyPair;
});