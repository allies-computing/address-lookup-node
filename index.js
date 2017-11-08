/*

    Address lookup with Node JS
    Simple demo to search for addresses via our API on form submit and returns the full address.

    Full place name lookup API documentation:-
    https://developers.alliescomputing.com/postcoder-web-api/address-lookup

*/

// Using a simplified HTTP client from NPM - https://github.com/request/request
var request = require('request');

// Going to grab the arg from the command line arguments for this example
var address_input = process.argv[2] || "";
var country = process.argv[3] || "GB";
var page = process.argv[4] || 0;
    
// Replace with your API key, test key will always return true regardless of email address
var api_key = "PCW45-12345-12345-1234X";

// Grab the input text and trim any whitespace
address_input = address_input.trim() || "";

// Create an empty output object
var output = new Object;

if (address_input == "") {

    // Respond without calling API if no input supplied
    output.error_message = "No input supplied";

    console.log(output);

} else {

    // Create the URL to API including API key and encoded email address
    var address_url = "https://ws.postcoder.com/pcw/" + api_key + "/address/" + country + "/" + encodeURIComponent(address_input) + "?page=" + page;

    // Call the API
    request(address_url, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            // Convert response into a JSON object
            var address_response = JSON.parse(body);
            
            // Check for alternative email address suggestion
            if (address_response.length > 0) {
                
                var last_address = address_response[address_response.length - 1];
                
                if(last_address.morevalues) {
                    
                    output.next_page = parseInt(last_address.nextpage);
                    output.num_of_addresses = parseInt(last_address.totalresults);
                    
                } else {
                    
                    output.num_of_addresses = address_response.length;
                }
                    
                output.current_page = parseInt(page);
                output.addresses = address_response;

                // Full list of "state" responses - https://developers.alliescomputing.com/postcoder-web-api/address-lookup
                
            } else {
                
                output.error_message = "No address found";
                
            } 

            console.log(output);

        } else {

            output.error_message = "An error occurred" + response.statusCode;

            console.log(output);

            // Triggered if API does not return HTTP code between 200 and 399
            // More info - https://developers.alliescomputing.com/postcoder-web-api/error-handling

        }

    });

}
