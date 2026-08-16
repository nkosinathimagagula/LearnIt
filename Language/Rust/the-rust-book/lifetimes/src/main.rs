use std::fmt::Display;

fn longest_with_an_announcement<'a, T>(
    x: &'a str, 
    y: &'a str, 
    ann: T
) -> &'a str where T: Display {
    println!("Announcement! {}", ann);
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("long string");
    let string2 = String::from("xyz");

    let result = longest_with_an_announcement(
        string1.as_str(), 
        string2.as_str(), 
        "Hello, world!"
    );
    println!("The longest string is: {}", result);
}

/*
* &str          - a string slice, which is a reference to a string. It does not own the string data, but rather points to it. 
                  The lifetime of a string slice is tied to the lifetime of the string it references.
* &'a str       - a string slice with an explicit lifetime parameter 'a. This means that the string slice must live at least as long as the lifetime 'a. 
                  The lifetime parameter allows us to specify how long the reference is valid, which is important for ensuring memory safety in Rust.
* &'a mut str   - a mutable string slice with an explicit lifetime parameter 'a. This means that the mutable string slice must live at least as long as the lifetime 'a, 
                  and it allows us to modify the string data it references. 
                  The lifetime parameter ensures that the mutable reference is valid for the specified duration, preventing dangling references and ensuring memory safety.
*/
// fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
//     if x.len() > y.len() {
//         x
//     } else {
//         y
//     }
// }
