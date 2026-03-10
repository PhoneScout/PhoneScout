using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using PhoneScout_GitHub.Controllers;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using Xunit;

public class RepairPostTests
{
    private ProfileController GetController(
        List<User> users,
        List<Part> parts)
    {
        var mockUsers = new Mock<DbSet<User>>();
        var mockParts = new Mock<DbSet<Part>>();
        var mockServices = new Mock<DbSet<Connectionservice>>();
        var mockConnectionParts = new Mock<DbSet<Connectionpart>>();

        mockUsers.As<IQueryable<User>>().Setup(m => m.Provider).Returns(users.AsQueryable().Provider);
        mockUsers.As<IQueryable<User>>().Setup(m => m.Expression).Returns(users.AsQueryable().Expression);
        mockUsers.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(users.AsQueryable().ElementType);
        mockUsers.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(users.AsQueryable().GetEnumerator());

        mockParts.As<IQueryable<Part>>().Setup(m => m.Provider).Returns(parts.AsQueryable().Provider);
        mockParts.As<IQueryable<Part>>().Setup(m => m.Expression).Returns(parts.AsQueryable().Expression);
        mockParts.As<IQueryable<Part>>().Setup(m => m.ElementType).Returns(parts.AsQueryable().ElementType);
        mockParts.As<IQueryable<Part>>().Setup(m => m.GetEnumerator()).Returns(parts.AsQueryable().GetEnumerator());

        var mockContext = new Mock<PhoneContext>();

        mockContext.Setup(c => c.Users).Returns(mockUsers.Object);
        mockContext.Setup(c => c.Parts).Returns(mockParts.Object);
        mockContext.Setup(c => c.Connectionservices).Returns(mockServices.Object);
        mockContext.Setup(c => c.Connectionparts).Returns(mockConnectionParts.Object);

        return new ProfileController(mockContext.Object);
    }

    [Fact]
    public void PostRepair_UserNotFound_ReturnsBadRequest()
    {
        var controller = GetController(new List<User>(), new List<Part>());

        var dto = new profileRepairPostDTO
        {
            userID = 1,
            parts = new List<string> { "Screen" }
        };

        var result = controller.postRepair(dto);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal("A felhasználó nem található.", badRequest.Value);
    }

    [Fact]
    public void PostRepair_NoParts_ReturnsBadRequest()
    {
        var users = new List<User>
        {
            new User { Id = 1 }
        };

        var controller = GetController(users, new List<Part>());

        var dto = new profileRepairPostDTO
        {
            userID = 1,
            parts = new List<string>()
        };

        var result = controller.postRepair(dto);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal("Nincsenek megadva alkatrészek.", badRequest.Value);
    }

    [Fact]
    public void PostRepair_PartDoesNotExist_ReturnsBadRequest()
    {
        var users = new List<User>
        {
            new User { Id = 1 }
        };

        var parts = new List<Part>();

        var controller = GetController(users, parts);

        var dto = new profileRepairPostDTO
        {
            userID = 1,
            parts = new List<string> { "Battery" }
        };

        var result = controller.postRepair(dto);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);

        Assert.Contains("Az alkatrész nem létezik", badRequest.Value.ToString());
    }

    [Fact]
    public void PostRepair_ValidRequest_ReturnsOk()
    {
        var users = new List<User>
        {
            new User { Id = 1 }
        };

        var parts = new List<Part>
        {
            new Part { Id = 1, PartName = "Kamera" }
        };

        var controller = GetController(users, parts);

        var dto = new profileRepairPostDTO
        {
            repairID = "PHNSCT-20260310-5678",
            userID = 1,
            billingPostalCode = 1051,
            billingCity = "Budapest",
            billingAddress = "Fő utca",
            billingPhoneNumber = 12345678979,
            deliveryPostalCode = 1051,
            deliveryCity = "Budapest",
            deliveryAddress = "Fő utca 1",
            deliveryPhoneNumber = 12345678979,
            phoneName = "iPhone",
            basePrice = 100,
            repairPrice = 150,
            isPriceAccepted = 0,
            status = 0,
            manufacturerName = "Apple",
            phoneInspection = 1,
            problemDescription = "Broken screen",
            repairDescription = "",
            parts = new List<string> { "Kamera" }
        };

        var result = controller.postRepair(dto);

        var ok = Assert.IsType<OkObjectResult>(result);

        Assert.Equal("A szerviz igénylés befejeződött.", ok.Value);
    }
}