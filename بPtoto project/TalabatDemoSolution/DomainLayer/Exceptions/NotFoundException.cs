namespace DomainLayer.Exceptions
{
    public abstract class NotFoundException(string message)
        : Exception(message);

    public sealed class ProductNotFoundException(int id)
        : NotFoundException($"Product with  id {id} Not Found!!");

    public sealed class UserNotFoundException(string email)
        : NotFoundException($"No user With email {email} was found!");
    public sealed class AddressNotFoundException(string userName)
        : NotFoundException($"No Address was found for the user {userName}");
    public sealed class DeliveryMethodNotFoundException(int id)
        : NotFiniteNumberException($"No Delivery Method with Id {id} was Found");
}