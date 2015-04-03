$(document).ready(function() {

	/* steps
		1. Print source balance and destination balance
		2. Send partial payment
		3. Immediately check balances
		4. Check balances again after 10 seconds	
    */


	//define global vars
	var API_STUB = "https://api.ripple.com/v1";
	var SRC_ADDR, SECRET, DEST_ADDR, FAKE_AMT, TRUE_AMT;

	//submit button event
	$("#submit_btn").click(function(){
		loadParams();
		testPartial();
	});


	//main function
	function testPartial(){
		checkBalances(SRC_ADDR, DEST_ADDR, "Starting Balances:");
	}

	// Check balances
	function checkBalances(srcAddr, destAddr, title) {
		$('#main').append("<div class='card shadow' id='output'><h2>" + title + "</h2></div>");
		$.ajax({
			url:API_STUB + "/accounts/"+srcAddr+"/balances?currency=XRP", 
			dataType:"json",
			error:function(){alert("api request " + srcAddr +"'/balances' failed");},
			success:[function(data) {$('#output').append("Source: "+ JSON.stringify(data.balances[0].value, null, 2))}, function(data) {
				$.ajax({
					url:API_STUB + "/accounts/"+destAddr+"/balances?currency=XRP", 
					dataType:"json",
					error:function(){alert("api request " + destAddr +"'/balances' failed");},
					success: [function(data) {$('#output').append("<br>Destination: "+ JSON.stringify(data.balances[0].value, null, 2))},
						sendPayment]
				});
			}]
		});
	}

	//Prepare payment, send payment, confirm payment
	function sendPayment(){
		$.ajax({
			url:API_STUB + "/accounts/"+srcAddr+"/balances?currency=XRP", 
			dataType:"json",
			error:function(){alert("api request " + srcAddr +"'/balances' failed");},
			success:[function(data) {$('#output').append("Source: "+ JSON.stringify(data.balances[0].value, null, 2))}, function(data) {
				$.ajax({
					url:API_STUB + "/accounts/"+destAddr+"/balances?currency=XRP", 
					dataType:"json",
					error:function(){alert("api request " + destAddr +"'/balances' failed");},
					success: [function(data) {$('#output').append("<br>Destination: "+ JSON.stringify(data.balances[0].value, null, 2))},
						sendPayment]
				});
			}]
		});
	}


	//Helpers
	function loadParams(){
		SRC_ADDR = $("#src_addr").val();
		SECRET = $("#secret").val();
		DEST_ADDR = $("#dest_addr").val();
		FAKE_AMT = $("#fake_amt").val();
		TRUE_AMT = $("#true_amt").val();
		
		console.log(SRC_ADDR);
	}
	

});
