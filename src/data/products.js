/**
 * Central Database for All Appliances
 * Categories: Kitchen, Cleaning, Heating & Cooling, Personal Care, Smart Home
 */

const products = [
    // ==========================================
    // KITCHEN APPLIANCES (15 items)
    // ==========================================
    {
        id: "kms-003",
        name: "32L Grill Microwave with Ceramic Enamel Interior",
        category: "Kitchen Appliances",
        brand: "Samsung",
        price: 2499000,
        originalPrice: 2940000,
        rating: 4.7,
        reviews: 102,
        badge: { type: "discount", text: "-15%" },
        images: [
    "/src/assets/images/products/kms_003_1.jpg",
    "/src/assets/images/products/kms_003_2.jpg"
        ],
        description: "Experience smart cooking with the 32L Grill Microwave. Features antibacterial ceramic enamel interior and crusty plate for crispy food.",
        specs: {
            "Capacity": "32L",
            "Power": "900W",
            "Grill Power": "1200W",
            "Control": "Touch + Dial",
            "Interior": "Ceramic Enamel",
            "Color": "Black Mirror",
            "Warranty": "2 Years"
        },
        features: ["Ceramic Enamel Interior", "Crusty Plate", "Auto Cook Menu", "Child Lock"]
    },
    {
        id: "espresso-coffee-machine-pro",
        name: "Espresso Coffee Machine Automatic Pro",
        category: "Kitchen Appliances",
        brand: "Philips",
        price: 4350000,
        rating: 4.9,
        reviews: 56,
        badge: { type: "hot", text: "HOT" },
        image: [
    "/src/assets/images/products/espresso_coffee_machine_pro_1.jpg",
    "/src/assets/images/products/espresso_coffee_machine_pro_2.jpg",
    "/src/assets/images/products/espresso_coffee_machine_pro_3.jpg"
        ],
        description: "Barista-quality coffee at home. Fully automatic espresso machine with latte go milk system.",
        specs: {
            "Pressure": "15 Bar",
            "Water Tank": "1.8L",
            "Grinder": "Ceramic",
            "Display": "Touch"
        }
    },
    {
        id: "smart-inverter-refrigerator-450l",
        name: "Smart Inverter Refrigerator 450L",
        category: "Kitchen Appliances",
        brand: "LG",
        price: 8990000,
        originalPrice: 9500000,
        rating: 4.8,
        reviews: 248,
        badge: { type: "new", text: "New" },
        image: [
    "/src/assets/images/products/smart_inverter_refrigerator_450l_1.jpg",
    "/src/assets/images/products/smart_inverter_refrigerator_450l_2.jpg"
        ],
        description: "Keep food fresh longer with linear cooling and door cooling technology. Spacious 450L capacity.",
        specs: {
            "Capacity": "450 Liters",
            "Energy Rating": "A++",
            "Compressor": "Smart Inverter",
            "No Frost": "Yes"
        }
    },
    {
        id: "professional-power-blender",
        name: "High Speed Professional Power Blender",
        category: "Kitchen Appliances",
        brand: "Ninja",
        price: 850000,
        rating: 4.8,
        reviews: 340,
        badge: { type: "bestseller", text: "Bestseller" },
        image: [
    "/src/assets/images/products/professional_power_blender_1.jpg",
    "/src/assets/images/products/professional_power_blender_2.jpg"
        ],
        description: "Crush ice and frozen fruits in seconds. Perfect for smoothies, sauces, and soups.",
        specs: {
            "Power": "1200W",
            "Jars": "2L + 2 Travel Cups",
            "Blades": "Stainless Steel 6-point",
            "Speed": "Variable"
        }
    },
    {
        id: "digital-air-fryer-xl",
        name: "Digital Air Fryer XL 5.5L Oil Free",
        category: "Kitchen Appliances",
        brand: "Philips",
        price: 1250000,
        rating: 4.6,
        reviews: 120,
        badge: null,
        image: [
    "/src/assets/images/products/digital_air_fryer_xl_1.jpg",
    "/src/assets/images/products/digital_air_fryer_xl_2.jpg",
    "/src/assets/images/products/digital_air_fryer_xl_3.jpg"
        ],
        description: "Great tasting fries with up to 90% less fat. Rapid Air technology for perfect results.",
        specs: {
            "Capacity": "5.5L",
            "Power": "1700W",
            "Presets": "7 Programs",
            "Basket": "Non-stick"
        }
    },
    {
        id: "stand-mixer-1000w",
        name: "Stand Mixer 1000W with Bowl 5L",
        category: "Kitchen Appliances",
        brand: "KitchenAid",
        price: 2100000,
        rating: 4.9,
        reviews: 88,
        badge: null,
        image: [
    "/src/assets/images/products/stand_mixer_1000w_1.jpg",
    "/src/assets/images/products/stand_mixer_1000w_2.jpg",
    "/src/assets/images/products/stand_mixer_1000w_3.jpg"
        ],
        description: "The ultimate kitchen companion for baking. Robust metal construction and planetary mixing action.",
        specs: {
            "Power": "1000W",
            "Bowl": "5L Stainless Steel",
            "Speeds": "10",
            "Attachments": "Whisk, Hook, Beater"
        }
    },
    {
        id: "glass-electric-kettle",
        name: "Glass Electric Kettle 1.7L LED Light",
        category: "Kitchen Appliances",
        brand: "Tefal",
        price: 350000,
        rating: 4.4,
        reviews: 45,
        badge: null,
        image: [
    "/src/assets/images/products/glass_electric_kettle_1.jpg",
    "/src/assets/images/products/glass_electric_kettle_2.jpg",
    "/src/assets/images/products/glass_electric_kettle_3.jpg"
        ],
        description: "Elegant glass design with blue LED illumination. Fast boiling and safety auto-off.",
        specs: {
            "Capacity": "1.7L",
            "Material": "Borosilicate Glass",
            "Power": "2200W",
            "Base": "360 Degree"
        }
    },
    {
        id: "toaster-2-slice",
        name: "2-Slice Toaster with Browning Control",
        category: "Kitchen Appliances",
        brand: "Bosch",
        price: 420000,
        rating: 4.5,
        reviews: 67,
        badge: null,
        image: [
    "/src/assets/images/products/toaster_2_slice_1.jpg",
    "/src/assets/images/products/toaster_2_slice_2.jpg",
    "/src/assets/images/products/toaster_2_slice_3.jpg"
        ],
        description: "Perfect toast every morning. Defrost, reheat and cancel functions with slide-out crumb tray.",
        specs: {
            "Slots": "2 Wide",
            "Material": "Stainless Steel",
            "Power": "800W",
            "Levels": "7 Browning Levels"
        }
    },
    {
        id: "rice-cooker-18l",
        name: "Digital Rice Cooker & Warmer 1.8L",
        category: "Kitchen Appliances",
        brand: "Panasonic",
        price: 950000,
        rating: 4.7,
        reviews: 112,
        badge: null,
        image: [
    "/src/assets/images/products/rice_cooker_18l_1.jpg"
        ],
        description: "Fuzzy logic technology for perfect rice every time. Keep warm function up to 12 hours.",
        specs: {
            "Capacity": "1.8L (10 cups)",
            "Pot": "Ceramic Coating",
            "Functions": "White, Brown, Porridge",
            "Feature": "Steam Basket"
        }
    },
    {
        id: "cold-press-juicer",
        name: "Cold Press Slow Juicer 200W",
        category: "Kitchen Appliances",
        brand: "Hurom",
        price: 1800000,
        rating: 4.8,
        reviews: 95,
        badge: null,
        image: [
    "/src/assets/images/products/cold_press_juicer_1.jpg"
        ],
        description: "Maximize nutrition with slow extraction. Quiet motor and easy cleaning system.",
        specs: {
            "Type": "Masticating",
            "Speed": "43 RPM",
            "Motor": "200W AC",
            "Chute": "Wide Mouth"
        }
    },
    {
        id: "food-processor-800w",
        name: "Multi-Function Food Processor 800W",
        category: "Kitchen Appliances",
        brand: "Braun",
        price: 1450000,
        rating: 4.6,
        reviews: 150,
        badge: null,
        image: [
    "/src/assets/images/products/food_processor_800w_1.jpg"
        ],
        description: "Chop, slice, shred, knead, and blend with one machine. Compact design.",
        specs: {
            "Power": "800W",
            "Bowl": "2.1L",
            "Speeds": "2 + Pulse",
            "Accessories": "5 Included"
        }
    },
    {
        id: "contact-grill",
        name: "Indoor Contact Grill Smokeless",
        category: "Kitchen Appliances",
        brand: "Tefal",
        price: 1650000,
        rating: 4.7,
        reviews: 89,
        badge: null,
        image: [
    "/src/assets/images/products/contact_grill_1.jpg"
        ],
        description: "Automatic thickness measurement adapts cooking time. Perfect steaks and paninis.",
        specs: {
            "Power": "2000W",
            "Plates": "Removable Non-stick",
            "Area": "600 cmÂ²",
            "Modes": "6 Automatic"
        }
    },
    {
        id: "meat-grinder-heavy",
        name: "Heavy Duty Electric Meat Grinder",
        category: "Kitchen Appliances",
        brand: "Panasonic",
        price: 1100000,
        rating: 4.5,
        reviews: 62,
        badge: null,
        image: [
    "/src/assets/images/products/meat_grinder_heavy_1.jpg",
    "/src/assets/images/products/meat_grinder_heavy_2.jpg",
    "/src/assets/images/products/meat_grinder_heavy_3.jpg"
        ],
        description: "Grind meat professionally at home. Durable metal gears and Japanese blade.",
        specs: {
            "Power": "1800W Locked",
            "Capacity": "1.6kg/min",
            "Plates": "Fine, Medium, Coarse",
            "Reverse": "Yes"
        }
    },
    {
        id: "hand-mixer-5-speed",
        name: "5-Speed Electric Hand Mixer",
        category: "Kitchen Appliances",
        brand: "Bosch",
        price: 320000,
        rating: 4.3,
        reviews: 210,
        badge: { type: "sale", text: "Sale" },
        image: [
    "/src/assets/images/products/hand_mixer_5_speed_1.jpg",
    "/src/assets/images/products/hand_mixer_5_speed_2.jpg",
    "/src/assets/images/products/hand_mixer_5_speed_3.jpg"
        ],
        description: "Lightweight and quiet. Perfect for egg whites, cream, and batter.",
        specs: {
            "Power": "450W",
            "Speeds": "5 + Turbo",
            "Weight": "0.8kg",
            "Tools": "Beaters, Hooks"
        }
    },
    {
        id: "waffle-maker",
        name: "Belgian Waffle Maker Rotary",
        category: "Kitchen Appliances",
        brand: "Cuisinart",
        price: 550000,
        rating: 4.6,
        reviews: 78,
        badge: null,
        image: [
    "/src/assets/images/products/waffle_maker_1.png",
    "/src/assets/images/products/waffle_maker_2.jpg"
        ],
        description: "Rotary feature for even baking and browning. Deep pockets for toppings.",
        specs: {
            "Type": "Round Belgian",
            "Coating": "Non-stick",
            "Power": "1000W",
            "Indicators": "Ready Light"
        }
    },

    // ==========================================
    // CLEANING APPLIANCES (10 items)
    // ==========================================
    {
        id: "robot-vacuum-x1",
        name: "Robot Vacuum Cleaner X1 Mop",
        category: "Cleaning Appliances",
        brand: "Roborock",
        price: 4500000,
        rating: 4.8,
        reviews: 310,
        badge: { type: "hot", text: "Trending" },
        image: [
    "/src/assets/images/products/robot_vacuum_x1_1.jpg"
        ],
        description: "Lidar navigation and sonic mopping. Auto-empty dock compatible.",
        specs: {
            "Suction": "5100Pa",
            "Runtime": "180 mins",
            "Mapping": "Multi-floor",
            "App": "Yes"
        }
    },
    {
        id: "dyson-v15",
        name: "Dyson V15 Detect Absolute",
        category: "Cleaning Appliances",
        brand: "Dyson",
        price: 7200000,
        rating: 4.9,
        reviews: 450,
        badge: { type: "bestseller", text: "Best" },
        image: [
    "/src/assets/images/products/dyson_v15_1.webp",
    "/src/assets/images/products/dyson_v15_2.webp"
        ],
        description: "Laser reveals microscopic dust. LCD screen shows scientific proof of deep clean.",
        specs: {
            "Suction": "240AW",
            "Runtime": "60 mins",
            "Heads": "Laser Fluffy + Torque",
            "Weight": "3kg"
        }
    },
    {
        id: "steam-cleaner-pro",
        name: "Heavy Duty Steam Cleaner Pro",
        category: "Cleaning Appliances",
        brand: "Karcher",
        price: 1850000,
        rating: 4.6,
        reviews: 85,
        badge: null,
        image: [
    "/src/assets/images/products/steam_cleaner_pro_1.jpg",
    "/src/assets/images/products/steam_cleaner_pro_2.jpg",
    "/src/assets/images/products/steam_cleaner_pro_3.jpg"
        ],
        description: "Chemical-free cleaning using just tap water. Kills 99.99% of bacteria.",
        specs: {
            "Pressure": "4 Bar",
            "Heating": "3 mins",
            "Tank": "1L",
            "Accessories": "Floor, Hand, Detail"
        }
    },
    {
        id: "air-purifier-4",
        name: "Smart Air Purifier 4 Pro",
        category: "Cleaning Appliances",
        brand: "Xiaomi",
        price: 2100000,
        rating: 4.8,
        reviews: 190,
        badge: { type: "new", text: "New" },
        image: [
    "/src/assets/images/products/air_purifier_4_1.jpeg",
    "/src/assets/images/products/air_purifier_4_2.webp"
        ],
        description: "Breathe clean air. Filters 99.97% of particles down to 0.3 microns.",
        specs: {
            "CADR": "500mÂ³/h",
            "Area": "60mÂ²",
            "Filter": "HEPA H13",
            "Sensor": "PM2.5 Laser"
        }
    },
    {
        id: "wet-dry-vacuum",
        name: "Cordless Wet & Dry Vacuum Mop",
        category: "Cleaning Appliances",
        brand: "Tineco",
        price: 3800000,
        rating: 4.7,
        reviews: 130,
        badge: null,
        image: [
    "/src/assets/images/products/wet_dry_vacuum_1.jpg"
        ],
        description: "Vacuum and wash floors in one step. Self-cleaning cycle keeps brush fresh.",
        specs: {
            "Runtime": "35 mins",
            "Tanks": "Dual (Clean/Dirty)",
            "Display": "LED Smart",
            "Surface": "Hard Floors"
        }
    },
    {
        id: "pressure-washer-k5",
        name: "High Pressure Washer K5",
        category: "Cleaning Appliances",
        brand: "Karcher",
        price: 3200000,
        rating: 4.7,
        reviews: 92,
        badge: null,
        image: [
    "/src/assets/images/products/pressure_washer_k5_2.webp"
        ],
        description: "Ideal for cleaning cars, patios, and facades. Water-cooled motor for long life.",
        specs: {
            "Pressure": "145 Bar",
            "Flow": "500 L/h",
            "Motor": "2100W",
            "Hose": "8m High Pressure"
        }
    },
    {
        id: "handheld-vacuum",
        name: "Portable Handheld Car Vacuum",
        category: "Cleaning Appliances",
        brand: "Baseus",
        price: 450000,
        rating: 4.4,
        reviews: 205,
        badge: null,
        image: [
    "/src/assets/images/products/handheld_vacuum_1.jpg"
        ],
        description: "Compact and powerful. Perfect for car interiors and quick messes.",
        specs: {
            "Suction": "15000Pa",
            "Runtime": "45 mins",
            "Charging": "USB-C",
            "Feature": "Light Built-in"
        }
    },
    {
        id: "carpet-cleaner",
        name: "Spot & Stain Carpet Cleaner",
        category: "Cleaning Appliances",
        brand: "Bissell",
        price: 1550000,
        rating: 4.6,
        reviews: 76,
        badge: null,
        image: [
    "/src/assets/images/products/carpet_cleaner_1.jpg"
        ],
        description: "Permanently removes spots and stains. Heatwave technology maintains water temp.",
        specs: {
            "Tank": "1.1L",
            "Power": "330W",
            "Hose": "1.5m",
            "Tools": "Tough Stain Tool"
        }
    },
    {
        id: "window-cleaner-robot",
        name: "Automatic Window Cleaning Robot",
        category: "Cleaning Appliances",
        brand: "Ecovacs",
        price: 1950000,
        rating: 4.2,
        reviews: 40,
        badge: null,
        image: [
    "/src/assets/images/products/window_cleaner_robot_1.jpg",
    "/src/assets/images/products/window_cleaner_robot_2.jpg"
        ],
        description: "Forget dangerous ladders. The robot sticks to glass creates a sparkling shine.",
        specs: {
            "Suction": "2800Pa",
            "Safety": "Rope + UPS Battery",
            "Routes": "Auto Z/N",
            "Surface": "Glass, Mirror, Tile"
        }
    },
    {
        id: "uv-bed-vacuum",
        name: "UV Bed Vacuum Cleaner Mite Remover",
        category: "Cleaning Appliances",
        brand: "Xiaomi",
        price: 650000,
        rating: 4.5,
        reviews: 60,
        badge: null,
        image: [
    "/src/assets/images/products/uv_bed_vacuum_1.png"
        ],
        description: "Remove dust mites and allergens from mattresses and sofas using UV-C light and suction.",
        specs: {
            "Power": "450W",
            "UV Lamp": "Yes",
            "Filter": "HEPA",
            "Heat": "50Â°C Hot Air"
        }
    },

    // ==========================================
    // HEATING & COOLING (10 items)
    // ==========================================
    {
        id: "ac-inverter-12",
        name: "Inverter Air Conditioner 12000 BTU",
        category: "Heating & Cooling",
        brand: "Artel",
        price: 3600000,
        rating: 4.6,
        reviews: 215,
        badge: { type: "sale", text: "Sale" },
        image: [
    "/src/assets/images/products/ac_inverter_12_1.jpg",
    "/src/assets/images/products/ac_inverter_12_2.jpg"
        ],
        description: "Efficient cooling and heating for your home. Low voltage operation support.",
        specs: {
            "Capacity": "12000 BTU",
            "Type": "Split Inverter",
            "Area": "Up to 35mÂ²",
            "Gas": "R410A"
        }
    },
    {
        id: "oil-heater-13",
        name: "Oil Filled Radiator 13 Fins",
        category: "Heating & Cooling",
        brand: "Midea",
        price: 950000,
        rating: 4.5,
        reviews: 88,
        badge: null,
        image: [
    "/src/assets/images/products/oil_heater_13_1.jpg"
        ],
        description: "Safe and silent heating. 3 heat settings and adjustable thermostat.",
        specs: {
            "Power": "2500W",
            "Fins": "13",
            "Safety": "Tip-over Switch",
            "Mobility": "Castor Wheels"
        }
    },
    {
        id: "tower-fan",
        name: "Digital Tower Fan with Remote",
        category: "Heating & Cooling",
        brand: "Philips",
        price: 850000,
        rating: 4.4,
        reviews: 120,
        badge: null,
        image: [
    "/src/assets/images/products/tower_fan_1.jpg"
        ],
        description: "Sleek cooling solution. Aroma diffuser integrated for fresh air.",
        specs: {
            "Height": "1.1m",
            "Modes": "Normal, Natural, Sleep",
            "Timer": "12 Hours",
            "Oscillation": "60Â°"
        }
    },
    {
        id: "humidifier-smart",
        name: "Smart Ultrasonice Humidifier 4L",
        category: "Heating & Cooling",
        brand: "Xiaomi",
        price: 450000,
        rating: 4.7,
        reviews: 156,
        badge: null,
        image: [
    "/src/assets/images/products/humidifier_smart_1.jpg"
        ],
        description: "Maintain healthy humidity levels. UV-C light sterilizes water before misting.",
        specs: {
            "Tank": "4.5L",
            "Output": "300ml/h",
            "Control": "App + Voice",
            "Noise": "<38dB"
        }
    },
    {
        id: "dehumidifier-20l",
        name: "Dehumidifier 20L/Day for Home",
        category: "Heating & Cooling",
        brand: "Ballu",
        price: 1800000,
        rating: 4.6,
        reviews: 40,
        badge: null,
        image: [
    "/src/assets/images/products/dehumidifier_20l_1.jpg"
        ],
        description: "Prevent mold and dampness. Clothes drying mode included.",
        specs: {
            "Capacity": "20L/24h",
            "Tank": "4L",
            "Area": "Up to 40mÂ²",
            "Filter": "Ionizer"
        }
    },
    {
        id: "portable-ac",
        name: "Portable Air Conditioner 9000 BTU",
        category: "Heating & Cooling",
        brand: "Electrolux",
        price: 3200000,
        rating: 4.3,
        reviews: 35,
        badge: null,
        image: [
    "/src/assets/images/products/portable_ac_1.jpg"
        ],
        description: "Cooling where you need it. No permanent installation required.",
        specs: {
            "Cooling": "9000 BTU",
            "Functions": "Cool, Fan, Dry",
            "Remote": "Yes",
            "Kit": "Window Kit Included"
        }
    },
    {
        id: "air-cooler",
        name: "Evaporative Air Cooler 10L",
        category: "Heating & Cooling",
        brand: "Honeywell",
        price: 1100000,
        rating: 4.2,
        reviews: 65,
        badge: null,
        image: [
    "/src/assets/images/products/air_cooler_1.jpg"
        ],
        description: "Eco-friendly cooling using water and ice. Low power consumption.",
        specs: {
            "Tank": "10L",
            "Airflow": "350 mÂ³/h",
            "Power": "65W",
            "Speed": "3 Levels"
        }
    },
    {
        id: "ceiling-fan",
        name: "Modern Ceiling Fan with Light",
        category: "Heating & Cooling",
        brand: "Panasonic",
        price: 1400000,
        rating: 4.8,
        reviews: 28,
        badge: null,
        image: [
    "/src/assets/images/products/ceiling_fan_1.jpg"
        ],
        description: "Silent DC motor with dimmable LED light. 5 blades for high airflow.",
        specs: {
            "Size": "56 inch",
            "Motor": "DC Silent",
            "Light": "LED 24W",
            "Remote": "Included"
        }
    },
    {
        id: "electric-blanket",
        name: "Smart Electric Heating Blanket",
        category: "Heating & Cooling",
        brand: "Beurer",
        price: 650000,
        rating: 4.7,
        reviews: 90,
        badge: null,
        image: [
    "/src/assets/images/products/electric_blanket_1.jpg",
    "/src/assets/images/products/electric_blanket_2.jpg"
        ],
        description: "Warm and cozy sleep. Overheat protection and auto switch-off.",
        specs: {
            "Size": "150x80cm (Single)",
            "Settings": "3 Temps",
            "Material": "Fleece",
            "Washable": "Yes"
        }
    },
    {
        id: "gas-heater",
        name: "Ceramic Gas Heater Panel",
        category: "Heating & Cooling",
        brand: "Bartolini",
        price: 1200000,
        rating: 4.4,
        reviews: 44,
        badge: null,
        image: [
    "/src/assets/images/products/gas_heater_1.jpg",
    "/src/assets/images/products/gas_heater_2.jpg"
        ],
        description: "Independent heating solution. Ceramic panels for even heat distribution.",
        specs: {
            "Power": "4.2kW",
            "Fuel": "LPG/Propane",
            "Safety": "ODS Sensor",
            "Ignition": "Piezo"
        }
    },

    // ==========================================
    // PERSONAL CARE (10 items)
    // ==========================================
    {
        id: "dyson-supersonic",
        name: "Dyson Supersonic Hair Dryer",
        category: "Personal Care",
        brand: "Dyson",
        price: 4800000,
        rating: 4.9,
        reviews: 500,
        badge: { type: "bestseller", text: "Elite" },
        image: [
    "/src/assets/images/products/dyson_supersonic_1.png",
    "/src/assets/images/products/dyson_supersonic_2.jpg"
        ],
        description: "Fast drying with no extreme heat. Engineered for different hair types.",
        specs: {
            "Power": "1600W",
            "Airflow": "41L/s",
            "Attachments": "5 Styling",
            "Cable": "2.8m"
        }
    },
    {
        id: "philips-shaver",
        name: "Philips Series 9000 Wet & Dry",
        category: "Personal Care",
        brand: "Philips",
        price: 2600000,
        rating: 4.8,
        reviews: 140,
        badge: { type: "new", text: "New" },
        image: [
    "/src/assets/images/products/philips_shaver_1.jpg",
    "/src/assets/images/products/philips_shaver_2.jpg"
        ],
        description: "World's closest electric shave. SkinIQ technology adapts to your face.",
        specs: {
            "Blades": "72 Self-sharpening",
            "Motion": "Flexible Heads",
            "Battery": "60 mins",
            "Cleaning": "Pod Included"
        }
    },
    {
        id: "oral-b-io",
        name: "Oral-B iO Series 9 Electric Toothbrush",
        category: "Personal Care",
        brand: "Oral-B",
        price: 3100000,
        rating: 4.9,
        reviews: 210,
        badge: null,
        image: [
    "/src/assets/images/products/oral_b_io_1.jpg",
    "/src/assets/images/products/oral_b_io_2.jpg"
        ],
        description: "Revolutionary magnetic iO technology for a professional clean feeling.",
        specs: {
            "Modes": "7 Smart Modes",
            "Screen": "Interactive Color",
            "Sensor": "AI Pressure",
            "Charging": "Magnetic Fast"
        }
    },
    {
        id: "hair-straightener-ghd",
        name: "Professional Ceramic Hair Straightener",
        category: "Personal Care",
        brand: "GHD",
        price: 1950000,
        rating: 4.8,
        reviews: 320,
        badge: null,
        image: [
    "/src/assets/images/products/hair_straightener_ghd_1.jpg",
    "/src/assets/images/products/hair_straightener_ghd_2.jpg"
        ],
        description: "Smooth and sleek results. Dual-zone technology maintains 185Â°C.",
        specs: {
            "Heat Up": "25 Seconds",
            "Plates": "Floating Ceramic",
            "Voltage": "Universal",
            "Sleep Mode": "Auto 30min"
        }
    },
    {
        id: "massage-gun-pro",
        name: "Deep Tissue Massage Gun Pro",
        category: "Personal Care",
        brand: "Theragun",
        price: 3500000,
        rating: 4.7,
        reviews: 85,
        badge: { type: "hot", text: "Hot" },
        image: [
    "/src/assets/images/products/massage_gun_pro_1.jpg",
    "/src/assets/images/products/massage_gun_pro_2.jpg"
        ],
        description: "Professional grade muscle treatment. Deep reach for recovery.",
        specs: {
            "Force": "60lbs",
            "Amplitude": "16mm",
            "Speed": "5 Ranges",
            "Battery": "150 mins"
        }
    },
    {
        id: "ipl-hair-removal",
        name: "Lumea IPL Hair Removal Device",
        category: "Personal Care",
        brand: "Philips",
        price: 4200000,
        rating: 4.6,
        reviews: 115,
        badge: null,
        image: [
    "/src/assets/images/products/ipl_hair_removal_1.jpg",
    "/src/assets/images/products/ipl_hair_removal_2.jpg"
        ],
        description: "6 months of hair-free smooth skin. SenseIQ personalized treatment.",
        specs: {
            "Flashes": "450,000",
            "Attachments": "Body, Face, Bikini",
            "Usage": "Cordless/Corded",
            "Sensor": "SmartSkin"
        }
    },
    {
        id: "beard-trimmer",
        name: "Precision Beard Trimmer Series 5",
        category: "Personal Care",
        brand: "Braun",
        price: 650000,
        rating: 4.5,
        reviews: 180,
        badge: null,
        image: [
    "/src/assets/images/products/beard_trimmer_1.jpg",
    "/src/assets/images/products/beard_trimmer_2.jpg"
        ],
        description: "Sharp, faster, more efficient. 39 length settings for ultimate precision.",
        specs: {
            "Comb": "0.5 - 20mm",
            "Blades": "Lifetime Sharp",
            "Battery": "100 mins",
            "Washable": "Fully"
        }
    },
    {
        id: "facial-cleanser",
        name: "Sonic Facial Cleansing Brush",
        category: "Personal Care",
        brand: "Foreo",
        price: 1200000,
        rating: 4.7,
        reviews: 200,
        badge: null,
        image: [
    "/src/assets/images/products/facial_cleanser_1.jpg",
    "/src/assets/images/products/facial_cleanser_2.jpg"
        ],
        description: "Ultra-hygienic silicone. Removes 99.5% of dirt, oil and makeup residue.",
        specs: {
            "Pulsations": "8000 T-Sonic/min",
            "Material": "Silicone",
            "Zones": "3 Cleansing",
            "Waterproof": "Yes"
        }
    },
    {
        id: "hair-curler-auto",
        name: "Auto-Rotating Ceramic Hair Curler",
        category: "Personal Care",
        brand: "BaByliss",
        price: 850000,
        rating: 4.4,
        reviews: 95,
        badge: null,
        image: [
    "/src/assets/images/products/hair_curler_auto_1.jpg",
    "/src/assets/images/products/hair_curler_auto_2.jpg"
        ],
        description: "Automatic curling system for effortless, beautiful curls.",
        specs: {
            "Temp": "210Â°C / 230Â°C",
            "Timer": "8-10-12s",
            "Chamber": "Ceramic",
            "Ion": "Frizz Control"
        }
    },
    {
        id: "smart-scale",
        name: "Body Composition Smart Scale 2",
        category: "Personal Care",
        brand: "Xiaomi",
        price: 350000,
        rating: 4.6,
        reviews: 300,
        badge: null,
        image: [
    "/src/assets/images/products/smart_scale_1.jpg",
    "/src/assets/images/products/smart_scale_2.jpg"
        ],
        description: "Track weight, body fat, muscle mass and more. Syncs with Mi Fit app.",
        specs: {
            "Sensors": "G-shaped Steel",
            "Metrics": "13 Body Data",
            "Users": "16 Profiles",
            "Design": "Glass Top"
        }
    },

    // ==========================================
    // SMART HOME (5 items)
    // ==========================================
    {
        id: "smart-lock-pro",
        name: "Smart Fingerprint Door Lock",
        category: "Smart Home",
        brand: "Xiaomi",
        price: 2100000,
        rating: 4.8,
        reviews: 70,
        badge: { type: "new", text: "Secure" },
        image: [
    "/src/assets/images/products/smart_lock_pro_1.jpg",
    "/src/assets/images/products/smart_lock_pro_2.jpg"
        ],
        description: "7 ways to unlock including fingerprint, NFC, and keypad. Doorbell integration.",
        specs: {
            "Security": "C-Class Cylinder",
            "Connect": "Bluetooth/Wi-Fi",
            "Battery": "18 Months",
            "Features": "Anti-peep"
        }
    },
    {
        id: "google-nest-hub",
        name: "Google Nest Hub 2nd Gen",
        category: "Smart Home",
        brand: "Google",
        price: 1100000,
        rating: 4.7,
        reviews: 150,
        badge: null,
        image: [
    "/src/assets/images/products/google_nest_hub_1.jpg",
    "/src/assets/images/products/google_nest_hub_2.jpg"
        ],
        description: "The center of your helpful home. Watch videos, control lights, and sleep sensing.",
        specs: {
            "Screen": "7-inch Touch",
            "Audio": "Enhanced Speaker",
            "Sensors": "Soli Radar",
            "Voice": "Assistant"
        }
    },
    {
        id: "philips-hue-kit",
        name: "Philips Hue Starter Kit E27",
        category: "Smart Home",
        brand: "Philips",
        price: 1800000,
        rating: 4.8,
        reviews: 90,
        badge: null,
        image: [
    "/src/assets/images/products/philips_hue_kit_1.jpg",
    "/src/assets/images/products/philips_hue_kit_2.jpg",
    "/src/assets/images/products/philips_hue_kit_3.jpg"
        ],
        description: "16 million colors to set the mood. Sync with music and movies.",
        specs: {
            "Bulbs": "3x Color Ambiance",
            "Hub": "Hue Bridge Incl.",
            "Control": "App/Voice",
            "Life": "25,000 hrs"
        }
    },
    {
        id: "security-camera-360",
        name: "Home Security Camera 2K Pro",
        category: "Smart Home",
        brand: "Xiaomi",
        price: 550000,
        rating: 4.6,
        reviews: 210,
        badge: { type: "bestseller", text: "Top" },
        image: [
    "/src/assets/images/products/security_camera_360_1.jpg",
    "/src/assets/images/products/security_camera_360_2.jpg"
        ],
        description: "360Â° pan-tilt-zoom panorama. Human detection and enhanced night vision.",
        specs: {
            "Res": "2K (1296p)",
            "Angle": "360Â°",
            "Audio": "Two-way",
            "Privacy": "Physical Shield"
        }
    },
    {
        id: "smart-plug-4pack",
        name: "Smart WiFi Plug (Pack of 4)",
        category: "Smart Home",
        brand: "TapLink",
        price: 480000,
        rating: 4.5,
        reviews: 120,
        badge: null,
        image: [
    "/src/assets/images/products/smart_plug_4pack_1.jpg",
    "/src/assets/images/products/smart_plug_4pack_2.jpg"
        ],
        description: "Control any appliance from your phone. Set schedules and monitor energy.",
        specs: {
            "Load": "16A / 3680W",
            "App": "Smart Life",
            "Voice": "Alexa/Google",
            "Monitor": "Energy Usage"
        }
    }
];

// Export for usage in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = products;
} else {
    // Browser global
    window.products = products;
}


