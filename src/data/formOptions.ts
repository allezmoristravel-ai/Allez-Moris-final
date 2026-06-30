
export const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
    "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
    "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt",
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji",
    "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
    "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
    "North Korea", "South Korea", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
    "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
    "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia",
    "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan",
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga",
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
    "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
    "Zambia", "Zimbabwe"
];

export const ACTIVITY_CATEGORIES = [
    {
        id: "sea",
        titleKey: "seaTours",
        icon: "⛵", // We can replace these with Lucide icons later if preferred
        items: [
            { id: "catamaran", labelKey: "catamaran" },
            { id: "speedboat", labelKey: "speedboat" },
            { id: "cataspeed", labelKey: "cataspeed" },
        ]
    },
    {
        id: "land",
        titleKey: "landTours",
        icon: "🗺️",
        items: [
            { id: "rumTasting", labelKey: "rumTasting" },
            { id: "temple", labelKey: "temple" },
            { id: "church", labelKey: "church" },
            { id: "sugarCane", labelKey: "sugarCane" },
            { id: "colouredSand", labelKey: "colouredSand" },
            { id: "botanicalGardens", labelKey: "botanicalGardens" },
            { id: "localMarkets", labelKey: "localMarkets" },
            { id: "portLouis", labelKey: "portLouis" },
            { id: "teaFarm", labelKey: "teaFarm" },
        ]
    },
    {
        id: "water",
        titleKey: "waterActivities",
        icon: "🌊",
        items: [
            { id: "snorkeling", labelKey: "snorkeling" },
            { id: "scubaDiving", labelKey: "scubaDiving" },
            { id: "glassBoat", labelKey: "glassBoat" },
            { id: "parasailing", labelKey: "parasailing" },
            { id: "underseaWalk", labelKey: "underseaWalk" },
            { id: "submarine", labelKey: "submarine" },
            { id: "dolphinWatch", labelKey: "dolphinWatch" },
            { id: "whaleWatch", labelKey: "whaleWatch" },
            { id: "deepSeaFishing", labelKey: "deepSeaFishing" },
            { id: "shoreFishing", labelKey: "shoreFishing" },
            { id: "kayakFishing", labelKey: "kayakFishing" },
            { id: "waterTubing", labelKey: "waterTubing" },
            { id: "kayakingMangroves", labelKey: "kayakingMangroves" },
            { id: "paddleBoarding", labelKey: "paddleBoarding" },
        ]
    },
    {
        id: "adventure",
        titleKey: "adventureNature",
        icon: "⛰️",
        items: [
            { id: "quadBiking", labelKey: "quadBiking" },
            { id: "zipline", labelKey: "zipline" },
            { id: "hiking", labelKey: "hiking" },
            { id: "trailRuns", labelKey: "trailRuns" },
            { id: "nightRun", labelKey: "nightRun" },
            { id: "horsebackRiding", labelKey: "horsebackRiding" },
            { id: "mountainBiking", labelKey: "mountainBiking" },
            { id: "safari", labelKey: "safari" },
            { id: "natureWalk", labelKey: "natureWalk" },
        ]
    },
    {
        id: "luxury",
        titleKey: "aerialLuxury",
        icon: "🚁",
        items: [
            { id: "helicopter", labelKey: "helicopter" },
            { id: "seaplane", labelKey: "seaplane" },
            { id: "privateYacht", labelKey: "privateYacht" },
            { id: "sunsetCruise", labelKey: "sunsetCruise" },
        ]
    },
    {
        id: "sporting",
        titleKey: "sportingLeisure",
        icon: "⛳",
        items: [
            { id: "golf", labelKey: "golf" },
            { id: "tennis", labelKey: "tennis" },
            { id: "padel", labelKey: "padel" },
            { id: "yoga", labelKey: "yoga" },
            { id: "spa", labelKey: "spa" },
        ]
    },
    {
        id: "wildlife",
        titleKey: "wildlifeFamily",
        icon: "🦎",
        items: [
            { id: "caselaParks", labelKey: "caselaParks" },
            { id: "laVanille", labelKey: "laVanille" },
            { id: "aquarium", labelKey: "aquarium" },
            { id: "sugarMuseum", labelKey: "sugarMuseum" },
            { id: "curiousCorner", labelKey: "curiousCorner" },
        ]
    },
    {
        id: "transport",
        titleKey: "transportRental",
        icon: "🚗",
        items: [
            { id: "airportTransfer", labelKey: "airportTransfer" },
            { id: "carHire", labelKey: "carHire" },
            { id: "scooterHire", labelKey: "scooterHire" },
            { id: "privateChauffeur", labelKey: "privateChauffeur" },
        ]
    },
];
