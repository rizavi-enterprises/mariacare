<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contact Form</title>
    <style>
        .contact-form-container {
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        input, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        
        button {
            background-color: #4285f4;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        button:hover {
            background-color: #357ae8;
        }
        
        .success-message {
            color: #4CAF50;
            margin-top: 10px;
            display: none;
        }
        
        .error-message {
            color: #f44336;
            margin-top: 10px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="contact-form-container">
        <h2>Contact Us</h2>
        <form id="contactForm">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="phone">Phone:</label>
                <input type="tel" id="phone" name="phone">
            </div>
            
            <div class="form-group">
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            
            <button type="submit">Submit</button>
        </form>
        
        <div id="successMessage" class="success-message">
            Thank you for your message! We'll get back to you soon.
        </div>
        
        <div id="errorMessage" class="error-message">
            Sorry, there was an error sending your message. Please try again later.
        </div>
    </div>

    <script>
        document.getElementById('contactForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };
            
            try {
                // Replace with your backend service URL
                const response = await fetch('http://your-backend-service-url/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    // Show success message
                    document.getElementById('successMessage').style.display = 'block';
                    document.getElementById('errorMessage').style.display = 'none';
                    
                    // Reset form
                    document.getElementById('contactForm').reset();
                } else {
                    throw new Error('Server response was not OK');
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('successMessage').style.display = 'none';
                document.getElementById('errorMessage').style.display = 'block';
            }
        });
    </script>
</body>
</html>
