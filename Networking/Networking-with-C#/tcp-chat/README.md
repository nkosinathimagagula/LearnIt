# Tcp Chat

This project implements a simple TCP chat with three components: a server, a messenger (client for sending messages), and a viewer (client for receiving messages) -- [just viewers].  All components are built using .NET and are run independently.

## Project Structure

The project consists of the following files:

*   **/tcp-chat-server/** The TCP server responsible for managing client connections and message broadcasting.
*   **/tcp-chat-messenger/** A client application that allows users to send messages to the chat server.
*   **/tcp-chat-viewer/** A client application that receives and displays messages from the chat server for viewers.

## Building and Running

This project uses the .NET CLI.  Ensure you have the .NET SDK installed.

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/nkosinathimagagula/LearnIt.git  # Replace with your repository URL
    cd Networking/Networking-with-C#/tcp-chat
    ```

2.  **Build the Project:**

    You have to be in the directory of the component you want to build.

    **/tcp-chat-server/**

    **/tcp-chat-messenger/**

    **/tcp-chat-viewer/**
    
    `e.g:` building the server
    ```bash 
    cd /tcp-chat-server/
    dotnet build
    ```

3.  **Run the Applications:**

    You need to open a minimun of three separate terminal windows or tabs to run each component concurrently.

    *   **Server:**

        ```bash
        cd /tcp-chat-server/
        dotnet run
        ```

    *   **Messenger:**

        ```bash
        cd /tcp-chat-messenger/
        dotnet run
        ```

    *   **Viewer:**

        ```bash
        cd /tcp-chat-viewer/
        dotnet run
        ```

## Usage

1.  Start the server first.
2.  Then, start one or more viewers to receive messages.
3.  Finally, start one or more messengers to send messages.

The messenger will prompt you to enter your username and then your message. The message will be broadcast to all connected viewers.  Viewers will display the username and the received message.
