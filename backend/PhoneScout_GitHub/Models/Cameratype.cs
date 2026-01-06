using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Cameratype
{
    public int Id { get; set; }

    public string? CameraType1 { get; set; }

    public virtual ICollection<Connphonecamera> Connphonecameras { get; set; } = new List<Connphonecamera>();
}
