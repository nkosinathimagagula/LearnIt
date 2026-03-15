use std::fs::File;
use std::io::ErrorKind;
use std::io::Error;
use std::io::Read;

fn main() {
    // 000 - panic
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(err) => panic!("Problem creating the file: {:?}", err),
            }
            other_error => panic!("Problem opening the file: {:?}", other_error),
        }
    };

    println!("File opened successfully: {:?}", f);


    // 001 - using closure to handle error
    let f2 = File::open("hello2.txt").unwrap_or_else(|error| {
        if error.kind() == ErrorKind::NotFound {
            File::create("hello2.txt").unwrap_or_else(|error| {
                panic!("Problem creating the file: {:?}", error)
            })
        } else {
            panic!("Problem opening the file: {:?}", error);
        }
    });

    println!("File opened successfully: {:?}", f2);
}


fn read_username_from_file() -> Result<String, Error> {
    let mut f = File::open("hello3.txt")?;      // ? is the same as using .unwrap() but it returns the error to the caller instead of panicking
    let mut s = String::new();

    f.read_to_string(&mut s)?;
    Ok(s)

    // chaining the operations together
    // let mut s2 = String::new();
    // File::open("hello4.txt")?.read_to_string(&mut s2)?;
    // Ok(s2)
}