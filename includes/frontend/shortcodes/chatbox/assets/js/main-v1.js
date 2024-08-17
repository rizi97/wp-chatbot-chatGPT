jQuery(document).ready(function($) {

    const ajaxurl        = chatgptPluginData.ajaxurl;
    const chatInput      = $('#chatbox_input');
    const chatSendButton = $('#chatbox_send');


    function toggleSendButton() {
        const userInput = chatInput.val().trim();
        if (userInput) {
            chatSendButton.removeClass('disabled'); 
        } else {
            chatSendButton.addClass('disabled'); 

            chatInput.removeAttr("style");
        }
    }


    function sendMessage() {
        var userInput = chatInput.val();

        $.ajax({
            url: ajaxurl,  
            type: 'POST',
            data: {
                action: 'chatbot_response', 
                message: userInput
            },
            beforeSend: function() {
                // Show user's input on the right side
                const userContainer = document.createElement('div');
                userContainer.classList.add('chat-message', 'chat-message-user');
        
                // Convert newlines to <br> tags
                const formattedMessage = userInput.replace(/\n/g, '<br>');

                const userMessage = document.createElement('p');
                userMessage.innerHTML = formattedMessage;
        
                userContainer.appendChild(userMessage);
                document.getElementById("chatbox-messages").appendChild(userContainer);
        
                // Update send button UI
                chatSendButton.find('i').removeClass('bi-send');
                chatSendButton.find('i').addClass('bi-hourglass-split');
                chatSendButton.addClass('disabled');

                // Reset value of input feild
                chatInput.val("");
            },
            success: function(response) {
                const container = document.createElement('div');
                container.classList.add('chat-message', 'chat-message-bot');
        
                if(response.success) {
                    const apiResponse = response.data.choices[0].message.content;

                    // typeText(container, apiResponse);
                
                    const parts = apiResponse.split(/(```[\s\S]*?```)/g);
        
                    parts.forEach(part => {
                        if (part.startsWith('```')) {
                            // Extract the language and code
                            const codeContent = part.replace(/```/g, '').trim();
                            const [language, ...codeLines] = codeContent.split('\n');
                            
                            // Clean up each line of code by trimming spaces and tabs
                            const cleanedCode = codeLines.map(line => line.trim()).join('\n');
        
                            // Create and style the code block
                            const codeContainer = document.createElement('pre');
                            const codeElement = document.createElement('code');
                            codeElement.className = `language-${language.trim()}`; // Add language class for Prism.js
                            codeElement.textContent = cleanedCode;
        
                            codeContainer.appendChild(codeElement);
                            container.appendChild(codeContainer);
                        } else {
                            // Normal text block
                            const normalText = document.createElement('p');
                            normalText.textContent = part.trim();
                            container.appendChild(normalText);
                        }
                    });
                }
                else {
                    const errorText = document.createElement('small');
                    errorText.classList.add('errorText');
                    errorText.textContent = response.data;
                    container.appendChild(errorText);
                }
        
                document.getElementById("chatbox-messages").appendChild(container);
            
                Prism.highlightAll();
            },
            complete: function() {
                chatSendButton.find('i').removeClass('bi-hourglass-split');
                chatSendButton.find('i').addClass('bi-send');
        
                chatInput.removeAttr("style");
            },
            error: function(xhr, status, error) {
                console.error('AJAX error:', error);
            }
        });        
    }


    function typeText(container, text, delay = 6) {
        let index = 0;
    
        // Create a span element to hold the blinking cursor
        const cursor = document.createElement('span');
        cursor.classList.add('typing-cursor');
        container.appendChild(cursor);
    
        function type() {
            if (index < text.length) {
                // Insert the character before the cursor
                cursor.insertAdjacentText('beforebegin', text.charAt(index));
                index++;
                setTimeout(type, delay);
            } else {
                // Remove the cursor when typing is complete
                cursor.remove();
                Prism.highlightAll();
            }
        }
    
        type();
    }
    


    // on the basis of input text disbled class add / remove

    chatInput.on('input', function() {
        toggleSendButton();
    });


    // Submit button click ajax call send

    chatSendButton.click(function() {
        sendMessage();
    });

    chatInput.keypress(function(e) {
        if (e.which === 13) {
            if (e.shiftKey) {
                e.preventDefault();
                // Move to the next line (do nothing, just let the default behavior happen)
                chatInput.val(chatInput.val() + "\n");
            } else {
                e.preventDefault();
                sendMessage();
            }
        }
    });


    // When input text count is greater then height will increase

    function autoResize() {
        chatInput.css('height', chatInput[0].scrollHeight + 'px');
    }

    chatInput.on('input', autoResize);

});