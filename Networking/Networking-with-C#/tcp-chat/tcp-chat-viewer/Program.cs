using System;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.Threading;

namespace TcpChatViewer
{
    class TcpChatViewer
    {
        // connection objects
        public readonly string serverAddress;
        public readonly int port;
        private TcpClient _client;
        public bool running { get; private set; }
        private bool _disconnectRequested = false;

        // buffer & messaging
        public readonly int bufferSize = 2 * 1024;          // 2KB
        private NetworkStream _messageStream = null;

        public TcpChatViewer(string serverAddress, int port)
        {
            // create a non-connected TcpClient
            this._client = new TcpClient();
            this._client.SendBufferSize = this.bufferSize;
            this._client.ReceiveBufferSize = this.bufferSize;
            this.running = false;

            this.serverAddress = serverAddress;
            this.port = port;
        }

        // connect to the chat server
        public void connect()
        {
            // try to connect
            this._client.Connect(this.serverAddress, this.port);
            EndPoint endPoint = this._client.Client.RemoteEndPoint;

            // check if we're connected
            if (this._client.Connected)
            {
                Console.WriteLine("Connected to the server at {0}.", endPoint);

                // send them the message that we are a viewer
                this._messageStream = this._client.GetStream();
                byte[] messageBuffer = Encoding.UTF8.GetBytes("viewer");
                this._messageStream.Write(messageBuffer, 0, messageBuffer.Length);

                // check if we're still connected
                if (!_isDisconnected(this._client))
                { 
                    this.running = true;
                    Console.WriteLine("Press Ctrl-C to exit the Viewer at any time.");
                }
                else
                {
                    _cleanupNetworkResources();
                    Console.WriteLine("The server didn't recognise us as a Viewer.\n:[");
                }
            }
            else
            {
                _cleanupNetworkResources();
                Console.WriteLine("Wasn't able to connect to the server at {0}.", endPoint);
            }
        }

        // request a desconnect
        public void Disconnect()
        {
            this.running = false;
            this._disconnectRequested = true;
            Console.WriteLine("Disconnecting from the chat...");
        }

        // main loop that listens and prints messages from the server
        public void ListenForMessages()
        {
            bool wasRunning = this.running;

            // listens for messages
            while (this.running)
            {
                int messageLength = this._client.Available;

                if (messageLength > 0)
                {
                    // read the whole message
                    byte[] messageBuffer = new byte[messageLength];
                    this._messageStream.Read(messageBuffer, 0, messageLength);

                    string message= Encoding.UTF8.GetString(messageBuffer);
                    Console.WriteLine(message);
                }

                // use less cpu
                Thread.Sleep(10);

                if (_isDisconnected(this._client))
                {
                    this.running = false;
                    Console.WriteLine("Server has disconnected from us.\n:[");
                }

                // check that a cancel has been requested by the user
                this.running &= !this._disconnectRequested;
            }

            // cleanup
            _cleanupNetworkResources();
            if (wasRunning)
            {
                Console.WriteLine("Disconnected.");
            }
        }

        // cleans any leftover network resources
        private void _cleanupNetworkResources()
        {
            this._messageStream?.Close();
            this._messageStream = null;
            this._client.Close();
        }

        // checks if a socket has disconnected
        // Adapted from -- http://stackoverflow.com/questions/722240/instantly-detect-client-disconnection-from-server-socket
        private static bool _isDisconnected(TcpClient client)
        {
            try
            {
                Socket s = client.Client;
                return s.Poll(10 * 1000, SelectMode.SelectRead) && (s.Available == 0);
            }
            catch (SocketException se)
            {
                // we got a socket error, assume it's disconnected
                return true;
            }
        }

        public static TcpChatViewer viewer;

        protected static void InterruptHandler(object sender, ConsoleCancelEventArgs args)
        {
            viewer.Disconnect();
            args.Cancel = true;
        }

        public static void Main(string[] args)
        {
            // setup the Viewer
            string host = "localhost";                  // args[0].Trim();
            int port = 6000;                            // int.Parse(args[1].Trim());

            viewer = new TcpChatViewer(host, port);

            // add a handler for a Ctrl+c press
            Console.CancelKeyPress += InterruptHandler;

            // try to connect and view messages
            viewer.connect();
            viewer.ListenForMessages();
        }
    }
}
