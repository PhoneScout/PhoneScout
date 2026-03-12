using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using PhoneScout_GitHub.Controllers;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using Xunit;

public class UpdateRepairTests
{
    private ProfileController GetController(
        List<User> users,
        List<Part> parts,
        List<Connectionservice> repairs,
        List<Connectionpart> repairParts)
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

        mockServices.As<IQueryable<Connectionservice>>().Setup(m => m.Provider).Returns(repairs.AsQueryable().Provider);
        mockServices.As<IQueryable<Connectionservice>>().Setup(m => m.Expression).Returns(repairs.AsQueryable().Expression);
        mockServices.As<IQueryable<Connectionservice>>().Setup(m => m.ElementType).Returns(repairs.AsQueryable().ElementType);
        mockServices.As<IQueryable<Connectionservice>>().Setup(m => m.GetEnumerator()).Returns(repairs.AsQueryable().GetEnumerator());

        mockConnectionParts.As<IQueryable<Connectionpart>>().Setup(m => m.Provider).Returns(repairParts.AsQueryable().Provider);
        mockConnectionParts.As<IQueryable<Connectionpart>>().Setup(m => m.Expression).Returns(repairParts.AsQueryable().Expression);
        mockConnectionParts.As<IQueryable<Connectionpart>>().Setup(m => m.ElementType).Returns(repairParts.AsQueryable().ElementType);
        mockConnectionParts.As<IQueryable<Connectionpart>>().Setup(m => m.GetEnumerator()).Returns(repairParts.AsQueryable().GetEnumerator());

        var mockContext = new Mock<PhoneContext>();

        mockContext.Setup(c => c.Users).Returns(mockUsers.Object);
        mockContext.Setup(c => c.Parts).Returns(mockParts.Object);
        mockContext.Setup(c => c.Connectionservices).Returns(mockServices.Object);
        mockContext.Setup(c => c.Connectionparts).Returns(mockConnectionParts.Object);

        mockContext.Setup(c => c.Update(It.IsAny<Connectionservice>()));
        mockContext.Setup(c => c.SaveChanges()).Returns(1);

        return new ProfileController(mockContext.Object);
    }

    [Fact]
    public void UpdateRepair_RepairNotFound_ReturnsNotFound()
    {
        var controller = GetController(new List<User>(), 
        new List<Part>(), new List<Connectionservice>(),
        new List<Connectionpart>());

        var dto = new profileRepairPostDTO { userID = 1, parts = new List<string> { "Képernyő" } };
        var result = controller.updateRepair(dto, "nonexistent");

        var notFound = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("A szerviz igénylés nem található.", notFound.Value);
    }

    [Fact]
    public void UpdateRepair_UserNotFound_ReturnsBadRequest()
    {
        var repairs = new List<Connectionservice> { new Connectionservice { RepairId = "R1" } };
        var controller = GetController(new List<User>(), new List<Part>(), repairs, new List<Connectionpart>());

        var dto = new profileRepairPostDTO { userID = 1, parts = new List<string> { "Screen" } };
        var result = controller.updateRepair(dto, "R1");

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("A felhasználó nem található.", badRequest.Value);
    }

    [Fact]
    public void UpdateRepair_NoParts_ReturnsBadRequest()
    {
        var users = new List<User> { new User { Id = 1 } };
        var repairs = new List<Connectionservice> { new Connectionservice { RepairId = "R1" } };
        var controller = GetController(users, new List<Part>(), repairs, new List<Connectionpart>());

        var dto = new profileRepairPostDTO { userID = 1, parts = new List<string>() };
        var result = controller.updateRepair(dto, "R1");

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Nincsenek megadva alkatrészek.", badRequest.Value);
    }

    [Fact]
    public void UpdateRepair_PartDoesNotExist_ReturnsBadRequest()
    {
        var users = new List<User> { new User { Id = 1 } };
        var repairs = new List<Connectionservice> { new Connectionservice { RepairId = "R1" } };
        var controller = GetController(users, new List<Part>(), repairs, new List<Connectionpart>());

        var dto = new profileRepairPostDTO { userID = 1, parts = new List<string> { "Battery" } };
        var result = controller.updateRepair(dto, "R1");

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Contains("Az alkatrész nem létezik", badRequest.Value.ToString());
    }

    [Fact]
    public void UpdateRepair_ValidUpdate_ReturnsOk()
    {
        var users = new List<User> { new User { Id = 1 } };
        var parts = new List<Part> { new Part { Id = 1, PartName = "Screen" } };
        var repairs = new List<Connectionservice> { new Connectionservice { RepairId = "R1", UserId = 1 } };
        var repairParts = new List<Connectionpart>();

        var controller = GetController(users, parts, repairs, repairParts);

        var dto = new profileRepairPostDTO
        {
            userID = 1,
            parts = new List<string> { "Screen" },
            billingPostalCode = 1051,
            billingCity = "Budapest"
        };

        var result = controller.updateRepair(dto, "R1");

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("A szerviz igénylés befejeződött.", ok.Value);
    }
}