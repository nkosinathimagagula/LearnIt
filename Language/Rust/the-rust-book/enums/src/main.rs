enum IpAddrKind {
    V4,
    V6,
}

struct IpAddr {
    kind: IpAddrKind,
    address: String,
}

fn main() {
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;

    let localhost = IpAddr {
        kind: IpAddrKind::V4,
        address: String::from("127.0.0.0.1"),
    };



    //
    let x: i8 = 5;
    let y: Option<i8> = Some(5);

    let sum = x + y.unwrap_or(0);
    println!("The sum is: {}", sum);

    match_ip_addr_kind(Some(IpAddrKind::V4));
    match_ip_addr_kind(Some(IpAddrKind::V6));
    match_ip_addr_kind(None);

}

fn match_ip_addr_kind(ip_kind: Option<IpAddrKind>) {
    match ip_kind {
        Some(IpAddrKind::V4) => println!("It's an IPv4 address!"),
        Some(IpAddrKind::V6) => println!("It's an IPv6 address!"),
        None => println!("No IP address provided!"),
    }
}
