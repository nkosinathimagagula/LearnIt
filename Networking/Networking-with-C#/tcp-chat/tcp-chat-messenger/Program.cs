using System;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.Threading;

namespace TcpChatMessenger
{
    class TcpChatMessenger
    {
        // connection objects
        public readonly string serverAddress;
        public readonly int port;
        private TcpClient _client;
        public bool running { get; private set; }

        // buffer & messaging
        public readonly int bufferSize = 2 * 1024;      // 2KB
        private NetworkStream? _messageStream;

        // personal data
        public readonly string name;

        public TcpChatMessenger(string serverAddress, int port, string name)
        {
            // create a non-connected TcpClient
            this._client = new TcpClient();
            this._client.SendBufferSize = this.bufferSize;
            this._client.ReceiveBufferSize = this.bufferSize;
            this.running = false;

            // set other things
            this.serverAddress = serverAddress;
            this.port = port;
            this.name = name;
        }

        public void Connect()
        {
            // try to connect
            this._client.Connect(serverAddress, port);
            EndPoint? endpoint = this._client.Client.RemoteEndPoint;

            // make sure we're connected
            if (this._client.Connected)
            {
                Console.WriteLine("Connected to server at {0}", endpoint);

                // Tell them that we're a messenger
                this._messageStream = this._client.GetStream();
                byte[] messageBuffer = Encoding.UTF8.GetBytes(String.Format("name:{0}", this.name));
                this._messageStream.Write(messageBuffer, 0, messageBuffer.Length);

                // if we are still connected after sending our name, that means the server accepts us
                if (!_isDisconnected(this._client))
                {
                    this.running = true;
                }
                else
                {
                    // name was probably taken
                    _cleanupNetworkResources();
                    Console.WriteLine("The server rejected us; \"{0}\" is probably in use.", this.name);
                }
            }
            else
            {
                _cleanupNetworkResources();
                Console.WriteLine("Wasn't able to connect to the server at {0}.", endpoint);
            }
        }

        public void SendMessages()
        {
            bool wasRunning = this.running;

            while (this.running)
            {
                // poll for user input
                Console.WriteLine("{0}> ", this.name);
                string message = Console.ReadLine() ?? string.Empty;

                // quit or send a message
                if ((message.ToLower() == "quit") || (message.ToLower() == "exit"))
                {
                    Console.WriteLine("Disconnecting...");
                    this.running = false;
                }
                else if (message != string.Empty)
                {
                    // send the message
                    byte[] messageBuffer = Encoding.UTF8.GetBytes(message);
                    this._messageStream?.Write(messageBuffer, 0, messageBuffer.Length);
                }

                // use less cpu
                Thread.Sleep(10);

                // check the server didn't disconnect 
                if (_isDisconnected(this._client))
                {
                    this.running = false;
                    Console.WriteLine("Server has disconnected from us. \n: :[");
                }
            }

            _cleanupNetworkResources();
            if (wasRunning)
            {
                Console.WriteLine("Disconnected.");
            }
        }

        private void _cleanupNetworkResources()
        {
            this._messageStream?.Close();
            this._messageStream = null;
            this._client.Close();
        }

        // Checks if a socket has disconnected
        // Adapted from -- http://stackoverflow.com/questions/722240/instantly-detect-client-disconnection-from-server-socket
        private static bool _isDisconnected(TcpClient client)
        {
            try
            {
                Socket socket = client.Client;
                return socket.Poll(10 * 1000, SelectMode.SelectRead) && (socket.Available == 0);
            }
            catch (SocketException)
            {
                // We got a socket error, assume it's disconnected
                return true;
            }
        }

        public static void Main(String[] args)
        {
            // get name
            Console.WriteLine("Enter a name to use: ");
            string name = Console.ReadLine() ?? string.Empty;

            // setup the messenger
            string host = "localhost";                  // args[0].Trim();
            int port = 6000;                            // args[0].Trim();

            TcpChatMessenger messenger = new TcpChatMessenger(host, port, name);

            // connect and send messages
            messenger.Connect();
            messenger.SendMessages();
        }
    }
}
