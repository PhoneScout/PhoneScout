using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using PhoneScout_GitHub.Controllers;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using Xunit;

public class PostalCodeTests
{
    private PostalCodeCityController GetControllerWithData(List<Postalcode> data)
    {
        var queryable = data.AsQueryable();

        var mockSet = new Mock<DbSet<Postalcode>>();

        mockSet.As<IQueryable<Postalcode>>().Setup(m => m.Provider).Returns(queryable.Provider);
        mockSet.As<IQueryable<Postalcode>>().Setup(m => m.Expression).Returns(queryable.Expression);
        mockSet.As<IQueryable<Postalcode>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
        mockSet.As<IQueryable<Postalcode>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());

        var mockContext = new Mock<PhoneContext>();
        mockContext.Setup(c => c.Postalcodes).Returns(mockSet.Object);

        return new PostalCodeCityController(mockContext.Object);
    }

    [Fact]
    public void autoFillPCC_ValidPostalCode_ReturnsOk()
    {
        var data = new List<Postalcode>
        {
            new Postalcode { Iranyitoszam = 1051, Telepules = "Budapest" }
        };

        var controller = GetControllerWithData(data);

        var dto = new PostalCodeDTO
        {
            postalCode = 1051,
            city = ""
        };

        var result = controller.autoFillPCC(dto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var value = Assert.IsType<Postalcode>(okResult.Value);

        Assert.Equal("Budapest", value.Telepules);
    }

    [Fact]
    public void autoFillPCC_InvalidPostalCode_ReturnsBadRequest()
    {
        var data = new List<Postalcode>
        {
            new Postalcode { Iranyitoszam = 1051, Telepules = "Budapest" }
        };

        var controller = GetControllerWithData(data);

        var dto = new PostalCodeDTO
        {
            postalCode = 9999,
            city = ""
        };

        var result = controller.autoFillPCC(dto);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal("Az irányítószám nem található.", badRequest.Value);
    }
}