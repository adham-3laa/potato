namespace DomainLayer.Exceptions
{
    public sealed class BasketNotFoundException(string key)
        : NotFoundException($"Basket with key {key} Not Found!!");

}