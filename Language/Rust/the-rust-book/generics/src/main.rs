struct Point<T, K> {
    x: T,
    y: K,
}

fn main() {
    let p1 = Point { x: 5, y: 10.0 };

    println!("p1.x = {}, p1.y = {}", p1.x, p1.y);

    let number_list = vec![34, 50, 25, 100, 65];

    let res = get_largest(number_list);

    print!("The largest number is {}", res);
}

fn get_largest<T: PartialOrd + Copy>(list: Vec<T>) -> T {
    let mut largest = list[0];

    for number in list {
        if number > largest {
            largest = number;
        }
    }

    largest
}
