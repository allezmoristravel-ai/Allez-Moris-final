
  ---


Detailed Payload Contract for `/api/itinerary/generate`

This document outlines the structure and possible values for the JSON payload sent from the frontend to the backend's itinerary generation API.

Endpoint: POST /api/itinerary/generate
Content-Type: application/json

  ---


`user_context` Object

Contains information about the user and their travel preferences.

* `name` (Type: string)
    * Description: The name of the user.
    * Constraints: Required. Minimum 1 character.
    * Example: "John Doe"


* `travel_style` (Type: string)
    * Description: The preferred travel style.
    * Constraints: Required. Must be one of the following enum values:
      "adventure", "relaxation", "cultural", "family", "romantic", "luxury", "budget", "balanced"
    * Example: "balanced"


* `budget_level` (Type: string)
    * Description: The desired budget level for the trip.
    * Constraints: Required. Must be one of the following enum values:
      "luxury", "mid_range", "budget"
    * Default (if not explicitly set by user): "luxury"
    * Example: "luxury"


* `language` (Type: string | undefined)
    * Description: The preferred language for the itinerary.
    * Constraints: Optional.
    * Example: "en"

  ---

`trip_details` Object

Details regarding the trip itself.


* `destination` (Type: string[])
    * Description: A list of regions the user wishes to visit.
    * Constraints: Required. Must contain at least one string.
    * Example: ["North", "South"]


* `duration_days` (Type: number)
    * Description: The number of days for the trip.
    * Constraints: Required. Must be an integer. Must be a positive number (at least 1).
    * Example: 7


* `adults` (Type: number)
    * Description: The number of adult travelers.
    * Constraints: Required. Must be an integer. Must be a positive number (at least 1).
    * Example: 2


* `children` (Type: number[])
    * Description: An array representing the ages of children traveling. This field is derived from frontend inputs (children_0_6, children_6_12, children_12_18) as follows:
        * For each child in the "0-6" category, the age 3 is added to this array.
        * For each child in the "6-12" category, the age 9 is added to this array.
        * For each child in the "12-18" category, the age 15 is added to this array.
    * Constraints: Will be an array of numbers. Can be empty if no children are specified.
    * Example (if 2 children 0-6, 1 child 6-12, 1 child 12-18): [3, 3, 9, 15]


* `start_date` (Type: string)
    * Description: The calculated start date of the trip.
    * Constraints: Automatically generated on the frontend as YYYY-MM-DD format (current date).
    * Example: "2026-02-09"


* `end_date` (Type: string)
    * Description: The calculated end date of the trip.
    * Constraints: Automatically generated on the frontend as YYYY-MM-DD format (start_date + duration_days - 1).
    * Example: "2026-02-15"

  ---

`logistics` Object

Preferences for transportation and accommodation.


* `transport_preference` (Type: string | undefined)
    * Description: Preferred mode of transport.
    * Constraints: Optional. Must be one of the following enum values:
      "any", "rental_car", "taxi", "public_transport", "private_chauffeur"
    * Example: "any"


* `accommodation_type` (Type: string | undefined)
    * Description: Preferred type of accommodation.
    * Constraints: Optional. Must be one of the following enum values:
      "any", "hotel", "villa", "guesthouse", "boutique_hotel"
    * Example: "any"


* `flight_booked` (Type: boolean | undefined)
    * Description: Indicates if the flight is already booked.
    * Constraints: Optional.
    * Example: false

  ---

`preferences` Object

User's interests and desired travel pace.


* `interests` (Type: string[] | undefined)
    * Description: A list of interests the user has for activities.
    * Constraints: Optional. Each string is an interest category (e.g., "beach_lagoon", "nature_wildlife").
    * Example: ["beach_lagoon", "gastronomy"]


* `rhythm` (Type: string | undefined)
    * Description: The desired pace of the trip.
    * Constraints: Optional. Must be one of the following enum values:
      "relaxed", "balanced", "fast_paced", "adventure"
    * Default (if not explicitly set by user): "balanced"
    * Example: "balanced"

  ---

`metadata` Object

Additional metadata about the request.


* `source` (Type: string | undefined)
    * Description: The source of the request.
    * Constraints: Optional.
    * Default: "tour_operator_demo"
    * Example: "tour_operator_demo"


* `thread_id` (Type: string | undefined)
    * Description: An optional identifier for tracking conversation threads.
    * Constraints: Optional.
    * Example: "some_unique_thread_id_uuid"


  ---

