import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatbotWidget.css";
import axios from "axios";

const TYPING_SPEED = 15;
const STORE_ADDRESS = "Miskolc, Palóczy László utca 3, 3525";
const STORE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;

const PHONES_DATA = `List of phones we sell:
================ NEXT PHONE=================
================ BASIC =================
Phone ID: 20
Name: Google Pixel 9 Pro
Manufacturer: Google
Release: 2024-09-09
Price: 335000
In store: No
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
Főkamera: Samsung GNK 50MP f/f/1.7
Széles látószögű: Sony IMX858 48MP f/f/1.7 OIS
Szelfikamera: Sony IMX858 42MP f/f/2.2 OIS
Teleobjektíves: Sony IMX858 48MP f/f/2.8

================ CONNECTIVITY =================
WiFi: 7
Bluetooth: 5.30
Mobile network: 5
Dual SIM: No
eSIM: No
NFC: No
Jack: Yes
Infrared: Yes

================ BATTERY =================
Battery capacity: 4700 mAh
Battery type: Li-Ion
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
In store: Yes
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
Főkamera: Omnivision OVX9000 50MP f/f/1.6
Széles látőszögű kamera: Samsung S5KJN1 50MP f/f/2.2 OIS
Szelfi kamera: Omnivision OV32B 32MP f/f/2.2 OIS
Teleobjektíves: Samsung S5KJN5 50MP f/f/2.0

================ CONNECTIVITY =================
WiFi: 7
Bluetooth: 6.00
Mobile network: 5
Dual SIM: No
eSIM: No
NFC: No
Jack: Yes
Infrared: No

================ BATTERY =================
Battery capacity: 5240 mAh
Battery type: Li-Ion
Charging wired: 90 W
Charging wireless: 50 W

================ BUILD =================
Dimensions: 152.30 x 71.20 x 8.08 mm
Weight: 189.00 g
Back material: Üveg
Waterproof: IP68
Speaker: stereo
Fingerprint: Ultraszonikus (Kijelzőben)
Available colors: Black, Green, White

================ NEXT PHONE=================
================ BASIC =================
Phone ID: 22
Name: Xiaomi 15 Ultra
Manufacturer: Xiaomi
Release: 2025-02-27
Price: 374790
In store: No
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
Főkamera: Sony LYT-900 50MP f/f/1.6
Széleslátószögű: Samsung S5KJN5 50MP f/f/2.2 OIS
Szelfikamera: Omnivision OV32B 32MP f/f/2.0 OIS
Telefotó: Samsung S5KJN5 50MP f/f/1.8
Teleobjektíves: Samsung ISOCELL HP9 200MP f/f/2.6

================ CONNECTIVITY =================
WiFi: 7
Bluetooth: 6.00
Mobile network: 5
Dual SIM: No
eSIM: No
NFC: No
Jack: Yes
Infrared: No

================ BATTERY =================
Battery capacity: 5410 mAh
Battery type: Li-Ion
Charging wired: 90 W
Charging wireless: 80 W

================ BUILD =================
Dimensions: 161.30 x 75.30 x 9.35 mm
Weight: 226.00 g
Back material: Üveg
Waterproof: IP68
Speaker: stereo
Fingerprint: Ultraszonikus (Kijelzőben)
Available colors: Black, Silver Chrome, White

================ NEXT PHONE=================
================ BASIC =================
Phone ID: 25
Name: Apple iPhone 17
Manufacturer: Apple
Release: 2025-09-19
Price: 320000
In store: Yes
================ DISPLAY =================
Resolution: 1206 x 2622
Screen size: 6.30"
Screen type: LTPO Super Retina XDR OLED
Refresh rate: 120 Hz
Max brightness: 3000 nits
Sharpness: 458

================ PERFORMANCE =================
Antutu: 2084100
CPU: Apple A19 4 GHz, 6 cores, 3 nm
RAM speed: 
Storage speed: NVMe
RAM/Storage versions: 8GB / 256GB; 8GB / 512GB

================ CAMERAS =================
Főkamera: Sony IMX904 48MP f/f/1.6
Széles látószögű: Sony IMX972 48MP f/f/2.2 OIS
Szelfi: Sony IMX914 18MP f/f/1.9 OIS

================ CONNECTIVITY =================
WiFi: 7
Bluetooth: 6.00
Mobile network: 5
Dual SIM: No
eSIM: No
NFC: No
Jack: Yes
Infrared: Yes

================ BATTERY =================
Battery capacity: 3692 mAh
Battery type: Li-Ion
Charging wired: 40 W
Charging wireless: 25 W

================ BUILD =================
Dimensions: 149.60 x 71.50 x 7.95 mm
Weight: 177.00 g
Back material: Üveg
Waterproof: IP68
Speaker: stereo
Fingerprint:  ()
Available colors: Fehér, Fekete, Levendula, Párakék, Zsályazöld

================ NEXT PHONE=================
================ BASIC =================
Phone ID: 26
Name: Apple iPhone Air
Manufacturer: Apple
Release: 2025-09-19
Price: 330000
In store: No
================ DISPLAY =================
Resolution: 1260 x 2736
Screen size: 6.50"
Screen type: LTPO Super Retina XDR OLED
Refresh rate: 120 Hz
Max brightness: 3000 nits
Sharpness: 460

================ PERFORMANCE =================
Antutu: 2067200
CPU: Apple A19 Pro 4 GHz, 6 cores, 3 nm
RAM speed: LPDDR5
Storage speed: UFS 3.1
RAM/Storage versions: 12GB / 1024GB; 12GB / 256GB; 12GB / 512GB

================ CAMERAS =================
Főkamera: Sony IMX904 48MP f/f/1.6
Szelfi: Sony IMX914 18MP f/f/1.9 OIS

================ CONNECTIVITY =================
WiFi: 7
Bluetooth: 6.00
Mobile network: 5
Dual SIM: No
eSIM: No
NFC: No
Jack: Yes
Infrared: Yes

================ BATTERY =================
Battery capacity: 3149 mAh
Battery type: Li-Ion
Charging wired: 40 W
Charging wireless: 20 W

================ BUILD =================
Dimensions: 156.20 x 74.70 x 5.60 mm
Weight: 145.00 g
Back material: Üveg
Waterproof: IP68
Speaker: stereo
Fingerprint:  ()
Available colors: Asztrofekete, Égkék, Felhőfehér, Világos arany

================ NEXT PHONE=================
================ BASIC =================
Phone ID: 27
Name: Apple iPhone 17 Pro
Manufacturer: Apple
Release: 2025-09-19
Price: 470000
In store: No
================ DISPLAY =================
Resolution: 1206 x 2622
Screen size: 6.30"
Screen type: LTPO Super Retina XDR OLED
Refresh rate: 120 Hz
Max brightness: 3000 nits
Sharpness: 460

================ PERFORMANCE =================
Antutu: 2139544
CPU: Apple A19 Pro 4 GHz, 6 cores, 3 nm
RAM speed: LPDDR5
Storage speed: UFS 3.1
RAM/Storage versions: 12GB / 1024GB; 12GB / 256GB; 12GB / 512GB

================ CAMERAS =================
Főkamera: Sony IMX903 48MP f/f/1.8
Széleslátószögű: Sony IMX972 48MP f/f/2.2 OIS
Szelfi: Sony IMX914 18MP f/f/1.9 OIS
Teleobjektíves: Sony IMX973 48MP f/f/2.8 OIS

================ CONNECTIVITY =================
WiFi: 7
Bluetooth: 6.00
Mobile network: 5
Dual SIM: No
eSIM: No
NFC: No
Jack: Yes
Infrared: Yes

================ BATTERY =================
Battery capacity: 3988 mAh
Battery type: Li-Ion
Charging wired: 40 W
Charging wireless: 25 W

================ BUILD =================
Dimensions: 150.00 x 71.90 x 8.75 mm
Weight: 206.00 g
Back material: Üveg
Waterproof: IP68
Speaker: stereo
Fingerprint:  ()
Available colors: Ezüst, Kozmosznarancs, Mélykék

================ NEXT PHONE=================
================ BASIC =================
Phone ID: 28
Name: Apple iPhone 17e
Manufacturer: Apple
Release: 2026-03-11
Price: 290000
In store: Yes
================ DISPLAY =================
Resolution: 1170 x 2532
Screen size: 6.10"
Screen type: Super Retina XDR OLED
Refresh rate: 0 Hz
Max brightness: 1200 nits
Sharpness: 460

================ PERFORMANCE =================
Antutu: 1951083
CPU:  Apple A19 0 GHz, 6 cores, 3 nm
RAM speed: LPDDR5
Storage speed: UFS 3.1
RAM/Storage versions: 12GB / 256GB; 8GB / 256GB; 8GB / 512GB

================ CAMERAS =================
Főkamera: Sony IMX904 48MP f/f/1.6
Szelfi:  12MP f/f/1.9 OIS

================ CONNECTIVITY =================
WiFi: 6
Bluetooth: 5.30
Mobile network: 0
Dual SIM: No
eSIM: No
NFC: No
Jack: Yes
Infrared: Yes

================ BATTERY =================
Battery capacity: 4005 mAh
Battery type: Li-Ion
Charging wired: 20 W
Charging wireless: 15 W

================ BUILD =================
Dimensions: 146.70 x 71.50 x 7.80 mm
Weight: 169.00 g
Back material: Üveg
Waterproof: IP68
Speaker: stereo
Fingerprint:  ()
Available colors: Fehér, Fekete, Halvány rózsaszín

================ NEXT PHONE=================
================ BASIC =================
Phone ID: 29
Name: Samsung Galaxy S26 Ultra
Manufacturer: Samsung
Release: 2026-03-06
Price: 560000
In store: No
================ DISPLAY =================
Resolution: 1440 x 3120
Screen size: 6.90"
Screen type: Dynamic LTPO AMOLED 2X
Refresh rate: 120 Hz
Max brightness: 2600 nits
Sharpness: 500

================ PERFORMANCE =================
Antutu: 4027702
CPU: Qualcomm SM8850-AC Snapdragon 8 Elite Gen 5 4 GHz, 8 cores, 3 nm
RAM speed: LPDDR5
Storage speed: UFS 3.1
RAM/Storage versions: 12GB / 256GB; 12GB / 512GB; 16GB / 1024GB

================ CAMERAS =================
Főkamera: Samsung ISOCELL HP2 200MP f/f/1.4
Széles látószögű: Samsung JN3 50MP f/f/1.9 OIS
Szelfi:  12MP f/f/2.2 OIS
Telefotó:  10MP f/f/2.4 OIS
Teleobjektíves: Sony IMX854 50MP f/f/2.9

================ CONNECTIVITY =================
WiFi: 7
Bluetooth: 6.00
Mobile network: 5
Dual SIM: No
eSIM: No
NFC: No
Jack: Yes
Infrared: Yes

================ BATTERY =================
Battery capacity: 5000 mAh
Battery type: Li-Ion
Charging wired: 60 W
Charging wireless: 25 W

================ BUILD =================
Dimensions: 163.60 x 78.10 x 7.90 mm
Weight: 214.00 g
Back material: Üveg
Waterproof: IP68
Speaker: stereo
Fingerprint: Ultraszonikus (Kijelző alatt)
Available colors: Égkék, Fehér, Fekete, Kékeslila, Ködös ezüst, Rózsaarany


================ NEXT PHONE=================
================ BASIC =================
Phone ID: 30
Name: Samsung Galaxy S26
Manufacturer: Samsung
Release: 2026-03-06
Price: 390000
In store: Yes
================ DISPLAY =================
Resolution: 1080 x 2340
Screen size: 6.30"
Screen type: Dynamic AMOLED 2X
Refresh rate: 120 Hz
Max brightness: 2600 nits
Sharpness: 409

================ PERFORMANCE =================
Antutu: 2825000
CPU: Samsung Exynos 2600 0 GHz, 8 cores, 3 nm
RAM speed: N/A
Storage speed: N/A
RAM/Storage versions: 12GB / 256GB; 12GB / 512GB

================ CAMERAS =================
Főkamera: Samsung GN3 50MP f/f/1.8
Szelfi kamera:  12MP f/f/2.2 OIS
Telefotó: Sony IMX564 12MP f/f/2.2 OIS
Teleobjektív: Samsung S5K3K1 10MP f/f/2.4

================ CONNECTIVITY =================
WiFi: 7
Bluetooth: 5.40
Mobile network: 5
Dual SIM: No
eSIM: No
NFC: No
Jack: Yes
Infrared: Yes

================ BATTERY =================
Battery capacity: 4300 mAh
Battery type: Li-Ion
Charging wired: 25 W
Charging wireless: 15 W

================ BUILD =================
Dimensions: 149.60 x 71.70 x 7.20 mm
Weight: 167.00 g
Back material: Üveg
Waterproof: IP68
Speaker: stereo
Fingerprint: Ultraszonikus (Kijelző alatt)
Available colors: Égkék, Fehér, Fekete, Kékeslila, Ködös ezüst, Rózsaarany




`;

const SYSTEM_INSTRUCTION = `
    You are a helpful assistant for PhoneScout, a mobile phone shop and service center.
    Use ONLY the information from the context below to answer the customer's question.
    If the question is unrelated to PhoneScout, politely say you cannot answer.
    
    Site name is PhoneScout. PhoneScout is a shop and service center for mobile phones.
    I am an assistant at PhoneScout, and I am here to help customers with any questions.

    PhoneScout services:
    - Selling new phones.
    - Phone repairs, including screen replacement and battery replacement.
    - Software updates for phones.
    - Data backup and transfer services.
    - Trade-in program for old phones.

    Warranty and returns:
    - All new phones have a 12-month warranty.
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
    - If you list phones, make it obious that its a list, for example by saying "Here are some phones we have:" and then list them, and if they ask about a specific phone, give them the details about that phone.
    - The address is Miskolc, Palóczy László utca 3, 3525. both to the service and the shop. If they ask about the address, tell them this and that both the service and the shop are in the same place.
    - If they ask about how can they repair something at home, give your best answer because we want to help the copstumer as we can
    `;

// Normalize text for matching.
const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const PHONE_RECORDS = PHONES_DATA
  .split("================ NEXT PHONE =================")
  .map((block) => {
    const nameMatch = block.match(/^\s*Name:\s*(.+)$/m);
    const nfcMatch = block.match(/^\s*NFC:\s*(.+)$/m);

    if (!nameMatch) return null;

    const name = nameMatch[1].trim();
    return {
      name,
      normalizedName: normalizeText(name),
      nfc: nfcMatch?.[1]?.trim() || null
    };
  })
  .filter(Boolean);

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

// Render the chatbot widget.
function ChatbotWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(window.innerWidth <= 991.98);
  const [messages, setMessages] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickButtons, setShowQuickButtons] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const historyRef = useRef([]);
  const chatRef = useRef(null);
  const widgetRef = useRef(null);
  const dragRef = useRef({ isDragging: false, offsetX: 0, offsetY: 0 });
  const bubbleScrollTimerRef = useRef(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 100);
    ask("START", { skipUser: true });
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Open the chatbot from mobile navigation.
    const handleOpenFromMobileNav = () => {
      setIsOpen(true);
      setShowBubble(false);
    };

    window.addEventListener('openChatbot', handleOpenFromMobileNav);

    return () => {
      window.removeEventListener('openChatbot', handleOpenFromMobileNav);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("chatbotStateChange", {
        detail: { isOpen }
      })
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("chatbotStateChange", {
          detail: { isOpen: false }
        })
      );
    };
  }, [isOpen]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, followUps, isLoading]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 991.98px)');

    // Sync the mobile viewport state.
    const handleViewportChange = (event) => {
      setIsMobileViewport(event.matches);
    };

    setIsMobileViewport(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleViewportChange);

    return () => {
      mediaQuery.removeEventListener('change', handleViewportChange);
    };
  }, []);

  useEffect(() => {
    if (!widgetRef.current) return;

    if (isMobileViewport) {
      widgetRef.current.style.left = '';
      widgetRef.current.style.top = '';
      widgetRef.current.style.right = '';
      widgetRef.current.style.bottom = '';
      dragRef.current.isDragging = false;
    }
  }, [isMobileViewport, isOpen]);

  useEffect(() => {
    if (!isMobileViewport) return;

    const handleScroll = () => {
      if (isOpen) return;

      setShowBubble(false);

      if (bubbleScrollTimerRef.current) {
        clearTimeout(bubbleScrollTimerRef.current);
      }

      bubbleScrollTimerRef.current = setTimeout(() => {
        if (!isOpen) {
          setShowBubble(true);
        }
      }, 220);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (bubbleScrollTimerRef.current) {
        clearTimeout(bubbleScrollTimerRef.current);
        bubbleScrollTimerRef.current = null;
      }
    };
  }, [isMobileViewport, isOpen]);

  useEffect(() => {
    // Drag the widget with the pointer.
    const handleMove = (e) => {
      if (!dragRef.current.isDragging || !widgetRef.current) return;
      const left = e.clientX - dragRef.current.offsetX;
      const top = e.clientY - dragRef.current.offsetY;
      widgetRef.current.style.left = `${left}px`;
      widgetRef.current.style.top = `${top}px`;
      widgetRef.current.style.right = "auto";
      widgetRef.current.style.bottom = "auto";
    };

    // Stop dragging the widget.
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

  // Check for service-related content.
  const isServiceRelated = (text) => {
    const serviceKeywords = ["szerviz", "javit", "javitas", "szervizelni", "repair", "service", "hiba", "nem mukodik"];
    const lowerText = normalizeText(text);
    return serviceKeywords.some((keyword) => lowerText.includes(keyword));
  };

  // Find a referenced phone model.
  const getMatchedPhone = (text) => {
    const normalizedQuestion = normalizeText(text);
    return PHONE_RECORDS.find((phone) => normalizedQuestion.includes(phone.normalizedName));
  };

  const mentionsKnownPhone = (text) => Boolean(getMatchedPhone(text));

  const isNfcQuestion = (text) => /\bnfc\b/.test(normalizeText(text));

  // Detect phone specification questions.
  const isPhoneDataRelated = (text) => {
    const normalizedText = normalizeText(text);
    const specKeywords = [
      "nfc", "wifi", "bluetooth", "kamera", "selfie", "akku", "akkumulator", "battery",
      "ram", "tarhely", "storage", "processzor", "cpu", "chip", "kijelzo", "display",
      "spec", "specifikacio", "mit tud", "miket tudsz", "adatlap"
    ];

    return mentionsKnownPhone(text) || specKeywords.some((keyword) => normalizedText.includes(keyword));
  };

  // Detect shopping intent.
  const isBuyingRelated = (text) => {
    const buyingKeywords = [
      "vasarol", "venni", "akarok", "szeretnek", "telefont", "telefon", "buy", "purchase",
      "ar", "arak", "price", "cost", "erdekel", "melyik", "mely", "legjobb", "ajanl"
    ];
    const lowerText = normalizeText(text);
    return buyingKeywords.some((keyword) => lowerText.includes(keyword)) || mentionsKnownPhone(text);
  };

  // Detect location questions.
  const isLocationRelated = (text) => {
    const normalized = normalizeText(text).trim().replace(/\s+/g, " ");

    const explicitPhrases = [
      "hol talalhato",
      "hol van",
      "mi a cimetek",
      "mi a cim",
      "mi az uzlet cime",
      "mi a bolt cime",
      "hol vagytok",
      "merre vagytok",
      "uzlet cime",
      "bolt cime",
      "szerviz cime",
      "address",
      "location"
    ];

    if (explicitPhrases.some((phrase) => normalized.includes(phrase))) {
      return true;
    }

    const hasWhereIntent = /\b(hol|merre)\b/.test(normalized);
    const hasAddressTarget = /\b(cim|cimetek|uzlet|bolt|szerviz|phonescout|telephely)\b/.test(normalized);

    return hasWhereIntent && hasAddressTarget;
  };

  // Send a question to the chatbot.
  const ask = async (question, options = {}) => {
    const { skipUser = false } = options;

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
      text: "Sam gondolkodik..."
    });

    const matchedPhone = getMatchedPhone(question);

    if (isNfcQuestion(question) && matchedPhone) {
      const nfcValue = normalizeText(matchedPhone.nfc || "");
      let nfcText = "nem egyértelműen szerepel NFC adat";

      if (["yes", "igen", "van", "true", "1"].some((value) => nfcValue.includes(value))) {
        nfcText = "van NFC";
      } else if (["no", "nincs", "nem", "false", "0"].some((value) => nfcValue.includes(value))) {
        nfcText = "nincs NFC";
      }

      const nfcAnswer = `A(z) ${matchedPhone.name} készülékben ${nfcText}.`;

      historyRef.current.push({ role: "user", text: question });
      historyRef.current.push({ role: "assistant", text: nfcAnswer });

      await typeMessage(loadingId, nfcAnswer, TYPING_SPEED);
      setFollowUps([]);
      setIsLoading(false);
      return;
    }

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

      let userQuestion = question;
      if (isBuyingRelated(question) || isPhoneDataRelated(question)) {
        userQuestion = `${PHONES_DATA}\n\nFelhasználó kérdése: ${question}\n\nFontos: ha a kérdés konkrét modellre vonatkozik, abból a modellből adj választ a fenti adatok alapján.`;
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

  // Reset the conversation.
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

  // Open the chatbot panel.
  const openChat = () => {
    setIsOpen(true);
    setShowBubble(false);
  };

  // Close the chatbot panel.
  const closeChat = () => {
    setIsOpen(false);
    if (isMobileViewport) {
      setShowBubble(false);
      return;
    }
    setTimeout(() => setShowBubble(true), 300);
  };

  // Start dragging the widget.
  const handleHeaderMouseDown = (e) => {
    if (isMobileViewport) return;
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
                  onClick={() => navigate("/szervizigenyles")}
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
