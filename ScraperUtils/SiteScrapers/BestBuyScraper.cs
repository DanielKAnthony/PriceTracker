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

            ans[1] = prodPrice.ToList()[0].TextContent;

            return ans;
        }
    }
}