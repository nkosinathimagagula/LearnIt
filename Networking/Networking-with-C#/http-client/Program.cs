using System;
using System.IO;
using System.Text;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace HttpClientExample
{
    class Downloader
    {
        public static string downloadUrl = "https://nkosinathimagagula.github.io/Portfolio/";
        public static string fileName = "index.html";

        public static async Task DownloadWebPage()
        {
            Console.WriteLine("Starting downloading...");

            // setup HttpClient
            using (HttpClient httpClient = new HttpClient())
            {
                HttpResponseMessage response = await httpClient.GetAsync(downloadUrl);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Got it...");

                    // get data
                    byte[] data = await response.Content.ReadAsByteArrayAsync();

                    // save it to a file
                    FileStream fileStream = File.Create(fileName);
                    await fileStream.WriteAsync(data);
                    fileStream.Close();

                    Console.WriteLine("Done!");
                }
            }
        }

        public static void Main(string[] args)
        {
            Task d1Task = DownloadWebPage();

            Console.WriteLine("Wait for at least 5 seconds...");
            Thread.Sleep(TimeSpan.FromSeconds(5));

            d1Task.GetAwaiter().GetResult();
        }
    }
}