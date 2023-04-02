using Aggro.Core;
using Aggro.Users.Model;
using Microsoft.EntityFrameworkCore;

namespace Aggro.Users;

public class UserService : IAsyncDisposable
{
    private readonly AggroContext _context;

    public UserService(IDbContextFactory<AggroContext> factory)
    {
        _context = factory.CreateDbContext();
    }

    public ValueTask DisposeAsync()
    {
        return _context.DisposeAsync();
    }

    public IQueryable<User> GetAll()
    {
        return _context.Users.AsQueryable();
    }
}
