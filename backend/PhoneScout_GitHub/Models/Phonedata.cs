using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Phonedata
{
    public int PhoneId { get; set; }

    public int? ManufacturerId { get; set; }

    public string? PhoneName { get; set; }

    public int? CpuId { get; set; }

    public int? PhoneAntutu { get; set; }

    public int? ScreenTypeId { get; set; }

    public int? PhoneResolutionHeight { get; set; }

    public int? PhoneResolutionWidth { get; set; }

    public decimal? ScreenSize { get; set; }

    public int? ScreenRefreshRate { get; set; }

    public int? ScreenMaxBrightness { get; set; }

    public int? ScreenSharpness { get; set; }

    public int? ConnectionMaxWifi { get; set; }

    public decimal? ConnectionMaxBluetooth { get; set; }

    public int? ConnectionMaxMobileNetwork { get; set; }

    public string? ConnectionDualSim { get; set; }

    public string? ConnectionEsim { get; set; }

    public string? ConnectionNfc { get; set; }

    public int? ConnectionConnectionSpeed { get; set; }

    public string? ConnectionJack { get; set; }

    public int? ChargerTypeId { get; set; }

    public int? SensorsFingerprintPlaceId { get; set; }

    public int? SensorsFingerprintTypeId { get; set; }

    public string? SensorsInfrared { get; set; }

    public int? RamSpeedId { get; set; }

    public int? StorageSpeedId { get; set; }

    public int? BatteryTypeId { get; set; }

    public int? BatteryCapacity { get; set; }

    public int? BatteryMaxChargingWired { get; set; }

    public int? BatteryMaxChargingWireless { get; set; }

    public decimal? CaseHeight { get; set; }

    public decimal? CaseWidth { get; set; }

    public decimal? CaseThickness { get; set; }

    public int? WaterproofTypeId { get; set; }

    public int? BackMaterialId { get; set; }

    public int? SpeakerTypeId { get; set; }

    public decimal? PhoneWeight { get; set; }

    public DateOnly? PhoneReleaseDate { get; set; }

    public int? PhonePrice { get; set; }

    public string? PhoneInStore { get; set; }

    public int? PhoneInStoreAmount { get; set; }

    public int? PhonePopularity { get; set; }

    public int PhoneDeleted { get; set; }

    public virtual Backmaterial? BackMaterial { get; set; }

    public virtual Batterytype? BatteryType { get; set; }

    public virtual Chargertype? ChargerType { get; set; }

    public virtual ICollection<Connphonecamera> Connphonecameras { get; set; } = new List<Connphonecamera>();

    public virtual ICollection<Connphonecolor> Connphonecolors { get; set; } = new List<Connphonecolor>();

    public virtual ICollection<Connphoneramstorage> Connphoneramstorages { get; set; } = new List<Connphoneramstorage>();

    public virtual Cpu? Cpu { get; set; }

    public virtual Manufacturer? Manufacturer { get; set; }

    public virtual Ramspeed? RamSpeed { get; set; }

    public virtual Screentype? ScreenType { get; set; }

    public virtual Sensorsfingerprintplace? SensorsFingerprintPlace { get; set; }

    public virtual Sensorsfingerprinttype? SensorsFingerprintType { get; set; }

    public virtual Speakertype? SpeakerType { get; set; }

    public virtual Storagespeed? StorageSpeed { get; set; }

    public virtual Waterprooftype? WaterproofType { get; set; }
}
