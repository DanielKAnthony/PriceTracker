using System;
using System.Linq;
using AngleSharp.Dom;

namespace PriceTrackerApp.ScraperUtils.SiteScrapers
{
    public static class BestBuyScraper
    {
        public static string[] GetData(IElement elem)
        {
            string[] ans = new string[2];

            var prodName = elem.QuerySelectorAll("h1").Where(e => e.HasAttribute("class")
                && e.GetAttribute("class").StartsWith("productName"));

            ans[0] = prodName.ToList()[0].TextContent;

            var prodPrice = elem.QuerySelectorAll("div").Where(e => e.HasAttribute("class")
                && e.GetAttribute("class").StartsWith("price_FHDfG large_3aP7Z "));

            string priceStr = new string(prodPrice.ToList()[0].TextContent
                .Where(n => char.IsDigit(n) || n == '.').ToArray());

            ans[1] = priceStr.Insert(priceStr.Length - 2, ".");

            return ans;
        }
    }
}