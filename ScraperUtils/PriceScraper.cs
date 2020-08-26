using System.Threading;
using System.Net.Http;
using System.IO;
using AngleSharp.Html.Parser;
using AngleSharp.Html.Dom;
using System.Threading.Tasks;

namespace PriceTrackerApp.ScraperUtils
{
    public static class PriceScraper
    {
        private static readonly string[] sites ={"kijiji","indigo","bestbuy"};

        public static async Task<string[]> FetchData(string userUrl)
        {
            try
            {
                if (!userUrl.StartsWith("https://www."))
                    return await ScrapeSite("https://www."+userUrl);
                return await ScrapeSite(userUrl);
            }
            catch
            {
                return new string[] { };
            }
        }

        private static async Task<string[]> ScrapeSite(string siteUrl)
        {
            try
            {
                CancellationTokenSource cts = new CancellationTokenSource();
                HttpClient httpClient = new HttpClient();
                HttpResponseMessage req = await httpClient.GetAsync(siteUrl);
                cts.Token.ThrowIfCancellationRequested();

                Stream response = await req.Content.ReadAsStreamAsync();
                cts.Token.ThrowIfCancellationRequested();

                HtmlParser parser = new HtmlParser();
                IHtmlDocument document = parser.ParseDocument(response);
                
                return ScrapeResults(document,GetDomainName(siteUrl));
            }
            catch
            {
                throw;
            }
        }

        private static string[] ScrapeResults(IHtmlDocument document,string domain)
        {
            var body = document.Body;

            if (domain == "kijiji")
                return SiteScrapers.KijijiScraper.GetData(body);
            else if (domain == "bestbuy")
                return SiteScrapers.BestBuyScraper.GetData(body);
            else if (domain == "indigo")
                return SiteScrapers.IndigoScraper.GetData(body);

            return null;
        }

        private static string GetDomainName(string url)
        {
            for (int i = 0; i < sites.Length; ++i)
            {
                if (url.Contains(sites[i])) return sites[i];
            }
            return null;
        }
    }
}