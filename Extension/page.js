var encryptionPattern = new RegExp(":geheim:([A-Za-z0-9+/=]*):([A-Za-z0-9+/=]*):([A-Za-z0-9+/=]*):", "g");

// Placeholders

var encryptFunction = function(input, el)
{
	// Reset Regexp counter and parse input
	var methodid = el.methodid;
	var keyid = el.keyid;
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
window.addEventListener("dblclick", function(event)
{
	var el = event.target;
	toggleGeheimStatus(el);
});

window.addEventListener("click", function(event)
{
	var el = event.target;
	if (event.offsetY < 20 && (el.clientWidth - event.offsetX) < 20)
	{
		toggleGeheimStatus(el);
	}
});

function toggleGeheimStatus(el)
{
	if (el.matches("textarea, input[type=text], input:not([type])"))
	{
		if (el.getAttribute("geheim"))
		{
			el.removeAttribute("geheim");
		}
		else
		{
			geheimPopup(el, 
			{
				// Trim settings to only send non trivial information
				keys: settings.keys.map(function(k){return {id:k.id, name:k.name, methodid:k.methodid}}),
				methods: settings.methods.map(function(m){return {id:m.id, name:m.name}})
			});
		}
		el.value = el.originalValue;
	}
}

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
