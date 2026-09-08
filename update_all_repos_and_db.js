const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const DEFAULT_MONGODB_URI = "mongodb+srv://sajolbd:sajolBD-222@cluster0.wug67yz.mongodb.net/?appName=Cluster0";
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

// Define updated servicesData array with exact text from Google Doc
const servicesData = [
  {
    slug: "renovation-upgrading",
    title: "Renovation & Upgrading",
    breadcrumbTitle: "Renovation & Upgrading Solutions",
    detailTitle: "Professional Renovation & Property Upgrading in Singapore",
    subServicesTitle: "Our Renovation & Upgrading Services",
    subServicesSubheading: "Customised residential and commercial renovation solutions crafted for modern living, high durability, and superior quality finish.",
    shortDescription: "Transform homes, offices, and commercial spaces with tailored renovations, interior upgrades, quality finishes, and expert project execution.",
    description: "We help homeowners and property owners achieve beautiful, practical spaces through professional renovation solutions built on trust, precision, and proven expertise.",
    featuredImage: "/images/services/renovation.png",
    bgImage: "/images/layout/breadcrumb-bg.png",
    targetBadge: "PROJECT COVERAGE",
    targetHeading: "Properties & Spaces We Renovate",
    targetSubheading: "From HDB flats to commercial offices, our experienced project team handles all renovation works with precision.",
    targetSpaces: [
      "HDB 3-Room, 4-Room, 5-Room & Executive Apartments",
      "BTO Flats & Resale HDB Units",
      "Condominium Apartments & Penthouses",
      "Landed Houses & Bungalows",
      "Commercial Offices & Retail Stores",
      "Industrial Premises & Warehouses"
    ],
    whyChooseBadge: "UA ADVANTAGE",
    whyChooseHeading: "Why Choose UA Engineering For Renovation?",
    whyChooseLeftTitle: "Traditional Renovation Companies",
    whyChooseRightTitle: "Our Renovation & Upgrading",
    whyChooseAdvantages: [
      {
        title: "Smart Space Planning",
        description: "We use digital layout planning and modern design tools to optimize every square foot of your home, creating functional, stylish, and efficient living spaces."
      },
      {
        title: "Minimal Disruption Process",
        description: "Our organised workflow, dust-control measures, and efficient project coordination reduce noise, mess, and inconvenience during renovation works."
      },
      {
        title: "Premium Materials & Finishes",
        description: "We source durable, high-quality materials and apply advanced installation techniques to ensure long-lasting performance and a refined finish."
      },
      {
        title: "Skilled & Certified Team",
        description: "Our BCA-compliant workmanship and experienced project specialists deliver reliable results with strict attention to safety and quality standards."
      }
    ],
    whyChooseChallenges: [
      {
        title: "Outdated Planning Methods",
        description: "Traditional contractors may rely on basic planning, resulting in inefficient layouts, wasted space, and design changes during the project."
      },
      {
        title: "Delays & Poor Coordination",
        description: "Without a structured workflow, projects can face delays, miscommunication, and extended renovation timelines that disrupt daily life."
      },
      {
        title: "Inconsistent Workmanship",
        description: "Some contractors use lower-grade materials or outdated techniques, leading to uneven finishes and frequent repair needs."
      },
      {
        title: "Limited Quality Assurance",
        description: "Traditional processes may lack proper inspections, documentation, and systematic quality control, reducing confidence in the final result."
      }
    ],
    features: [
      "BCA Certified Workmanship",
      "Skilled & Experienced Team",
      "Transparent Project Pricing",
      "Quality Material Commitment",
      "On-Time Project Delivery",
      "Reliable Service Support"
    ],
    benefits: [
      "Comprehensive end-to-end renovation managed by single experienced contractor.",
      "Strict compliance with HDB, BCA, and condo management guidelines.",
      "High quality materials for long-lasting aesthetic and structural durability.",
      "Clear upfront quotation with detailed breakdown and fixed delivery timeline."
    ],
    processHeading: "Our Working Process",
    processText: "Our structured renovation process transforms your Singapore property on time and budget. We manage design, structural permits, and premium built-in cabinetry.",
    processSteps: [
      {
        title: "Step 01: One-Site Meeting & Site Visit",
        description: "We assess your space, understand your needs, and identify the best renovation approach."
      },
      {
        title: "Step 02: Planning & Proposal Making",
        description: "We create a clear renovation plan with scope, timeline, materials, and pricing."
      },
      {
        title: "Step 03: Start Working & Quality Control",
        description: "Our team executes the project with strict supervision and consistent quality checks."
      },
      {
        title: "Step 04: Functional Audit & Handover",
        description: "We inspect every detail, complete final checks, and hand over a ready-to-use space."
      }
    ],
    serviceAreasBadge: "COVERAGE",
    serviceAreasHeading: "Reliable Engineering & Renovation Solutions Near You",
    serviceAreasSubheading: "UA ENGINEERING proudly provides renovation and upgrading services across Singapore, covering all major residential and commercial areas.",
    faqs: [
      {
        question: "1. What renovation services does UA Engineering provide?",
        answer: "We provide home, kitchen, room, flooring, decking, and open-plan renovation services, including C&R works."
      },
      {
        question: "2. Do you handle HDB, condo, and landed property renovations?",
        answer: "Yes. We provide customised renovation solutions for HDB flats, condominiums, and landed homes across Singapore."
      },
      {
        question: "3. Can UA Engineering help with creating open-plan spaces?",
        answer: "Yes. We handle C&R works, including site assessment, non-load-bearing wall removal, masonry, and reconstruction, while following Singapore regulations."
      },
      {
        question: "4. Do you provide customised renovation solutions?",
        answer: "Yes. Our team tailors renovation plans, layouts, materials, finishes, and built-in solutions to suit your space and requirements."
      },
      {
        question: "5. How do you ensure renovation projects stay on schedule and budget?",
        answer: "We use structured project management, transparent quotations, quality materials, and coordinated workmanship to keep projects organised and on track."
      },
      {
        question: "6. Does UA Engineering provide renovation services across Singapore?",
        answer: "Yes. We serve major areas across Singapore, including the Central, East, North, North-East, and West regions."
      },
      {
        question: "7. How can I get a quotation for my renovation project?",
        answer: "Contact UA Engineering through the Get Free Quote, WhatsApp, or Let Us Call You options and share your project requirements."
      }
    ],
    services: [
      {
        slug: "home-renovation",
        title: "Home Renovation",
        image: "/images/services/sub_home_reno.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Transform your HDB, condo, or landed property with customised home renovation solutions designed for modern living, comfort, functionality, and long-term value.",
        longDescription: "Create a home that reflects your lifestyle with UA Engineering's professional Home Renovation Services in Singapore. We specialise in renovating HDB flats, condominiums, and landed homes by improving layouts, maximising usable space, and upgrading interiors for better comfort and functionality. Whether you're renovating an ageing property or preparing a newly purchased home, our experienced team delivers practical renovation solutions with quality workmanship, efficient project coordination, and compliance with Singapore renovation guidelines.",
        features: [
          "Complete Home Renovation Planning",
          "Space Reconfiguration",
          "Wall Hacking & Masonry Works",
          "Room Reconfiguration",
          "Demolition Works",
          "Built-in Carpentry Installation"
        ],
        benefits: [
          "Complete renovation solutions managed under one experienced project team.",
          "Quality workmanship using durable materials and proven installation methods.",
          "Transparent project planning with clear timelines and regular progress updates.",
          "Professional renovations completed in accordance with Singapore renovation requirements."
        ],
        process: [
          "Step 01 – Consultation: Discuss renovation goals, budget, and project requirements.",
          "Step 02 – Site Survey: Measure the property and assess existing conditions.",
          "Step 03 – Planning: Prepare layouts, material selections, and project schedule.",
          "Step 04 – Renovation Works: Carry out demolition, installation, and finishing works.",
          "Step 05 – Quality Inspection: Inspect workmanship and complete all necessary touch-ups.",
          "Step 06 – Project Handover: Final walkthrough, site cleaning, and customer handover."
        ],
        processSteps: [
          { title: "Step 01 – Consultation", description: "Discuss renovation goals, budget, and project requirements." },
          { title: "Step 02 – Site Survey", description: "Measure the property and assess existing conditions." },
          { title: "Step 03 – Planning", description: "Prepare layouts, material selections, and project schedule." },
          { title: "Step 04 – Renovation Works", description: "Carry out demolition, installation, and finishing works." },
          { title: "Step 05 – Quality Inspection", description: "Inspect workmanship and complete all necessary touch-ups." },
          { title: "Step 06 – Project Handover", description: "Final walkthrough, site cleaning, and customer handover." }
        ]
      },
      {
        slug: "kitchen-renovation",
        title: "Kitchen Renovation",
        image: "/images/services/sub_kitchen_reno.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Upgrade your kitchen with smart layouts, durable cabinetry, and stylish finishes that maximise storage, efficiency, and everyday convenience for Singapore homes.",
        longDescription: "Transform your cooking space with UA Engineering's professional Kitchen Renovation Services in Singapore. We design and renovate functional kitchens for HDB flats, condominiums, and landed homes, combining smart layouts with quality materials and efficient storage solutions. From cabinet replacement and countertop installation to tiling and plumbing coordination, we deliver practical kitchen renovations that improve workflow, maximise space, and enhance everyday living.",
        features: [
          "Kitchen Layout Planning",
          "Custom Kitchen Cabinet Installation",
          "Quartz & Solid Surface Countertops",
          "Kitchen Wall & Floor Tiling",
          "Sink & Plumbing Coordination",
          "Storage Optimisation Solutions"
        ],
        benefits: [
          "Practical kitchen layouts designed for everyday cooking and storage.",
          "Quality cabinetry with durable hardware and premium finishes.",
          "Experienced project coordination for smooth renovation progress.",
          "Tailored solutions for HDB, condo, and landed properties."
        ],
        process: [
          "Step 01 – Consultation: Discuss kitchen layout, storage, and lifestyle requirements.",
          "Step 02 – Site Measurement: Measure the kitchen and assess renovation requirements.",
          "Step 03 – Design Planning: Confirm layout, materials, and countertop selection.",
          "Step 04 – Renovation Works: Install cabinets, countertops, tiling, and plumbing fixtures.",
          "Step 05 – Finishing: Complete adjustments, detailing, and final fittings.",
          "Step 06 – Handover: Inspect completed work and hand over your new kitchen."
        ],
        processSteps: [
          { title: "Step 01 – Consultation", description: "Discuss kitchen layout, storage, and lifestyle requirements." },
          { title: "Step 02 – Site Measurement", description: "Measure the kitchen and assess renovation requirements." },
          { title: "Step 03 – Design Planning", description: "Confirm layout, materials, and countertop selection." },
          { title: "Step 04 – Renovation Works", description: "Install cabinets, countertops, tiling, and plumbing fixtures." },
          { title: "Step 05 – Finishing", description: "Complete adjustments, detailing, and final fittings." },
          { title: "Step 06 – Handover", description: "Inspect completed work and hand over your new kitchen." }
        ]
      },
      {
        slug: "room-beautification",
        title: "Room Beautification",
        image: "/images/services/sub_room_beautification.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Refresh bedrooms, living rooms, and study spaces with elegant interior upgrades that create a comfortable, stylish, and personalised environment for your family.",
        longDescription: "Enhance the comfort and appearance of your home with UA Engineering's Room Beautification Services in Singapore. We upgrade bedrooms, living rooms, and study spaces through customised interior enhancements, decorative finishes, space optimisation, and quality built-in features. Every project is designed to create a welcoming environment that reflects your lifestyle while improving functionality and visual appeal.",
        features: [
          "Interior Space Enhancement",
          "Decorative Feature Walls",
          "Built-in Wardrobes & Storage",
          "Ceiling Design Improvements",
          "Decorative Wall Panel Installation",
          "Interior Finishing Coordination"
        ],
        benefits: [
          "Personalised room designs tailored to your lifestyle.",
          "Modern finishes that enhance comfort and aesthetics.",
          "Quality craftsmanship with attention to every detail.",
          "Efficient renovation with minimal disruption."
        ],
        process: [
          "Step 01 – Consultation: Understand your design preferences and room requirements.",
          "Step 02 – Site Assessment: Evaluate room dimensions and existing conditions.",
          "Step 03 – Design Selection: Confirm finishes, materials, and renovation scope.",
          "Step 04 – Installation: Carry out enhancement works with precision.",
          "Step 05 – Final Detailing: Complete finishing touches and quality checks.",
          "Step 06 – Project Completion: Clean the area and hand over the completed space."
        ],
        processSteps: [
          { title: "Step 01 – Consultation", description: "Understand your design preferences and room requirements." },
          { title: "Step 02 – Site Assessment", description: "Evaluate room dimensions and existing conditions." },
          { title: "Step 03 – Design Selection", description: "Confirm finishes, materials, and renovation scope." },
          { title: "Step 04 – Installation", description: "Carry out enhancement works with precision." },
          { title: "Step 05 – Final Detailing", description: "Complete finishing touches and quality checks." },
          { title: "Step 06 – Project Completion", description: "Clean the area and hand over the completed space." }
        ]
      },
      {
        slug: "create-open-plan-spaces",
        title: "Create Open Plan Spaces (C&R Works)",
        image: "/images/services/sub_open_plan.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Create spacious and modern open-plan living areas with professional C&R works, ensuring safe structural modifications and compliance with Singapore regulations.",
        longDescription: "Create brighter and more spacious interiors with UA Engineering's C&R (Construction & Reconstruction) Services in Singapore. We perform professional wall removal, structural modifications, and space reconfiguration to improve flow and maximise usable living areas. Every project is carefully planned and executed in compliance with HDB and Singapore building regulations.",
        features: [
          "Site Assessment & Structural Review",
          "Non-Load Bearing Wall Removal",
          "Masonry & Reconstruction Works",
          "Space Reconfiguration",
          "BCA Compliance Coordination",
          "Site Restoration & Finishing"
        ],
        benefits: [
          "Safe structural modifications following Singapore regulations.",
          "Professional planning before any alteration begins.",
          "Experienced masonry and reconstruction specialists.",
          "Neat execution with careful quality supervision."
        ],
        process: [
          "Step 01 – Site Inspection: Assess structural conditions and project feasibility.",
          "Step 02 – Planning: Prepare renovation scope and compliance requirements.",
          "Step 03 – Approval: Coordinate necessary renovation approvals where required.",
          "Step 04 – Construction Works: Carry out demolition and reconstruction safely.",
          "Step 05 – Site Restoration: Complete masonry finishing and clean the work area.",
          "Step 06 – Final Inspection: Inspect completed works before project handover."
        ],
        processSteps: [
          { title: "Step 01 – Site Inspection", description: "Assess structural conditions and project feasibility." },
          { title: "Step 02 – Planning", description: "Prepare renovation scope and compliance requirements." },
          { title: "Step 03 – Approval", description: "Coordinate necessary renovation approvals where required." },
          { title: "Step 04 – Construction Works", description: "Carry out demolition and reconstruction safely." },
          { title: "Step 05 – Site Restoration", description: "Complete masonry finishing and clean the work area." },
          { title: "Step 06 – Final Inspection", description: "Inspect completed works before project handover." }
        ]
      },
      {
        slug: "floor-renovation-polishing",
        title: "Floor Renovation & Polishing",
        image: "/images/services/sub_floor_reno.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Restore and upgrade your flooring with high-quality renovation and polishing services that enhance durability, appearance, and long-lasting protection.",
        longDescription: "Restore the beauty and durability of your floors with UA Engineering's professional Floor Renovation & Polishing Services in Singapore. We repair, replace, and polish a wide range of flooring materials to improve appearance, safety, and long-term performance for residential and commercial properties.",
        features: [
          "Floor Surface Assessment",
          "Tile Replacement & Repairs",
          "Vinyl Flooring Installation",
          "Marble & Homogeneous Tile Polishing",
          "Floor Levelling",
          "Protective Surface Finishing"
        ],
        benefits: [
          "Professional flooring solutions for lasting durability.",
          "Smooth, level finishes with quality workmanship.",
          "Suitable for residential and commercial properties.",
          "Reliable project scheduling and clean execution."
        ],
        process: [
          "Step 01 – Inspection: Assess floor condition and identify repair requirements.",
          "Step 02 – Surface Preparation: Remove damaged flooring and prepare the substrate.",
          "Step 03 – Material Selection: Confirm flooring materials and finish options.",
          "Step 04 – Installation: Install or restore flooring with precision.",
          "Step 05 – Polishing: Polish and protect completed floor surfaces.",
          "Step 06 – Handover: Perform final inspection and site cleaning."
        ],
        processSteps: [
          { title: "Step 01 – Inspection", description: "Assess floor condition and identify repair requirements." },
          { title: "Step 02 – Surface Preparation", description: "Remove damaged flooring and prepare the substrate." },
          { title: "Step 03 – Material Selection", description: "Confirm flooring materials and finish options." },
          { title: "Step 04 – Installation", description: "Install or restore flooring with precision." },
          { title: "Step 05 – Polishing", description: "Polish and protect completed floor surfaces." },
          { title: "Step 06 – Handover", description: "Perform final inspection and site cleaning." }
        ]
      },
      {
        slug: "decking-work",
        title: "Decking Work",
        image: "/images/services/sub_decking.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Enhance balconies, patios, and outdoor spaces with durable decking solutions that combine weather resistance, safety, and elegant design.",
        longDescription: "Upgrade your outdoor living areas with UA Engineering's professional Decking Installation Services in Singapore. We design and install durable timber and composite decking for balconies, patios, gardens, and outdoor spaces that combine functionality, safety, and long-lasting performance in Singapore's tropical climate.",
        features: [
          "Timber Deck Installation",
          "Composite Decking Systems",
          "Balcony & Patio Decking",
          "Outdoor Flooring Solutions",
          "Anti-Slip Deck Finishes",
          "Deck Repair & Replacement"
        ],
        benefits: [
          "Weather-resistant decking designed for Singapore conditions.",
          "Quality materials with durable construction.",
          "Custom decking layouts to suit your outdoor space.",
          "Professional installation with precise workmanship."
        ],
        process: [
          "Step 01 – Consultation: Review outdoor space and decking requirements.",
          "Step 02 – Site Measurement: Measure the installation area accurately.",
          "Step 03 – Material Selection: Choose decking materials and finishing options.",
          "Step 04 – Installation: Install decking framework and deck boards.",
          "Step 05 – Finishing: Complete trimming and final detailing.",
          "Step 06 – Project Handover: Inspect the completed deck and hand over the project."
        ],
        processSteps: [
          { title: "Step 01 – Consultation", description: "Review outdoor space and decking requirements." },
          { title: "Step 02 – Site Measurement", description: "Measure the installation area accurately." },
          { title: "Step 03 – Material Selection", description: "Choose decking materials and finishing options." },
          { title: "Step 04 – Installation", description: "Install decking framework and deck boards." },
          { title: "Step 05 – Finishing", description: "Complete trimming and final detailing." },
          { title: "Step 06 – Project Handover", description: "Inspect the completed deck and hand over the project." }
        ]
      },
      {
        slug: "decorative-wall-panels",
        title: "Installation of Decorative Wall Panels",
        image: "/images/services/sub_wall_panels.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Transform plain walls into stunning feature walls with professionally installed decorative wall panels, combining modern aesthetics, durability, and low-maintenance performance.",
        longDescription: "Enhance your interiors with UA Engineering's Decorative Wall Panel Installation Services in Singapore. We install stylish wall panel systems that add texture, depth, and character to living rooms, bedrooms, offices, and commercial interiors. Our solutions combine modern design with quality workmanship to create elegant feature walls that are durable and easy to maintain.",
        features: [
          "PVC Wall Panel Installation",
          "Fluted Wall Panels",
          "WPC Decorative Panels",
          "Feature Wall Design",
          "Custom Panel Layouts",
          "Finishing & Edge Trimming"
        ],
        benefits: [
          "Wide selection of modern decorative panel designs.",
          "Precise installation with seamless finishing.",
          "Durable materials that require minimal maintenance.",
          "Professional workmanship for premium interior aesthetics."
        ],
        process: [
          "Step 01 – Consultation: Discuss design preferences and installation locations.",
          "Step 02 – Site Measurement: Measure wall dimensions and assess surface conditions.",
          "Step 03 – Design Confirmation: Select panel type, layout, and finishing details.",
          "Step 04 – Installation: Install decorative panels accurately and securely.",
          "Step 05 – Finishing: Complete edge trimming and final detailing.",
          "Step 06 – Handover: Inspect completed work and hand over the finished feature wall."
        ],
        processSteps: [
          { title: "Step 01 – Consultation", description: "Discuss design preferences and installation locations." },
          { title: "Step 02 – Site Measurement", description: "Measure wall dimensions and assess surface conditions." },
          { title: "Step 03 – Design Confirmation", description: "Select panel type, layout, and finishing details." },
          { title: "Step 04 – Installation", description: "Install decorative panels accurately and securely." },
          { title: "Step 05 – Finishing", description: "Complete edge trimming and final detailing." },
          { title: "Step 06 – Handover", description: "Inspect completed work and hand over the finished feature wall." }
        ]
      }
    ]
  },
  {
    slug: "structural-exterior-works",
    title: "Structural & Exterior Works",
    breadcrumbTitle: "Structural & Exterior Engineering",
    detailTitle: "Complete Structural & Exterior Works in Singapore",
    subServicesTitle: "Our Structural & Exterior Services",
    subServicesSubheading: "Explore our expert structural and exterior work services, delivering durable, customised solutions for residential and commercial properties across Singapore.",
    shortDescription: "Strengthen and protect your property with structural repairs, roofing, steel works, gate, grill, masonry, and durable exterior improvement solutions.",
    description: "UA ENGINEERING provides professional structural and exterior works for homes and businesses in Singapore. Our skilled team delivers steel fabrication, roof extensions, gates, grills, balcony shelters, and awnings built for durability.",
    featuredImage: "/images/services/structural.png",
    bgImage: "/images/layout/breadcrumb-bg.png",
    targetBadge: "PROJECT COVERAGE",
    targetHeading: "Structural & Exterior Solutions for Every Property",
    targetSubheading: "From HDB homes to commercial premises, we deliver customised steel and exterior solutions built for Singapore's environment.",
    targetSpaces: [
      "HDB Flats",
      "Condominiums",
      "Landed Homes",
      "Commercial Properties"
    ],
    whyChooseBadge: "UA ADVANTAGE",
    whyChooseHeading: "Our Structural & Exterior Works",
    whyChooseLeftTitle: "Other Traditional Contractors",
    whyChooseRightTitle: "Our Structural & Exterior Works",
    whyChooseAdvantages: [
      {
        title: "Accurate Site Measurements",
        description: "We take detailed on-site measurements before fabrication to minimise installation adjustments and achieve a precise fit."
      },
      {
        title: "Made-to-Measure Fabrication",
        description: "Every gate, grill, shelter, and steel structure is fabricated to suit your property's dimensions instead of relying on standard sizes."
      },
      {
        title: "Neat & Professional Installation",
        description: "Our team focuses on proper alignment, clean welding, secure fixing, and tidy finishing for a professional appearance."
      },
      {
        title: "Material & Workmanship Focus",
        description: "We recommend suitable materials based on your project's location, usage, and exposure to weather for better long-term performance."
      }
    ],
    whyChooseChallenges: [
      {
        title: "Limited Site Assessment",
        description: "Some contractors rely on rough measurements, increasing the likelihood of on-site modifications during installation."
      },
      {
        title: "One-Size-Fits-Most Approach",
        description: "Standard-size fabrication may require trimming or adjustments, affecting the overall finish and fit."
      },
      {
        title: "Less Attention to Finishing",
        description: "Rushed installation can result in uneven alignment, visible weld marks, or inconsistent finishing details."
      },
      {
        title: "Basic Material Selection",
        description: "Using materials without considering environmental conditions may affect durability and maintenance requirements over time."
      }
    ],
    features: [
      "BCA-Compliant Workmanship",
      "Custom Design & Fabrication",
      "Premium Quality Materials",
      "Skilled Installation Team",
      "Weather-Resistant Solutions",
      "Singapore Quality Standards"
    ],
    benefits: [
      "Accurate site measurements for precise fit and stability.",
      "Custom steel fabrication using rust-resistant finishes.",
      "Professional installation ensuring safety and compliance.",
      "Long-lasting exterior protection against Singapore's sun and rain."
    ],
    processHeading: "Our Working Process",
    processText: "Our structural and exterior work process prioritises safety, precision, and long-term durability. From customised steel fabrication to professional installation, every project is completed with quality workmanship and strict attention to detail.",
    processSteps: [
      {
        title: "STEP 01: Site Assessment & Planning",
        description: "We inspect your property, understand project requirements, take accurate measurements, and recommend the most suitable structural or exterior solution."
      },
      {
        title: "STEP 02: Custom Fabrication",
        description: "Steel components, gates, grills, roof structures, and awnings are precisely fabricated using premium materials for strength and lasting performance."
      },
      {
        title: "STEP 03: Professional Installation",
        description: "Our experienced team installs every structure with precision, ensuring secure fittings, quality workmanship, and minimal disruption to your property."
      },
      {
        title: "STEP 04: Final Inspection & Handover",
        description: "We perform comprehensive quality checks, verify structural integrity, and ensure every detail meets our standards before project completion."
      }
    ],
    serviceAreasBadge: "COVERAGE",
    serviceAreasHeading: "Reliable Engineering & Renovation Solutions Near You",
    serviceAreasSubheading: "UA ENGINEERING proudly provides renovation and upgrading services across Singapore, covering all major residential and commercial areas.",
    faqs: [
      {
        question: "1. What structural and exterior works does UA Engineering provide?",
        answer: "We provide steel fabrication, gates and grills, balcony shelters, roof extensions, awnings, and other customised structural and exterior solutions."
      },
      {
        question: "2. Can UA Engineering customise steel structures for my property?",
        answer: "Yes. We provide custom steel fabrication for structural frames, platforms, access structures, staircases, railings, and other project-specific requirements."
      },
      {
        question: "3. Do you install main gates and security grills?",
        answer: "Yes. We design, fabricate, and install stainless steel gates, mild steel gates, decorative grills, and other customised metalwork."
      },
      {
        question: "4. Can you build roof extensions and outdoor shelters?",
        answer: "Yes. We provide car porch roof extensions, walkway covers, backyard extensions, balcony shelters, and awnings for improved weather protection and usable outdoor space."
      },
      {
        question: "5. What materials do you use for structural and exterior works?",
        answer: "We use quality materials selected for strength, durability, weather resistance, and suitability for Singapore's environmental conditions."
      },
      {
        question: "6. What is the process for structural and exterior works?",
        answer: "Our process includes site assessment and planning, custom fabrication, professional installation, and final inspection and handover."
      },
      {
        question: "7. Do you provide structural and exterior works across Singapore?",
        answer: "Yes. UA Engineering serves residential and commercial properties across Singapore, including HDB flats, condominiums, landed houses, offices, and retail properties."
      }
    ],
    services: [
      {
        slug: "steel-work",
        title: "All Kinds of Steel Work",
        image: "/images/services/sub_steel_work.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Expert steel fabrication and installation for durable, safe, customised structural solutions throughout Singapore properties.",
        longDescription: "UA ENGINEERING provides custom steel fabrication and installation services for HDB flats, condominiums, landed homes, and commercial properties across Singapore. We fabricate and install steel support structures, custom frames, platforms, brackets, railings, and other metal components tailored to your property's requirements. Our team combines precise fabrication, quality materials, and professional installation to deliver durable steel solutions built for safety, functionality, and long-term performance.",
        features: [
          "Custom Steel Fabrication",
          "Structural Steel Support Frames",
          "Mild Steel & Stainless Steel Works",
          "Precision Cutting & Welding",
          "Protective Anti-Rust Finishes",
          "Steel Repair & Modification Works"
        ],
        benefits: [
          "Every component is custom-fabricated using accurate site measurements.",
          "Suitable materials and coatings withstand Singapore's humid conditions.",
          "Experienced professionals ensure safe, stable, quality workmanship.",
          "Clear coordination ensures organised projects from assessment through installation."
        ],
        process: [
          "Step 01 - Site Assessment: Inspect site, measure areas, understand requirements.",
          "Step 02 - Planning & Quotation: Recommend solutions, materials, and provide quotation.",
          "Step 03 - Steel Fabrication: Cut, weld, assemble, and prepare steel components.",
          "Step 04 - Surface Finishing: Apply protective coatings for durability and appearance.",
          "Step 05 - Installation: Install and secure components with precise alignment.",
          "Step 06 - Inspection & Handover: Check quality, finishing, functionality before project handover."
        ],
        processSteps: [
          { title: "Step 01 - Site Assessment", description: "Inspect site, measure areas, understand requirements." },
          { title: "Step 02 - Planning & Quotation", description: "Recommend solutions, materials, and provide quotation." },
          { title: "Step 03 - Steel Fabrication", description: "Cut, weld, assemble, and prepare steel components." },
          { title: "Step 04 - Surface Finishing", description: "Apply protective coatings for durability and appearance." },
          { title: "Step 05 - Installation", description: "Install and secure components with precise alignment." },
          { title: "Step 06 - Inspection & Handover", description: "Check quality, finishing, functionality before project handover." }
        ]
      },
      {
        slug: "main-gate-grill-work",
        title: "Main Gate & Grill Work",
        image: "/images/services/sub_gate_grill.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Custom gates and grills combining security, durability, and modern designs for residential and commercial properties across Singapore.",
        longDescription: "UA ENGINEERING provides custom main gate and grill fabrication services for HDB flats, condominiums, landed homes, and commercial properties across Singapore. Whether you're replacing an existing gate, installing a new entrance gate, or upgrading window and door grills, we fabricate each product to suit your property's dimensions and design preferences. Our team focuses on quality workmanship, secure installation, and durable materials to improve property security while complementing the overall appearance of your home or business.",
        features: [
          "Mild Steel Main Gates",
          "Stainless Steel Gates",
          "Decorative Metal Grills",
          "Window & Door Grill Installation",
          "Custom Metal Fencing",
          "Rust-Resistant Protective Finishes"
        ],
        benefits: [
          "Every gate and grill is custom-made for precise fitting.",
          "Strong steel provides reliable security for daily use.",
          "Protective coatings ensure durability and clean modern appearance.",
          "Professional installation ensures secure fixing and smooth operation."
        ],
        process: [
          "Step 01 - Site Measurement: Inspect site, discuss preferences, take accurate measurements.",
          "Step 02 - Design & Quotation: Recommend materials, styles, and provide clear quotation.",
          "Step 03 - Fabrication: Fabricate gates and grills to approved specifications.",
          "Step 04 - Surface Finishing: Apply protective finishes for durability and appearance.",
          "Step 05 - Installation: Securely install, align, and test smooth operation.",
          "Step 06 - Final Inspection: Check alignment, locks, finishing, and complete handover."
        ],
        processSteps: [
          { title: "Step 01 - Site Measurement", description: "Inspect site, discuss preferences, take accurate measurements." },
          { title: "Step 02 - Design & Quotation", description: "Recommend materials, styles, and provide clear quotation." },
          { title: "Step 03 - Fabrication", description: "Fabricate gates and grills to approved specifications." },
          { title: "Step 04 - Surface Finishing", description: "Apply protective finishes for durability and appearance." },
          { title: "Step 05 - Installation", description: "Securely install, align, and test smooth operation." },
          { title: "Step 06 - Final Inspection", description: "Check alignment, locks, finishing, and complete handover." }
        ]
      },
      {
        slug: "balcony-shelter-work",
        title: "Balcony Shelter Work",
        image: "/images/services/sub_balcony_shelter.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Professionally installed balcony shelters providing reliable weather protection, enhanced comfort, and lasting durability for Singapore properties.",
        longDescription: "UA ENGINEERING designs and installs balcony shelters that provide practical weather protection while enhancing the comfort and usability of outdoor living spaces. Our balcony shelter solutions are suitable for HDB executive apartments (where permitted), condominiums, landed homes, and commercial premises. We use quality structural materials and roofing systems to create shelters that blend with your property's exterior while helping protect against Singapore's sun and frequent rainfall.",
        features: [
          "Polycarbonate Balcony Shelters",
          "Aluminium Support Structures",
          "Balcony Canopy Installation",
          "UV-Resistant Roofing Panels",
          "Rain Protection Systems",
          "Custom Shelter Designs"
        ],
        benefits: [
          "Customised shelters complement your property's layout and functional needs.",
          "Durable roofing materials provide reliable weather protection.",
          "Professional workmanship ensures secure fixing and structural support.",
          "Balcony shelters create comfortable outdoor spaces for daily use."
        ],
        process: [
          "Step 01 - Site Assessment: We inspect the balcony area and assess suitable shelter options.",
          "Step 02 - Design Consultation: Material options, colours, and structural requirements are discussed.",
          "Step 03 - Fabrication: Support frames and shelter components are fabricated according to site measurements.",
          "Step 04 - Material Preparation: Roofing panels and structural components are prepared before installation.",
          "Step 05 - Installation: The shelter is securely installed with careful alignment and finishing.",
          "Step 06 - Inspection & Handover: Completed works are checked before final project completion."
        ],
        processSteps: [
          { title: "Step 01 - Site Assessment", description: "We inspect the balcony area and assess suitable shelter options." },
          { title: "Step 02 - Design Consultation", description: "Material options, colours, and structural requirements are discussed." },
          { title: "Step 03 - Fabrication", description: "Support frames and shelter components are fabricated according to site measurements." },
          { title: "Step 04 - Material Preparation", description: "Roofing panels and structural components are prepared before installation." },
          { title: "Step 05 - Installation", description: "The shelter is securely installed with careful alignment and finishing." },
          { title: "Step 06 - Inspection & Handover", description: "Completed works are checked before final project completion." }
        ]
      },
      {
        slug: "roof-extension-solutions",
        title: "Roof Extension & Solutions",
        image: "/images/services/sub_roof_extension.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Custom roof extensions designed to maximise covered space while improving weather protection, functionality, and long-term property value.",
        longDescription: "UA ENGINEERING provides customised roof extension solutions for landed homes and commercial properties across Singapore. Whether you need additional covered space for a car porch, outdoor seating area, side walkway, or backyard, our team fabricates and installs durable roof structures designed to suit your property's layout. We focus on practical designs, quality materials, and professional installation to improve protection from Singapore's weather while maintaining a clean and well-integrated appearance.",
        features: [
          "Car Porch Roof Extensions",
          "Side Walkway Roof Covers",
          "Backyard Roof Extensions",
          "Metal Roof Structures",
          "Polycarbonate Roofing",
          "Aluminium Roofing Systems"
        ],
        benefits: [
          "Tailored roof designs maximise covered space and complement architecture.",
          "Quality structural materials ensure reliable long-term performance.",
          "Climate-suitable solutions protect against sun and heavy rainfall.",
          "Professional installation ensures organised workmanship and quality finishing."
        ],
        process: [
          "Step 01 - Site Visit: We assess your existing roof and discuss extension requirements.",
          "Step 02 - Design Proposal: Roof layout, materials, and structural details are finalised.",
          "Step 03 - Fabrication: Roof support structures are fabricated according to approved dimensions.",
          "Step 04 - Material Preparation: Roofing sheets, flashings, and accessories are prepared.",
          "Step 05 - Installation: Structural frames and roofing materials are professionally installed.",
          "Step 06 - Quality Inspection: The completed roof extension is inspected before handover."
        ],
        processSteps: [
          { title: "Step 01 - Site Visit", description: "We assess your existing roof and discuss extension requirements." },
          { title: "Step 02 - Design Proposal", description: "Roof layout, materials, and structural details are finalised." },
          { title: "Step 03 - Fabrication", description: "Roof support structures are fabricated according to approved dimensions." },
          { title: "Step 04 - Material Preparation", description: "Roofing sheets, flashings, and accessories are prepared." },
          { title: "Step 05 - Installation", description: "Structural frames and roofing materials are professionally installed." },
          { title: "Step 06 - Quality Inspection", description: "The completed roof extension is inspected before handover." }
        ]
      },
      {
        slug: "awning-shelter-fabrication",
        title: "Awning Shelter Fabrication & Installation",
        image: "/images/services/sub_awning_shelter.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "High-quality awning shelters expertly fabricated and installed to provide shade, weather protection, and enhanced outdoor comfort.",
        longDescription: "UA ENGINEERING fabricates and installs customised awning shelters for residential and commercial properties throughout Singapore. Our awnings provide practical shade and weather protection for entrances, windows, patios, shopfronts, and outdoor areas. Every awning is manufactured according to your property's dimensions and installed with careful attention to structural stability, functionality, and overall appearance.",
        features: [
          "Residential Awning Installation",
          "Commercial Shopfront Awnings",
          "Window Awnings",
          "Patio & Outdoor Shelters",
          "Polycarbonate Awnings",
          "Custom Shelter Installation"
        ],
        benefits: [
          "Every awning is fabricated to suit your property's size, usage, and exterior design.",
          "Our awning systems help reduce direct sunlight and provide shelter during rainy weather.",
          "Quality framing and secure installation contribute to stability and durability.",
          "We complete installations with careful alignment, neat workmanship, and attention to detail."
        ],
        process: [
          "Step 01 - Site Consultation: We assess the installation area and discuss your shelter requirements.",
          "Step 02 - Material Selection: Suitable awning materials, frame types, and colours are recommended.",
          "Step 03 - Custom Fabrication: The awning frame and roofing components are fabricated to required dimensions.",
          "Step 04 - Pre-Installation Preparation: Materials and fittings are prepared for efficient on-site installation.",
          "Step 05 - Installation: We securely install, check alignment, fixing points, and structural stability.",
          "Step 06 - Final Inspection & Handover: We complete a final quality inspection and customer handover."
        ],
        processSteps: [
          { title: "Step 01 - Site Consultation", description: "We assess the installation area and discuss your shelter requirements." },
          { title: "Step 02 - Material Selection", description: "Suitable awning materials, frame types, and colours are recommended." },
          { title: "Step 03 - Custom Fabrication", description: "The awning frame and roofing components are fabricated to required dimensions." },
          { title: "Step 04 - Pre-Installation Preparation", description: "Materials and fittings are prepared for efficient on-site installation." },
          { title: "Step 05 - Installation", description: "We securely install, check alignment, fixing points, and structural stability." },
          { title: "Step 06 - Final Inspection & Handover", description: "We complete a final quality inspection and customer handover." }
        ]
      }
    ]
  },
  {
    slug: "painting-waterproofing",
    title: "Painting & Waterproofing",
    breadcrumbTitle: "Painting & Waterproofing Solutions",
    detailTitle: "Professional Painting & Waterproofing Services in Singapore",
    subServicesTitle: "Our Painting & Waterproofing Services",
    subServicesSubheading: "Discover our comprehensive painting and waterproofing solutions designed to protect, enhance, and extend the lifespan of residential and commercial properties in Singapore.",
    shortDescription: "Enhance your property's interior and exterior appearance through premium painting, waterproofing, crack repairs, and protective coatings.",
    description: "UA ENGINEERING provides expert painting and waterproofing solutions in Singapore, delivering durable finishes, leak protection, and reliable solutions for homes, offices, and commercial properties.",
    featuredImage: "/images/services/painting.png",
    bgImage: "/images/layout/breadcrumb-bg.png",
    targetBadge: "PROJECT COVERAGE",
    targetHeading: "Professional Solutions for Every Space",
    targetSubheading: "Enhancing and protecting homes, offices, retail spaces, and industrial facilities with expert workmanship.",
    targetSpaces: [
      "HDB Flats",
      "Condominiums",
      "Landed Houses",
      "Office Buildings",
      "Retail Shops"
    ],
    whyChooseBadge: "UA ADVANTAGE",
    whyChooseHeading: "Why Choose UA Engineering For Painting & Waterproofing?",
    whyChooseLeftTitle: "Typical Painting & Waterproofing Services",
    whyChooseRightTitle: "Our Painting & Waterproofing Services",
    whyChooseAdvantages: [
      {
        title: "Thorough Site Assessment",
        description: "We inspect surface conditions, moisture issues, and coating failures before recommending the most suitable painting or waterproofing solution."
      },
      {
        title: "Quality Materials & Proven Systems",
        description: "We use trusted paints, waterproof coatings, and proven application methods designed for Singapore's humid and rainy climate."
      },
      {
        title: "Skilled & Neat Workmanship",
        description: "Every project is completed with careful surface preparation, precise application, and a clean worksite from start to finish."
      },
      {
        title: "Reliable Project Delivery",
        description: "Clear communication, transparent quotations, timely completion, and final quality inspections ensure a smooth customer experience."
      }
    ],
    whyChooseChallenges: [
      {
        title: "Limited Surface Preparation",
        description: "Skipping proper cleaning or repairs may reduce paint adhesion and shorten the lifespan of waterproofing systems."
      },
      {
        title: "Generic Material Selection",
        description: "Using unsuitable materials or application methods may lead to fading, peeling, or recurring water seepage."
      },
      {
        title: "Inconsistent Workmanship",
        description: "Uneven finishes, poor detailing, or inadequate waterproofing can affect both appearance and long-term performance."
      },
      {
        title: "Higher Long-Term Maintenance",
        description: "Poor preparation and application may require frequent repairs, repainting, or additional waterproofing work over time."
      }
    ],
    features: [
      "15+ Years Skilled Professionals",
      "Premium Quality Materials",
      "Expert Surface Preparation",
      "Moisture & Leak Protection",
      "Weather-Resistant Coatings",
      "Free Site Inspection & Quotation"
    ],
    benefits: [
      "Expert interior and exterior painting enhancing beauty and value.",
      "Accurate leak detection preventing water seepage and structural damage.",
      "Long-lasting moisture protection tailored for Singapore climate.",
      "Clean, efficient execution with minimal disruption."
    ],
    processHeading: "Our Working Process",
    processText: "Our proven painting and waterproofing process ensures durable finishes, reliable leak protection, and quality workmanship from inspection to completion.",
    processSteps: [
      {
        title: "STEP 01: Site Inspection & Assessment",
        description: "Inspect surfaces, identify leaks, cracks, and moisture-related issues."
      },
      {
        title: "STEP 02: Surface Preparation",
        description: "Clean, repair, patch, and prepare surfaces for lasting adhesion."
      },
      {
        title: "STEP 03: Painting & Waterproofing",
        description: "Apply premium paints, coatings, membranes, or waterproofing systems professionally."
      },
      {
        title: "STEP 04: Quality Inspection & Handover",
        description: "Conduct final checks, site cleaning, and project handover with care."
      }
    ],
    serviceAreasBadge: "COVERAGE",
    serviceAreasHeading: "Reliable Engineering & Renovation Solutions Near You",
    serviceAreasSubheading: "UA ENGINEERING proudly provides renovation and upgrading services across Singapore, covering all major residential and commercial areas.",
    faqs: [
      {
        question: "1. What painting and waterproofing services does UA Engineering provide?",
        answer: "We provide interior and exterior painting, repainting, roof waterproofing, bathroom and toilet waterproofing, balcony and terrace waterproofing, and protective coating solutions."
      },
      {
        question: "2. Can you help with water leaks and moisture problems?",
        answer: "Yes. We inspect the affected area, identify leaks or moisture issues, repair damaged surfaces, and recommend suitable waterproofing solutions."
      },
      {
        question: "3. What waterproofing methods do you use?",
        answer: "We use solutions such as liquid-applied polyurethane membranes, torch-on bituminous membranes, PU injection grouting, and nano-silane waterproofing sealers, depending on site conditions."
      },
      {
        question: "4. Do you provide both interior and exterior painting?",
        answer: "Yes. Our services include interior walls and ceilings, exterior walls and facades, and repainting for residential and commercial properties."
      },
      {
        question: "5. How do you prepare surfaces before painting or waterproofing?",
        answer: "We clean, repair, patch, and properly prepare surfaces to improve adhesion and help ensure a durable, long-lasting finish."
      },
      {
        question: "6. Do you provide a site inspection before starting the project?",
        answer: "Yes. We offer site inspections to assess surfaces, cracks, leaks, and moisture-related problems before recommending the appropriate solution."
      },
      {
        question: "7. Does UA Engineering provide painting and waterproofing services across Singapore?",
        answer: "Yes. We serve residential and commercial properties across Singapore, including HDB flats, condominiums, landed houses, offices, and retail spaces."
      }
    ],
    services: [
      {
        slug: "painting-services",
        title: "Painting Services",
        image: "/images/services/sub_painting.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Expert Interior and Exterior Painting Services Designed to Enhance Beauty, Protection, and Property Value.",
        longDescription: "Refresh and protect your property with UA Engineering's professional Painting Services in Singapore. We provide interior and exterior painting for HDB flats, condominiums, landed houses, offices, and commercial properties. Our process includes thorough surface preparation, crack repairs, priming, and premium paint application to achieve smooth, durable, and long-lasting finishes that withstand Singapore's humid climate.",
        features: [
          "Interior Wall & Ceiling Painting",
          "Exterior Wall & Facade Painting",
          "Repainting for Homes & Commercial Properties",
          "Door, Metal Gate & Railing Painting",
          "Protective Primers & Premium Top Coats",
          "Final Touch-Up & Site Cleaning"
        ],
        benefits: [
          "Comprehensive surface preparation for smoother, longer-lasting paint finishes.",
          "Premium quality paints from trusted brands for excellent durability and colour retention.",
          "Clean, efficient workmanship with minimal disruption to your home or business.",
          "Experienced painters delivering reliable results with attention to every detail."
        ],
        process: [
          "Step 01 – Site Inspection: Assess wall condition, cracks, moisture, and painting requirements.",
          "Step 02 – Surface Preparation: Protect surrounding areas, repair cracks, sand surfaces, apply primer.",
          "Step 03 – Colour Confirmation: Confirm paint colours, finishes, and project scope before application.",
          "Step 04 – Paint Application: Apply premium paint systems using professional techniques for even coverage.",
          "Step 05 – Final Touch-Up: Inspect painted surfaces, complete touch-ups, remove protective coverings.",
          "Step 06 – Quality Handover: Conduct final inspection, site cleaning, and customer handover."
        ],
        processSteps: [
          { title: "Step 01 – Site Inspection", description: "Assess wall condition, cracks, moisture, and painting requirements." },
          { title: "Step 02 – Surface Preparation", description: "Protect surrounding areas, repair cracks, sand surfaces, apply primer." },
          { title: "Step 03 – Colour Confirmation", description: "Confirm paint colours, finishes, and project scope before application." },
          { title: "Step 04 – Paint Application", description: "Apply premium paint systems using professional techniques for even coverage." },
          { title: "Step 05 – Final Touch-Up", description: "Inspect painted surfaces, complete touch-ups, remove protective coverings." },
          { title: "Step 06 – Quality Handover", description: "Conduct final inspection, site cleaning, and customer handover." }
        ]
      },
      {
        slug: "waterproofing-solutions",
        title: "Waterproofing Solutions",
        image: "/images/services/sub_waterproofing.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Professional Waterproofing Solutions Preventing Water Seepage, Roof Leaks, and Moisture Damage for Lasting Protection.",
        longDescription: "Protect your property from water seepage, roof leaks, ceiling leaks, and damp walls with UA Engineering's professional Waterproofing Solutions in Singapore. We provide effective waterproofing for roofs, bathrooms, balconies, external walls, and concrete surfaces using proven waterproofing systems that deliver long-term protection against Singapore's heavy rainfall and humidity.",
        features: [
          "Roof Waterproofing Systems",
          "Bathroom & Toilet Waterproofing",
          "Balcony & Terrace Waterproofing",
          "Ceiling Leak & Water Seepage Repair",
          "PU Injection for Crack Sealing",
          "Leak Testing & Final Quality Inspection"
        ],
        benefits: [
          "Accurate leak detection to identify the root cause before repairs begin.",
          "High-performance waterproofing systems designed for Singapore's tropical climate.",
          "Durable solutions that help prevent recurring leaks and costly repairs.",
          "Skilled waterproofing specialists delivering dependable workmanship and lasting protection."
        ],
        process: [
          "Step 01 – Site Assessment: Inspect leak sources, moisture levels, cracks, and affected surfaces.",
          "Step 02 – Surface Preparation: Clean the area, remove damaged materials, prepare surfaces.",
          "Step 03 – System Selection: Recommend the most suitable waterproofing method based on site conditions.",
          "Step 04 – Waterproofing Application: Apply membranes, PU injection, sealants, or waterproof coatings.",
          "Step 05 – Testing & Inspection: Carry out water testing and verify complete waterproof protection.",
          "Step 06 – Project Handover: Perform final quality checks, clean site, provide maintenance guidance."
        ],
        processSteps: [
          { title: "Step 01 – Site Assessment", description: "Inspect leak sources, moisture levels, cracks, and affected surfaces." },
          { title: "Step 02 – Surface Preparation", description: "Clean the area, remove damaged materials, prepare surfaces." },
          { title: "Step 03 – System Selection", description: "Recommend the most suitable waterproofing method based on site conditions." },
          { title: "Step 04 – Waterproofing Application", description: "Apply membranes, PU injection, sealants, or waterproof coatings." },
          { title: "Step 05 – Testing & Inspection", description: "Carry out water testing and verify complete waterproof protection." },
          { title: "Step 06 – Project Handover", description: "Perform final quality checks, clean site, provide maintenance guidance." }
        ]
      }
    ]
  },
  {
    slug: "aluminium-glazing-works",
    title: "Aluminium & Glazing Works",
    breadcrumbTitle: "Aluminium & Glazing Solutions",
    detailTitle: "Professional Aluminium & Glazing Works in Singapore",
    subServicesTitle: "What We Offer Under Aluminium & Glazing Works",
    subServicesSubheading: "From fabrication and installation to repairs and replacements, we deliver complete aluminium and glass solutions you can depend on.",
    shortDescription: "Modern aluminium and glass solutions including windows, doors, shopfronts, office partitions, balustrades, and custom glazing installations.",
    description: "UA Engineering provides professional aluminium and glass solutions designed to enhance durability, natural lighting, security, and architectural appeal with expert craftsmanship and reliable installation services throughout Singapore.",
    featuredImage: "/images/services/aluminium.png",
    bgImage: "/images/layout/breadcrumb-bg.png",
    targetBadge: "PROJECT COVERAGE",
    targetHeading: "Applications We Specialise In",
    targetSubheading: "Tailored aluminium and glazing solutions for a wide range of residential, commercial, and industrial environments.",
    targetSpaces: [
      "Residential Properties",
      "Commercial Buildings",
      "Retail Properties",
      "Offices Buildings"
    ],
    whyChooseBadge: "UA ADVANTAGE",
    whyChooseHeading: "Why Choose UA Engineering For Aluminium & Glazing?",
    whyChooseLeftTitle: "Common Contractor Challenges",
    whyChooseRightTitle: "Our Aluminium & Glazing Works",
    whyChooseAdvantages: [
      {
        title: "Customised Solutions",
        description: "Every project is designed and fabricated to suit your property's exact dimensions and functional requirements."
      },
      {
        title: "Quality Materials",
        description: "We use premium aluminium profiles and quality glazing materials for reliable performance and lasting durability."
      },
      {
        title: "Precision Workmanship",
        description: "Our experienced team ensures accurate measurements, professional installation, and attention to every detail."
      },
      {
        title: "Timely Project Delivery",
        description: "Projects are completed efficiently with careful planning to minimise disruption to your home or business."
      }
    ],
    whyChooseChallenges: [
      {
        title: "Poor Measurement & Incorrect Fit",
        description: "Inaccurate measurements can cause gaps, misalignment, and costly rework."
      },
      {
        title: "Poor-Quality Materials",
        description: "Low-grade materials can lead to leaks, corrosion, and early wear."
      },
      {
        title: "Unsafe or Improper Installation",
        description: "Poor installation can affect safety, durability, and weather resistance."
      },
      {
        title: "Unclear Pricing & Project Delays",
        description: "Hidden costs and poor coordination can lead to delays and budget issues."
      }
    ],
    features: [
      "Premium Grade Materials",
      "Custom Aluminium Fabrication",
      "Precision Glass Installation",
      "Weather Resistant Solutions",
      "Professional Installation Team",
      "Long Lasting Performance"
    ],
    benefits: [
      "Custom aluminium window and door systems built to measure.",
      "High safety tempered glass and laminated skylight solutions.",
      "Effective insect protection with magnetic and retractable mesh.",
      "Weatherproof outdoor zip blinds and glass protection films."
    ],
    processHeading: "Our Working Process",
    processText: "Our aluminium and glazing solutions combine expert craftsmanship with premium materials to deliver durable, functional, and visually appealing installations for residential, commercial, and industrial properties.",
    processSteps: [
      {
        title: "STEP 01: Site Assessment",
        description: "We inspect the installation area, take accurate measurements, and recommend the most suitable aluminium and glazing solution."
      },
      {
        title: "STEP 02: Custom Fabrication",
        description: "Aluminium frames, glass panels, and accessories are fabricated to precise specifications for a seamless fit."
      },
      {
        title: "STEP 03: Professional Installation",
        description: "Our experienced technicians install every component with precision, ensuring strength, safety, and a clean finish."
      },
      {
        title: "STEP 04: Final Inspection",
        description: "Every installation undergoes quality checks, operational testing, and a thorough site cleanup before project handover."
      }
    ],
    serviceAreasBadge: "COVERAGE",
    serviceAreasHeading: "Reliable Engineering & Renovation Solutions Near You",
    serviceAreasSubheading: "UA ENGINEERING proudly provides renovation and upgrading services across Singapore, covering all major residential and commercial areas.",
    faqs: [
      {
        question: "1. What aluminium and glazing services does UA Engineering provide?",
        answer: "We provide aluminium window and door installation, glass installation and repair, skylights, mosquito nets, zip blinds, and other customised glazing solutions."
      },
      {
        question: "2. What types of aluminium windows and glass do you install?",
        answer: "We install aluminium casement and sliding windows, double-glazed glass doors, tempered glass shower screens, and other customised aluminium and glass systems."
      },
      {
        question: "3. Do you provide custom-made aluminium and glass solutions?",
        answer: "Yes. We take site measurements and custom-fabricate aluminium frames, glass panels, blinds, and accessories to suit your property's requirements."
      },
      {
        question: "4. Can you install skylights to improve natural lighting?",
        answer: "Yes. We install laminated safety glass skylights, Low-E glass options, and UV-resistant polycarbonate domes to improve natural lighting while providing weather protection."
      },
      {
        question: "5. Do you provide mosquito net and blind installation?",
        answer: "Yes. We install magnetic mosquito screens, retractable roller netting, stainless steel insect mesh, motorised zip blinds, and windproof outdoor blind systems."
      },
      {
        question: "6. How does UA Engineering ensure a proper aluminium and glass installation?",
        answer: "Our process includes site assessment, accurate measurements, custom fabrication, professional installation, operational testing, and final quality inspection."
      },
      {
        question: "7. Do you provide aluminium and glazing services across Singapore?",
        answer: "Yes. UA Engineering serves residential, commercial, retail, office, and industrial properties across Singapore."
      }
    ],
    services: [
      {
        slug: "aluminium-glass-installation",
        title: "Aluminium & Glass Installation & Repair",
        image: "/images/services/sub_aluminium_glass.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Professional aluminium and glass installation and repair services delivering durability, safety, and modern aesthetics seamlessly.",
        longDescription: "UA Engineering provides professional aluminium and glass installation and repair services for residential, commercial, and industrial properties throughout Singapore. We install aluminium windows, sliding and swing doors, glass partitions, shopfront glazing, shower screens, and customised glazing systems using premium aluminium profiles and high-quality tempered or laminated safety glass. Our repair services address damaged glass panels, worn hardware, faulty rollers, misaligned frames, and deteriorated sealants, restoring safety and smooth operation.",
        features: [
          "Aluminium Windows & Doors",
          "Sliding & Folding Door Systems",
          "Glass Partitions & Shopfronts",
          "Glass Replacement & Repairs",
          "Door Roller & Hinge Replacement",
          "Silicone Sealing & Waterproofing"
        ],
        benefits: [
          "Precision measurements for accurate fitting.",
          "Premium aluminium and safety glass solutions.",
          "Skilled installation with quality workmanship.",
          "Reliable repair and replacement services."
        ],
        process: [
          "Step 01 – Site Inspection: Assess existing conditions and take detailed measurements.",
          "Step 02 – Material Preparation: Fabricate aluminium frames and prepare glass components.",
          "Step 03 – Surface Preparation: Remove existing components and prepare installation areas.",
          "Step 04 – Installation: Install frames, glazing systems, and essential hardware.",
          "Step 05 – Sealing & Adjustment: Apply sealants and adjust moving components.",
          "Step 06 – Final Inspection: Conduct operational testing and quality assurance checks."
        ],
        processSteps: [
          { title: "Step 01 – Site Inspection", description: "Assess existing conditions and take detailed measurements." },
          { title: "Step 02 – Material Preparation", description: "Fabricate aluminium frames and prepare glass components." },
          { title: "Step 03 – Surface Preparation", description: "Remove existing components and prepare installation areas." },
          { title: "Step 04 – Installation", description: "Install frames, glazing systems, and essential hardware." },
          { title: "Step 05 – Sealing & Adjustment", description: "Apply sealants and adjust moving components." },
          { title: "Step 06 – Final Inspection", description: "Conduct operational testing and quality assurance checks." }
        ]
      },
      {
        slug: "skylight-installation",
        title: "Skylight Installation",
        image: "/images/services/sub_skylight.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Brighten interiors with professionally installed skylights that enhance natural lighting, ventilation, and energy efficiency effortlessly.",
        longDescription: "Bring more natural daylight into your property with professionally installed skylight systems from UA Engineering. We install fixed and ventilated skylights for residential, commercial, and industrial buildings, helping improve interior brightness, ventilation, and overall architectural appeal. Every installation includes careful structural assessment, weatherproof flashing, and precision sealing to deliver reliable long-term performance in Singapore's climate.",
        features: [
          "Fixed Skylight Installation",
          "Ventilated Skylight Systems",
          "Polycarbonate Skylights",
          "Roof Opening Preparation",
          "Waterproof Flashing Installation",
          "Leak Repair & Resealing"
        ],
        benefits: [
          "Professional waterproof installation techniques.",
          "Durable weather-resistant skylight systems.",
          "Quality sealing for long-term protection.",
          "Clean and precise installation workmanship."
        ],
        process: [
          "Step 01 – Roof Assessment: Inspect roof structure and determine installation location.",
          "Step 02 – Design & Planning: Confirm skylight dimensions and material specifications.",
          "Step 03 – Opening Preparation: Prepare roof opening and supporting framework.",
          "Step 04 – Skylight Installation: Install skylight with secure structural fixing.",
          "Step 05 – Waterproof Sealing: Apply flashing and weather-resistant sealants.",
          "Step 06 – Quality Inspection: Verify waterproofing, alignment, and overall finish."
        ],
        processSteps: [
          { title: "Step 01 – Roof Assessment", description: "Inspect roof structure and determine installation location." },
          { title: "Step 02 – Design & Planning", description: "Confirm skylight dimensions and material specifications." },
          { title: "Step 03 – Opening Preparation", description: "Prepare roof opening and supporting framework." },
          { title: "Step 04 – Skylight Installation", description: "Install skylight with secure structural fixing." },
          { title: "Step 05 – Waterproof Sealing", description: "Apply flashing and weather-resistant sealants." },
          { title: "Step 06 – Quality Inspection", description: "Verify waterproofing, alignment, and overall finish." }
        ]
      },
      {
        slug: "mosquito-net-installation",
        title: "Mosquito Net Installation",
        image: "/images/services/sub_mosquito_net.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Custom mosquito net installations provide effective insect protection while maintaining fresh airflow and unobstructed outdoor views.",
        longDescription: "UA Engineering supplies and installs custom-fit mosquito net systems that provide effective insect protection without restricting natural airflow or outdoor views. Our solutions are suitable for windows, doors, balconies, and ventilation openings, with options including sliding, magnetic, retractable, and fixed-frame systems. Every installation is accurately measured to ensure a secure fit, smooth operation, and long-lasting performance.",
        features: [
          "Window Mosquito Nets",
          "Door Mosquito Screens",
          "Retractable Mosquito Nets",
          "Magnetic Screen Installation",
          "Custom Mesh Fabrication",
          "Replacement & Repair Services"
        ],
        benefits: [
          "Custom-made solutions for every opening.",
          "Durable mesh with smooth operation.",
          "Neat installation with precise fitting.",
          "Low-maintenance insect protection systems."
        ],
        process: [
          "Step 01 – Site Measurement: Measure windows and doors for accurate fabrication.",
          "Step 02 – Custom Fabrication: Manufacture frames and mesh to required dimensions.",
          "Step 03 – Installation Preparation: Prepare fixing points and installation surfaces.",
          "Step 04 – System Installation: Install mesh systems with secure fittings.",
          "Step 05 – Functional Adjustment: Check sliding, magnetic, or retractable operation.",
          "Step 06 – Final Inspection: Verify fitting quality and smooth daily use."
        ],
        processSteps: [
          { title: "Step 01 – Site Measurement", description: "Measure windows and doors for accurate fabrication." },
          { title: "Step 02 – Custom Fabrication", description: "Manufacture frames and mesh to required dimensions." },
          { title: "Step 03 – Installation Preparation", description: "Prepare fixing points and installation surfaces." },
          { title: "Step 04 – System Installation", description: "Install mesh systems with secure fittings." },
          { title: "Step 05 – Functional Adjustment", description: "Check sliding, magnetic, or retractable operation." },
          { title: "Step 06 – Final Inspection", description: "Verify fitting quality and smooth daily use." }
        ]
      },
      {
        slug: "glass-protection-films",
        title: "Glass Protection Films",
        image: "/images/services/sub_glass_films.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "High-quality glass protection film installation enhancing privacy, UV protection, heat reduction, and everyday indoor comfort.",
        longDescription: "UA Engineering provides professional glass protection film installation services for residential and commercial properties across Singapore. We install high-performance solar control films, safety films, privacy films, decorative films, and UV protection films for windows, glass doors, office partitions, and shopfront glazing. Our quality window films help reduce solar heat, minimise UV exposure, improve indoor privacy, and protect glass surfaces from scratches and accidental impacts.",
        features: [
          "Solar Control Film Installation",
          "UV Protection Window Films",
          "Privacy & Frosted Films",
          "Safety & Security Films",
          "Decorative Glass Films",
          "Office Glass Film Application",
          "Shopfront Window Films",
          "Bubble-Free Film Installation"
        ],
        benefits: [
          "Professional surface preparation for a clean, seamless, and bubble-free film application.",
          "Premium-quality window films designed for lasting durability and reliable performance.",
          "Precise installation that enhances privacy, comfort, and the appearance of glass surfaces.",
          "Careful workmanship with thorough quality checks for a flawless finished result."
        ],
        process: [
          "Step 01 – Site Assessment: Inspect glass surfaces, discuss requirements, recommend film solution.",
          "Step 02 – Surface Preparation: Clean and prepare the glass thoroughly to ensure maximum adhesion.",
          "Step 03 – Film Measurement: Measure and precision-cut the film to suit each glass panel.",
          "Step 04 – Film Installation: Apply selected film using professional techniques for bubble-free finish.",
          "Step 05 – Finishing: Trim edges, remove excess moisture, ensure proper alignment.",
          "Step 06 – Final Inspection: Inspect completed installation and verify overall finish and adhesion."
        ],
        processSteps: [
          { title: "Step 01 – Site Assessment", description: "Inspect glass surfaces, discuss requirements, recommend film solution." },
          { title: "Step 02 – Surface Preparation", description: "Clean and prepare the glass thoroughly to ensure maximum adhesion." },
          { title: "Step 03 – Film Measurement", description: "Measure and precision-cut the film to suit each glass panel." },
          { title: "Step 04 – Film Installation", description: "Apply selected film using professional techniques for bubble-free finish." },
          { title: "Step 05 – Finishing", description: "Trim edges, remove excess moisture, ensure proper alignment." },
          { title: "Step 06 – Final Inspection", description: "Inspect completed installation and verify overall finish and adhesion." }
        ]
      },
      {
        slug: "zip-blind-fabrication",
        title: "Zip Blind & All Types of Blind Fabrication & Installation",
        image: "/images/services/sub_zip_blinds.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Custom blind fabrication and installation enhancing privacy, comfort, sun protection, and contemporary property aesthetics effectively.",
        longDescription: "UA Engineering designs, fabricates, and installs customised blind systems for indoor and outdoor applications across Singapore. Our solutions include zip blinds, roller blinds, Venetian blinds, Roman blinds, vertical blinds, zebra blinds, blackout blinds, and motorised systems. Designed to improve privacy, reduce glare, and enhance thermal comfort, every blind is manufactured to suit your property's dimensions and functional requirements.",
        features: [
          "Zip Blind Systems",
          "Roller Blind Installation",
          "Venetian Blinds",
          "Roman Blinds",
          "Zebra Blinds",
          "Blind Repair & Replacement"
        ],
        benefits: [
          "Custom fabrication for precise installation.",
          "Wide range of blind system options.",
          "Professional installation with quality finishes.",
          "Durable solutions for indoor and outdoor spaces."
        ],
        process: [
          "Step 01 – Consultation: Assess space, dimensions, and shading requirements.",
          "Step 02 – Material Selection: Select suitable blind fabric, hardware, and operating system.",
          "Step 03 – Custom Fabrication: Manufacture blinds according to approved specifications.",
          "Step 04 – Professional Installation: Install brackets, tracks, and blind systems securely.",
          "Step 05 – System Adjustment: Fine-tune alignment and operating mechanisms.",
          "Step 06 – Final Handover: Inspect operation, demonstrate usage, complete handover."
        ],
        processSteps: [
          { title: "Step 01 – Consultation", description: "Assess space, dimensions, and shading requirements." },
          { title: "Step 02 – Material Selection", description: "Select suitable blind fabric, hardware, and operating system." },
          { title: "Step 03 – Custom Fabrication", description: "Manufacture blinds according to approved specifications." },
          { title: "Step 04 – Professional Installation", description: "Install brackets, tracks, and blind systems securely." },
          { title: "Step 05 – System Adjustment", description: "Fine-tune alignment and operating mechanisms." },
          { title: "Step 06 – Final Handover", description: "Inspect operation, demonstrate usage, complete handover." }
        ]
      }
    ]
  },
  {
    slug: "electrical-plumbing-aircon",
    title: "Electrical, Plumbing & Aircon",
    breadcrumbTitle: "Electrical, Plumbing & Aircon Solutions",
    detailTitle: "Professional Electrical Plumbing & Aircon Solutions in Singapore",
    subServicesTitle: "What We Offer Under Electrical, Plumbing & Aircon",
    subServicesSubheading: "Discover our comprehensive electrical, plumbing, and aircon solutions, professionally delivered for safe, reliable, and efficient property performance.",
    shortDescription: "Complete M&E solutions covering electrical systems, plumbing installations, air-conditioning services, repairs, upgrades, and routine maintenance.",
    description: "Expert electrical, plumbing, and aircon services ensuring safe, efficient, reliable building systems across Singapore properties.",
    featuredImage: "/images/services/electrical.png",
    bgImage: "/images/layout/breadcrumb-bg.png",
    targetBadge: "PROJECT COVERAGE",
    targetHeading: "Properties We Proudly Serve",
    targetSubheading: "Delivering dependable and secure electrical, plumbing, and air conditioning solutions for every type of property across Singapore.",
    targetSpaces: [
      "HDB Flats",
      "Condominiums",
      "Commercial Offices",
      "Retail Shops"
    ],
    whyChooseBadge: "UA ADVANTAGE",
    whyChooseHeading: "Why Choose UA Engineering For Electrical, Plumbing & Aircon?",
    whyChooseLeftTitle: "Common Service Challenges",
    whyChooseRightTitle: "Our Commitment to Quality Services",
    whyChooseAdvantages: [
      {
        title: "Integrated Building Solutions",
        description: "We coordinate electrical, plumbing, and air conditioning works under one team, improving project efficiency and reducing unnecessary scheduling delays."
      },
      {
        title: "Qualified Technical Team",
        description: "Our experienced technicians perform installations, repairs, and maintenance with careful workmanship, practical solutions, and attention to safety."
      },
      {
        title: "Quality Materials & Components",
        description: "We use reliable electrical accessories, plumbing fittings, and air conditioning components selected for durability and dependable long-term performance."
      },
      {
        title: "Thorough System Testing",
        description: "Every completed installation and repair is checked to verify proper operation, safety, and overall system performance before handover."
      }
    ],
    whyChooseChallenges: [
      {
        title: "Multiple Contractor Coordination",
        description: "Managing separate contractors for electrical, plumbing, and aircon works can create scheduling conflicts and communication gaps."
      },
      {
        title: "Unclear Work Scope",
        description: "Poor planning or incomplete quotations may lead to unexpected variations, additional costs, or project delays during execution."
      },
      {
        title: "Inconsistent Workmanship",
        description: "Improper installations or overlooked details can affect system reliability, operational efficiency, and future maintenance requirements."
      },
      {
        title: "Limited Post-Service Support",
        description: "Without dependable after-service assistance, resolving defects or operational issues may become slower and more inconvenient."
      }
    ],
    features: [
      "Professional Technicians",
      "Energy Efficient Solutions",
      "Fast Response Service",
      "Long-Term Performance",
      "End-to-End Solutions",
      "Customised Solutions"
    ],
    benefits: [
      "EMA licensed electrician rewiring and DB box upgrades.",
      "Comprehensive pipe leak repair and sanitary plumbing works.",
      "Chemical cleaning, gas top-up, and troubleshooting for all aircon brands.",
      "Single contractor management for all M&E building services."
    ],
    processHeading: "Our Working Process",
    processText: "Our integrated M&E solutions ensure your electrical, plumbing, and air conditioning systems operate safely, efficiently, and reliably. Every project is carefully planned, professionally executed, and thoroughly inspected for lasting performance.",
    processSteps: [
      {
        title: "STEP 01: Site Assessment",
        description: "Inspect existing electrical, plumbing, and aircon systems, identify issues, and confirm the required work scope."
      },
      {
        title: "STEP 02: System Preparation",
        description: "Prepare wiring routes, pipe connections, and installation areas before commencing repair or installation works."
      },
      {
        title: "STEP 03: Installation & Repairs",
        description: "Carry out electrical, plumbing, and aircon installations or repairs using quality materials and proven workmanship."
      },
      {
        title: "STEP 04: Testing & Handover",
        description: "Perform functional testing, safety inspections, and system checks before completing the project and client handover."
      }
    ],
    serviceAreasBadge: "COVERAGE",
    serviceAreasHeading: "Reliable Engineering & Renovation Solutions Near You",
    serviceAreasSubheading: "UA ENGINEERING proudly provides renovation and upgrading services across Singapore, covering all major residential and commercial areas.",
    faqs: [
      {
        question: "1. What electrical, plumbing, and aircon services does UA Engineering provide?",
        answer: "We provide electrical works, plumbing repairs and installations, aircon servicing and repairs, rewiring, DB upgrades, and maintenance solutions."
      },
      {
        question: "2. Are your electrical works carried out by licensed electricians?",
        answer: "Yes. Electrical rewiring, DB upgrades, high-voltage testing, and power network works are carried out by EMA-licensed electricians."
      },
      {
        question: "3. Do you provide whole-house electrical rewiring?",
        answer: "Yes. We provide complete electrical rewiring solutions for homes and other properties, including planning, installation, and testing."
      },
      {
        question: "4. Can you repair plumbing leaks and unclog pipes?",
        answer: "Yes. We handle copper and PVC pipe leaks, as well as sink, toilet bowl, and basin unclogging."
      },
      {
        question: "5. Do you install water heaters?",
        answer: "Yes. We install both storage and instant water heaters according to your property's requirements."
      },
      {
        question: "6. What aircon repair and servicing do you provide?",
        answer: "We provide general servicing, chemical cleaning and overhauls, coolant gas leak checks, and gas top-ups."
      },
      {
        question: "7. Do you provide electrical, plumbing, and aircon services across Singapore?",
        answer: "Yes. UA Engineering provides these services for HDB flats, condominiums, offices, retail shops, and other properties across Singapore."
      }
    ],
    services: [
      {
        slug: "electrical-lighting-work",
        title: "Electrical & Lighting Work",
        image: "/images/services/sub_electrical.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Safe, efficient electrical and lighting solutions delivering reliable power, comfort, and everyday convenience for every property.",
        longDescription: "UA Engineering provides professional electrical and lighting solutions for residential and commercial properties across Singapore. Our services include electrical wiring, lighting installations, power point additions, distribution board upgrades, ceiling fan installations, and electrical fault troubleshooting. Every project is completed with careful planning, quality materials, and thorough testing to ensure reliable performance, operational safety, and long-term dependability.",
        features: [
          "Electrical Wiring & Rewiring",
          "Indoor & Outdoor Lighting Installation",
          "Ceiling Fan Installation",
          "Circuit Fault Diagnosis & Repairs",
          "Switch & Socket Replacement",
          "Electrical Maintenance Services"
        ],
        benefits: [
          "Safe electrical installations with careful cable routing and quality workmanship.",
          "Reliable electrical solutions for residential and commercial properties.",
          "Professional fault diagnosis to restore electrical systems efficiently.",
          "Thorough testing to verify safe operation before project completion."
        ],
        process: [
          "Step 01 – Site Assessment: Inspect electrical systems, identify requirements, and determine installation or repair scope.",
          "Step 02 – Planning: Prepare wiring routes, electrical points, and equipment layout for efficient installation.",
          "Step 03 – Installation: Install wiring, switches, sockets, lighting fixtures, and electrical components.",
          "Step 04 – System Integration: Connect circuits, distribution boards, and protective electrical devices.",
          "Step 05 – Testing: Perform electrical testing, circuit verification, and functional inspections.",
          "Step 06 – Project Handover: Confirm system performance and complete final inspection with the client."
        ],
        processSteps: [
          { title: "Step 01 – Site Assessment", description: "Inspect electrical systems, identify requirements, and determine installation or repair scope." },
          { title: "Step 02 – Planning", description: "Prepare wiring routes, electrical points, and equipment layout for efficient installation." },
          { title: "Step 03 – Installation", description: "Install wiring, switches, sockets, lighting fixtures, and electrical components." },
          { title: "Step 04 – System Integration", description: "Connect circuits, distribution boards, and protective electrical devices." },
          { title: "Step 05 – Testing", description: "Perform electrical testing, circuit verification, and functional inspections." },
          { title: "Step 06 – Project Handover", description: "Confirm system performance and complete final inspection with the client." }
        ]
      },
      {
        slug: "plumbing-services",
        title: "Plumbing Services",
        image: "/images/services/sub_plumbing.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Professional plumbing solutions ensure reliable water flow, leak-free systems, and long-lasting performance for every property.",
        longDescription: "UA Engineering delivers dependable plumbing solutions for residential and commercial properties, covering water supply systems, sanitary fittings, drainage repairs, and pipe installations. Whether repairing leaks, replacing damaged pipes, or installing new plumbing fixtures, our team focuses on efficient water flow, reliable performance, and quality workmanship to keep your plumbing system operating smoothly.",
        features: [
          "Water Pipe Installation",
          "Leak Detection & Repairs",
          "Toilet & Basin Installation",
          "Tap & Mixer Replacement",
          "Drainage Pipe Repairs",
          "Plumbing Maintenance Services"
        ],
        benefits: [
          "Accurate leak detection to minimise water loss and prevent property damage.",
          "Quality plumbing installations using durable fittings and pipe materials.",
          "Reliable repairs that restore efficient water supply and drainage performance.",
          "Careful workmanship with thorough testing before project completion."
        ],
        process: [
          "Step 01 – Site Inspection: Assess plumbing conditions and identify faults or installation requirements.",
          "Step 02 – Planning: Determine pipe routing, fixture locations, and material requirements.",
          "Step 03 – Installation: Install water pipes, sanitary fixtures, valves, and plumbing accessories.",
          "Step 04 – Connection: Complete water supply, drainage, and fixture connections securely.",
          "Step 05 – Pressure Testing: Inspect joints, connections, and water flow for reliable performance.",
          "Step 06 – Final Handover: Verify proper operation and ensure the work area is clean before completion."
        ],
        processSteps: [
          { title: "Step 01 – Site Inspection", description: "Assess plumbing conditions and identify faults or installation requirements." },
          { title: "Step 02 – Planning", description: "Determine pipe routing, fixture locations, and material requirements." },
          { title: "Step 03 – Installation", description: "Install water pipes, sanitary fixtures, valves, and plumbing accessories." },
          { title: "Step 04 – Connection", description: "Complete water supply, drainage, and fixture connections securely." },
          { title: "Step 05 – Pressure Testing", description: "Inspect joints, connections, and water flow for reliable performance." },
          { title: "Step 06 – Final Handover", description: "Verify proper operation and ensure the work area is clean before completion." }
        ]
      },
      {
        slug: "aircon-repair",
        title: "Aircon Repair",
        image: "/images/services/sub_aircon.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Restore cooling efficiency with expert aircon repairs for dependable comfort and optimal system performance year-round.",
        longDescription: "UA Engineering provides professional air conditioning repair services to restore cooling performance, improve energy efficiency, and extend system lifespan. Our technicians diagnose faults accurately, repair malfunctioning components, resolve water leakage issues, and optimise overall system operation, helping maintain a comfortable indoor environment throughout the year.",
        features: [
          "Aircon Fault Diagnosis",
          "Refrigerant Gas Top-Up",
          "Water Leakage Repairs",
          "Air Filter Cleaning",
          "Drain Pipe Cleaning",
          "Component Replacement"
        ],
        benefits: [
          "Accurate fault diagnosis for faster and more effective repair solutions.",
          "Restore cooling efficiency with professional repair and system optimisation.",
          "Careful inspection of critical components to improve operational reliability.",
          "Performance testing to ensure stable cooling before service completion."
        ],
        process: [
          "Step 01 – System Inspection: Examine indoor and outdoor units to identify operational faults.",
          "Step 02 – Fault Diagnosis: Assess cooling performance, electrical components, and refrigerant condition.",
          "Step 03 – Repair Works: Repair or replace faulty components and restore system functionality.",
          "Step 04 – System Servicing: Clean filters, drainage lines, and essential air conditioning components.",
          "Step 05 – Performance Testing: Verify cooling capacity, airflow, and overall system operation.",
          "Step 06 – Final Verification: Complete functional checks and confirm satisfactory system performance before handover."
        ],
        processSteps: [
          { title: "Step 01 – System Inspection", description: "Examine indoor and outdoor units to identify operational faults." },
          { title: "Step 02 – Fault Diagnosis", description: "Assess cooling performance, electrical components, and refrigerant condition." },
          { title: "Step 03 – Repair Works", description: "Repair or replace faulty components and restore system functionality." },
          { title: "Step 04 – System Servicing", description: "Clean filters, drainage lines, and essential air conditioning components." },
          { title: "Step 05 – Performance Testing", description: "Verify cooling capacity, airflow, and overall system operation." },
          { title: "Step 06 – Final Verification", description: "Complete functional checks and confirm satisfactory system performance before handover." }
        ]
      }
    ]
  },
  {
    slug: "solar-panel-installation",
    title: "Solar Panel Installation",
    breadcrumbTitle: "Solar Panel Installation",
    detailTitle: "Professional Solar Panel Installation in Singapore",
    subServicesTitle: "Professional Solar Panel Installation Overview",
    subServicesSubheading: "Professional solar panel installation service delivering clean, efficient renewable energy solutions for residential and commercial properties across Singapore.",
    shortDescription: "Reduce energy costs with professionally installed solar panel systems designed for long-term efficiency, reliability, and sustainable performance.",
    description: "UA Engineering provides professional solar panel installation services for residential and commercial properties across Singapore. We deliver customised rooftop solar solutions designed to maximise available roof space and support efficient renewable energy generation.",
    featuredImage: "/images/services/solar.png",
    bgImage: "/images/layout/breadcrumb-bg.png",
    targetBadge: "PROJECT COVERAGE",
    targetHeading: "Solar Solutions for Every Property",
    targetSubheading: "Professional rooftop solar panel installations tailored for residential and commercial properties seeking clean, efficient renewable energy across Singapore.",
    targetSpaces: [
      "Landed Homes",
      "Condominiums",
      "Commercial Buildings",
      "Retail Properties"
    ],
    whyChooseBadge: "UA ADVANTAGE",
    whyChooseHeading: "Why Choose UA Engineering For Solar Panel Installation?",
    whyChooseLeftTitle: "Common Installation Challenges",
    whyChooseRightTitle: "UA Engineering's Solar Installation Expertise",
    whyChooseAdvantages: [
      {
        title: "Professional Site Assessment",
        description: "Every installation begins with a detailed roof assessment to determine structural suitability, panel placement, and sunlight exposure for optimal system performance."
      },
      {
        title: "Quality Installation Standards",
        description: "Our team installs solar panels using reliable mounting systems, quality components, and proven installation practices for long-term durability."
      },
      {
        title: "Tailored System Planning",
        description: "Each solar installation is planned according to your property's roof layout, available space, and energy requirements for efficient performance."
      },
      {
        title: "Thorough System Verification",
        description: "We inspect all installed components, electrical connections, and mounting structures to ensure the system is ready for safe operation."
      }
    ],
    whyChooseChallenges: [
      {
        title: "Unsuitable Roof Planning",
        description: "Poor panel placement or inadequate roof assessment can reduce solar energy generation and long-term system efficiency."
      },
      {
        title: "Substandard Installation",
        description: "Improper mounting or electrical connections may affect system reliability, safety, and overall installation quality."
      },
      {
        title: "Inferior Components",
        description: "Low-quality materials and mounting hardware can reduce durability and increase maintenance requirements over time."
      },
      {
        title: "Limited Project Support",
        description: "Poor communication and insufficient project coordination can result in delays and an unsatisfactory installation experience."
      }
    ],
    features: [
      "Solar PV Installation",
      "Rooftop Solar Systems",
      "Secure Roof Mounting",
      "Weather-Resistant Installation",
      "Precision Workmanship",
      "Clean Energy Solutions"
    ],
    benefits: [
      "Customised rooftop solar PV layout design for maximum solar yield.",
      "Structural load analysis and secure mounting systems for Singapore weather.",
      "Complete electrical integration, inverter setup, and grid connection.",
      "Turnkey project management from site survey to final commissioning."
    ],
    processHeading: "Our Working Process",
    processText: "Our solar installation process includes site assessment, system planning, secure rooftop mounting, and professional electrical integration to deliver reliable renewable energy performance.",
    processSteps: [
      {
        title: "STEP 01: Site Assessment",
        description: "Evaluate roof condition, available installation space, sunlight exposure, and structural suitability for solar panel installation."
      },
      {
        title: "STEP 02: System Planning",
        description: "Design an efficient panel layout and determine equipment placement based on your property's energy requirements."
      },
      {
        title: "STEP 03: Panel Installation",
        description: "Install mounting structures, solar panels, and electrical components using safe and professional installation practices."
      },
      {
        title: "STEP 04: Testing & Handover",
        description: "Conduct system inspections, verify electrical connections, and complete final testing before project handover."
      }
    ],
    serviceAreasBadge: "COVERAGE",
    serviceAreasHeading: "Reliable Engineering & Renovation Solutions Near You",
    serviceAreasSubheading: "UA ENGINEERING proudly provides renovation and upgrading services across Singapore, covering all major residential and commercial areas.",
    faqs: [
      {
        question: "1. What solar panel installation services does UA Engineering provide?",
        answer: "We provide rooftop solar PV installation, secure mounting, electrical integration, system testing, and professional handover."
      },
      {
        question: "2. Is my roof suitable for solar panel installation?",
        answer: "We assess roof condition, structural suitability, available space, sunlight exposure, and shading to determine solar feasibility."
      },
      {
        question: "3. Do you conduct a roof load assessment before installation?",
        answer: "Yes. We conduct structural roof load assessments and shading analysis for RC flat roofs, metal roofs, and tiled landed property roofs."
      },
      {
        question: "4. Can solar panels be installed on landed homes and commercial buildings?",
        answer: "Yes. We provide solar solutions for landed homes, condominiums, commercial buildings, and retail properties, subject to site suitability."
      },
      {
        question: "5. How does the solar panel installation process work?",
        answer: "Our process includes site assessment, system planning, panel and mounting installation, electrical integration, testing, and final handover."
      },
      {
        question: "6. Are your solar installations designed for Singapore's weather conditions?",
        answer: "Yes. We use secure mounting and weather-resistant installation practices designed for reliable performance in Singapore's conditions."
      },
      {
        question: "7. Does UA Engineering provide solar panel installation across Singapore?",
        answer: "Yes. We provide professional solar panel installation services across Singapore for suitable residential and commercial properties."
      }
    ],
    services: [
      {
        slug: "solar-panel-installation",
        title: "Solar Panel Installation",
        image: "/images/services/sub_solar.png",
        breadcrumbBg: "/images/layout/breadcrumb-bg.png",
        description: "Professional solar panel installation service delivering clean, efficient renewable energy solutions for residential and commercial properties across Singapore.",
        longDescription: "UA Engineering provides professional solar panel installation services for residential and commercial properties across Singapore. We deliver customised rooftop solar solutions designed to maximise available roof space and support efficient renewable energy generation. Our experienced team manages every stage of the installation process, including site assessment, roof suitability evaluation, solar panel layout planning, mounting structure installation, inverter installation, electrical cabling, and final system commissioning. Using quality solar components and proven installation practices, we ensure every system is installed with precision, safety, and long-term reliability in mind.",
        features: [
          "Rooftop Solar Assessment",
          "Custom Panel Layout Design",
          "Solar Panel Installation",
          "Electrical System Integration",
          "Safety & Performance Testing",
          "Final System Commissioning"
        ],
        benefits: [
          "Assess the site, roof condition, space, and sunlight to determine the best panel placement.",
          "Use reliable solar panels, durable mounting systems, and quality electrical components for lasting performance.",
          "Carefully plan mounting, cable routing, and electrical connections for safety and stability.",
          "Manage the entire process from consultation and planning to installation, testing, and handover."
        ],
        process: [
          "Step 01 – Site Assessment: Inspect roof condition, available installation area, structural suitability, and sunlight exposure.",
          "Step 02 – System Planning: Prepare a customised solar panel layout, equipment selection, and installation plan.",
          "Step 03 – Installation Preparation: Arrange mounting structures, electrical materials, safety equipment.",
          "Step 04 – Solar Panel Installation: Install mounting rails, solar panels, inverters, and electrical cabling.",
          "Step 05 – System Integration: Complete electrical connections, configure the inverter, and integrate components.",
          "Step 06 – Testing & Handover: Conduct system testing, verify operational performance, and complete client handover."
        ],
        processSteps: [
          { title: "Step 01 – Site Assessment", description: "Inspect roof condition, available installation area, structural suitability, and sunlight exposure." },
          { title: "Step 02 – System Planning", description: "Prepare a customised solar panel layout, equipment selection, and installation plan." },
          { title: "Step 03 – Installation Preparation", description: "Arrange mounting structures, electrical materials, safety equipment." },
          { title: "Step 04 – Solar Panel Installation", description: "Install mounting rails, solar panels, inverters, and electrical cabling." },
          { title: "Step 05 – System Integration", description: "Complete electrical connections, configure the inverter, and integrate components." },
          { title: "Step 06 – Testing & Handover", description: "Conduct system testing, verify operational performance, and complete client handover." }
        ]
      }
    ]
  }
];

// Exact CMS Data built from Doc
const cmsData = {
  site: {
    content: {
      siteLogo: "/images/logo.webp",
      footerLogo: "/images/logo.webp",
      companyName: "UA ENGINEERING PTE. LTD.",
      welcomeMessage: "Welcome to",
      phone: "+65 8459 3003",
      email: "hello.uaengineering@gmail.com",
      address: "38C SEA AVENUE MARINE MANSION SINGAPORE 424256",
      workingHours: "Mon - Sat: 9:00 AM - 6:00 PM (Emergency 24/7 Support)",
      appointmentButtonText: "Book An Appointment",
      footerAboutText: "A complete renovation partner for homes and commercial spaces in Singapore, handling everything from small repairs to full structural transformation.",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
      youtube: "https://youtube.com",
      whatsapp: "https://wa.me/6584593003"
    },
    seo: {
      metaTitle: "UA Engineering PTE. LTD. | Singapore Engineering & Renovation",
      metaDescription: "UA Engineering PTE. LTD. provides renovation, waterproofing, steel works, roofing, electrical, plumbing, aircon, aluminium glazing and maintenance services across Singapore.",
      metaKeywords: "UA Engineering, Singapore Renovation, Waterproofing Singapore",
      schemaJson: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "UA Engineering Pte Ltd"
      })
    }
  },
  home: {
    content: {
      heroHeading: "From Renovation to Painting, Roofing, Electrical, Plumbing and Steel Works.",
      heroSubheading: "We handle it all with expertise, reliability, and guaranteed quality.",
      heroSlide1Heading: "From Renovation to Painting, Roofing, Electrical, Plumbing and Steel Works.",
      heroSlide1Subheading: "We handle it all with expertise, reliability, and guaranteed quality.",
      heroSlide2Heading: "Everything Your Property Needs. One Trusted Engineering Team.",
      heroSlide2Subheading: "From renovations to electrical, plumbing, painting, roofing, steel fabrication, waterproofing, and maintenance - We handle it all.",
      heroSlide3Heading: "Fresh Paint. Lasting Protection. Stunning Results.",
      heroSlide3Subheading: "Interior and exterior painting services that enhance appearance, protect surfaces, and increase the value of your property.",
      heroSlide4Heading: "Roof Problems? We Fix Them Before They Cost You More.",
      heroSlide4Subheading: "Professional roof repairs, waterproofing, leak prevention, and complete roofing solutions to keep your property safe in every season.",
      heroSlide5Heading: "Safe, Reliable Electrical Solutions for Every Building.",
      heroSlide5Subheading: "From new installations and rewiring to troubleshooting and upgrades, we deliver electrical work that keeps your property running safely.",
      heroSlide6Heading: "Professional Plumbing Services Without the Hassle.",
      heroSlide6Subheading: "Leak repairs, pipe replacement, drainage solutions and sanitary installations all completed with quality workmanship.",
      heroSlide7Heading: "Custom Steel Fabrication Built for Strength & Precision.",
      heroSlide7Subheading: "We design, fabricate, and install steel structures, staircases, platforms, railings, and custom metal works.",
      heroImage: "/images/home/hero/hero-bg.png",
      heroImageAlt: "UA Engineering Renovation and Steel Fabrications Banner",
      heroCtaText: "Book An Appointment",
      aboutHeading: "Your Trusted Partner for All Building Needs.",
      aboutSubheading: "We provide home renovation, painting, waterproofing, main gate & grill works, balcony shelter installation, roof extensions, aluminium & glass installation, electrical, plumbing, aircon, and solar panel installation for homes and commercial properties across Singapore.",
      aboutImage: "/images/home/about/about-main.jpg",
      aboutImageAlt: "UA Engineering Upgrading Worksite Team",
      aboutExperience: "15",
      aboutCard1Title: "BCA Certified Company",
      aboutCard1Desc: "Meeting standards with high-quality workmanship, reliable service, compliance, consistent delivery, and professional practices.",
      aboutCard2Title: "Skilled & Certified Workforce",
      aboutCard2Desc: "Experienced professionals delivering quality work with precision, and attention.",
      aboutCard3Title: "Competitive & Transparent Pricing",
      aboutCard3Desc: "Fair, upfront pricing with detailed quotations, competitive rates, and no hidden costs or charges.",
      servicesIntro: "Get professional renovation, painting, waterproofing, structural works, M&E services, and solar panel installation-all under one roof.",
      whyChooseBadge: "UA ADVANTAGE",
      whyChooseHeading: "Why Choose UA Engineering",
      whyCard1Title: "Complete Building Solutions",
      whyCard1Desc: "From renovation and structural works to M&E, glazing, waterproofing, and solar, one trusted team handles every project.",
      whyCard2Title: "Quality Workmanship",
      whyCard2Desc: "Every project is completed with skilled workmanship, quality materials, and attention to detail for lasting performance.",
      whyCard3Title: "Honest & Transparent Pricing",
      whyCard3Desc: "Clear quotations, fair pricing, and no hidden costs, so you can plan your project with confidence.",
      whyCard4Title: "Reliable Project Management",
      whyCard4Desc: "We coordinate every stage efficiently, keeping projects organized, on schedule, and completed to high standards.",
      issue1Title: "Multiple Contractors to Manage",
      issue1Desc: "Hiring separate contractors often leads to delays, communication gaps, and inconsistent workmanship across different stages of the project.",
      issue2Title: "Poor Workmanship",
      issue2Desc: "Low-quality materials and rushed installation can result in recurring repairs, higher maintenance costs, and reduced durability.",
      issue3Title: "Unclear Pricing",
      issue3Desc: "Unexpected charges and incomplete quotations can increase project costs and create unnecessary stress during construction.",
      issue4Title: "Delays & Poor Communication",
      issue4Desc: "Lack of planning and communication often causes missed deadlines, project disruptions, and uncertainty throughout the construction process.",
      relyBadge: "RELIABILITY & TRUST",
      relyHeading: "Why Do You Rely On Us?",
      relyImage: "/images/home/rely/rely-main.png",
      relyButtonText: "Talk to an Expert",
      relyFeature1Title: "Honest & Transparent Pricing",
      relyFeature1Desc: "Receive clear, detailed quotations with fair pricing and no hidden costs, so you know exactly what to expect before work begins.",
      relyFeature2Title: "Quality Work That Lasts",
      relyFeature2Desc: "We focus on quality materials, skilled workmanship, and proper installation to deliver durable solutions you can depend on for years.",
      relyFeature3Title: "Reliable Service, Every Step",
      relyFeature3Desc: "From the first site visit to project handover, we keep you informed, stay on schedule, and ensure a smooth experience.",
      callbackHeading: "Let Us Call You",
      callbackSubheading: "Need help now? Send a few details - we'll call you shortly.",
      callbackBgImage: "/images/home/call/callback-bg.png",
      callbackSupportImage: "/images/home/call/call-support.png",
      callbackButtonText: "Submit Now",
      reviewsBadge: "CLIENT TESTIMONIALS",
      reviewsHeading: "What Our Clients Say About UA Engineering",
      processBadge: "HOW IT WORKS",
      processHeading: "Our Simple & Transparent Working Process",
      processSubheading: "From site inspection and quotation to professional installation and project handover, we ensure quality, transparency, and customer satisfaction at every stage.",
      processStep1Title: "Free Consultation & Site Visit",
      processStep1Desc: "We assess your requirements, inspect the site, discuss solutions, and understand your project goals.",
      processStep1Image: "/images/home/process/assessment.png",
      processStep2Title: "Quotation & Project Planning",
      processStep2Desc: "Provide a detailed quotation, project scope, material recommendations, timeline, and execution plan with transparent pricing.",
      processStep2Image: "/images/home/process/planning.png",
      processStep3Title: "Professional Execution",
      processStep3Desc: "Our skilled team completes every project using quality materials, safe practices, and strict workmanship standards.",
      processStep3Image: "/images/home/process/execution.png",
      processStep4Title: "Final Inspection & Handover",
      processStep4Desc: "We conduct final quality checks, ensure everything meets expectations, and hand over your completed project with confidence.",
      processStep4Image: "/images/home/process/handover.png",
      serviceAreasTitle: "Reliable Home Renovation Solutions Near You",
      serviceAreasSubtitle: "UA ENGINEERING proudly provides home renovation services across Singapore, covering all major residential and commercial areas.",
      consultHeading: "Book a Free Consultation as Your Convenient Time",
      consultSubheading: "Would you like to discuss your project face-to-face with our expert? Do you need expert guidance for your project? Would you like our expert to visit your site or project? Then book a free-of-cost appointment at your convenience."
    },
    seo: {
      metaTitle: "UA Engineering PTE. LTD. | Singapore Engineering & Renovation",
      metaDescription: "UA Engineering PTE. LTD. provides renovation, waterproofing, steel works, roofing, electrical, plumbing, aircon, aluminium glazing and maintenance services across Singapore.",
      metaKeywords: "UA Engineering, Singapore Renovation, Waterproofing Singapore",
      schemaJson: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "UA Engineering Pte Ltd"
      })
    }
  },
  about: {
    content: {
      heroHeading: "About UA Engineering",
      heroSubheading: "UA Engineering is a Singapore-based company providing renovation, structural, glazing, electrical, plumbing, aircon, waterproofing, and solar solutions.",
      heroImage: "/images/layout/about-bg.png",
      aboutImage: "/images/home/about/about-main.jpg",
      heroImageAlt: "UA Engineering Commercial Facility Builders",
      sectionTag: "About Our Company",
      overviewHeading: "About Our Company",
      overviewText: "UA ENGINEERING PTE. LTD. is a trusted engineering and construction company. We deliver quality workmanship through highly skilled and certified professionals, BCA-compliant practices, and premium materials. With transparent pricing, a strong focus on safety, and reliable project management, we are committed to completing every project on time while exceeding our clients' expectations. Your satisfaction, safety, and trust are at the heart of everything we do.",
      experienceYears: "15",
      experienceTitle: "Years of Excellence",
      experienceSubtitle: "15+ Years Skilled Personnel",
      trustHeading: "Why Property Owners Trust UA Engineering",
      highlightsJson: JSON.stringify([
        { text: "15+ Years Skilled Personnel", icon: "Clock" },
        { text: "Highly Skilled & Certified Workers", icon: "Wrench" },
        { text: "BCA Compliant Workmanship", icon: "Award" },
        { text: "Transparent & Competitive Pricing", icon: "DollarSign" },
        { text: "Premium Quality Materials", icon: "ShieldCheck" },
        { text: "Safety-First Construction Practices", icon: "ShieldCheck" },
        { text: "On-Time Project Completion", icon: "Clock" },
        { text: "100% Commitment to Client Satisfaction", icon: "ThumbsUp" }
      ]),
      ehsHeading: "EHS Safety Policy & Environmental Compliance",
      ehsText: "We maintain a Zero-Accident policy across all site operations. Our EHS compliance officers inspect structural rigs, high-voltage lines, and confined space setups daily to protect our workers and clients.",
      ehsImage: "/images/home/about/about-main.jpg",
      processBadge: "HOW WE WORK",
      processHeading: "Our Process",
      processSubheading: "Every successful renovation begins with proper planning and professional execution. At UA Engineering, we follow a proven project management process that ensures efficiency, quality, and complete customer confidence from the initial consultation through project completion.",
      processStepsJson: JSON.stringify([
        {
          id: 1,
          tag: "STEP 01",
          title: "Consultation & Site Assessment",
          description: "We discuss your renovation goals, inspect the property, take accurate measurements, assess technical requirements, and recommend practical solutions to develop a clear and efficient project plan.",
          milestones: [
            "Free consultation and site inspection",
            "Detailed technical assessment",
            "Structural and feasibility evaluation",
            "Accurate measurements"
          ]
        },
        {
          id: 2,
          tag: "STEP 02",
          title: "Proposal & Project Planning",
          description: "We prepare a transparent quotation covering scope, materials, pricing, and timeline. After approval, we organise resources, scheduling, and project planning for smooth execution.",
          milestones: [
            "Detailed itemised quotation",
            "Transparent pricing",
            "Material recommendations",
            "Project scheduling"
          ]
        },
        {
          id: 3,
          tag: "STEP 03",
          title: "Professional Execution & Quality Control",
          description: "Our skilled team completes every project safely under experienced supervision, following BCA and HDB standards while maintaining strict quality control throughout every stage.",
          milestones: [
            "Experienced project supervisors",
            "Certified skilled workers",
            "Premium construction materials",
            "Continuous quality inspections"
          ]
        },
        {
          id: 4,
          tag: "STEP 04",
          title: "Completion, Handover & After-Sales Support",
          description: "After final inspections and site cleaning, we hand over the completed project with warranty information, maintenance guidance, and responsive after-sales support for your peace of mind.",
          milestones: [
            "Final quality inspection",
            "Complete project walkthrough",
            "Site cleaning and finishing",
            "Warranty documentation"
          ]
        }
      ]),
      residentialBadge: "WHAT WE DO",
      residentialHeading: "Complete Renovation, Engineering & Property Improvement Services",
      residentialSubheading: "UA Engineering provides complete renovation, structural, waterproofing, electrical, plumbing, aluminium, and solar panel solutions for residential, commercial, and industrial properties across Singapore.",
      faqBadge: "FAQ'S",
      faqHeading: "Frequently Asked Questions",
      faqSubheading: "Find expert answers to common questions about our renovation, construction, and handyman services in Singapore.",
      faqsJson: JSON.stringify([
        {
          question: "1. What services does UA Engineering provide?",
          answer: "UA Engineering provides a comprehensive range of renovation and engineering services, including residential and commercial renovation, structural works, glazing, aluminium works, electrical, plumbing, air-conditioning, waterproofing, and solar panel solutions."
        },
        {
          question: "2. Does UA Engineering handle both residential and commercial projects?",
          answer: "Yes. We undertake projects for residential, commercial, and industrial properties across Singapore. Our team can manage projects of different sizes and requirements, from individual renovation works to complete property improvement projects."
        },
        {
          question: "3. How does the renovation process work?",
          answer: "Our process begins with a consultation and site assessment, followed by a detailed proposal and project planning. Once approved, our skilled team carries out the works under professional supervision and quality control. The project concludes with final inspection, handover, site cleaning, and after-sales support."
        },
        {
          question: "4. Do you provide a detailed quotation before starting work?",
          answer: "Yes. We provide transparent, itemised quotations outlining the project scope, materials, pricing, and expected timeline. This helps clients understand the costs clearly and minimise unexpected charges during the project."
        },
        {
          question: "5. Are your workers skilled and certified?",
          answer: "Yes. UA Engineering works with highly skilled and certified professionals who follow applicable industry requirements and established safety and quality practices. Experienced supervision is maintained throughout the project to ensure professional execution."
        },
        {
          question: "6. Do you provide waterproofing, plumbing, electrical and air-conditioning services?",
          answer: "Yes. We provide a wide range of essential property services, including waterproofing, plumbing, electrical works, and air-conditioning solutions. These services can be carried out as individual works or integrated into a larger renovation or engineering project."
        },
        {
          question: "7. How does UA Engineering ensure quality and timely project completion?",
          answer: "We use structured project planning, experienced supervision, quality inspections, premium materials, and professional workmanship throughout each stage. Our team focuses on safety, quality control, clear communication, and efficient scheduling to deliver projects reliably and on time."
        }
      ])
    },
    seo: {
      metaTitle: "About Us | UA Engineering PTE. LTD.",
      metaDescription: "Learn more about UA Engineering's team, licensed professional engineers, safety track record, and commercial construction capability in Singapore.",
      metaKeywords: "about UA engineering, site engineers Singapore, certified contractors Singapore",
      schemaJson: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About UA Engineering Pte Ltd"
      })
    }
  },
  services: {
    content: {
      heroHeading: "Our Engineering Services",
      heroSubheading: "Professional solutions covering plumbing, substation electrical networks, waterproofing membranes, drywall, tiling, hacking, and solar panels.",
      heroImage: "/images/services/services-bg.jpg",
      heroImageAlt: "UA Engineering Substation Electrical Rewiring Grid",
      servicesHeading: "Singapore Building and Construction Capability",
      servicesSubheading: "We handle commercial, industrial, and residential upgrades. All works are certified by BCA registered professional engineers."
    },
    seo: {
      metaTitle: "Our Services | Substation Electrical, Plumbing, Waterproofing",
      metaDescription: "Explore our commercial and industrial services in Singapore.",
      metaKeywords: "substation electrical works, commercial plumbing Singapore",
      schemaJson: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service"
      })
    }
  },
  projects: {
    content: {
      heroHeading: "Our Completed Projects",
      heroSubheading: "A catalog of successfully delivered commercial, retail, and residential projects reflecting structural engineering precision and quality.",
      heroImage: "/images/projects/projects-bg.jpg",
      heroImageAlt: "UA Engineering Commercial Drywall Alteration Project",
      portfolioHeading: "Featured Engineering Contracts",
      portfolioSubheading: "Review our portfolio of successfully delivered projects in Singapore."
    },
    seo: {
      metaTitle: "Completed Projects | UA Engineering Portfolio",
      metaDescription: "Review our portfolio of successfully delivered projects in Singapore.",
      metaKeywords: "engineering portfolio Singapore, substation works Singapore",
      schemaJson: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage"
      })
    }
  },
  blog: {
    content: {
      heroHeading: "Engineering & Safety Resources",
      heroSubheading: "Professional insights, building codes, EHS checklists, and tips on flat roof waterproofing and electrical safety upgrades in HDBs.",
      heroImage: "/images/blog/blog-bg.jpg",
      heroImageAlt: "UA Engineering BTO Renovation Checklist Documents",
      blogHeading: "Latest Insights & Field Manuals",
      blogSubheading: "Stay up-to-date with Singapore BCA and HDB guidelines."
    },
    seo: {
      metaTitle: "Blog & Engineering Resources | UA Engineering",
      metaDescription: "Read the latest engineering articles, safety tips, BTO renovation rules, and electrical rewiring checklists.",
      metaKeywords: "engineering blog, BTO renovation tips",
      schemaJson: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog"
      })
    }
  },
  contact: {
    content: {
      heroHeading: "Contact UA Engineering",
      heroSubheading: "Get in touch for commercial quotations, structural surveys, emergency substation audits, or custom plumbing design layout consultations.",
      heroImage: "/images/contact/contact-bg.jpg",
      heroImageAlt: "UA Engineering Singapore Customer Support Center",
      contactAddress: "38C SEA AVENUE MARINE MANSION SINGAPORE 424256",
      contactPhone: "+65 8459 3003",
      contactEmail: "hello.uaengineering@gmail.com",
      contactHours: "Mon - Sat: 9:00 AM - 6:00 PM (Emergency 24/7 Support)"
    },
    seo: {
      metaTitle: "Contact Us | UA Engineering PTE. LTD.",
      metaDescription: "Request a callback or quotation from UA Engineering Singapore.",
      metaKeywords: "contact UA engineering, Singapore engineer inspection",
      schemaJson: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage"
      })
    }
  }
};

const websiteCmsPath = path.join(__dirname, "..", "UA ENGINEERING PTE. LTD -Website", "data", "cmsData.json");
const dashboardCmsPath = path.join(__dirname, "..", "UA ENGINEERING PTE. LTD -Dashboard", "data", "cmsData.json");

const websiteServicesTsPath = path.join(__dirname, "..", "UA ENGINEERING PTE. LTD -Website", "data", "servicesData.ts");
const dashboardServicesTsPath = path.join(__dirname, "..", "UA ENGINEERING PTE. LTD -Dashboard", "data", "servicesData.ts");

const dbJsonPath = path.join(__dirname, "data", "db.json");

async function main() {
  console.log("==================================================");
  console.log(" Re-running Full Data Sync with 100% Exact Doc Text");
  console.log("==================================================");

  const servicesTsCode = `export interface SubService {
  slug: string;
  title: string;
  image: string;
  breadcrumbTitle?: string;
  breadcrumbBg?: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  process: string[];
  processSteps?: ProcessStep[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ServiceCategory {
  slug: string;
  title: string;
  breadcrumbTitle?: string;
  detailTitle?: string;
  subServicesTitle?: string;
  subServicesSubheading?: string;
  shortDescription: string;
  description: string;
  featuredImage: string;
  bgImage: string;
  icon?: string;
  services: SubService[];
  features?: string[];
  benefits?: string[];
  process?: string[];
  processHeading?: string;
  processText?: string;
  processSteps?: ProcessStep[];
  targetBadge?: string;
  targetHeading?: string;
  targetSubheading?: string;
  targetSpaces?: string[];
  whyChooseBadge?: string;
  whyChooseHeading?: string;
  whyChooseLeftTitle?: string;
  whyChooseRightTitle?: string;
  whyChooseAdvantages?: { title: string; description: string }[];
  whyChooseChallenges?: { title: string; description: string }[];
  serviceAreasBadge?: string;
  serviceAreasHeading?: string;
  serviceAreasSubheading?: string;
  faqs?: FAQItem[];
}

export const servicesData: ServiceCategory[] = ${JSON.stringify(servicesData, null, 2)};
`;

  fs.writeFileSync(websiteServicesTsPath, servicesTsCode, "utf8");
  console.log(" - Updated Website servicesData.ts");

  fs.writeFileSync(dashboardServicesTsPath, servicesTsCode, "utf8");
  console.log(" - Updated Dashboard servicesData.ts");

  fs.writeFileSync(websiteCmsPath, JSON.stringify(cmsData, null, 2), "utf8");
  console.log(" - Updated Website cmsData.json");

  fs.writeFileSync(dashboardCmsPath, JSON.stringify(cmsData, null, 2), "utf8");
  console.log(" - Updated Dashboard cmsData.json");

  // 3. Update db.json
  let dbData = JSON.parse(fs.readFileSync(dbJsonPath, "utf8"));
  dbData.cms = cmsData;
  dbData.services = servicesData;
  fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), "utf8");
  console.log(" - Updated local db.json");

  // 4. Update MongoDB Atlas
  console.log("\nConnecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
  });
  console.log(" - Connected to MongoDB successfully!");

  const CmsSchema = new mongoose.Schema({ pageId: String, content: Object, seo: Object }, { strict: false });
  const ServiceSchema = new mongoose.Schema({ categories: Array }, { strict: false });

  const Cms = mongoose.models.Cms || mongoose.model("Cms", CmsSchema);
  const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

  await Cms.deleteMany({});
  for (const pageId of Object.keys(cmsData)) {
    await Cms.create({
      pageId,
      content: cmsData[pageId].content,
      seo: cmsData[pageId].seo,
    });
  }
  console.log(" - MongoDB 'Cms' collection updated with 7 pages.");

  await Service.deleteMany({});
  await Service.create({ categories: servicesData });
  console.log(" - MongoDB 'Service' collection updated with 6 categories and all sub-services.");

  await mongoose.disconnect();
  console.log("\n==================================================");
  console.log(" SUCCESS! Re-synced 100% Exact Text Across All Files ");
  console.log("==================================================");
}

main().catch(err => {
  console.error("Error updating data:", err);
  process.exit(1);
});
