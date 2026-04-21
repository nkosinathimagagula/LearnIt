// use std::fmt::Display;

pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize_author(&self) -> String {
        format!("@{}", self.author)
    }
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.summarize_author(), self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }

    fn summarize(&self) -> String {
        format!("{}: {}", self.summarize_author(), self.content)
    }
}

pub trait Summary {
    fn summarize_author(&self) -> String {
        String::from("Anonymous")
    }

    fn summarize(&self) -> String {
        format!("(Read more from {} ...)", self.summarize_author())
    }
}

pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}

// trait bound syntax
// pub fn notify_generic<T: Summary>(item: &T) {
//     println!("Breaking news! {}", item.summarize());
// }

// using where clause for trait bounds
// fn some_function<T: Summary, U: Summary>(t: &T, u: &U) -> i32 
//     where T: Display + Clone, U: Clone + Debug
// {
//     // ..
//     0
// }

fn return_summarizable() -> impl Summary {
    Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("of course, as you probably already know, people"),
        reply: false,
        retweet: false,
    }
}

fn main() {
    let tweet = Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("of course, as you probably already know, people"),
        reply: false,
        retweet: false,
    };

    let article = NewsArticle {
        headline: String::from("Penguins win the Stanley Cup Championship!"),
        location: String::from("Pittsburgh, PA, USA"),
        author: String::from("John Doe"),
        content: String::from("The Pittsburgh Penguins have won the Stanley Cup!"),
    };

    println!("Tweet Summary: {}", tweet.summarize());
    println!("Article Summary: {}", article.summarize());

    println!();

    notify(&tweet);
    notify(&article);

    println!();

    println!("Return Summarizable: {}", return_summarizable().summarize());
}
