var reportError = function(msg, url, line){
	console.error('Neater Bookmarks error:', msg, url, line);
};

self.onerror = function(msg, url, line){
	reportError(msg, url, line);
};

chrome.runtime.onMessage.addListener(function(request){
	if (request.error) reportError.apply(null, request.error);
});

if (chrome.omnibox){
	var setSuggest = function(description){
		chrome.omnibox.setDefaultSuggestion({
			description: description
		});
	};
	
	var omniboxValue = null;
	var firstResult = null;
	var resetSuggest = function(){
		omniboxValue = null;
		firstResult = null;
		setSuggest('<url><match>*</match></url> ' + chrome.i18n.getMessage('searchBookmarks'));
		
	};
	resetSuggest();

	var xmlEncode = function (text){
		return text.replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/\'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	var matcher = function(text, value){
		var matched = false;
		var exp = new RegExp(value.replace(/\s+/g, '|'), 'ig');
		var matchedText = text.replace(exp, function(m){
			matched = true;
			return '<match>' + m + '</match>';
		});
		return {
			text: matchedText,
			matched: matched
		};
	};

	chrome.omnibox.onInputChanged.addListener(function(value, suggest){
		if (!value){
			resetSuggest();
			return;
		}
		omniboxValue = value;
		chrome.bookmarks.search(value, function(results){
			results = results.filter(function(result){
				return !!result.url;
			});
			if (!results.length){
				resetSuggest();
				return;
			}
			var v = value.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
			var vPattern = new RegExp('^' + v.replace(/\s+/g, '.*'), 'ig');
			if (results.length > 1){
				results.sort(function(a, b){
					var aTitle = a.title;
					var bTitle = b.title;
					var aIndexTitle = aTitle.toLowerCase().indexOf(v);
					var bIndexTitle = bTitle.toLowerCase().indexOf(v);
					if (aIndexTitle >= 0 || bIndexTitle >= 0){
						if (aIndexTitle < 0) aIndexTitle = Infinity;
						if (bIndexTitle < 0) bIndexTitle = Infinity;
						return aIndexTitle - bIndexTitle;
					}
					var aTestTitle = vPattern.test(aTitle);
					var bTestTitle = vPattern.test(bTitle);
					if (aTestTitle && !bTestTitle) return -1;
					if (!aTestTitle && bTestTitle) return 1;
					return b.dateAdded - a.dateAdded;
				});
				results = results.slice(0, 6);
			}
			var resultsLen = results.length;
			firstResult = results.shift();
			var firstTitle = matcher(xmlEncode(firstResult.title), v);
			var firstURL = {text: xmlEncode(firstResult.url)};
			if (!firstTitle.matched) firstURL = matcher(firstURL.text, v);
			setSuggest(firstTitle.text + ' <dim>-</dim> <url>' + firstURL.text + '</url>');
			var suggestions = [];
			for (var i=0, l=results.length; i<l; i++){
				var result = results[i];
				var title = matcher(xmlEncode(result.title), v);
				var URL = result.url;
				var url = {text: xmlEncode(URL)};
				if (!title.matched) url = matcher(url.text, v);
				suggestions.push({
					content: URL,
					description: title.text + ' <dim>-</dim> <url>' + url.text + '</url>'
				});
			}
			suggest(suggestions);
			suggestions = null;
			results = null;
			vPattern = null;
		});
	});

	var selectTab = function(callback){
		if (chrome.tabs.query){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				if (tabs && tabs[0]) callback(tabs[0]);
			});
		} else {
			chrome.tabs.getSelected(null, callback);
		}
	};

	var openUrlInSelectedTab = function(url){
		selectTab(function(tab){
			chrome.tabs.update(tab.id, {
				url: url,
				active: true
			});
		});
	};

	chrome.omnibox.onInputEntered.addListener(function(text){
		if (!text){
			resetSuggest();
			return;
		}
		if (firstResult && text == omniboxValue){
			openUrlInSelectedTab(firstResult.url);
			return;
		}
		if (text != omniboxValue){
			openUrlInSelectedTab(text);
			return;
		}
		chrome.bookmarks.search(text, function(results){
			results = results.filter(function(result){
				return !!result.url;
			});
			if (!results.length){
				resetSuggest();
				return;
			}
			results.sort(function(a, b){
				return b.dateAdded - a.dateAdded;
			});
			openUrlInSelectedTab(results[0].url);
		});
	});
}
