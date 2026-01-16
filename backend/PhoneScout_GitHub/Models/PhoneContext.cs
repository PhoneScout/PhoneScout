using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace PhoneScout_GitHub.Models;

public partial class PhoneContext : DbContext
{
    public PhoneContext()
    {
    }

    public PhoneContext(DbContextOptions<PhoneContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<Backmaterial> Backmaterials { get; set; }

    public virtual DbSet<Batterytype> Batterytypes { get; set; }

    public virtual DbSet<Camera> Cameras { get; set; }

    public virtual DbSet<Cameratype> Cameratypes { get; set; }

    public virtual DbSet<Chargertype> Chargertypes { get; set; }

    public virtual DbSet<Color> Colors { get; set; }

    public virtual DbSet<Connectionpart> Connectionparts { get; set; }

    public virtual DbSet<Connectionservice> Connectionservices { get; set; }

    public virtual DbSet<Connphonecamera> Connphonecameras { get; set; }

    public virtual DbSet<Connphonecolor> Connphonecolors { get; set; }

    public virtual DbSet<Connphoneramstorage> Connphoneramstorages { get; set; }

    public virtual DbSet<Connuserorder> Connuserorders { get; set; }

    public virtual DbSet<Cpu> Cpus { get; set; }

    public virtual DbSet<Manufacturer> Manufacturers { get; set; }

    public virtual DbSet<Part> Parts { get; set; }

    public virtual DbSet<Phonedata> Phonedatas { get; set; }

    public virtual DbSet<Phonepicture> Phonepictures { get; set; }

    public virtual DbSet<Postalcode> Postalcodes { get; set; }

    public virtual DbSet<Privilege> Privileges { get; set; }

    public virtual DbSet<Ramspeed> Ramspeeds { get; set; }

    public virtual DbSet<Ramstorage> Ramstorages { get; set; }

    public virtual DbSet<Screentype> Screentypes { get; set; }

    public virtual DbSet<Sensorsfingerprintplace> Sensorsfingerprintplaces { get; set; }

    public virtual DbSet<Sensorsfingerprinttype> Sensorsfingerprinttypes { get; set; }

    public virtual DbSet<Speakertype> Speakertypes { get; set; }

    public virtual DbSet<Storagespeed> Storagespeeds { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Waterprooftype> Waterprooftypes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=phonescout;user=PSAdmin;password=ciscoSecret123", Microsoft.EntityFrameworkCore.ServerVersion.Parse("10.4.32-mariadb"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_hungarian_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("addresses");

            entity.HasIndex(e => e.UserId, "userID");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.Address1)
                .HasMaxLength(256)
                .HasColumnName("address");
            entity.Property(e => e.AddressType)
                .HasColumnType("int(1)")
                .HasColumnName("addressType");
            entity.Property(e => e.City)
                .HasMaxLength(64)
                .HasColumnName("city");
            entity.Property(e => e.PhoneNumber)
                .HasColumnType("bigint(11)")
                .HasColumnName("phoneNumber");
            entity.Property(e => e.PostalCode)
                .HasColumnType("int(4)")
                .HasColumnName("postalCode");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("userID");

            entity.HasOne(d => d.User).WithMany(p => p.Addresses)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("addresses_ibfk_1");
        });

        modelBuilder.Entity<Backmaterial>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("backmaterial");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.BackMaterial1)
                .HasMaxLength(32)
                .HasColumnName("backMaterial");
        });

        modelBuilder.Entity<Batterytype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("batterytype");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.BatteryType1)
                .HasMaxLength(20)
                .HasColumnName("batteryType");
        });

        modelBuilder.Entity<Camera>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("camera");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.CameraAperture)
                .HasMaxLength(8)
                .HasColumnName("cameraAperture");
            entity.Property(e => e.CameraFocalLength)
                .HasColumnType("int(11)")
                .HasColumnName("cameraFocalLength");
            entity.Property(e => e.CameraName)
                .HasMaxLength(64)
                .HasColumnName("cameraName");
            entity.Property(e => e.CameraOis)
                .HasMaxLength(8)
                .HasColumnName("cameraOIS");
            entity.Property(e => e.CameraResolution)
                .HasColumnType("int(11)")
                .HasColumnName("cameraResolution");
        });

        modelBuilder.Entity<Cameratype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("cameratype");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.CameraType1)
                .HasMaxLength(64)
                .HasColumnName("cameraType");
        });

        modelBuilder.Entity<Chargertype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("chargertype");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.ChargerType1)
                .HasMaxLength(16)
                .HasColumnName("chargerType");
        });

        modelBuilder.Entity<Color>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("color");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.ColorHex)
                .HasMaxLength(8)
                .HasColumnName("colorHex");
            entity.Property(e => e.ColorName)
                .HasMaxLength(32)
                .HasColumnName("colorName");
        });

        modelBuilder.Entity<Connectionpart>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("connectionparts");

            entity.HasIndex(e => e.PartId, "partID");

            entity.HasIndex(e => e.RepairId, "repairID");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.PartId)
                .HasColumnType("int(11)")
                .HasColumnName("partID");
            entity.Property(e => e.RepairId)
                .HasMaxLength(22)
                .HasColumnName("repairID");

            entity.HasOne(d => d.Part).WithMany(p => p.Connectionparts)
                .HasForeignKey(d => d.PartId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("connectionparts_ibfk_1");

            entity.HasOne(d => d.Repair).WithMany(p => p.Connectionparts)
                .HasForeignKey(d => d.RepairId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("connectionparts_ibfk_2");
        });

        modelBuilder.Entity<Connectionservice>(entity =>
        {
            entity.HasKey(e => e.RepairId).HasName("PRIMARY");

            entity.ToTable("connectionservice");

            entity.HasIndex(e => e.UserId, "userID");

            entity.Property(e => e.RepairId)
                .HasMaxLength(22)
                .HasColumnName("repairID");
            entity.Property(e => e.Address)
                .HasMaxLength(256)
                .HasColumnName("address");
            entity.Property(e => e.City)
                .HasMaxLength(64)
                .HasColumnName("city");
            entity.Property(e => e.ManufacturerName)
                .HasMaxLength(24)
                .HasColumnName("manufacturerName");
            entity.Property(e => e.PhoneInspection)
                .HasColumnType("tinyint(4)")
                .HasColumnName("phoneInspection");
            entity.Property(e => e.PhoneName)
                .HasMaxLength(64)
                .HasColumnName("phoneName");
            entity.Property(e => e.PhoneNumber)
                .HasColumnType("bigint(11)")
                .HasColumnName("phoneNumber");
            entity.Property(e => e.PostalCode)
                .HasColumnType("int(4)")
                .HasColumnName("postalCode");
            entity.Property(e => e.Price)
                .HasColumnType("int(11)")
                .HasColumnName("price");
            entity.Property(e => e.ProblemDescription)
                .HasColumnType("text")
                .HasColumnName("problemDescription");
            entity.Property(e => e.Status)
                .HasColumnType("int(1)")
                .HasColumnName("status");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("userID");

            entity.HasOne(d => d.User).WithMany(p => p.Connectionservices)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("connectionservice_ibfk_4");
        });

        modelBuilder.Entity<Connphonecamera>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("connphonecamera");

            entity.HasIndex(e => e.CameraId, "cameraID");

            entity.HasIndex(e => e.CameraTypeId, "cameraTypeID");

            entity.HasIndex(e => e.PhoneId, "phoneID");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.CameraId)
                .HasColumnType("int(11)")
                .HasColumnName("cameraID");
            entity.Property(e => e.CameraTypeId)
                .HasColumnType("int(11)")
                .HasColumnName("cameraTypeID");
            entity.Property(e => e.PhoneId)
                .HasColumnType("int(11)")
                .HasColumnName("phoneID");

            entity.HasOne(d => d.Camera).WithMany(p => p.Connphonecameras)
                .HasForeignKey(d => d.CameraId)
                .HasConstraintName("camera");

            entity.HasOne(d => d.CameraType).WithMany(p => p.Connphonecameras)
                .HasForeignKey(d => d.CameraTypeId)
                .HasConstraintName("cameraType");

            entity.HasOne(d => d.Phone).WithMany(p => p.Connphonecameras)
                .HasForeignKey(d => d.PhoneId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("phone");
        });

        modelBuilder.Entity<Connphonecolor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("connphonecolor");

            entity.HasIndex(e => e.ColorId, "colorID");

            entity.HasIndex(e => e.PhoneId, "phoneID");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.ColorId)
                .HasColumnType("int(11)")
                .HasColumnName("colorID");
            entity.Property(e => e.PhoneId)
                .HasColumnType("int(11)")
                .HasColumnName("phoneID");

            entity.HasOne(d => d.Color).WithMany(p => p.Connphonecolors)
                .HasForeignKey(d => d.ColorId)
                .HasConstraintName("color");

            entity.HasOne(d => d.Phone).WithMany(p => p.Connphonecolors)
                .HasForeignKey(d => d.PhoneId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("connphonecolor_ibfk_1");
        });

        modelBuilder.Entity<Connphoneramstorage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("connphoneramstorage");

            entity.HasIndex(e => e.PhoneId, "phoneID");

            entity.HasIndex(e => e.RamstorageId, "ramstorageID");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.PhoneId)
                .HasColumnType("int(11)")
                .HasColumnName("phoneID");
            entity.Property(e => e.RamstorageId)
                .HasColumnType("int(11)")
                .HasColumnName("ramstorageID");

            entity.HasOne(d => d.Phone).WithMany(p => p.Connphoneramstorages)
                .HasForeignKey(d => d.PhoneId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("connphoneramstorage_ibfk_1");

            entity.HasOne(d => d.Ramstorage).WithMany(p => p.Connphoneramstorages)
                .HasForeignKey(d => d.RamstorageId)
                .HasConstraintName("ramstorage");
        });

        modelBuilder.Entity<Connuserorder>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("connuserorder");

            entity.HasIndex(e => e.UserId, "userID");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.Address)
                .HasMaxLength(256)
                .HasColumnName("address");
            entity.Property(e => e.Amount)
                .HasColumnType("int(11)")
                .HasColumnName("amount");
            entity.Property(e => e.City)
                .HasMaxLength(64)
                .HasColumnName("city");
            entity.Property(e => e.PhoneColorHex).HasMaxLength(7);
            entity.Property(e => e.PhoneColorName)
                .HasMaxLength(32)
                .HasColumnName("phoneColorName");
            entity.Property(e => e.PhoneName)
                .HasMaxLength(64)
                .HasColumnName("phoneName");
            entity.Property(e => e.PhoneNumber)
                .HasColumnType("bigint(11)")
                .HasColumnName("phoneNumber");
            entity.Property(e => e.PhoneRam)
                .HasColumnType("int(4)")
                .HasColumnName("phoneRam");
            entity.Property(e => e.PhoneStorage)
                .HasColumnType("int(4)")
                .HasColumnName("phoneStorage");
            entity.Property(e => e.PostalCode)
                .HasColumnType("int(4)")
                .HasColumnName("postalCode");
            entity.Property(e => e.Price)
                .HasColumnType("int(11)")
                .HasColumnName("price");
            entity.Property(e => e.Status)
                .HasColumnType("int(11)")
                .HasColumnName("status");
            entity.Property(e => e.UserId)
                .HasColumnType("int(11)")
                .HasColumnName("userID");

            entity.HasOne(d => d.User).WithMany(p => p.Connuserorders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("connuserorder_ibfk_3");
        });

        modelBuilder.Entity<Cpu>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("cpu");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.CpuCoreNumber)
                .HasColumnType("int(11)")
                .HasColumnName("cpuCoreNumber");
            entity.Property(e => e.CpuManufacturingTechnology)
                .HasColumnType("int(11)")
                .HasColumnName("cpuManufacturingTechnology");
            entity.Property(e => e.CpuMaxClockSpeed)
                .HasColumnType("int(11)")
                .HasColumnName("cpuMaxClockSpeed");
            entity.Property(e => e.CpuName)
                .HasMaxLength(64)
                .HasColumnName("cpuName");
        });

        modelBuilder.Entity<Manufacturer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("manufacturer");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.ManufacturerName)
                .HasMaxLength(32)
                .HasColumnName("manufacturerName");
            entity.Property(e => e.ManufacturerUrl)
                .HasMaxLength(256)
                .HasColumnName("manufacturerURL");
        });

        modelBuilder.Entity<Part>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("parts");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.PartName)
                .HasMaxLength(16)
                .HasColumnName("partName");
            entity.Property(e => e.PartStock)
                .HasColumnType("int(11)")
                .HasColumnName("partStock");
        });

        modelBuilder.Entity<Phonedata>(entity =>
        {
            entity.HasKey(e => e.PhoneId).HasName("PRIMARY");

            entity.ToTable("phonedatas");

            entity.HasIndex(e => e.BackMaterialId, "backMaterialID");

            entity.HasIndex(e => e.BatteryTypeId, "batteryTypeID");

            entity.HasIndex(e => e.ChargerTypeId, "chargerTypeID");

            entity.HasIndex(e => e.CpuId, "cpuID");

            entity.HasIndex(e => e.ManufacturerId, "manufacturerID");

            entity.HasIndex(e => e.RamSpeedId, "ramSpeedID");

            entity.HasIndex(e => e.ScreenTypeId, "screenTypeID");

            entity.HasIndex(e => e.SensorsFingerprintPlaceId, "sensorsFingerprintPlaceID");

            entity.HasIndex(e => e.SensorsFingerprintTypeId, "sensorsFingerprintTypeID");

            entity.HasIndex(e => e.SpeakerTypeId, "speakerTypeID");

            entity.HasIndex(e => e.StorageSpeedId, "storageSpeedID");

            entity.HasIndex(e => e.WaterproofTypeId, "waterproofTypeID");

            entity.Property(e => e.PhoneId)
                .HasColumnType("int(11)")
                .HasColumnName("phoneID");
            entity.Property(e => e.BackMaterialId)
                .HasColumnType("int(11)")
                .HasColumnName("backMaterialID");
            entity.Property(e => e.BatteryCapacity)
                .HasColumnType("int(11)")
                .HasColumnName("batteryCapacity");
            entity.Property(e => e.BatteryMaxChargingWired)
                .HasColumnType("int(11)")
                .HasColumnName("batteryMaxChargingWired");
            entity.Property(e => e.BatteryMaxChargingWireless)
                .HasColumnType("int(11)")
                .HasColumnName("batteryMaxChargingWireless");
            entity.Property(e => e.BatteryTypeId)
                .HasColumnType("int(11)")
                .HasColumnName("batteryTypeID");
            entity.Property(e => e.CaseHeight)
                .HasPrecision(10, 2)
                .HasColumnName("caseHeight");
            entity.Property(e => e.CaseThickness)
                .HasPrecision(10, 2)
                .HasColumnName("caseThickness");
            entity.Property(e => e.CaseWidth)
                .HasPrecision(10, 2)
                .HasColumnName("caseWidth");
            entity.Property(e => e.ChargerTypeId)
                .HasColumnType("int(11)")
                .HasColumnName("chargerTypeID");
            entity.Property(e => e.ConnectionConnectionSpeed)
                .HasColumnType("int(11)")
                .HasColumnName("connectionConnectionSpeed");
            entity.Property(e => e.ConnectionDualSim)
                .HasMaxLength(8)
                .HasColumnName("connectionDualSim");
            entity.Property(e => e.ConnectionEsim)
                .HasMaxLength(8)
                .HasColumnName("connectionESim");
            entity.Property(e => e.ConnectionJack)
                .HasMaxLength(8)
                .HasColumnName("connectionJack");
            entity.Property(e => e.ConnectionMaxBluetooth)
                .HasPrecision(10, 2)
                .HasColumnName("connectionMaxBluetooth");
            entity.Property(e => e.ConnectionMaxMobileNetwork)
                .HasColumnType("int(11)")
                .HasColumnName("connectionMaxMobileNetwork");
            entity.Property(e => e.ConnectionMaxWifi)
                .HasColumnType("int(11)")
                .HasColumnName("connectionMaxWifi");
            entity.Property(e => e.ConnectionNfc)
                .HasMaxLength(8)
                .HasColumnName("connectionNfc");
            entity.Property(e => e.CpuId)
                .HasColumnType("int(11)")
                .HasColumnName("cpuID");
            entity.Property(e => e.ManufacturerId)
                .HasColumnType("int(11)")
                .HasColumnName("manufacturerID");
            entity.Property(e => e.PhoneAntutu)
                .HasColumnType("int(11)")
                .HasColumnName("phoneAntutu");
            entity.Property(e => e.PhoneDeleted)
                .HasColumnType("int(11)")
                .HasColumnName("phoneDeleted");
            entity.Property(e => e.PhoneInStore)
                .HasMaxLength(8)
                .HasColumnName("phoneInStore");
            entity.Property(e => e.PhoneInStoreAmount)
                .HasColumnType("int(11)")
                .HasColumnName("phoneInStoreAmount");
            entity.Property(e => e.PhoneName)
                .HasMaxLength(64)
                .HasColumnName("phoneName");
            entity.Property(e => e.PhonePopularity)
                .HasColumnType("int(11)")
                .HasColumnName("phonePopularity");
            entity.Property(e => e.PhonePrice)
                .HasColumnType("int(11)")
                .HasColumnName("phonePrice");
            entity.Property(e => e.PhoneReleaseDate).HasColumnName("phoneReleaseDate");
            entity.Property(e => e.PhoneResolutionHeight)
                .HasColumnType("int(11)")
                .HasColumnName("phoneResolutionHeight");
            entity.Property(e => e.PhoneResolutionWidth)
                .HasColumnType("int(11)")
                .HasColumnName("phoneResolutionWidth");
            entity.Property(e => e.PhoneWeight)
                .HasPrecision(10, 2)
                .HasColumnName("phoneWeight");
            entity.Property(e => e.RamSpeedId)
                .HasColumnType("int(11)")
                .HasColumnName("ramSpeedID");
            entity.Property(e => e.ScreenMaxBrightness)
                .HasColumnType("int(11)")
                .HasColumnName("screenMaxBrightness");
            entity.Property(e => e.ScreenRefreshRate)
                .HasColumnType("int(11)")
                .HasColumnName("screenRefreshRate");
            entity.Property(e => e.ScreenSharpness)
                .HasColumnType("int(11)")
                .HasColumnName("screenSharpness");
            entity.Property(e => e.ScreenSize)
                .HasPrecision(10, 2)
                .HasColumnName("screenSize");
            entity.Property(e => e.ScreenTypeId)
                .HasColumnType("int(11)")
                .HasColumnName("screenTypeID");
            entity.Property(e => e.SensorsFingerprintPlaceId)
                .HasColumnType("int(11)")
                .HasColumnName("sensorsFingerprintPlaceID");
            entity.Property(e => e.SensorsFingerprintTypeId)
                .HasColumnType("int(11)")
                .HasColumnName("sensorsFingerprintTypeID");
            entity.Property(e => e.SensorsInfrared)
                .HasMaxLength(8)
                .HasColumnName("sensorsInfrared");
            entity.Property(e => e.SpeakerTypeId)
                .HasColumnType("int(11)")
                .HasColumnName("speakerTypeID");
            entity.Property(e => e.StorageSpeedId)
                .HasColumnType("int(11)")
                .HasColumnName("storageSpeedID");
            entity.Property(e => e.WaterproofTypeId)
                .HasColumnType("int(11)")
                .HasColumnName("waterproofTypeID");

            entity.HasOne(d => d.BackMaterial).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.BackMaterialId)
                .HasConstraintName("backMaterial");

            entity.HasOne(d => d.BatteryType).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.BatteryTypeId)
                .HasConstraintName("batteryType");

            entity.HasOne(d => d.ChargerType).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.ChargerTypeId)
                .HasConstraintName("chargerType");

            entity.HasOne(d => d.Cpu).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.CpuId)
                .HasConstraintName("cpu");

            entity.HasOne(d => d.Manufacturer).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.ManufacturerId)
                .HasConstraintName("manufacturer");

            entity.HasOne(d => d.RamSpeed).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.RamSpeedId)
                .HasConstraintName("ramSpeed");

            entity.HasOne(d => d.ScreenType).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.ScreenTypeId)
                .HasConstraintName("screenType");

            entity.HasOne(d => d.SensorsFingerprintPlace).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.SensorsFingerprintPlaceId)
                .HasConstraintName("fingerprintPlace");

            entity.HasOne(d => d.SensorsFingerprintType).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.SensorsFingerprintTypeId)
                .HasConstraintName("fingerprintType");

            entity.HasOne(d => d.SpeakerType).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.SpeakerTypeId)
                .HasConstraintName("speakerType");

            entity.HasOne(d => d.StorageSpeed).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.StorageSpeedId)
                .HasConstraintName("storageSpeed");

            entity.HasOne(d => d.WaterproofType).WithMany(p => p.Phonedata)
                .HasForeignKey(d => d.WaterproofTypeId)
                .HasConstraintName("waterproofType");
        });

        modelBuilder.Entity<Phonepicture>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("phonepictures");

            entity.HasIndex(e => e.PhoneId, "phoneID");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.PhoneId)
                .HasColumnType("int(11)")
                .HasColumnName("phoneID");
            entity.Property(e => e.PictureBack)
                .HasColumnType("mediumblob")
                .HasColumnName("pictureBack");
            entity.Property(e => e.PictureBottom)
                .HasColumnType("mediumblob")
                .HasColumnName("pictureBottom");
            entity.Property(e => e.PictureFront)
                .HasColumnType("mediumblob")
                .HasColumnName("pictureFront");
            entity.Property(e => e.PictureTop)
                .HasColumnType("mediumblob")
                .HasColumnName("pictureTop");

            entity.HasOne(d => d.Phone).WithMany(p => p.Phonepictures)
                .HasForeignKey(d => d.PhoneId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("phonepictures_ibfk_1");
        });

        modelBuilder.Entity<Postalcode>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("postalcode")
                .HasCharSet("utf8")
                .UseCollation("utf8_general_ci");

            entity.Property(e => e.Iranyitoszam).HasColumnType("int(4)");
            entity.Property(e => e.Megye).HasMaxLength(22);
            entity.Property(e => e.Telepules).HasMaxLength(20);
        });

        modelBuilder.Entity<Privilege>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("privilege");

            entity.HasIndex(e => e.Level, "level").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.Level)
                .HasColumnType("int(1)")
                .HasColumnName("level");
            entity.Property(e => e.Name)
                .HasMaxLength(64)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Ramspeed>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("ramspeed");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.RamSpeed1)
                .HasMaxLength(16)
                .HasColumnName("ramSpeed");
        });

        modelBuilder.Entity<Ramstorage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("ramstorage");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.RamAmount)
                .HasColumnType("int(11)")
                .HasColumnName("ramAmount");
            entity.Property(e => e.StorageAmount)
                .HasColumnType("int(11)")
                .HasColumnName("storageAmount");
        });

        modelBuilder.Entity<Screentype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("screentype");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.ScreenType1)
                .HasMaxLength(32)
                .HasColumnName("screenType");
        });

        modelBuilder.Entity<Sensorsfingerprintplace>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("sensorsfingerprintplace");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.SensorsFingerprintPlace1)
                .HasMaxLength(32)
                .HasColumnName("sensorsFingerprintPlace");
        });

        modelBuilder.Entity<Sensorsfingerprinttype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("sensorsfingerprinttype");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.SensorsFingerprintType1)
                .HasMaxLength(32)
                .HasColumnName("sensorsFingerprintType");
        });

        modelBuilder.Entity<Speakertype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("speakertype");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.SpeakerType1)
                .HasMaxLength(8)
                .HasColumnName("speakerType");
        });

        modelBuilder.Entity<Storagespeed>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("storagespeed");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.StorageSpeed1)
                .HasMaxLength(16)
                .HasColumnName("storageSpeed");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.PrivilegeId, "privilegeID");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.Active)
                .HasColumnType("int(1)")
                .HasColumnName("active");
            entity.Property(e => e.Email)
                .HasMaxLength(64)
                .HasColumnName("email");
            entity.Property(e => e.Hash)
                .HasMaxLength(64)
                .HasColumnName("HASH");
            entity.Property(e => e.Name)
                .HasMaxLength(64)
                .HasColumnName("name");
            entity.Property(e => e.PrivilegeId)
                .HasColumnType("int(1)")
                .HasColumnName("privilegeID");
            entity.Property(e => e.Salt)
                .HasMaxLength(64)
                .HasColumnName("SALT");

            entity.HasOne(d => d.Privilege).WithMany(p => p.Users)
                .HasForeignKey(d => d.PrivilegeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("users_ibfk_3");
        });

        modelBuilder.Entity<Waterprooftype>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("waterprooftype");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("ID");
            entity.Property(e => e.WaterproofType1)
                .HasMaxLength(16)
                .HasColumnName("waterproofType");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
