using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PriceTrackerApp.Models;
using Microsoft.AspNetCore.HttpOverrides;

namespace PriceTrackerApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(option => option.EnableEndpointRouting = false);

            services.AddDbContext<TrackerContext>(options =>
            options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "price-tracker/build";
            });

            services.AddHttpsRedirection(opt => opt.HttpsPort = 443);

            services.Configure<ForwardedHeadersOptions>(options =>
  {
      options.ForwardedHeaders = 
          ForwardedHeaders.XForwardedFor | 
          ForwardedHeaders.XForwardedProto;

      options.KnownNetworks.Clear();
      options.KnownProxies.Clear();
  });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseForwardedHeaders();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseMvc();
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = Path.Join(env.ContentRootPath, "price-tracker");

                if (env.IsDevelopment())
                {
                    spa.Options.StartupTimeout = TimeSpan.FromSeconds(900);
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
