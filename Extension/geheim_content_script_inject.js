var encryptionPattern = new RegExp(":geheim:([A-Za-z0-9+/=]*):([A-Za-z0-9+/=]*):([A-Za-z0-9+/=]*):", "g");

// Placeholders

var encryptFunction = function(input, el)
{
	// Reset Regexp counter and parse input
	var methodid = el.methodid;
	var keyid = el.keyid;
	/*
	if(!methodid || !keyid)
	{
		methodid = el.methodid = window.prompt("Enter MethodID", "b64");
		keyid = el.keyid = window.prompt("Enter KeyID", "10000");
	}
	*/
	// Process
	if (settings.keys.find(k => k.id == keyid && k.methodid == methodid))
	{
		eval("var method = " + settings.methods.find(m => m.id == methodid).encrypt);
		var encryptkey = settings.keys.find(k => k.id == keyid && k.methodid == methodid).encryptkey;
		var data = method(input, encryptkey);
		return ":geheim:" + methodid + ":" + keyid + ":" + data + ":";
	}
	else
	{
		return input;
	}
}
var decryptFunction = function(input, el)
{
	// Reset Regexp counter and parse input
	encryptionPattern.lastIndex = -1;
	var exec = encryptionPattern.exec(input);
	var methodid = exec[1];
	var keyid = exec[2];
	var data = exec[3];
	// Store methodid and keyid with element
	if (el)
	{
		el.methodid = methodid;
		el.keyid = keyid;
	}
	// Process
	if (settings.keys.find(k => k.id == keyid && k.methodid == methodid))
	{
		eval("var method = " + settings.methods.find(m => m.id == methodid).decrypt);
		var decryptkey = settings.keys.find(k => k.id == keyid && k.methodid == methodid).decryptkey;
		return {processed: true, data: method(data, decryptkey)};
	}
	else
	{
		return {processed: false, data: input};
	}
}

// New Getter and Setter functions

var defineGetterValue = function()
{
	if (this.getAttribute("geheim"))
	{
		return encryptFunction(this.originalValue, this);
	}
	else
	{
		return this.originalValue;
	}
}

var defineGetterEncryptedValue = function()
{
	this.clearTextValue = this.originalValue;
	if (this.getAttribute("geheim"))
	{
		return encryptFunction(this.originalValue, this);
	}
	else
	{
		return this.originalValue;
	}
}

var defineSetterValue = function(val)
{
	if (!this.getAttribute("geheim"))
	{
		if (val.substr(0, 8) == ":geheim:")
		{
			this.setAttribute("geheim", true);
			var clearText = decryptFunction(val, this);
			if (clearText.processed == true)
			{
				val = clearText.data;
			}
			else
			{
				this.setAttribute("geheimUnknown", true);
			}
		}
	}
	this.originalValue = val;
}

// Link functions

Object.defineProperty(HTMLTextAreaElement.prototype, "originalValue",
{
	get: HTMLTextAreaElement.prototype.__lookupGetter__("value"),
	set: HTMLTextAreaElement.prototype.__lookupSetter__("value")
});
Object.defineProperty(HTMLTextAreaElement.prototype, "encryptedValue",
{
	get: defineGetterEncryptedValue
});
Object.defineProperty(HTMLTextAreaElement.prototype, "value",
{
	get: defineGetterValue,
	set: defineSetterValue
});

Object.defineProperty(HTMLInputElement.prototype, "originalValue",
{
	get: HTMLInputElement.prototype.__lookupGetter__("value"),
	set: HTMLInputElement.prototype.__lookupSetter__("value")
});
Object.defineProperty(HTMLInputElement.prototype, "encryptedValue",
{
	get: defineGetterEncryptedValue
});
Object.defineProperty(HTMLInputElement.prototype, "value",
{
	get: defineGetterValue,
	set: defineSetterValue
});

// Force all fields to reset their value so they use the new Getter and Setter

var processElements = function()
{
	// Prepare Textarea and Input by triggering a value change
	[].forEach.call(document.querySelectorAll("textarea, input[type=text], input:not([type])"), function(el)
	{
		el.value = el.originalValue;
	});
	// Replace all encrypted text values
	var textNodes = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, null, false);
	for (var node; node = textNodes.nextNode();)
	{
		if (encryptionPattern.test(node.wholeText))
		{
			if (!node.parentNode.matches("textarea, input[type=text], input:not([type])"))
			{
				// Highlight that this text was originally encrypted
				node.parentNode.setAttribute("geheimText", true);
				// Show clear text
				node.nodeValue = node.nodeValue.replace(encryptionPattern, function(match)
				{
					var clearText = decryptFunction(match);
					if (clearText.processed == false)
					{
						// Unknown encryption method or key.
						node.parentNode.setAttribute("geheimTextUnknown", true);
					}
					return clearText.data;
				});
			}
		}
	}
}

// Process all elements on page load

window.addEventListener("load", processElements);

// Process all elements on page changes

window.addEventListener("load", function()
{
	new MutationObserver(function(mutations)
	{
		mutations.forEach(function(mutation)
		{
			if (mutation.addedNodes.length > 0)
			{
				processElements();
			};
		});
	}).observe(document.body,
	{
		childList: true,
		subtree: true
	});
});

// Bind click event to toggle encryption status

window.addEventListener("click", function(event)
{
	var el = event.target;
	if (el.matches("textarea, input[type=text], input:not([type])"))
	{
		if (event.offsetY < 20 && (el.clientWidth - event.offsetX) < 20)
		{
			if (el.getAttribute("geheim"))
			{
				el.removeAttribute("geheim");
			}
			else
			{
				geheimDialogEncrypt(el);
				el.setAttribute("geheim", true);
			}
			el.value = el.originalValue;
		}
	}
	// Dialog events
	if (el.getAttribute("geheimdialog"))
	{
		geheimDialogOverlay.remove();
		geheimDialogOverlayTarget.methodid = el.getAttribute("methodid");
		geheimDialogOverlayTarget.keyid = el.getAttribute("keyid");
		el.value = el.originalValue;
		el.value = el.value;
	}
});
	
// Process form submit events

window.addEventListener("submit", function(event)
{
	[].forEach.call(event.target.querySelectorAll("textarea, input[type=text], input:not([type])"), function(el)
	{
		el.value = el.encryptedValue;
	});
	window.setTimeout(function()
	{
		[].forEach.call(event.target.querySelectorAll("textarea, input[type=text], input:not([type])"), function(el)
		{
			el.value = el.clearTextValue;
		});
	}, 0);
}, true);




// Geheim Dialog

var geheimDialogOverlay = null;
var geheimDialogOverlayTarget = null;

function geheimDialogEncrypt(target)
{
	geheimDialogOverlayTarget = target;
	geheimDialogOverlay = document.createElement("div");
	geheimDialogOverlay.className = "geheimDialog";
	document.body.appendChild(geheimDialogOverlay);
	
	var dialog = document.createElement("div");
	dialog.className = "dialog";
	geheimDialogOverlay.appendChild(dialog);
	
	// Existing keys
	
	var heading1 = document.createElement("h2");
	heading1.innerText = "Geheim - Select key";
	dialog.appendChild(heading1);
	
	var existingKeys = document.createElement("ul");
	dialog.appendChild(existingKeys);
	settings.methods.sort(function(a, b){if (a.name < b.name){return -1;}else if (a.name > b.name){return 1;}else{return 0;}}).forEach(function (method)
	{
		var methodEl = document.createElement("li");
		methodEl.className = "method";
		methodEl.innerHTML = method.name;
		existingKeys.appendChild(methodEl);
		settings.keys.filter(k => k.methodid == method.id).sort(function(a, b){if (a.name < b.name){return -1;}else if (a.name > b.name){return 1;}else{return 0;}}).forEach(function (key)
		{
			var keyEl = document.createElement("li");
			keyEl.className = "key";
			keyEl.innerHTML = key.name;
			keyEl.setAttribute("geheimdialog", true);
			keyEl.setAttribute("methodid", key.methodid);
			keyEl.setAttribute("keyid", key.id);
			existingKeys.appendChild(keyEl);
		});
	});

	// New key
	
	var addNew = document.createElement("p");
	addNew.innerText = "To add a new key, open the extension options.";
	dialog.appendChild(addNew);
	
	/*
	
	// Mockup
	
	dialog.innerHTML += "<p><label>Method <select><option>Base64</option</select></label></p>";
	dialog.innerHTML += "<p><label>Key name <input type='text' placeholder='Eg. \"Close Friends\" or \"Family-key\"' /></label></p>";
	dialog.innerHTML += "<p><label>Key id (<a href=''>generate random</a>)<input type='text' /></label></p>";
	dialog.innerHTML += "<p><label>Encryption key (<a href=''>generate key pair</a>)<textarea></textarea></label></p>";
	dialog.innerHTML += "<p><label>Decryption key <textarea></textarea></label></p>";
	dialog.innerHTML += "<p><button>Save new key</button> <button>Cancel</button></p>";
	*/
	
}





