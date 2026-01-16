using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Phonepicture
{
    public int Id { get; set; }

    public int PhoneId { get; set; }

    public byte[]? PictureFront { get; set; }

    public byte[]? PictureBack { get; set; }

    public byte[]? PictureTop { get; set; }

    public byte[]? PictureBottom { get; set; }

    public virtual Phonedata Phone { get; set; } = null!;
}
