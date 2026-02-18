import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatbotWidget.css";
import axios from "axios";

const TYPING_SPEED = 15;
const STORE_ADDRESS = "Miskolc, Palóczy László utca 3, 3525";
const STORE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;

const PHONES_DATA = `List of phones we sell:
      ================ NEXT PHONE =================
      ================ BASIC =================
      Phone ID: 1
      Name: Xiaomi 13T
      Manufacturer: Xiaomi
      Release: 2023-09-26
      Price: 135000
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1220 x 2712
      Screen size: 6.67"
      Screen type: AMOLED
      Refresh rate: 144 Hz
      Max brightness: 2600 nits
      Sharpness: 466

      ================ PERFORMANCE =================
      Antutu: 905365
      CPU: Mediatek Dimensity 8200 Ultra 3 GHz, 8 cores, 4 nm
      RAM speed: LPDDR5
      Storage speed: UFS 3.1
      RAM/Storage versions: 12GB / 256GB; 2GB / 256GB

      ================ CAMERAS =================
      Fő hátsó kamera: Sony IMX707 50MP f/f/1.9 OIS
      Széles látószögű: Omnivision OV13B10 12MP f/f/2.2
      Szelfikamera: Sony IMX596 20MP f/f/2.2
      Telefotó: Omnivision OV50D40 Light Hunter 400 50MP f/f/2.0

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 5.30
      Mobile network: 5
      Dual SIM: Yes
      eSIM: Yes
      NFC: Yes
      Jack: No
      Infrared: Yes

      ================ BATTERY =================
      Battery capacity: 5000 mAh
      Battery type: Li-Po
      Charging wired: 67 W
      Charging wireless: 0 W

      ================ BUILD =================
      Dimensions: 162.20 x 75.50 x 8.49 mm
      Weight: 193.00 g
      Back material: Vegán műbőr
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Optikai (Kijelző)
      Available colors: Alpine Blue, Black, Meadow Green

      ================ NEXT PHONE =================
      ================ BASIC =================
      Phone ID: 2
      Name: ZTE nubia Red Magic 9S Pro
      Manufacturer: ZTE nubia
      Release: 2024-07-09
      Price: 341270
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1116 x 2480
      Screen size: 2.80"
      Screen type: AMOLED
      Refresh rate: 120 Hz
      Max brightness: 1600 nits
      Sharpness: 400

      ================ PERFORMANCE =================
      Antutu: 2369542
      CPU: Qualcomm Snapdragon 8 Gen 3 Leading Edition 3 GHz, 8 cores, 4 nm
      RAM speed: LPDDR5X
      Storage speed: UFS 4.0
      RAM/Storage versions: 12GB / 256GB; 12GB / 258GB; 16GB / 542GB

      ================ CAMERAS =================
      Főkamera: GalaxyCore GC02M1 2MP f/f/2.4
      Makrókamera: Omnivision OV16A1Q 16MP f/f/2.0
      Széles látószögű kamera: Samsung GN5 50MP f/f/1.9 OIS
      Szelfi kamera: Samsung S5KJN1 50MP f/f/2.2

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 5.20
      Mobile network: 5
      Dual SIM: Yes
      eSIM: No
      NFC: Yes
      Jack: Yes
      Infrared: Yes

      ================ BATTERY =================
      Battery capacity: 6500 mAh
      Battery type: Li-Polymer
      Charging wired: 80 W
      Charging wireless: 0 W

      ================ BUILD =================
      Dimensions: 164.00 x 86.40 x 9.80 mm
      Weight: 229.00 g
      Back material: Üveg
      Waterproof: nincs
      Speaker: stereo
      Fingerprint: Optikai (Kijelző)
      Available colors: Cyclone, Design Sleet, Frost

      ================ NEXT PHONE =================
      ================ BASIC =================
      Phone ID: 3
      Name: Samsung Galaxy S24 Ultra
      Manufacturer: Samsung
      Release: 2025-02-03
      Price: 338640
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1116 x 2480
      Screen size: 6.80"
      Screen type: LTPO AMOLED
      Refresh rate: 120 Hz
      Max brightness: 2600 nits
      Sharpness: 505

      ================ PERFORMANCE =================
      Antutu: 1814869
      CPU: Snapdragon 8 Gen 3 3 GHz, 8 cores, 4 nm
      RAM speed: LPDDR5X
      Storage speed: UFS 4.0
      RAM/Storage versions: 12GB / 1024GB; 12GB / 256GB; 12GB / 512GB

      ================ CAMERAS =================
      Főkamera:  50MP f/
      Periszkópos telefotó kamera: Samsung ISOCELL HP2 200MP f/f/1.7 OIS
      Széles látószögű kamera: Samsung S5K3LU 12MP f/f/2.2
      Szelfi kamera: Sony IMX564 12MP f/f/2.2
      Telefotó kamera: Sony IMX854 50MP f/f/3.4 OIS

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 5.30
      Mobile network: 5
      Dual SIM: Yes
      eSIM: Yes
      NFC: Yes
      Jack: No
      Infrared: No

      ================ BATTERY =================
      Battery capacity: 5000 mAh
      Battery type: Li-Ion
      Charging wired: 45 W
      Charging wireless: 15 W

      ================ BUILD =================
      Dimensions: 162.30 x 79.00 x 8.60 mm
      Weight: 233.00 g
      Back material: Üveg
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Ultraszonikus (Kijelző)
      Available colors: Titánfekete, Titánkék, Titánlila, Titánsárga, Titánszürke

      ================ NEXT PHONE =================
      ================ BASIC =================
      Phone ID: 4
      Name: Apple iPhone 16 Pro Max
      Manufacturer: Apple
      Release: 2024-09-20
      Price: 546940
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1320 x 2868
      Screen size: 6.90"
      Screen type: Super Retina XDR OLED
      Refresh rate: 120 Hz
      Max brightness: 2000 nits
      Sharpness: 460

      ================ PERFORMANCE =================
      Antutu: 1753018
      CPU: Apple A18 Pro 5 GHz, 6 cores, 3 nm
      RAM speed: 
      Storage speed: 
      RAM/Storage versions: 8GB / 1024GB; 8GB / 256GB; 8GB / 512GB

      ================ CAMERAS =================
      Főkamera: Sony IMX903 48MP f/f/1.8 OIS
      periszkópos telefotó: Sony IMX913 12MP f/f/2.8 OIS
      Széles látószögű kamera: Sony IMX972 48MP f/f/2.2
      Szelfi kamera: Sony IMX714 12MP f/f/1.9

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 5.30
      Mobile network: 5
      Dual SIM: Yes
      eSIM: Yes
      NFC: Yes
      Jack: No
      Infrared: No

      ================ BATTERY =================
      Battery capacity: 4685 mAh
      Battery type: Li-Po
      Charging wired: 25 W
      Charging wireless: 25 W

      ================ BUILD =================
      Dimensions: 163.00 x 77.60 x 8.25 mm
      Weight: 227.00 g
      Back material: Üveg
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Nincs ()
      Available colors: Black Titanium, Desert Titanium, Natural Titanium, White Titanium

      ================ NEXT PHONE =================
      ================ BASIC =================
      Phone ID: 5
      Name: Samsung Galaxy S25 Ultra
      Manufacturer: Samsung
      Release: 2025-02-03
      Price: 359020
      In store: Yes
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1440 x 3120
      Screen size: 6.86"
      Screen type: Dynamic LTPO AMOLED 2X
      Refresh rate: 120 Hz
      Max brightness: 2600 nits
      Sharpness: 505

      ================ PERFORMANCE =================
      Antutu: 2265528
      CPU: Qualcomm Snapdragon 8 Elite 4 GHz, 8 cores, 3 nm
      RAM speed: LPDDR5X
      Storage speed: UFS 4.0
      RAM/Storage versions: 12GB / 1024GB; 12GB / 256GB; 12GB / 512GB; 16GB / 1024GB

      ================ CAMERAS =================
      Főkamera: Samsung ISOCELL HP2 200MP f/f/1.7 OIS
      Periszkópos telefotó kamera: Sony IMX854 50MP f/f/3.4 OIS
      Széles látószögű kamera: Samsung JN3 50MP f/f/1.9
      Szelfi kamera: Samsung S5K3LU 12MP f/f/2.2
      Telefotó kamera:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 5.40
      Mobile network: 5
      Dual SIM: Yes
      eSIM: Yes
      NFC: Yes
      Jack: No
      Infrared: No

      ================ BATTERY =================
      Battery capacity: 5000 mAh
      Battery type: Li-Ion
      Charging wired: 45 W
      Charging wireless: 15 W

      ================ BUILD =================
      Dimensions: 162.80 x 77.60 x 8.20 mm
      Weight: 218.00 g
      Back material: Üveg
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Ultraszonikus (Kijelző)
      Available colors: Titanium Black, Titanium Gray, Titanium Jadegreen, Titanium Jetblack, Titanium Pinkgold, Titanium Silverblue, Titanium Whitesilver

      ================ NEXT PHONE =================
      ================ BASIC =================
      Phone ID: 6
      Name: Honor Magic7 Pro
      Manufacturer: Honor
      Release: 2024-11-08
      Price: 320640
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1280 x 2800
      Screen size: 6.80"
      Screen type: LTPO OLED
      Refresh rate: 120 Hz
      Max brightness: 5000 nits
      Sharpness: 453

      ================ PERFORMANCE =================
      Antutu: 3040000
      CPU: Qualcomm Snapdragon 8 Elite 4 GHz, 8 cores, 3 nm
      RAM speed: LPDDR5X
      Storage speed: UFS 4.0
      RAM/Storage versions: 12GB / 1024GB; 12GB / 256GB; 12GB / 521GB; 16GB / 1024GB; 16GB / 512GB

      ================ CAMERAS =================
      Főkamera: Omnivision OV50H 50MP f/f/1.4 OIS
      Széles látószögű kamera: Omnivision OV50D40 Light Hunter 400 50MP f/f/2.0
      Szelfi kamera: Sony IMX816 50MP f/f/2.0
      Telefotó kamera: Samsung S5KHP3SP 200MP f/f/2.6 OIS

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 5.40
      Mobile network: 5
      Dual SIM: Yes
      eSIM: Yes
      NFC: Yes
      Jack: No
      Infrared: Yes

      ================ BATTERY =================
      Battery capacity: 5270 mAh
      Battery type: Li-Ion
      Charging wired: 100 W
      Charging wireless: 80 W

      ================ BUILD =================
      Dimensions: 162.70 x 77.10 x 8.80 mm
      Weight: 223.00 g
      Back material: Üveg
      Waterproof: IP69K
      Speaker: stereo
      Fingerprint: Ultraszonikus (Kijelző)
      Available colors: Black, Breeze Blue, Lunar shadow Gray

      ================ NEXT PHONE =================
      ================ BASIC =================
      Phone ID: 7
      Name: Google Pixel 9 Pro XL
      Manufacturer: Google
      Release: 2024-08-22
      Price: 372990
      In store: Yes
      Amount: 0

      ================ DISPLAY =================
      Resolution: 2992 x 1344
      Screen size: 6.80"
      Screen type: LTPO OLED
      Refresh rate: 120 Hz
      Max brightness: 3000 nits
      Sharpness: 482

      ================ PERFORMANCE =================
      Antutu: 1148512
      CPU: Google Tensor G4 3 GHz, 8 cores, 4 nm
      RAM speed: 
      Storage speed: UFS 3.1
      RAM/Storage versions: 16GB / 128GB; 16GB / 256GB; 16GB / 512GB

      ================ CAMERAS =================
      Főkamera: Samsung GN1 50MP f/f/1.7 OIS
      Periszkópos telefotó kamera: Samsung S5KGM5 48MP f/f/2.8 OIS
      Széles látószögű kamera: Samsung S5KGM5 48MP f/f/1.7
      Szelfi kamera:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 5.30
      Mobile network: 5
      Dual SIM: Yes
      eSIM: Yes
      NFC: Yes
      Jack: No
      Infrared: No

      ================ BATTERY =================
      Battery capacity: 5060 mAh
      Battery type: Li-Ion
      Charging wired: 37 W
      Charging wireless: 23 W

      ================ BUILD =================
      Dimensions: 162.75 x 76.59 x 8.54 mm
      Weight: 210.00 g
      Back material: Üveg
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Ultraszonikus (Kijelző)
      Available colors: Hazel, Obsidian, Porcelain, Rose Quartz

      ================ NEXT PHONE =================
      ================ BASIC =================
      Phone ID: 8
      Name: Xiaomi Redmi Note 14 Pro 5G
      Manufacturer: Xiaomi
      Release: 2025-01-15
      Price: 84160
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1220 x 2712
      Screen size: 6.67"
      Screen type: AMOLED
      Refresh rate: 120 Hz
      Max brightness: 3000 nits
      Sharpness: 446

      ================ PERFORMANCE =================
      Antutu: 704404
      CPU: Mediatek Dimensity 7300 Ultra 2 GHz, 8 cores, 4 nm
      RAM speed: LPDDR4X
      Storage speed: UFS 2.2
      RAM/Storage versions: 12GB / 256GB; 12GB / 512GB; 8GB / 256GB

      ================ CAMERAS =================
      Főkamera:  50MP f/
      makró kamera:  50MP f/
      Széles látószögű kamera:  50MP f/
      Szelfi kamera:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 6
      Bluetooth: 5.40
      Mobile network: 5
      Dual SIM: Yes
      eSIM: Yes
      NFC: Yes
      Jack: No
      Infrared: Yes

      ================ BATTERY =================
      Battery capacity: 5110 mAh
      Battery type: Li-Polymer
      Charging wired: 45 W
      Charging wireless: 0 W

      ================ BUILD =================
      Dimensions: 162.30 x 74.40 x 8.20 mm
      Weight: 190.00 g
      Back material: Üveg
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Optikai (Kijelző alatt)
      Available colors: Midnight black, Ocean blue



      ================ NEXT PHONE =================
      ================ BASIC =================
      Phone ID: 11
      Name: Xiaomi Redmi Note 14 5G
      Manufacturer: Xiaomi 
      Release: 2025-01-16
      Price: 75600
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1080 x 2400
      Screen size: 6.67"
      Screen type: Amoled
      Refresh rate: 120 Hz
      Max brightness: 1200 nits
      Sharpness: 395

      ================ PERFORMANCE =================
      Antutu: 463129
      CPU: Mediatek Dimensity 7025 Ultra 2 GHz, 6 cores, 6 nm
      RAM speed: LPDDR4X
      Storage speed: UFS2.2
      RAM/Storage versions: 12GB / 512GB; 6GB / 128GB; 8GB / 256GB

      ================ CAMERAS =================
      Főkamera: n/a 108MP f/f/1.7
      Makró kamera:  50MP f/
      Széles látószögű kamera:  50MP f/
      Szelfi kamera:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 5
      Bluetooth: 5.30
      Mobile network: 5
      Dual SIM: Yes
      eSIM: No
      NFC: Yes
      Jack: Yes
      Infrared: Yes

      ================ BATTERY =================
      Battery capacity: 5110 mAh
      Battery type: n/a
      Charging wired: 45 W
      Charging wireless: 0 W

      ================ BUILD =================
      Dimensions: 162.40 x 75.70 x 7.99 mm
      Weight: 190.00 g
      Back material: Műanyag
      Waterproof: IP64
      Speaker: stereo
      Fingerprint: Optikai (Kijelző alatt)
      Available colors: Coral Green

      ================ NEXT PHONE=================
      ================ BASIC =================
      Phone ID: 10
      Name: Xiaomi Redmi Note 14 4G
      Manufacturer: Xiaomi
      Release: 2024-02-25
      Price: 57800
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1080 x 2400
      Screen size: 6.67"
      Screen type: Amoled
      Refresh rate: 120 Hz
      Max brightness: 1200 nits
      Sharpness: 395

      ================ PERFORMANCE =================
      Antutu: 116000
      CPU: Mediatek Helio G99 Ultra 2 GHz, 8 cores, 6 nm
      RAM speed: LPDDR4X
      Storage speed: UFS2.2
      RAM/Storage versions: N/A

      ================ CAMERAS =================
      Fő hátsó kamera: Samsung HM6 108MP f/f/1.7
      Széles látószögű:  50MP f/
      Teleobjektív:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 5
      Bluetooth: 5.30
      Mobile network: 4
      Dual SIM: Yes
      eSIM: No
      NFC: Yes
      Jack: Yes
      Infrared: Yes

      ================ BATTERY =================
      Battery capacity: 5500 mAh
      Battery type: Li-Pol
      Charging wired: 33 W
      Charging wireless: 0 W

      ================ BUILD =================
      Dimensions: 163.30 x 76.60 x 8.20 mm
      Weight: 196.50 g
      Back material: Műanyag
      Waterproof: IP54
      Speaker: stereo
      Fingerprint: Optikai (Kijelző alatt)
      Available colors: Lime Green, Midnight Black, Mist Purple, Ocean Blue

      ================ NEXT PHONE=================
      ================ BASIC =================
      Phone ID: 13
      Name: Xiaomi Redmi Note 14 Pro 4G
      Manufacturer: Xiaomi 
      Release: 2025-01-16
      Price: 73990
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1080 x 2400
      Screen size: 6.67"
      Screen type: Amoled
      Refresh rate: 120 Hz
      Max brightness: 1800 nits
      Sharpness: 395

      ================ PERFORMANCE =================
      Antutu: 423868
      CPU: Mediatek Helio G100 Ultra 2 GHz, 8 cores, 6 nm
      RAM speed: LPDDR4X
      Storage speed: UFS2.2
      RAM/Storage versions: 12GB / 256GB; 12GB / 512GB; 8GB / 128GB; 8GB / 256GB

      ================ CAMERAS =================
      Főkamera: n/a 108MP f/f/1.7
      makró kamera:  50MP f/
      Széles látószögű kamera:  50MP f/
      Szelfikamera:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 5
      Bluetooth: 5.30
      Mobile network: 4
      Dual SIM: Yes
      eSIM: No
      NFC: Yes
      Jack: Yes
      Infrared: Yes

      ================ BATTERY =================
      Battery capacity: 5500 mAh
      Battery type: n/a
      Charging wired: 45 W
      Charging wireless: 0 W

      ================ BUILD =================
      Dimensions: 162.20 x 74.90 x 8.20 mm
      Weight: 180.00 g
      Back material: Műanyag
      Waterproof: IP64
      Speaker: stereo
      Fingerprint: Optikai (Kijelző alatt)
      Available colors: Aurora Purple, Midnight Black, Ocean Blue

      ================ NEXT PHONE=================
      ================ BASIC =================
      Phone ID: 14
      Name: Xiaomi Redmi Note 14 Pro+ 5G
      Manufacturer: Xiaomi 
      Release: 2025-01-15
      Price: 102490
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1220 x 2712
      Screen size: 6.67"
      Screen type: Amoled
      Refresh rate: 120 Hz
      Max brightness: 3000 nits
      Sharpness: 446

      ================ PERFORMANCE =================
      Antutu: 750292
      CPU: Qualcomm SM7635 Snapdragon 7s Gen 3 2 GHz, 8 cores, 4 nm
      RAM speed: LPDDR4X
      Storage speed: UFS2.2
      RAM/Storage versions: 12GB / 256GB; 12GB / 512GB; 8GB / 256GB

      ================ CAMERAS =================
      Fő kamera: n/a 108MP f/f/1.7
      Makró kamera:  50MP f/
      Széles látószögű kamera:  50MP f/
      Szelfikamera:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 5
      Bluetooth: 5.40
      Mobile network: 5
      Dual SIM: Yes
      eSIM: Yes
      NFC: Yes
      Jack: Yes
      Infrared: Yes

      ================ BATTERY =================
      Battery capacity: 5110 mAh
      Battery type: n/a
      Charging wired: 120 W
      Charging wireless: 0 W

      ================ BUILD =================
      Dimensions: 162.50 x 74.70 x 8.80 mm
      Weight: 205.00 g
      Back material: Üveg
      Waterproof: ip68
      Speaker: stereo
      Fingerprint: Optikai (Kijelző alatt)
      Available colors: Frost Blue, Lavender Purple, Midnight Black

      ================ NEXT PHONE=================
      ================ BASIC =================
      Phone ID: 15
      Name: Xiaomi 14
      Manufacturer: Xiaomi
      Release: 2023-10-01
      Price: 299990
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1200 x 2670
      Screen size: 6.36"
      Screen type: AMOLED
      Refresh rate: 120 Hz
      Max brightness: 3000 nits
      Sharpness: 460

      ================ PERFORMANCE =================
      Antutu: 2089308
      CPU: Snapdragon® 8 Gen 3 3 GHz, 8 cores, 4 nm
      RAM speed: LPDDR5X
      Storage speed: UFS 4
      RAM/Storage versions: 12GB / 256GB; 12GB / 512GB

      ================ CAMERAS =================
      Floating telefotó kamera:  50MP f/
      Főkamera: Omnivision OV32B 32MP f/f/2.0
      Széles látószögű kamera: Omnivision OVX9000 50MP f/f/1.62 OIS
      Szelfi kamera: Samsung S5KJN1 50MP f/f/2.2

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 5.40
      Mobile network: 5
      Dual SIM: Yes
      eSIM: Yes
      NFC: Yes
      Jack: No
      Infrared: Yes

      ================ BATTERY =================
      Battery capacity: 4610 mAh
      Battery type: Li-Po
      Charging wired: 90 W
      Charging wireless: 50 W

      ================ BUILD =================
      Dimensions: 152.80 x 71.50 x 8.20 mm
      Weight: 193.00 g
      Back material: Üveg
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Optikai (Kijelzőben)
      Available colors: Black, Jade Green, White

      ================ NEXT PHONE=================
      ================ BASIC =================
      Phone ID: 16
      Name: Motorola Edge 50 Fusion
      Manufacturer: Motorola
      Release: 2024-05-15
      Price: 91820
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1080 x 2400
      Screen size: 6.67"
      Screen type: P-OLED
      Refresh rate: 144 Hz
      Max brightness: 1600 nits
      Sharpness: 393

      ================ PERFORMANCE =================
      Antutu: 603451
      CPU: Qualcomm Snapdragon 7s Gen 2 2 GHz, 8 cores, 4 nm
      RAM speed: LPDDR4X
      Storage speed: UFS 2.2
      RAM/Storage versions: 128GB / 8GB; 256GB / 12GB; 256GB / 8GB; 512GB / 12GB; 512GB / 8GB

      ================ CAMERAS =================
      Első (selfie) kamera:  50MP f/
      Főkamera: Hynix Hi-1336 13MP f/f/2.1
      Makró kamera: Samsung S5KJD1 32MP f/f/2.45
      Széles látószögű kamera: Sony LYT-700C 50MP f/f/1.8 OIS
      Teleobjektíves kamera:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 5
      Bluetooth: 5.30
      Mobile network: 5
      Dual SIM: Yes
      eSIM: No
      NFC: Yes
      Jack: No
      Infrared: No

      ================ BATTERY =================
      Battery capacity: 5000 mAh
      Battery type: Li-Polymer
      Charging wired: 68 W
      Charging wireless: 0 W

      ================ BUILD =================
      Dimensions: 161.91 x 73.05 x 7.76 mm
      Weight: 175.00 g
      Back material: Fa
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Optikai (Kijelző alatt)
      Available colors: Forest Blue, Hot Pink, Marshmallow Blue

      ================ NEXT PHONE=================
      ================ BASIC =================
      Phone ID: 17
      Name: Motorola Edge 50 Ultra
      Manufacturer: Motorola
      Release: 2024-05-15
      Price: 217160
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1220 x 2712
      Screen size: 6.70"
      Screen type: P-OLED
      Refresh rate: 144 Hz
      Max brightness: 2500 nits
      Sharpness: 444

      ================ PERFORMANCE =================
      Antutu: 1523879
      CPU: Qualcomm Snapdragon 8s Gen 3 3 GHz, 8 cores, 4 nm
      RAM speed: LPDDR5X
      Storage speed: UFS 4.0
      RAM/Storage versions: 0GB / 0GB; 1000GB / 16GB; 512GB / 12GB; 512GB / 16GB

      ================ CAMERAS =================
      Első (selfie) kamera:  50MP f/
      Főkamera: Omnivision OV50H 50MP f/f/1.4 OIS
      Széles látószögű kamera: Omnivision OV64B 64MP f/f/2.4
      Teleobjektíves kamera: Samsung S5KJN1 50MP f/f/2.2

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 5.40
      Mobile network: 5
      Dual SIM: Yes
      eSIM: No
      NFC: Yes
      Jack: No
      Infrared: No

      ================ BATTERY =================
      Battery capacity: 4500 mAh
      Battery type: Li-Polymer
      Charging wired: 125 W
      Charging wireless: 50 W

      ================ BUILD =================
      Dimensions: 161.08 x 72.37 x 8.59 mm
      Weight: 197.00 g
      Back material: Fa
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Optikai (Kijelző alatt)
      Available colors: Forest Grey, Nordic Wood, Peach Fuzz

      ================ NEXT PHONE=================
      ================ BASIC =================
      Phone ID: 18
      Name: Motorola Edge 50 Neo
      Manufacturer: Motorola
      Release: 2024-08-29
      Price: 117000
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1200 x 2670
      Screen size: 6.40"
      Screen type: P-OLED
      Refresh rate: 120 Hz
      Max brightness: 3000 nits
      Sharpness: 460

      ================ PERFORMANCE =================
      Antutu: 696931
      CPU: Mediatek Dimensity 7300 2 GHz, 0 cores, 4 nm
      RAM speed: 
      Storage speed: UFS 4.0
      RAM/Storage versions: N/A

      ================ CAMERAS =================
      Főkamera:  50MP f/
      Széles látószögű: Sony LYT-700C 50MP f/f/1.8 OIS
      Szelfikamera:  50MP f/
      Telefotó:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 0
      Bluetooth: 5.30
      Mobile network: 0
      Dual SIM: No
      eSIM: No
      NFC: Yes
      Jack: No
      Infrared: No

      ================ BATTERY =================
      Battery capacity: 4310 mAh
      Battery type: Li-Polymer
      Charging wired: 68 W
      Charging wireless: 15 W

      ================ BUILD =================
      Dimensions: 154.10 x 71.20 x 8.10 mm
      Weight: 171.00 g
      Back material: Fa
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Optikai (Kijelző alatt)
      Available colors: PANTONE Grisaille, PANTONE Latte, PANTONE Mocha Mousse, PANTONE Nautical Blue, PANTONE Poinciana

      ================ NEXT PHONE=================
      ================ BASIC =================
      Phone ID: 19
      Name: Motorola Edge 50
      Manufacturer: Motorola
      Release: 2024-08-08
      Price: 108000
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1220 x 2712
      Screen size: 6.70"
      Screen type: P-OLED
      Refresh rate: 120 Hz
      Max brightness: 1600 nits
      Sharpness: 446

      ================ PERFORMANCE =================
      Antutu: 722062
      CPU: Qualcomm SM7450-AB Snapdragon 7 Gen 1 AE 2 GHz, 1 cores, 4 nm
      RAM speed: 
      Storage speed: UFS 2.2
      RAM/Storage versions: 12GB / 256GB; 12GB / 512GB; 8GB / 256GB

      ================ CAMERAS =================
      Fő hátsó kamera:  50MP f/
      Széles látószögű: Sony LYT-700C 50MP f/f/1.8 OIS
      Szelfikamera:  50MP f/
      Telefotó:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 0
      Bluetooth: 5.20
      Mobile network: 0
      Dual SIM: No
      eSIM: No
      NFC: Yes
      Jack: No
      Infrared: No

      ================ BATTERY =================
      Battery capacity: 5000 mAh
      Battery type: Li-Polymer
      Charging wired: 68 W
      Charging wireless: 15 W

      ================ BUILD =================
      Dimensions: 160.80 x 72.40 x 7.80 mm
      Weight: 180.00 g
      Back material: Fa
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Optikai (Kijelző alatt)
      Available colors: Jungle Green, Koala Grey, Peach Fuzz

      ================ NEXT PHONE=================
      ================ BASIC =================
      Phone ID: 20
      Name: Google Pixel 9 Pro
      Manufacturer: Google
      Release: 2024-09-09
      Price: 335000
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1280 x 2856
      Screen size: 6.30"
      Screen type: P-OLED
      Refresh rate: 120 Hz
      Max brightness: 2400 nits
      Sharpness: 497

      ================ PERFORMANCE =================
      Antutu: 1148512
      CPU: Google Tensor G4 3 GHz, 8 cores, 4 nm
      RAM speed: 
      Storage speed: UFS 3.1
      RAM/Storage versions: 16GB / 1024GB; 16GB / 128GB; 16GB / 256GB; 16GB / 512GB

      ================ CAMERAS =================
      Fő hátsó kamera: Samsung GNK 50MP f/f/1.69 OIS
      Periszkópos telefotó: Sony IMX858 48MP f/f/2.8 OIS
      Széles látószögű:  50MP f/
      Szelfikamera:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 5.30
      Mobile network: 5
      Dual SIM: Yes
      eSIM: No
      NFC: Yes
      Jack: No
      Infrared: No

      ================ BATTERY =================
      Battery capacity: 4700 mAh
      Battery type: Li-ion
      Charging wired: 27 W
      Charging wireless: 21 W

      ================ BUILD =================
      Dimensions: 152.80 x 72.90 x 8.50 mm
      Weight: 199.00 g
      Back material: Fa
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Ultraszonikus (Kijelző alatt)
      Available colors: Beige, Black, Grey, Pink

      ================ NEXT PHONE=================
      ================ BASIC =================
      Phone ID: 21
      Name: Xiaomi 15
      Manufacturer: Xiaomi
      Release: 2024-10-29
      Price: 255590
      In store: No
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1200 x 2670
      Screen size: 6.36"
      Screen type: LTPO AMOLED
      Refresh rate: 120 Hz
      Max brightness: 3200 nits
      Sharpness: 460

      ================ PERFORMANCE =================
      Antutu: 2746580
      CPU: Snapdragon 8 Elite 4 GHz, 8 cores, 3 nm
      RAM speed: LPDDR5X
      Storage speed: UFS 4
      RAM/Storage versions: 12GB / 256GB; 12GB / 512GB

      ================ CAMERAS =================
      Főkamera: Omnivision OV32B 32MP f/f/2.0
      Széles látőszögű kamera: Omnivision OVX9000 50MP f/f/1.62 OIS
      Szelfi kamera: Samsung S5KJN1 50MP f/f/2.2
      Teleobjektíves: Samsung S5KJN5 50MP f/f/2.0 OIS

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 6.00
      Mobile network: 5
      Dual SIM: Yes
      eSIM: No
      NFC: Yes
      Jack: No
      Infrared: Yes

      ================ BATTERY =================
      Battery capacity: 5240 mAh
      Battery type: Li-Ion
      Charging wired: 90 W
      Charging wireless: 50 W

      ================ BUILD =================
      Dimensions: 152.30 x 71.20 x 8.08 mm
      Weight: 190.50 g
      Back material: Üveg
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Ultraszonikus (Kijelzőben)
      Available colors: Black, Green, Liquid Silver, White

      ================ NEXT PHONE=================
      ================ BASIC =================
      Phone ID: 22
      Name: Xiaomi 15 Ultra
      Manufacturer: Xiaomi
      Release: 2025-02-27
      Price: 374790
      In store: Yes
      Amount: 0

      ================ DISPLAY =================
      Resolution: 1400 x 3200
      Screen size: 6.73"
      Screen type: LTPO AMOLED
      Refresh rate: 120 Hz
      Max brightness: 3200 nits
      Sharpness: 522

      ================ PERFORMANCE =================
      Antutu: 2746580
      CPU: Snapdragon 8 Elite 4 GHz, 8 cores, 3 nm
      RAM speed: LPDDR5X
      Storage speed: UFS 4.1
      RAM/Storage versions: 16GB / 1024GB; 16GB / 512GB

      ================ CAMERAS =================
      Floating telefotó kamera: Omnivision OV32B 32MP f/f/2.0
      Főkamera: Samsung ISOCELL HP9 200MP f/f/2.6 OIS
      Széles látószögű kamera: Samsung S5KJN5 50MP f/f/2.0 OIS
      Szelfi kamera: Sony LYT-900 50MP f/f/1.63 OIS
      Ultra telefotó kamera:  50MP f/

      ================ CONNECTIVITY =================
      WiFi: 7
      Bluetooth: 6.00
      Mobile network: 5
      Dual SIM: Yes
      eSIM: Yes
      NFC: Yes
      Jack: No
      Infrared: Yes

      ================ BATTERY =================
      Battery capacity: 5410 mAh
      Battery type: Li-Ion
      Charging wired: 90 W
      Charging wireless: 80 W

      ================ BUILD =================
      Dimensions: 161.30 x 75.30 x 9.35 mm
      Weight: 229.00 g
      Back material: Üveg
      Waterproof: IP68
      Speaker: stereo
      Fingerprint: Ultraszonikus (Kijelzőben)
      Available colors: Black, Silver Chrome, White
      `;

const SYSTEM_INSTRUCTION = `
    You are a helpful assistant for PhoneScout, a mobile phone shop and service center.
    Use ONLY the information from the context below to answer the customer's question.
    If the question is unrelated to PhoneScout, politely say you cannot answer.
    
    Site name is PhoneScout. PhoneScout is a shop and service center for mobile phones.
    I am an assistant at PhoneScout, and I am here to help customers with any questions.

    PhoneScout services:
    - Selling new and used phones.
    - Phone repairs, including screen replacement and battery replacement.
    - Software updates for phones.
    - Data backup and transfer services.
    - Trade-in program for old phones.
    - Accessories: chargers, earphones, cases, and screen protectors.

    Warranty and returns:
    - All new phones have a 12-month warranty.
    - Used phones have a 6-month warranty.
    - Returns accepted within 14 days with receipt.
    - Repairs are guaranteed for 3 months after service.

    Common questions:
    - How can I buy a phone? Customers can visit the shop or order online.
    - Do you ship phones? Yes, we provide shipping within the country.
    - Can I trade in my old phone? Yes, PhoneScout accepts trade-ins for most major brands.
    - Do you offer financing? Yes, we have financing options for selected phones.
    - Can I repair my phone here? Yes, PhoneScout provides repair services for screens, batteries, and software issues.

    PhoneScout contact info:
    - Customers can contact us via email at phonescoutofficial@gmail.co or call +36-46-500-930.
    - Our working hours are Monday to Friday, 9am to 6pm, and Saturday 10am to 4pm.

    Guidelines for the assistant:
    - Always answer questions related to phones sold and services offered.
    - If the customer asks about phones, provide specs and options.
    - If the customer asks about repair, shipping, trade-in, or warranty, provide relevant details.
    - If the question is unrelated to PhoneScout, politely say it is not about the site's topic, and never answer.
    - Dont answer any questions that doesn't go with the phone shop or service context. Tell the user that you cant help with the question and ask if they have any questions in connection with our website.
    - Don't recommend any other service, if the user asks about it, tell that you dont know any other repair shop.
    - Don't use any stylings during a response such as **, *, etc.
    - Give short understandable and easily digestible answers, avoid long and complex sentences if possible.
    - If the user asks something because he doesnt know, you can explan it to them, for example if they ask you to explain more about a part you can explan what does each thing mean and do. 
    - We dont sell any accessories. If the user asks about accessories, tell them that we dont sell any accessories but we can help with any questions about phones or repairs.
    - We dont sell used phones, only new phones.
    - We only repair phones, no other devices.
    - If the user asks about something that is not related to phones or phone repairs, tell them that you cant help with that question and ask if they have any questions in connection with our website.
    - If they ask about any phone related you can answer, for exaqmple about general information or such.
    - Dont recommend us in every single message, it is too much if you mention our service inm every message.
    - If the user wants service, they can fill a form too to request a repair.
    - If the user comes in person, they should fill the form for easier and faster service, but if they dont want to fill the form, it will take longer in person to 
    - After the user filled the form there is a description of what they have to do.
    
    `;

const QUICK_BUTTONS = [
  "Betört a kijelzőm",
  "Nem tölt a telefonom",
  "Nem kapcsol be a telefonom",
  "Az akkumulátor gyorsan lemerül",
  "Vízbe esett a telefonom",
  "Zöld csík van a kijelzőn",
  "Nem működik a kamera",
  "Nem hallanak telefonálás közben",
  "Fel van púposodva az akkumulátor",
  "Rezeg a kamera"
];

function ChatbotWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickButtons, setShowQuickButtons] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const historyRef = useRef([]);
  const chatRef = useRef(null);
  const widgetRef = useRef(null);
  const dragRef = useRef({ isDragging: false, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 100);
    ask("START", { skipUser: true });
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, followUps, isLoading]);

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragRef.current.isDragging || !widgetRef.current) return;
      const left = e.clientX - dragRef.current.offsetX;
      const top = e.clientY - dragRef.current.offsetY;
      widgetRef.current.style.left = `${left}px`;
      widgetRef.current.style.top = `${top}px`;
      widgetRef.current.style.right = "auto";
      widgetRef.current.style.bottom = "auto";
    };

    const handleUp = () => {
      dragRef.current.isDragging = false;
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, []);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateMessage = (id, patch) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const typeMessage = async (id, text, speed = TYPING_SPEED) => {
    updateMessage(id, { role: "answer", text: "" });
    let current = "";
    for (let i = 0; i < text.length; i += 1) {
      current += text[i];
      updateMessage(id, { text: current });
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
  };

  const isServiceRelated = (text) => {
    const serviceKeywords = ["szerviz", "javít", "javítás", "szervizelni", "repair", "service", "hiba", "nem működik"];
    const lowerText = text.toLowerCase();
    return serviceKeywords.some(keyword => lowerText.includes(keyword));
  };

  const isBuyingRelated = (text) => {
    const buyingKeywords = ["vásárol", "venni", "akarok", "szeretnék", "telefont", "telefon", "buy", "purchase", "ár", "ára", "árak", "price", "cost", "érdekel", "melyik", "mely", "legjobb", "ajánl"];
    const lowerText = text.toLowerCase();
    return buyingKeywords.some(keyword => lowerText.includes(keyword));
  };

  const isLocationRelated = (text) => {
    const locationKeywords = ["hol található", "hol van", "cím", "címet", "üzlet", "bolt", "hely", "address", "location"];
    const lowerText = text.toLowerCase();
    return locationKeywords.some((keyword) => lowerText.includes(keyword));
  };

  const ask = async (question, options = {}) => {
    const { skipUser = false } = options;

    // Ha "START" üzenet, csak a welcome üzenetet mutatjuk, API-t nem hívunk
    if (question === "START") {
      addMessage({
        id: `bot-${Date.now()}`,
        role: "answer",
        text: "Üdvözöllek a PhoneScout ügyfélszolgálatban! Én Sam vagyok. 👋\n\nMiben segíthetek?"
      });
      setShowQuickButtons(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setShowQuickButtons(false);

    if (!skipUser) {
      addMessage({
        id: `user-${Date.now()}`,
        role: "user",
        text: question
      });
    }

    const loadingId = `loading-${Date.now()}`;
    addMessage({
      id: loadingId,
      role: "loading",
      text: "AI gondolkodik..."
    });

    if (isLocationRelated(question)) {
      const locationAnswer = `Üzletünk címe: ${STORE_ADDRESS}`;

      historyRef.current.push({ role: "user", text: question });
      historyRef.current.push({ role: "assistant", text: locationAnswer });

      await typeMessage(loadingId, locationAnswer, TYPING_SPEED);

      addMessage({
        id: `location-btn-${Date.now()}`,
        role: "location-button",
        text: "location"
      });

      setFollowUps([]);
      setIsLoading(false);
      return;
    }

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY nincs beállítva a .env fájlban");
      }

      const conversationHistory = historyRef.current.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      // Dinamikusan adjuk hozzá a telefonok adatait az aktuális kérdéshez, ha vásárlásról van szó
      let userQuestion = question;
      if (isBuyingRelated(question)) {
        userQuestion = `${PHONES_DATA}\n\nFelhasználó kérdése: ${question}`;
      }

      const requestBody = {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents: [
          ...conversationHistory,
          {
            role: "user",
            parts: [{ text: userQuestion }]
          }
        ]
      };

      const res = await axios.post(
        // ITT A VÁLTOZÁS: gemini-2.5-pro
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,requestBody);

      if (res.status !== 200) {
        const errorData = await res.data;
        throw new Error(`API hiba ${res.status}: ${errorData?.error?.message || "Ismeretlen hiba"}`);
      }

      const data = await res.data;
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Nem kaptam választ.";

      historyRef.current.push({ role: "user", text: question });
      historyRef.current.push({ role: "assistant", text: answer });

      await typeMessage(loadingId, answer, TYPING_SPEED);

      // Ha a válasz szervízhez kapcsolódik, adjunk hozzá egy gombat
      if (isServiceRelated(answer)) {
        addMessage({
          id: `service-btn-${Date.now()}`,
          role: "service-button",
          text: "szerviz"
        });
      }

      setFollowUps([]);
    } catch (err) {
      console.error("Chat hiba:", err);
      updateMessage(loadingId, {
        role: "answer",
        text: `Hiba történt: ${err.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goHome = () => {
    historyRef.current = [];
    addMessage({
      id: `user-${Date.now()}`,
      role: "user",
      text: "🏠 Vissza a kezdőlapra"
    });
    setFollowUps([]);
    setShowQuickButtons(true);
    ask("START", { skipUser: true });
  };

  const openChat = () => {
    setIsOpen(true);
    setShowBubble(false);
  };

  const closeChat = () => {
    setIsOpen(false);
    setTimeout(() => setShowBubble(true), 300);
  };

  const handleHeaderMouseDown = (e) => {
    if (!widgetRef.current) return;
    const rect = widgetRef.current.getBoundingClientRect();
    dragRef.current.isDragging = true;
    dragRef.current.offsetX = e.clientX - rect.left;
    dragRef.current.offsetY = e.clientY - rect.top;
  };

  return (
    <div className="ps-chatbot">
      <div ref={widgetRef} className={`chat-widget ${isOpen ? "open" : ""}`}>
        <div className="chat-header" onMouseDown={handleHeaderMouseDown}>
          <div className="header-content">
            <img src="/images/ChatBotLogo.png" alt="Chatbot Logo" className="header-logo" />
            <span> <i>Scout</i> <strong>Sam</strong></span>
          </div>
          <span className="chat-close" onClick={closeChat}>
            −
          </span>
        </div>
        <div className="chat" ref={chatRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role === "user" ? "user" : message.role}`}
            >
              {message.role === "loading" ? (
                <>
                  <div className="loader" />
                  <span>{message.text}</span>
                </>
              ) : message.role === "service-button" ? (
                <button
                  className="service-button-link"
                  onClick={() => navigate("/szerviz")}
                >
                  Szervíz igénylése
                </button>
              ) : message.role === "location-button" ? (
                <button
                  className="service-button-link"
                  onClick={() => window.open(STORE_MAP_URL, "_blank", "noopener,noreferrer")}
                >
                  Megnyitás térképen
                </button>
              ) : (
                message.text
              )}
            </div>
          ))}
        </div>
        <div className="buttons">
          {showQuickButtons && (
            <div className="quick-buttons">
              {QUICK_BUTTONS.map((text) => (
                <button
                  key={text}
                  onClick={() => ask(text)}
                  disabled={isLoading}
                  className="quick-btn"
                >
                  {text}
                </button>
              ))}
            </div>
          )}
          <button className="home-btn" onClick={goHome} disabled={isLoading}>
            🏠 Kezdőlap
          </button>
          {followUps.map((question) => (
            <button
              key={question}
              onClick={() => ask(question)}
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                ask(inputValue);
                setInputValue("");
              }
            }}
            placeholder="Írj egy üzenetet..."
            disabled={isLoading}
            className="chat-input"
          />
          <button
            onClick={() => {
              if (inputValue.trim()) {
                ask(inputValue);
                setInputValue("");
              }
            }}
            disabled={isLoading || !inputValue.trim()}
            className="send-btn"
          >
            Küldés
          </button>
        </div>
      </div>

      <div
        className={`chat-bubble ${showBubble ? "visible" : ""}`}
        onClick={openChat}
      >
        <img src="/images/ChatBotLogo.png" alt="Chatbot" className="chatbot-logo-img" />
      </div>
    </div>
  );
}

export default ChatbotWidget;
