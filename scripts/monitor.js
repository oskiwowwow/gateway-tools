$(document).ready(function() {
	//define api url stub
	var api_stub = "https://api.ripple.com/v1";
	
	/* ripple-lib code
	//build a remote for s1.ripple.com
	var Remote = ripple.Remote;
	var remote = new Remote({
	  servers: [ 'wss://s1.ripple.com:443' ]
	});

	//try to connect to it
	remote.connect(function() {
	  remote.requestServerInfo(function(err, info) {
	    // process err and info
		console.log(info);
		if(err){alert("Unable to connect to reach wss://s1.ripple.com:443, check console log"); console.log(err);}
	  });
	});
	*/
	
	//submit button event
	$("#url_submit").click(function(){
		submitURL($("#ripple_txt_url").val());
	});
	
	//fetch the url specified
	function submitURL (rippleURL){
		$.ajax({
			url:rippleURL, 
			dataType:"text", 
			success:function(data) {
				showResults(data, rippleURL);
			}
		});
	}
	
	//process the data returned from the specified URL	
	function showResults(ripple_txt, rippleURL) {
		//remove placeholder text
		$('#welcome').remove();
		//show ripple.txt on left side
		$('#outer').append("<div id='main'><div class='card shadow' id=ripple_txt><h2>'" + rippleURL + "' Contents:</h2>" + ripple_txt + "</div></div>");
		//parse ripple.txt
		var gatewayInfo = parse(ripple_txt);
		console.log(gatewayInfo);
		
		//ripple-rest
		$.ajax({
			url:api_stub + "/accounts/"+gatewayInfo.accounts[0]+"/settings", 
			dataType:"json",
			error:function(){alert("api request failed");},
			success:[displayAccountInfo, validateColdWallet]
		});
		
		//ripple-lib code
        /*var options = {
		  account: gatewayInfo.accounts[0],
		  ledger: 'validated'
		};
		var request = remote.requestAccountInfo(options, function(err, info) {
			if(err){
				alert("Unable to connect to get info for " + gatewayInfo.accounts[0] + "; check console log"); 
				console.log(err);
			}
			else { 
				console.log(info);
			}
		}); */
	}
	
	//this defines what is displayed
	function displayAccountInfo(info){
		console.log(info.settings);
		$('#main').append("<div class='card shadow' id=account_info><h2>Cold Wallet Settings:</h2>" + JSON.stringify(info.settings, null, 2) + "</div>");
	}
	
	//validate cold wallet settings
	function validateColdWallet(info){
		$('#main').append("<div class='card shadow' id=cold_wallet_validations><h2>Cold Wallet Validations:</h2>" + "</div>");
		//validate defaultRipple
		$('#cold_wallet_validations').append("<p>" + validateField("default_ripple", info.settings.default_ripple, "true") + "</p>");
		$('#cold_wallet_validations').append("<p>" + validateField("global_freeze", info.settings.global_freeze, "false") + "</p>");
	}	
	
	//general validation function, returns raw html
	function validateField(fieldName, fieldValue, targetValue){
		console.log(fieldValue + " | " + targetValue);
		return "<div class='result'>" + fieldName + ": " + 
			((fieldValue.toString()==targetValue) ? "<span class='good'>" + fieldValue + "</span>" : "<span class='bad'>" + fieldValue + "</span>")
			 	+ "</div>";
	}
	
	//helper for parsing the ripple.txt into an object
	function parse(txt) {
		txt = txt.replace('\r\n', '\n');
		txt = txt.replace('\r', '\n');
		txt = txt.split('\n');

		var currentSection = "", sections = {};
		for (var i = 0, l = txt.length; i < l; i++) {
			var line = txt[i];
			if (!line.length || line[0] === '#') {
				continue;
			}
			else if (line[0] === '[' && line[line.length - 1] === ']') {
				currentSection = line.slice(1, line.length - 1);
				sections[currentSection] = [];
			}
			else {
				line = line.replace(/^\s+|\s+$/g, '');
				if (sections[currentSection]) {
					sections[currentSection].push(line);
				}
			}
		}
		return sections;
	}
});