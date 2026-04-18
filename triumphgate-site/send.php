<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name    = strip_tags(trim($_POST['name']));
    $email   = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST['message']);

    $to      = "triumphgatemodelschool@yahoo.com"; 
    $subject = "New Message from Website Contact Form";
    $headers = "From: " . $email . "\r\n" .
               "Reply-To: " . $email . "\r\n" .
               "Content-Type: text/plain; charset=UTF-8";

    $body = "You have received a new message from your website contact form.\n\n" .
            "Name: $name\n" .
            "Email: $email\n\n" .
            "Message:\n$message";

    if (mail($to, $subject, $body, $headers)) {
        echo "✅ Message sent successfully! We will get back to you soon.";
    } else {
        echo "❌ Sorry, your message could not be sent. Please try again later.";
    }
}
?>