using System;
using System.Text;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Threading;

namespace TcpChatServer
{
    class TcpChatServer
    {
        // What listens in
        private TcpListener _listener;

        // types of clients connected
        private List<TcpClient> _viewers = new List<TcpClient>();
        private List<TcpClient> _messengers = new List<TcpClient>();

        // Names that are taken by other messangers
        private Dictionary<TcpClient, string> _names = new Dictionary<TcpClient, string>();

        // Messages that need to be sent
        private Queue<string> _messageQueue = new Queue<string>();

        // Extra data
        public readonly string chatName;
        public readonly int port;
        public bool running { get; private set; }

        // Buffer -- [2KB]
        public readonly int BufferSize = 2 * 1024;

        // Make a new TCP chat server with our provided name
        public TcpChatServer(string chatName, int port)
        {
            // set basic data
            this.chatName = chatName;
            this.port = port;
            this.running = false;

            // Make the listener listen for connections on any device
            this._listener = new TcpListener(IPAddress.Any, this.port);
        }

        // This will shutdown the server if it's running
        public void Shutdown()
        {
            Console.WriteLine("Shutting down the server!");
            this.running = false;
        }

        // Start running the server
        public void Run()
        {
            // Some info
            Console.WriteLine("Starting \"{0}\" TCP Chat Server on port {1}.", this.chatName, this.port);
            Console.WriteLine("Press Ctrl+C to shutdown the server.");

            // Make the server run
            this._listener.Start();
            this.running = true;


            // Main server loop
            while (this.running)
            {
                // Check for new clients
                if (this._listener.Pending())
                {
                    _handleNewConnection();
                }

                // Do the rest
                _checkForDisconnects();
                _checkForNewMessages();
                _sendMessages();

                // Use less CPU
                Thread.Sleep(10);
            }

            // Stop the server and clean up any connected clients
            foreach (TcpClient v in this._viewers)
            {
                _cleanupClient(v);
            }

            foreach (TcpClient m in this._messengers)
            {
                _cleanupClient(m);
            }

            this._listener.Stop();

            // info
            Console.WriteLine("Server is shutdown");
        }

        private void _handleNewConnection()
        {
            bool good = false;
            TcpClient newClient = this._listener.AcceptTcpClient();
            NetworkStream netStream = newClient.GetStream();

            // Modify default buffer size
            newClient.SendBufferSize = this.BufferSize;
            newClient.ReceiveBufferSize = this.BufferSize;

            // info
            EndPoint? endPoint = newClient.Client.RemoteEndPoint;
            Console.WriteLine("Handling a new connection from {0} ...", endPoint);

            // Let them identify themselves
            byte[] messageBuffer = new byte[this.BufferSize];
            int bytesRead = netStream.Read(messageBuffer, 0, messageBuffer.Length);

            if (bytesRead > 0)
            {
                string message = Encoding.UTF8.GetString(messageBuffer, 0, bytesRead);

                if (message == "viewer")
                {
                    good = true;
                    this._viewers.Add(newClient);

                    Console.WriteLine("{0} is a viewer", endPoint);

                    // Send them a hello message
                    message = String.Format("Welcome to {0} chat server!", this.chatName);
                    messageBuffer = Encoding.UTF8.GetBytes(message);
                    netStream.Write(messageBuffer, 0, messageBuffer.Length);
                }
                else if (message.StartsWith("name:"))
                {
                    // messenger
                    string name = message.Substring(message.IndexOf(":") + 1);

                    if ((name != string.Empty) && (!_names.ContainsValue(name)))
                    {
                        // They are new here
                        good = true;
                        this._names.Add(newClient, name);
                        this._messengers.Add(newClient);

                        Console.WriteLine("{0} is a Messenger with the name {1}.", endPoint, name);

                        // tell the viewers we have a new messenger
                        this._messageQueue.Enqueue(String.Format("{0} has joined the chat.", name));
                    }
                }
                else
                {
                    // it wasn't either a viewer or messenger, clean up anyways
                    Console.WriteLine("Wasn't able to identify {0} as a viewer or messenger.", endPoint);
                    _cleanupClient(newClient);
                }
            }

            // Do we really need them???
            if (!good)
            {
                newClient.Close();
            }
        }
        
        // Sees if any of the clients have left the chat server
        private void _checkForDisconnects()
        {
            // check the viewers first
            foreach (TcpClient v in this._viewers.ToArray())
            {
                if (_isDisconnected(v))
                {
                    Console.WriteLine("Viewer {0} has left.", v.Client.RemoteEndPoint);

                    // cleanup on our end
                    this._viewers.Remove(v);
                    _cleanupClient(v);
                }
            }

            // now check the messengers
            foreach (TcpClient m in this._messengers.ToArray())
            {
                if (_isDisconnected(m))
                {
                    // get info about the messenger
                    string name = _names[m];

                    // tell the viewers someone has left
                    Console.WriteLine("Messenger {0} has left.", name);
                    this._messageQueue.Enqueue(String.Format("{0} has left the chat.", name));

                    // cleanup on our end
                    _messengers.Remove(m);
                    _names.Remove(m);
                    _cleanupClient(m);
                }
            }
        }

        // see if our messengers has sent us a new message
        private void _checkForNewMessages()
        {
            foreach (TcpClient m in this._messengers)
            {
                int messageLength = m.Available;
                if (messageLength > 0)
                {
                    // there's one.. get it
                    byte[] messageBuffer = new byte[messageLength];
                    // Stream.Read and Stream.ReadAsync might return fewer bytes than requested, resulting in unreliable code if the return value isn't checked.
                    // Stream.ReadExactly and Stream.ReadExactlyAsync are used now
                    // https://learn.microsoft.com/en-us/dotnet/fundamentals/code-analysis/quality-rules/ca2022
                    m.GetStream().ReadExactly(messageBuffer, 0, messageBuffer.Length);

                    // attach name to it and shove it into the queue
                    string message = String.Format("{0}: {1}", this._names[m], Encoding.UTF8.GetString(messageBuffer));
                    this._messageQueue.Enqueue(message);
                }
            }
        }

        // clears out the message queue and sends it to all the viewers
        private void _sendMessages()
        {
            foreach (string message in this._messageQueue)
            {
                // encode the message
                byte[] messageBuffer = Encoding.UTF8.GetBytes(message);

                // send the message to each viewer
                foreach (TcpClient v in this._viewers)
                {
                    v.GetStream().Write(messageBuffer, 0, messageBuffer.Length);
                }
            }

            // clear the queue
            this._messageQueue.Clear();
        }

        // Checks if a socket has disconnected
        // Adapted from -- http://stackoverflow.com/questions/722240/instantly-detect-client-disconnection-from-server-socket
        private static bool _isDisconnected(TcpClient client)
        {
            try
            {
                Socket s = client.Client;
                return s.Poll(10 * 1000, SelectMode.SelectRead) && (s.Available == 0);
            }
            catch (SocketException)
            {
                // we got a socket error, assume it's desconnected
                return true;
            }
        }

        // cleanup resources for a TcpClient
        private static void _cleanupClient(TcpClient client)
        {
            client.GetStream().Close();             // close network stream
            client.Close();                         // close client
        }


        public static TcpChatServer? chat;

        protected static void InterruptHandler(object? sender, ConsoleCancelEventArgs args)
        {
            chat?.Shutdown();
            args.Cancel = true;
        }

        public static void Main(string[] args)
        {
            // create the server
            string name = "Bad IRC";                // args[0].Trim();
            int port = 6000;                        // int.Parse(args[1].Trim());

            chat = new TcpChatServer(name, port);

            // add a handlerfor a Ctrl+c press
            Console.CancelKeyPress += InterruptHandler;

            // run the chat server
            chat.Run();
        }
    }
}
