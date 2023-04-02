using Aggro.Users;
using Aggro.Users.Model;

namespace Aggro.Core;

public class Query
{
    public User Me() => throw new NotImplementedException();

    public IQueryable<User> Users(UserService service) => service.GetAll();
}
