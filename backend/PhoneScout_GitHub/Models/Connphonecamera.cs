using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Connphonecamera
{
    public int Id { get; set; }

    public int PhoneId { get; set; }

    public int CameraId { get; set; }

    public int CameraTypeId { get; set; }

    public virtual Camera Camera { get; set; } = null!;

    public virtual Cameratype CameraType { get; set; } = null!;

    public virtual Phonedata Phone { get; set; } = null!;
}
