#[derive(Debug)]
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

#[derive(Debug)]
struct  Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

impl Rectangle {
    fn square(size: u32) -> Rectangle {
        Rectangle { width: size, height: size }
    }
}

fn main() {
    let mut user1 = User {
        email: String::from("nkn@walt.co.za"),
        username: String::from("nknwalt"),
        active: true,
        sign_in_count: 1
    };

    let name = user1.username;
    user1.email = String::from("newemail@example.com");

    let user2 = build_user(String::from("user2@gmail.com"), String::from("user2"));

    let user3 = User {
        email: String::from("user3@gmail.com"),
        username: String::from("user3"),
        ..user2
    };

    println!("User1: {}, {}, {}, {}", name, user1.email, user1.active, user1.sign_in_count);

    println!("user2: {:?}", user2);
    println!("user3: {:?}", user3);

    // struct Color(i32, i32, i32);
    // struct Point(i32, i32, i32);



    let rect = Rectangle {
        width: 30,
        height: 50
    };

    let rect_area = rect.area();

    println!("The area of the rectangle is {} square pixels.", rect_area);

    println!("Rectangle is {:#?}", rect);



    let rect2 = Rectangle::square(20);
    println!("Rectangle is {:#?}", rect2);
}

fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1
    }
}
