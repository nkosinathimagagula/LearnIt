use std::collections::HashMap;

fn main() {
    // let a = [1, 2, 3];
    let mut v: Vec<i32> = Vec::new();

    v.push(4);
    v.push(6);
    v.push(7);
    v.push(9);

    {
        let v2 = vec![1, 2, 3, 4, 5];

        let third: &i32 = &v2[2];
        println!("The third element is {} in `v2`", third);
    }

    match v.get(1) {
        Some(v_second) => println!("The second element is {} in `v`", v_second),
        None => println!("There is no second element in `v`."),
        
    }

    for i in &v {
        println!("{}", i);
    }


    // HashMap
    let blue = String::from("Blue");
    let yellow = String::from("Yellow");
    let green = String::from("Green");

    let mut scores = HashMap::new();

    // insert blue and yellow scores (updatable)
    scores.insert(&blue, 10);
    scores.insert(&yellow, 50);

    // insert green score if it doesn't exist (not updatable)
    scores.entry(&green).or_insert(80);

    let blue_score = scores.get(&blue);
    println!("Blue's score: {}", blue_score.unwrap_or(&0));

    match scores.get(&yellow) {
        Some(score) => println!("Yellow's score: {}", score),
        None => println!("Yellow's score not found."),
    }


    // more hashmap examples
    let text = "hello world wonderful world";

    let mut map = HashMap::new();

    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }

    println!("text map: {:?}", map);
}
