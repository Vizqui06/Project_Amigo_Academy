/**
 * CONTACT FORM HANDLER WITH AJAX
 * 
 * This file handles the contact form submission using AJAX (Asynchronous JavaScript And XML).
 * 
 * WHAT IS AJAX?
 * AJAX allows web pages to send and receive data from a server WITHOUT refreshing the page.
 * In traditional forms, when you click "Submit":
 *   1. Browser sends data to server
 *   2. Page refreshes completely
 *   3. You see a new page
 * 
 * With AJAX:
 *   1. JavaScript sends data to server in the background
 *   2. Page stays as it is (no refresh)
 *   3. JavaScript updates only the part that needs to change
 * 
 * This creates a smoother, more modern user experience.
 */

// Wait for the entire HTML document to load before running this code
// This ensures the form element exists when we try to find it
document.addEventListener('DOMContentLoaded', function() {
  
  // Find the contact form in the HTML by its ID attribute
  // document.getElementById() searches the entire page for an element with id="contactForm"
  const form = document.getElementById('contactForm');
  
  // Check if the form exists on this page
  // (This script might load on pages that don't have the contact form)
  if (!form) {
    return; // Exit early if form doesn't exist
  }
  
  /**
   * EVENT LISTENER
   * This "listens" for when the form is submitted (user clicks "Send" button)
   * When the submit event happens, it runs the function inside
   */
  form.addEventListener('submit', async function(event) {
    
    /**
     * PREVENT DEFAULT BEHAVIOR
     * By default, forms refresh the page when submitted.
     * event.preventDefault() stops this from happening so we can use AJAX instead.
     */
    event.preventDefault();
    
    /**
     * COLLECT FORM DATA
     * We need to gather all the information the user typed into the form.
     * We find each input field by its ID and get its current value.
     */
    const formData = {
      name: document.getElementById('name').value,      // Gets text from name input
      email: document.getElementById('email').value,    // Gets text from email input
      message: document.getElementById('message').value // Gets text from message textarea
    };
    
    /**
     * FETCH API - THE AJAX REQUEST
     * 
     * fetch() is a modern JavaScript function that sends HTTP requests to servers.
     * Think of it like sending a letter:
     *   - You write the letter (formData)
     *   - You put it in an envelope with an address ('/contact')
     *   - You specify how to send it (method: 'POST')
     *   - You wait for a response
     * 
     * The 'await' keyword makes JavaScript wait for the server's response before continuing.
     * Without 'await', the code would continue immediately and 'response' would be undefined.
     */
    try {
      // TRY block: Code that might fail (network errors, server errors, etc.)
      
      /**
       * SEND THE REQUEST
       * fetch() sends data to the server at the '/contact' endpoint
       */
      const response = await fetch('/contact', {
        
        /**
         * METHOD: 'POST'
         * HTTP methods tell the server what action we want:
         *   - GET: "Give me data" (like visiting a webpage)
         *   - POST: "Here's data to save" (like submitting a form)
         *   - PUT: "Update this data"
         *   - DELETE: "Remove this data"
         * 
         * We use POST because we're sending new data to save.
         */
        method: 'POST',
        
        /**
         * HEADERS
         * Headers are like metadata - information ABOUT the data we're sending.
         * 'Content-Type: application/json' tells the server:
         * "Hey, the data I'm sending is in JSON format, not traditional form format"
         */
        headers: {
          'Content-Type': 'application/json'
        },
        
        /**
         * BODY
         * The actual data we're sending.
         * JSON.stringify() converts our JavaScript object into a JSON string.
         * 
         * Before: { name: "John", email: "john@email.com", message: "Hello" }
         * After:  '{"name":"John","email":"john@email.com","message":"Hello"}'
         * 
         * We need to convert it because HTTP can only send text, not JavaScript objects.
         */
        body: JSON.stringify(formData)
      });
      
      /**
       * PARSE THE RESPONSE
       * The server sends back a response in JSON format.
       * response.json() converts the JSON string back into a JavaScript object.
       * We need to 'await' this too because parsing takes time.
       */
      const result = await response.json();
      
      /**
       * FIND THE MESSAGE DISPLAY AREA
       * Remember that empty <div id="formMessage"></div> in the HTML?
       * We're going to put success/error messages there.
       */
      const messageDiv = document.getElementById('formMessage');
      
      /**
       * DISPLAY RESULT TO USER
       * Check if the server said the operation was successful.
       * The server sends back something like: { success: true, message: "..." }
       */
      if (result.success) {
        // SUCCESS CASE
        // Display a green success message
        messageDiv.innerHTML = '<p style="color: green;">✓ Message sent successfully!</p>';
        
        /**
         * CLEAR THE FORM
         * form.reset() clears all input fields, so the user can send another message.
         * It's like hitting the "Clear" button on a calculator.
         */
        form.reset();
        
        /**
         * AUTO-HIDE MESSAGE
         * After 5 seconds (5000 milliseconds), remove the success message.
         * setTimeout() runs code after a delay.
         */
        setTimeout(function() {
          messageDiv.innerHTML = ''; // Clear the message
        }, 5000);
        
      } else {
        // FAILURE CASE (server said something went wrong)
        // Display a red error message
        messageDiv.innerHTML = '<p style="color: red;">✗ Error: ' + (result.error || 'Please try again.') + '</p>';
      }
      
    } catch (error) {
      /**
       * CATCH BLOCK - HANDLES ERRORS
       * If anything goes wrong in the TRY block, code jumps here.
       * Common errors:
       *   - No internet connection
       *   - Server is down
       *   - Server sent invalid JSON
       *   - Request timeout
       */
      
      console.error('Error submitting form:', error); // Log error for developers
      
      // Show user-friendly error message
      document.getElementById('formMessage').innerHTML = 
        '<p style="color: red;">Network error. Please check your connection and try again.</p>';
    }
    
  }); // End of submit event listener
  
}); // End of DOMContentLoaded event listener

/**
 * WHY USE AJAX?
 * 
 * Without AJAX (Traditional Form):
 *   1. User fills form and clicks "Send"
 *   2. Entire page reloads
 *   3. User loses their place on the page
 *   4. Slower, jarring experience
 * 
 * With AJAX (This Implementation):
 *   1. User fills form and clicks "Send"
 *   2. Data sent in background
 *   3. Page stays exactly where it is
 *   4. Small message appears confirming success
 *   5. Faster, smoother experience
 * 
 * REAL-WORLD EXAMPLES:
 *   - Gmail: Send emails without page refresh
 *   - Facebook: Post updates without page refresh
 *   - Google Maps: Load new map tiles without page refresh
 *   - Instagram: Like posts without page refresh
 */