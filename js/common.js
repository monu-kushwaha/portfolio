$(document).ready(function() {
    $(document).on('click', '.send-message', function(e) {
        e.preventDefault();
        const form = $('.myFormData');
        const formData = form.serialize();

        // Send the AJAX request
        $.ajax({
            url: "https://monu-kushwaha.github.io/portfolio/sendEmail.php", // Replace with your server URL
            type: "POST",
            data: formData, // Send the serialized form data
            success: function(response) {
                // Handle success
                $("#response").html(`<p>Response: ${response}</p>`);
            },
            error: function(xhr, status, error) {
                // Handle error
                $("#response").html(`<p>Error: ${error}</p>`);
            },
        });
    });

})