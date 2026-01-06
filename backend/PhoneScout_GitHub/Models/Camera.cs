using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Camera
{
    public int Id { get; set; }

    public string? CameraName { get; set; }

    public int? CameraResolution { get; set; }

    public string? CameraAperture { get; set; }

    public int? CameraFocalLength { get; set; }

    public string? CameraOis { get; set; }

    public virtual ICollection<Connphonecamera> Connphonecameras { get; set; } = new List<Connphonecamera>();
}
