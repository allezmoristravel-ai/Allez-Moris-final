import { Accommodation } from "@/types/accommodation";

export const accommodations: Accommodation[] = [
    {
        id: "seafront-apartment-bain-boeuf",
        title: "Three-Bedroom Seafront Apartment with Private Splash Pool",
        region: "North",
        location: "Bain Boeuf",
        type: "Apartment",
        price: "€150",
        period: "per night",
        image: "/accommodations/three-bedroom-seafront-apartment-bain-boeuf-main.jpg",
        images: [
            "/accommodations/three-bedroom-seafront-apartment-bain-boeuf-main.jpg",
            "/accommodations/seafront-apartment-bain-boeuf-living-room.jpg",
            "/accommodations/seafront-apartment-bain-boeuf-bedroom.jpg",
            "/accommodations/seafront-apartment-bain-boeuf-pool.jpg",
            "/accommodations/seafront-apartment-bain-boeuf-terrace.jpg",
            "/accommodations/seafront-apartment-bain-boeuf-view.jpg",
        ],
        bedrooms: 3,
        guests: 6,
        description: "This beautifully appointed three-bedroom apartment is ideally located in the sought-after coastal village of Bain Boeuf. Set just moments from the lagoon, the property offers stunning views of Coin de Mire, combining modern comfort with relaxed island living.\n\nDesigned for both comfort and style, the apartment opens onto a private garden terrace with a splash pool, creating a seamless indoor-outdoor living experience.",
        features: [
            "Private Splash Pool",
            "Sea Views",
            "Walking distance to beach",
            "Fully equipped kitchen",
            "Air conditioning",
            "Wi-Fi",
            "Parking"
        ],
        slug: "seafront-apartment-bain-boeuf",
        locationUrl: "https://maps.google.com/?q=Bain+Boeuf,+Mauritius"
    },
    {
        id: "luxury-villa-flic-en-flac",
        title: "Luxury Beachfront Villa with Infinity Pool",
        region: "West",
        location: "Flic en Flac",
        type: "Villa",
        price: "€320",
        period: "per night",
        image: "/category-stay.jpg",
        images: ["/category-stay.jpg"],
        bedrooms: 4,
        guests: 8,
        description: "An exquisite four-bedroom villa perched along the stunning west coast of Mauritius. Wake up to panoramic ocean views, take a dip in the infinity pool, or stroll directly onto the white sandy beach of Flic en Flac.\n\nPerfect for families or groups seeking a premium island escape with complete privacy and world-class amenities.",
        features: [
            "Infinity Pool",
            "Direct Beach Access",
            "Ocean Views",
            "Private Chef Available",
            "Air conditioning",
            "Wi-Fi",
            "Housekeeping"
        ],
        slug: "luxury-villa-flic-en-flac",
        locationUrl: "https://maps.google.com/?q=Flic+en+Flac,+Mauritius"
    },
    {
        id: "cozy-guesthouse-chamarel",
        title: "Charming Mountain Guesthouse near Chamarel",
        region: "South",
        location: "Chamarel",
        type: "Guesthouse",
        price: "€75",
        period: "per night",
        image: "/hero-mauritius.jpg",
        images: ["/hero-mauritius.jpg"],
        bedrooms: 2,
        guests: 4,
        description: "Nestled in the lush green hills of Chamarel, this charming guesthouse offers a peaceful retreat surrounded by tropical gardens and mountain views. Just minutes from the famous Seven Coloured Earth and Chamarel Waterfall.\n\nIdeal for couples or small families looking for an authentic Mauritian countryside experience.",
        features: [
            "Mountain Views",
            "Tropical Garden",
            "Breakfast Included",
            "Near Chamarel Attractions",
            "Free Parking",
            "Wi-Fi"
        ],
        slug: "cozy-guesthouse-chamarel",
        locationUrl: "https://maps.google.com/?q=Chamarel,+Mauritius"
    },
];

export function getAccommodationBySlug(slug: string): Accommodation | undefined {
    return accommodations.find(a => a.slug === slug);
}

export function getAccommodations(): Accommodation[] {
    return accommodations;
}
