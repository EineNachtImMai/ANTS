//               ,
//       _,-'\   /|   .    .    /`.
//   _,-'     \_/_|_  |\   |`. /   `._,--===--.__
//  ^       _/"/  " \ : \__|_ /.   ,'    :.  :. .`-._
//         // ^   /7 t'""    "`-._/ ,'\   :   :  :  .`.
//         Y      L/ )\         ]],'   \  :   :  :   : `.
//         |        /  `.n_n_n,','\_    \ ;   ;  ;   ;  _>
//         |__    ,'     |  \`-'    `-.__\_______.==---'
//        //  `""\\      |   \            \
//        \|     |/      /    \            \
//                      /     |             `.
//                     /      |               ^
//                    ^       |
// Stef                       ^


// number of times my PC crashed in the development process (without counting the initial few days,
// otherwise i'd have like 20 more)


// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::{File, OpenOptions};
use std::io::{Write, BufReader, BufRead, Error};

// #[tauri::command]
// async fn open_file_dialog() -> Option<String> {
//     match tauri::FileDialog::new()
//         .add_filter("All Files", "*")
//         .pick_file()
//         .await
//     {
//         Ok(Some(file)) => Some(file.path().to_string_lossy().to_string()),
//         _ => None,
//     }
// }

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
