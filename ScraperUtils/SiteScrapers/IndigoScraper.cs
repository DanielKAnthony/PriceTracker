using System;
using System.Linq;
using AngleSharp.Dom;

namespace PriceTrackerApp.ScraperUtils.SiteScrapers
{
    public static class IndigoScraper
    {
        public static string[] GetData(IElement elem)
        {
            string[] ans = new string[2];

            var prodName = elem.QuerySelectorAll("h1").Where(e => e.HasAttribute("title"));
            if (prodName.Count() != 0)
                ans[0] = prodName.ToList()[0].GetAttribute("title");

            //---prices---
            //check for discount
            var res = elem.QuerySelectorAll("span").Where(e => e.HasAttribute("class")
            && e.GetAttribute("class") == "item-price__price-amount");

            if (res.Count() == 0)
                res = elem.QuerySelectorAll("div").Where(e => e.HasAttribute("class") &&
                e.GetAttribute("class") == "item-price__normal");

            ans[1] = res.ToList()[0].TextContent;
            
            return ans;
        }
    }
}