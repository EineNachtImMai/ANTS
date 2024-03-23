// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::{File, OpenOptions};
use std::io::{Write, BufReader, BufRead, Error};

// use serde_json::Result;

#[tauri::command]
fn write(path: &str, contents: &str) -> Result<(), Error> {
    let mut output = OpenOptions::new().write(true).open(path).unwrap();
    writeln!(output, "{contents}").expect("oopsie woopsie");

    Ok(())
}


#[tauri::command]
fn read(path: &str) -> Result<String, Error> {
    let input = File::open(path)?;
    let buffered = BufReader::new(input);

    let mut together: String = "".to_owned();

    for line in buffered.lines() {
        together = together + "\n" + line.expect("sure home this works lol").as_str();
    }
    
    Ok(together)
}

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
