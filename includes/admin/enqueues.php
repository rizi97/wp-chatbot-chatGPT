<?php

function chatgpt_plugin_admin_scripts() {
    wp_enqueue_style('chatgpt-plugin-admin-css', CHATGPT_PLUGIN_URL . 'assets/css/admin-style.css');
}
add_action('admin_enqueue_scripts', 'chatgpt_plugin_admin_scripts');