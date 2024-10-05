const MONTH_LIST = [
    {
        name: 'January',
        abbreviation: 'Jan',
    },
    {
        name: 'February',
        abbreviation: 'Feb',
    },
    {
        name: 'March',
        abbreviation: 'Mar',
    },
    {
        name: 'April',
        abbreviation: 'Apr',
    },
    {
        name: 'May',
        abbreviation: 'May',
    },
    {
        name: 'June',
        abbreviation: 'Jun',
    },
    {
        name: 'July',
        abbreviation: 'Jul',
    },
    {
        name: 'August',
        abbreviation: 'Aug',
    },
    {
        name: 'September',
        abbreviation: 'Sep',
    },
    {
        name: 'October',
        abbreviation: 'Oct',
    },
    {
        name: 'November',
        abbreviation: 'Nov',
    },
    {
        name: 'December',
        abbreviation: 'Dec',
    }
];
const SERVICE_VEHICLE_LIST = [
    {name: "Bike"},
    {name: "Car"},
    {name: "All"},
]
const SERVICE_CATEGORY_LIST = [
    {name: "Washing Services"},
    {name: "Detailing Services"}
]
const SERVICE_LIST = [
    {
      name: "Basic Car Wash",
      category: "Washing Services",
      vehicle: 'Car',
      description: "Exterior cleaning using water and shampoo.",
      coverImage: "basic_car_wash.jpg"
    },
    {
      name: "Deluxe Car Wash",
      category: "Washing Services",
      vehicle: 'Car',
      description: "Exterior wash with waxing and polishing.",
      coverImage: "deluxe_car_wash.jpg"
    },
    {
      name: "Underbody Wash",
      category: "Washing Services",
      vehicle: 'Car',
      description: "High-pressure cleaning of the car’s underbody.",
      coverImage: "underbody_wash.jpg"
    },
    {
      name: "Foam Wash",
      category: "Washing Services",
      vehicle: 'Car',
      description: "Foam wash for thorough cleaning.",
      coverImage: "foam_wash.jpg"
    },
    {
      name: "Basic Bike Wash",
      category: "Washing Services",
      vehicle: 'Bike',
      description: "Quick wash for bikes using water and soap.",
      coverImage: "basic_bike_wash.jpg"
    },
    {
      name: "Premium Bike Wash",
      category: "Washing Services",
      vehicle: 'Bike',
      description: "Detailed cleaning including engine and tire polish.",
      coverImage: "premium_bike_wash.jpg"
    },
    {
      name: "Chain Lubrication and Cleaning",
      category: "Washing Services",
      vehicle: 'Bike',
      description: "Cleaning and lubricating the bike chain.",
      coverImage: "chain_cleaning.jpg"
    },
    {
      name: "Steam Car Wash",
      category: "Washing Services",
      vehicle: 'Car',
      description: "Eco-friendly wash using steam for deep cleaning.",
      coverImage: "steam_car_wash.jpg"
    },
    {
      name: "Car Polishing",
      category: "Detailing Services",
      vehicle: 'Car',
      description: "Exterior polish to give your car a shine.",
      coverImage: "car_polishing.jpg"
    },
    {
      name: "Interior Vacuuming",
      category: "Detailing Services",
      vehicle: 'Car',
      description: "Deep vacuuming for car interiors.",
      coverImage: "interior_vacuuming.jpg"
    },
    {
      name: "Leather Seat Treatment",
      category: "Detailing Services",
      vehicle: 'Car',
      description: "Cleaning and conditioning of leather seats.",
      coverImage: "leather_seat_treatment.jpg"
    },
    {
      name: "Polishing",
      category: "Detailing Services",
      vehicle: 'All',
      description: "Polishing and cleaning the vehicle.",
      coverImage: "dashboard_polishing.jpg"
    }
];  

const DEFAULT_DATA = { MONTH_LIST, SERVICE_VEHICLE_LIST, SERVICE_CATEGORY_LIST, SERVICE_LIST }
export default DEFAULT_DATA;