jQuery(document).ready(function($) {

    const ajaxUrl         = chatgptPluginData.ajaxurl;
    const darkTheme       = chatgptPluginData.dark_theme;

    const chatInput       = $('#chatbox_input');
    const chatSendButton  = $('#chatbox_send');
    const chatboxMessages = document.getElementById("chatbox-messages");

    // console.log(darkTheme)

    // Add class in body if dark theme toggle selected from the plugin settings
    if(darkTheme == 1) {
        $("body").addClass("chatbox_dark")
        $(".chatbox_wrapper .chatbox_bottom_wrap").css("backgroundColor", "#000")
    }



    function toggleSendButton() {
        const userInput = chatInput.val().trim();
        if (userInput) {
            chatSendButton.removeClass('disabled'); 
        } else {
            chatSendButton.addClass('disabled'); 

            chatInput.removeAttr("style");
        }
    }


    function scrollToBottom() {
        document.body.scrollTop = document.body.scrollHeight;
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
    }


    function sendMessage() {
        var userInput  = chatInput.val();

        $.ajax({
            url: ajaxUrl,  
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
                chatboxMessages.appendChild(userContainer);

                // Add Loader
                const loaderContainer = document.createElement('div');
                loaderContainer.classList.add('loader_wrap');
                const loaderElement = document.createElement('p');
                loaderElement.classList.add('loader');

                loaderContainer.appendChild(loaderElement);
                chatboxMessages.appendChild(loaderContainer);


                // Scroll to the latest content
                scrollToBottom();

        
                // Update send button UI
                chatSendButton.find('i').removeClass('bi-send');
                chatSendButton.find('i').addClass('bi-hourglass-split');
                chatSendButton.addClass('loading disabled');

                // Reset value of input feild
                chatInput.val("");
            },
            success: function(response) {
                const container = document.createElement('div');
                container.classList.add('chat-message', 'chat-message-bot');
            
                if (response.success) {
                    if ('error' in response.data) {
                        const errorText = document.createElement('small');
                        errorText.classList.add('errorText');
                        errorText.textContent = response.data.error.message;
                        container.appendChild(errorText);
                    } else {
                        const apiResponse = response.data.choices[0].message.content;
            
                        // Split the response into parts for code blocks and text
                        const parts = apiResponse.split(/(```[\s\S]*?```)/g);

                        console.log(parts)
            
                        // Process each part
                        parts.forEach(part => {
                            if (part.startsWith('```')) {
                                // Handle code blocks
                                const codeContent = part.replace(/```/g, '').trim();
                                const [language, ...codeLines] = codeContent.split('\n');
                                const cleanedCode = codeLines.join('\n');
                        
                                const codeContainer = document.createElement('pre');
                                const codeElement = document.createElement('code');
                                codeElement.className = `language-${language.trim()}`;
                                codeElement.textContent = cleanedCode;
                        
                                codeContainer.appendChild(codeElement);
                                container.appendChild(codeContainer);
                        
                                // Highlight code blocks with Prism.js
                                Prism.highlightElement(codeElement);
                            } else {
                                // Handle text content
                                let formattedContent = part.trim();
                        
                                // Replace list markers with HTML list elements
                                const lines = formattedContent.split('\n');
                                let currentList = null;

                                console.log(lines)
                        
                                lines.forEach(line => {
                                    const olMatch = line.match(/^\d+\.\s+/); // Match ordered list item
                                    const ulMatch = line.match(/^\s*-\s+/); // Match unordered list item
                        
                                    if(line.trim()) {
                                        if (olMatch) {
                                            if (!currentList || currentList.tagName !== 'OL') {
                                                // If we're not in an ordered list, close the current list and start a new ordered list
                                                if (currentList) container.appendChild(currentList);
                                                currentList = document.createElement('ol');
                                            }
                                            const listItem = document.createElement('li');
                                            listItem.textContent = line.replace(olMatch[0], '');
                                            currentList.appendChild(listItem);
                                        } else if (ulMatch) {
                                            if (!currentList || currentList.tagName !== 'UL') {
                                                // If we're not in an unordered list, close the current list and start a new unordered list
                                                if (currentList) container.appendChild(currentList);
                                                currentList = document.createElement('ul');
                                            }
                                            const listItem = document.createElement('li');
                                            listItem.textContent = line.replace(ulMatch[0], '');
                                            currentList.appendChild(listItem);
                                        } else {
                                            // If there's a current list, append it and reset
                                            if (currentList) {
                                                container.appendChild(currentList);
                                                currentList = null;
                                            }

                                            // Handle other text content as paragraphs
                                            const paragraph = document.createElement('p');
                                            paragraph.textContent = line;
                                            container.appendChild(paragraph);
                                        }
                                    }
                                });
                        
                                // Append any remaining list
                                if (currentList) {
                                    container.appendChild(currentList);
                                }
                            }
                        });
                    }
                } else {
                    const errorText = document.createElement('small');
                    errorText.classList.add('errorText');
                    errorText.textContent = response.data;
                    container.appendChild(errorText);
                }
            
                chatboxMessages.appendChild(container);
            
                // Scroll to the latest content
                scrollToBottom();
            },            
            
            complete: function() {
                chatSendButton.find('i').removeClass('bi-hourglass-split');
                chatSendButton.find('i').addClass('bi-send');

                chatSendButton.removeClass('loading');
        
                chatInput.removeAttr("style");

                // Hide loader
                $(".chatbox_wrapper .loader_wrap").hide();

                // Scroll to the latest content
                scrollToBottom();
            },
            error: function(xhr, status, error) {
                console.error('AJAX error:', error);
            }
        });        
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
                
                var userInput  = chatInput.val().trim();
                if(userInput) 
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