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
//
// I am neither the creator nor the owner of this ASCII art, Stef is. The site I found it on seemed
// to allow the usage of the artworks as long as you leave the signature (which I did) but if you
// are the owner and would like it removed, feel free to contact me.


// number of times my PC crashed in the development process (without counting the initial few days,
// otherwise i'd have like 20 more)
//
// crash_counter = 5


// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::{File, OpenOptions};
use std::io::{Write, BufReader, BufRead, Error};
use markdown::{to_html_with_options, CompileOptions, Options};

fn write_to_result(path: &str, contents: &str, append: bool) -> Result<(), Error> {
    let mut output = OpenOptions::new().write(true).append(append).create(true).open(path).unwrap();
    writeln!(output, "{contents}").expect("oopsie woopsie");

    Ok(())
}


#[tauri::command]
fn write(path: &str, contents: &str, append: bool) {
    write_to_result(path, contents, append).expect("failed to write");
}


fn read_to_result(path: &str) -> Result<String, Error> {
    let input = File::open(path)?;
    let buffered = BufReader::new(input);

    let mut together: String = "".to_owned();

    for line in buffered.lines() {
        together = together + line.expect("sure hope this works lol").as_str() + "<br>";
    }
    
    Ok(together)
}

#[tauri::command]
fn read(path: &str) -> String {
    let result = read_to_result(path).expect("well, shit");
    result
}

#[tauri::command]
fn convertMDtoHTML(contents: &str) -> String {
    to_html_with_options(
        contents,
        &Options {
            compile: CompileOptions {
                allow_dangerous_html: true,
                ..CompileOptions::default()
            },
            ..Options::default()
        }
    ).expect("we fucked up")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read, write, convertMDtoHTML])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
