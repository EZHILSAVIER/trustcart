
export const stats = [
    { title: "Total Products", value: "12,450", change: "+12%", type: "positive" },
    { title: "Violations Detected", value: "320", change: "+5.2%", type: "negative" },
    { title: "Pending Review", value: "45", change: "-2%", type: "neutral" },
    { title: "Safe Listings", value: "12,085", change: "+15%", type: "positive" },
];

export const violations = [
    {
        id: 1,
        productName: "Gucci Handbag - Limited Edition",
        violationType: "Deepfake / Counterfeit",
        confidence: 98,
        status: "Flagged",
        date: "2024-10-24",
        seller: "FashionHub_99",
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=200",
    },
    {
        id: 2,
        productName: "Herbal miracle cancer cure",
        violationType: "Misleading Claim / Medical",
        confidence: 95,
        status: "Removed",
        date: "2024-10-23",
        seller: "NaturalCures_Direct",
        imageUrl: "https://images.unsplash.com/photo-1626015528518-bc6a3146486c?auto=format&fit=crop&q=80&w=200",
    },
    {
        id: 3,
        productName: "Nike Air Jordan 1",
        violationType: "Price Manipulation",
        confidence: 82,
        status: "Warning",
        date: "2024-10-23",
        seller: "Kicks_Resell",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200",
    },
    {
        id: 4,
        productName: "Baby Formula 2020 Expired",
        violationType: "Expired Product / Safety",
        confidence: 99,
        status: "High Risk",
        date: "2024-10-22",
        seller: "Discount_Mart",
        imageUrl: "https://images.unsplash.com/photo-1632059349850-89147573eb19?auto=format&fit=crop&q=80&w=200",
    }
];
