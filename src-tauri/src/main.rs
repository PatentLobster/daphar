#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use har;

#[tauri::command]
fn parse_har(path: &str) -> String {
    return match har::from_path(path) {
        Ok(spec) => match har::to_json(&spec) {
            Ok(str) => str,
            Err(_) => "err".to_string()
        },
        Err(_) => "error".to_string()
    }
}



fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, parse_har])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
