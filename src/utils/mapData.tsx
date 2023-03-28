const Images = [
    { image: require("https://beautydistrict.ro/wp-content/uploads/2014/02/IMG_5541_resize.jpg") },
    { image: require("https://www.floreasca.com/wp-content/uploads/2020/05/cmraaaaav2mcmevxdaln50ne9flxbhmhiue-9bqbjbwq5mid4mpj84nbvjvejvshkry4qo2c2u7t24rilpgfyyznpmjon8_t-tgzyhae1ppbu0qaqq_ug_q8riibquusojydcs6gehboaweh_lj-geat7bm5k1iughrwquoiicgbzngsj7u07mukk4u7hw.jpg") },
    { image: require("https://jovsky.ro/wp-content/uploads/2020/01/floreasca-home-300x184.jpg") },
    { image: require("https://www.floreasca.com/wp-content/uploads/2020/05/cmrzaaaamrt-kkqvnle4dm1yj4-2nznhvozegl1dylph0mkup2bgwcq5nc_tbjjikqdtkj8lkprq-cg-vkge2vc2qaewbln2_d_16-iquuroys0dpgmhl_mfdg6jdegd1pq3fahjehbcwnnzoannjb6p1qwxuu_4ghrigwom2svqwsilisvvsbsfu_xw8q.jpg") },
    { image: require("https://getavoinea.ro/wp-content/uploads/2022/05/alphabeauty-geta-voinea-agora-floreasca-1.jpg") },
];

export const markers = [
    {
        coordinate: {
            latitude: 44.481983,
            longitude: 26.086169,
        },
        title: "Beauty District",
        description: "Description...",
        image: require("https://beautydistrict.ro/wp-content/uploads/2014/02/IMG_5541_resize.jpg"),
        rating: 4,
        reviews: 99,
    },
    {
        coordinate: {
            latitude: 44.460734,
            longitude: 26.094791,
        },
        title: "Salonette",
        description: "Description...",
        image: require("https://jovsky.ro/wp-content/uploads/2020/01/floreasca-home-300x184.jpg"),
        rating: 5,
        reviews: 102,
    },
    {
        coordinate: {
            latitude: 44.468325,
            longitude: 26.103345,
        },
        title: "Jovsky Studio",
        description: "Description...",
        image: Images[2].image,
        rating: 3,
        reviews: 220,
    },
    {
        coordinate: {
            latitude: 44.460843,
            longitude: 26.102110,
        },
        title: "Endorphin Lab",
        description: "Description...",
        image: require("https://getavoinea.ro/wp-content/uploads/2022/05/alphabeauty-geta-voinea-agora-floreasca-1.jpg"),
        rating: 4,
        reviews: 48
    }
    // {
    //     coordinate: {
    //         latitude: 44.460231,
    //         longitude: 26.100649,
    //     },
    //     title: "Agora",
    //     description: "Description...",
    //     image: Images[4].image,
    //     rating: 4,
    //     reviews: 178,
    // },
];

export const mapDarkStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];

export const mapStandardStyle = [
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
];