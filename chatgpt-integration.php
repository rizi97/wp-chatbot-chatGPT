<?php
/*
Plugin Name: ChatGPT Integration
Description: Integrates ChatGPT into the website.
Version: 1.0
Author: PowerHouse Team
*/


if (!defined('ABSPATH')) {
    exit;
}

// Define Plugin Constants
define('CHATGPT_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('CHATGPT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include the necessary files
require_once CHATGPT_PLUGIN_PATH . 'includes/admin/enqueues.php';
require_once CHATGPT_PLUGIN_PATH . 'includes/admin/admin-settings.php';
require_once CHATGPT_PLUGIN_PATH . 'includes/frontend/enqueues.php';
require_once CHATGPT_PLUGIN_PATH . 'includes/frontend/shortcodes/chatbox/main.php';



