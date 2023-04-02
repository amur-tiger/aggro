using Aggro.Core;
using Aggro.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddPooledDbContextFactory<AggroContext>(
    options => options.UseNpgsql(
        builder.Configuration.GetConnectionString("Database")));

builder.Services
    .AddTransient<UserService>();

builder.Services
    .AddGraphQLServer()
    .RegisterService<UserService>()
    .AddQueryType<Query>();

var app = builder.Build();

app.UseFileServer(new FileServerOptions
{
    FileProvider = new PhysicalFileProvider(
        System.IO.Path.Combine(builder.Environment.ContentRootPath, "../app/public")
    ),
});

app.MapGraphQL();

app.Run();
