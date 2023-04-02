using System.ComponentModel.DataAnnotations.Schema;

namespace Aggro.Users.Model;

[Table("user")]
public class User
{
    [Column("id")]
    [GraphQLNonNullType]
    [GraphQLType(typeof(IdType))]
    public Guid ID { get; set; }

    [Column("username")]
    public string Username { get; set; }

    [Column("mail")]
    public string Mail { get; set; }

    [Column("password")]
    [GraphQLIgnore]
    public string Password { get; set; }

    [Column("registered")]
    public DateTime Registered { get; set; }

    [Column("lastlogin")]
    public DateTime? LastLogin { get; set; }
}
