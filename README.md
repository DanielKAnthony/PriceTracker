# Price Tracker
### .NET Core 3 | React.js | PostgreSQL | Docker

This web application is capable of tracking the price of any item found on the official websites of Kijiji, Bestbuy, and Indigo/Chapters. Users can see a graphical representation of their selected items' price trends up to the last 30 days since they added it to their list.

The user can opt in to receive an email notification if one of their tracked items reaches or falls below a specified price.

This is done through a server-side web scraper written in C#, using the AngleSharp module installed through NuGet.

The site can visited [here](https://pricetrackerweb.herokuapp.com)

## Technologies Used
.NET Core 3
- Used Entity Framework Core and Npgsql to map objects to Postgres tables.
- Server-side queries through LINQ.
- Connected React.js through SpaServices.

.React.js
- Navbar conditional rendering, textfields, and buffer icon components using MaterialUI.

PostgreSQL
- Hosted on AWS server through ElephantSQL.

Docker version 19.03.1
- Built and pushed to Heroku's container registry.