﻿using System;
using System.IO;
using System.Text;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace HttpClientExample
{
    class Downloader
    {
        public static string baseUrl = "https://nkosinathimagagula.github.io";
        public static string myPortfolioPath = "/Portfolio";
        public static string downloadUrl = $"{baseUrl}{myPortfolioPath}";
        public static string htmlFileName = "index.html";

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

                    // html file
                    // save it to a file
                    FileStream htmlFileStream = File.Create(htmlFileName);
                    await htmlFileStream.WriteAsync(data);
                    htmlFileStream.Close();

                    Console.WriteLine("Done!\n");

                    // get other files
                    Console.WriteLine("Getting other files ...");

                    string htmlContent = await response.Content.ReadAsStringAsync();

                    // stylesheet regex
                    Regex regex = new Regex("<link rel=\"stylesheet\" href=\"(?<href>[^\"]+)\"");
                    MatchCollection matchCollection = regex.Matches(htmlContent);

                    Console.WriteLine("Start finding matches...");

                    foreach (Match match in matchCollection)
                    {
                        string cssUrl = match.Groups["href"].Value;
                        Console.WriteLine($"Found: {cssUrl}");

                        HttpResponseMessage cssResponse = await httpClient.GetAsync($"{baseUrl}{cssUrl}");
                        byte[] cssContent = await cssResponse.Content.ReadAsByteArrayAsync();

                        string cssFileName = Path.GetFileName(cssUrl);

                        FileStream cssFilestream = File.Create(cssFileName);
                        await cssFilestream.WriteAsync(cssContent);
                        cssFilestream.Close();
                    }

                    Console.WriteLine("Done!\n");

                }
            }
        }

        public static void Main(string[] args)
        {
            Task d1Task = DownloadWebPage();

            // Console.WriteLine("Wait for at least 5 seconds...");
            // Thread.Sleep(TimeSpan.FromSeconds(5));

            d1Task.GetAwaiter().GetResult();
        }
    }
}
