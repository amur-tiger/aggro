using Aggro.Users.Model;
using Microsoft.EntityFrameworkCore;

namespace Aggro.Core;

public class AggroContext : DbContext
{
    // todo https://learn.microsoft.com/en-us/aspnet/core/data/ef-mvc/intro?view=aspnetcore-7.0#create-the-database-context
    
    public AggroContext(DbContextOptions<AggroContext> options) : base(options) {}
    
    public DbSet<User> Users { get; set; }
}
