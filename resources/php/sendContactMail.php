<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        // Include additional variables
        include('../../../includes/includes.php');

        // Perform reCAPTCHA verification
        $response = $_POST["captcha"];
        $verify_url = 'https://www.google.com/recaptcha/api/siteverify?secret='.$secret.'&response='.$response;
        $verify = file_get_contents($verify_url);
        $captcha_success = json_decode($verify);

        if ($captcha_success->success == false) {
            // The user was not verified by reCAPTCHA
            echo "invalid";
            exit;
        }

        // Fetch and sanitise form submission data
        $name = str_replace(array("\r","\n"),array(" "," ") , strip_tags(trim($_POST["name"])));
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $subject = "[Website] " . strip_tags(trim($_POST["subject"]));
        $message = strip_tags(trim($_POST["message"]));

        // Check to ensure all fields are populated and email address format is valid
        if (empty($name) OR !filter_var($email, FILTER_VALIDATE_EMAIL) OR empty($subject) OR empty($message)) {
            echo "error";
            exit;
        }

        // Set the email content
        $content = "Name: $name\n";
        $content .= "Email: $email\n\n";
        $content .= "Subject: $subject\n\n";
        $content .= "Message:\n\n$message\n";

        // Set the email headers
        $headers = 'From: ' . $name . ' <' . $email . '>' . "\r\n" . 'Reply-To: ' . $email . "\r\n" . 'X-Mailer: PHP/'.phpversion();

        // Send the email
        $success = mail($mail_to, $subject, $content, $headers);

        if ($success) {
            echo "success";
        } else {
            echo "error";
        }

    } else {
        echo "Access to this page is prohibited.";
    }
?>