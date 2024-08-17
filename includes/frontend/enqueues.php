<?php

// Enqueue frontend JS
function chatgpt_plugin_frontend_scripts() {
    wp_enqueue_script('chatgpt-plugin-jquery', CHATGPT_PLUGIN_URL . 'assets/js/jquery.min.js', array(''), null, true);
}
add_action('wp_enqueue_scripts', 'chatgpt_plugin_frontend_scripts');
