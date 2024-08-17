<?php

define('SHORTCODE_PATH', "includes/frontend/shortcodes/chatbox/");


function chatgpt_plugin_shortcode_chatbox() {
    wp_enqueue_style('shortcode_chatbox_prism', CHATGPT_PLUGIN_URL . SHORTCODE_PATH . "assets/css/prism-tomorrow.min.css");

    if(get_option('chatgpt_plugin_enable_feature')) {
        wp_enqueue_style('shortcode_chatbox_dark_style', CHATGPT_PLUGIN_URL . SHORTCODE_PATH . "assets/css/dark_style.css");
    }
    else {
        wp_enqueue_style('shortcode_chatbox_style', CHATGPT_PLUGIN_URL . SHORTCODE_PATH . "assets/css/style.css");
    }
    
    wp_enqueue_style('shortcode_chatbox_icons', CHATGPT_PLUGIN_URL . SHORTCODE_PATH . "assets/css/bootstrap-icons.css");

    wp_enqueue_script('shortcode_chatbox_prism', CHATGPT_PLUGIN_URL . SHORTCODE_PATH . "assets/js/prism.min.js", array("jquery"), null, true);
    wp_enqueue_script('shortcode_chatbox_typeit', CHATGPT_PLUGIN_URL . SHORTCODE_PATH . "assets/js/typed.min.js", array("jquery"), null, true);
    wp_enqueue_script('shortcode_chatbox_main', CHATGPT_PLUGIN_URL . SHORTCODE_PATH . 'assets/js/main.js', array('jquery'), null, true);

    wp_localize_script('shortcode_chatbox_main', 'chatgptPluginData', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'dark_theme' => get_option('chatgpt_plugin_enable_feature')
    ));
}
add_action('wp_enqueue_scripts', 'chatgpt_plugin_shortcode_chatbox');



function chatgpt_plugin_display_chatbox() {
    ob_start();
    
    $file_path = CHATGPT_PLUGIN_PATH . SHORTCODE_PATH . '/view.php';
    
    if (file_exists($file_path)) {
        include $file_path;
    } else {
        echo 'File not found: ' . $file_path;
    }

    return ob_get_clean();
}
add_shortcode('chatbox', 'chatgpt_plugin_display_chatbox');



function handle_chatbot_response() {
    ob_clean();
    
    $apiKey = get_option('chatgpt_plugin_api_key');
    
    if(!$apiKey) {
        wp_send_json_error("Something wrong with your API Key.");
    }
    else {
        $user_input = isset($_POST['message']) ? sanitize_text_field($_POST['message']) : '';
    
        $response = wp_remote_post( 'https://api.openai.com/v1/chat/completions', array(
            'method'    => 'POST',
            'body'      => json_encode( array(
                'model'    => 'gpt-3.5-turbo',  
                'messages' => array(
                    array(
                        'role'    => 'user',
                        'content' => $user_input
                    )
                ),
                'max_tokens' => 150
            ) ),
            'headers'   => array(
                'Content-Type'  => 'application/json',
                'Authorization' => 'Bearer ' . $apiKey,
            ),
        ) );
    
        if (is_wp_error($response)) {
            wp_send_json_error($response->get_error_message());
        } else {
            $body = wp_remote_retrieve_body($response);
            wp_send_json_success(json_decode($body, true));
        }
    }
    
    wp_die();
}
add_action('wp_ajax_chatbot_response', 'handle_chatbot_response');
add_action('wp_ajax_nopriv_chatbot_response', 'handle_chatbot_response');




function demo_content() {
    ob_clean();
    
    $response = array(
        "success" => true,
        "data" => array(
            "id" => "chatcmpl-9ueDfK08y0bdGRNIV95RFhJrU5Ees",
            "object" => "chat.completion",
            "created" => 1723287999,
            "model" => "gpt-3.5-turbo-0125",
            "choices" => array(
                array(
                    "index" => 0,
                    "message" => array(
                        "role" => "assistant",
                        "content" => "Civil work refers to any work or projects carried out by the government or non-profit organizations that benefit society as a whole. Some examples of civil work include infrastructure projects, social welfare programs, environmental conservation efforts, and community development initiatives.

The benefits of civil work are numerous and far-reaching. Some of the key benefits include:

```php
<?php
  echo 'Hello, World!';
?>
```

1. Improved quality of life: Civil work projects help to improve the overall quality of life for individuals in a community by providing essential services such as clean water, sanitation, healthcare, and transportation.

2. Economic development: Civil work projects stimulate economic growth by creating jobs, increasing property values, and attracting investment to an area.

3. Social cohesion: Civil work projects bring communities together and foster a sense of belonging and pride among residents",
                        "refusal" => null
                    ),
                    "logprobs" => null,
                    "finish_reason" => "stop"
                )
            ),
            "usage" => array(
                "prompt_tokens" => 13,
                "completion_tokens" => 72,
                "total_tokens" => 85
            ),
            "system_fingerprint" => null
        )
    );
    
    wp_send_json($response);
    
    
    wp_die();
}
add_action('wp_ajax_demo_content', 'demo_content');
add_action('wp_ajax_nopriv_demo_content', 'demo_content');







