<?php
// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Setting button display beside activation button
function chatgpt_plugin_settings_link($links) {
    $settings_link = '<a href="options-general.php?page=chatgpt-plugin-settings">Settings</a>';
    array_unshift($links, $settings_link);
    return $links;
}
add_filter('plugin_action_links', 'chatgpt_plugin_settings_link');

// Add settings page to the admin menu
function chatgpt_plugin_add_settings_page() {
    add_options_page(
        'ChatGPT Plugin Settings', // Page title
        'ChatGPT Plugin',          // Menu title
        'manage_options',          // Capability required to see the page
        'chatgpt-plugin-settings', // Menu slug
        'chatgpt_plugin_render_settings_page' // Function to render the settings page
    );
}
add_action('admin_menu', 'chatgpt_plugin_add_settings_page');

// Render the settings page
function chatgpt_plugin_render_settings_page() {
    ?>
    <div class="chatgpt_plugin_wrap">
        <h1>ChatGPT Plugin Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('chatgpt_plugin_options_group');
            do_settings_sections('chatgpt-plugin-settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Register settings
function chatgpt_plugin_register_settings() {
    register_setting('chatgpt_plugin_options_group', 'chatgpt_plugin_api_key');
    register_setting('chatgpt_plugin_options_group', 'chatgpt_plugin_enable_feature');

    add_settings_section(
        'chatgpt_plugin_main_section',
        'Main Settings',
        'chatgpt_plugin_main_section_callback',
        'chatgpt-plugin-settings'
    );

    add_settings_field(
        'chatgpt_plugin_api_key',
        'API Key',
        'chatgpt_plugin_api_key_callback',
        'chatgpt-plugin-settings',
        'chatgpt_plugin_main_section'
    );

    add_settings_field(
        'chatgpt_plugin_enable_feature',
        'Dark Theme',
        'chatgpt_plugin_enable_feature_callback',
        'chatgpt-plugin-settings',
        'chatgpt_plugin_main_section'
    );
}
add_action('admin_init', 'chatgpt_plugin_register_settings');

// Section callback
function chatgpt_plugin_main_section_callback() {
    echo '<p>Enter your ChatGPT API key and configure plugin settings.</p>';
}

// Field callback for API Key
function chatgpt_plugin_api_key_callback() {
    $api_key = get_option('chatgpt_plugin_api_key');
    echo '<input type="text" class="api_key_field" name="chatgpt_plugin_api_key" value="' . esc_attr($api_key) . '" />';
}

// Field callback for toggle button
function chatgpt_plugin_enable_feature_callback() {
    $enabled = get_option('chatgpt_plugin_enable_feature');
    $checked = $enabled ? 'checked' : '';
    ?>
    <label class="switch">
        <input type="checkbox" name="chatgpt_plugin_enable_feature" value="1" <?php echo $checked; ?> />
        <span class="slider round"></span>
    </label>
    <?php
}
