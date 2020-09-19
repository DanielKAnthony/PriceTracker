FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build

ENV ASPNETCORE_Environment=Production

WORKDIR /server

COPY . ./

RUN dotnet publish -c Release -o publish

CMD ["dotnet","publish/PriceTrackerApp.dll"]