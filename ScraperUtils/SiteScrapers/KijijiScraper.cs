﻿using System;
using System.Linq;
using AngleSharp.Dom;

namespace PriceTrackerApp.ScraperUtils.SiteScrapers
{
    public static class KijijiScraper
    {
        public static string[] GetData(IElement elem)
        {
            string[] ans = new string[2];

            var prodName = elem.QuerySelectorAll("h1").Where(e => e.HasAttribute("itemprop")
                && e.HasAttribute("class") && e.GetAttribute("itemprop") == "name" &&
                e.GetAttribute("class").StartsWith("title"));

            Console.WriteLine("here1");

            ans[0] = prodName.ToList()[0].TextContent;

            var prodPrice = elem.QuerySelectorAll("span").Where(e => e.HasAttribute("itemprop")
                 && e.GetAttribute("itemprop") == "price");

            Console.WriteLine("here2");

            ans[1] = prodPrice.ToList()[0].TextContent;

            return ans;
        }
    }
}