import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LAZARE_API = "https://lazare.rs";

// Svaka kategorija skuplja proizvode iz više kolekcija
const CATEGORIES = [
    {
        name: "Majice",
        collections: [
            "елегант-мајице",
            "elegant-2-0-majice",
            "azur-lines-t-shirt",
            "roll-elegant-t-shirt",
            "apollo-lines-rollzip-t-shirt",
        ],
    },
    {
        name: "Polo majice",
        collections: [
            "polo-majice",
            "swedish-polo",
            "riviera-zip-polo",
            "polo-line-knit",
            "polo-tech-knit",
            "polo-sharp-zip-knit",
            "polo-diamond",
            "formell-polo",
            "business-polo",
        ],
    },
    {
        name: "Košulje",
        collections: ["ultraflex-kosulje", "comfort-line-kosulja"],
    },
    {
        name: "Pantalone",
        collections: [
            "belgian-stretch-pants",
            "executive-fit-pants",
            "gentle-lines-pants",
            "chess-grid-pants",
        ],
    },
    {
        name: "Bermude",
        collections: [
            "lazare-classic-bermude",
            "executive-fit-bermude",
            "letnji-dress-code",
        ],
    },
    {
        name: "Jakne i prsluk",
        collections: [
            "comandante-jacket",
            "lazare%E2%84%A2-prestige",
            "prestige-vest",
        ],
    },
    {
        name: "Džemperi",
        collections: [
            "lazare-classic-rollneck",
            "lazare-classic-half-zip",
            "lazare-rollneck-majeste",
            "richmood-quarter-zip",
            "predator-tanki-duks",
        ],
    },
    {
        name: "Overshirts",
        collections: [
            "soft-classic-overshirt",
            "lombardy-overshirt",
            "texas-overshirt",
        ],
    },
    {
        name: "Traperice",
        collections: ["lazare-classic-jeans", "lazare-urban-classic-jeans"],
    },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

const COLOR_HEX: Record<string, string> = {
    "WHITE":        "#FFFFFF",
    "BLACK":        "#000000",
    "NAVY":         "#1B2A4A",
    "BROWN":        "#8B4513",
    "BEIGE":        "#F5F0E8",
    "GREY":         "#9E9E9E",
    "GRAY":         "#9E9E9E",
    "BLUE":         "#1565C0",
    "GREEN":        "#2E7D32",
    "RED":          "#C62828",
    "BURGUNDY":     "#6A1B2A",
    "CAMEL":        "#C19A6B",
    "LAVENDER":     "#E8D5F5",
    "SAND":         "#F5DEB3",
    "OLIVE":        "#808000",
    "CREAM":        "#FFFDD0",
    "KHAKI":        "#C3B091",
    "DARK":         "#424242",
    "LIGHT":        "#F5F5F5",
    "MINT":         "#98D8C8",
    "SILVER":       "#C0C0C0",
    "CARBON":       "#2B2B2B",
    "OCEAN":        "#006994",
    "SATIN":        "#1A1A2E",
    "MIDNIGHT":     "#191970",
    "CABERNET":     "#722F37",
    "WIMBLEDON":    "#4A7C59",
};

const CLOUDINARY_CLOUD = "deb76rjsj";
const CLOUDINARY_PRESET = "qif08pke";

async function uploadToCloudinary(imageUrl: string): Promise<string | null> {
    try {
        const form = new FormData();
        form.append("file", imageUrl);
        form.append("upload_preset", CLOUDINARY_PRESET);
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
            { method: "POST", body: form }
        );
        if (!res.ok) return null;
        const data: any = await res.json();
        return data.secure_url ?? null;
    } catch {
        return null;
    }
}

function extractColor(title: string): string {
    const parts = title.split(" - ");
    return parts.length > 1 ? parts[parts.length - 1].trim() : "UNKNOWN";
}

function getHex(colorName: string): string {
    const upper = colorName.toUpperCase();
    for (const [key, val] of Object.entries(COLOR_HEX)) {
        if (upper.includes(key)) return val;
    }
    return "#9E9E9E";
}

async function fetchProducts(handle: string): Promise<any[]> {
    try {
        const res = await fetch(
            `${LAZARE_API}/collections/${handle}/products.json?limit=250`
        );
        if (!res.ok) return [];
        const data: any = await res.json();
        return data.products ?? [];
    } catch {
        return [];
    }
}

async function main() {
    const store = await prisma.store.findFirst();
    if (!store) {
        console.error("Nema prodavnice! Prvo kreiraj prodavnicu u admin panelu.");
        process.exit(1);
    }

    console.log(`\nSeedanje prodavnice: "${store.name}"\n`);

    // Cleanup
    console.log("Brišem postojeće podatke...");
    await prisma.orderItem.deleteMany({ where: { order: { storeId: store.id } } });
    await prisma.order.deleteMany({ where: { storeId: store.id } });
    await prisma.image.deleteMany({ where: { product: { storeId: store.id } } });
    await prisma.product.deleteMany({ where: { storeId: store.id } });
    await prisma.category.deleteMany({ where: { storeId: store.id } });
    await prisma.billboard.deleteMany({ where: { storeId: store.id } });
    await prisma.size.deleteMany({ where: { storeId: store.id } });
    await prisma.color.deleteMany({ where: { storeId: store.id } });
    console.log("Obrisano.\n");

    // Sizes
    console.log("Kreiram veličine...");
    const sizeMap: Record<string, string> = {};
    for (const s of SIZES) {
        const size = await prisma.size.create({
            data: { storeId: store.id, name: s, value: s },
        });
        sizeMap[s] = size.id;
    }

    // Fetch all products, deduplicate by Shopify product id
    console.log("\nUčitavam proizvode sa lazare.rs...");
    type Entry = { product: any; categoryName: string };
    const entries: Entry[] = [];
    const seenIds = new Set<number>();
    const colorNames = new Set<string>();

    for (const cat of CATEGORIES) {
        const catProducts: any[] = [];

        for (const handle of cat.collections) {
            const products = await fetchProducts(handle);
            for (const p of products) {
                if (seenIds.has(p.id)) continue;
                seenIds.add(p.id);
                catProducts.push(p);
                colorNames.add(extractColor(p.title));
            }
        }

        console.log(`  ${cat.name}: ${catProducts.length} proizvoda`);
        for (const p of catProducts) {
            entries.push({ product: p, categoryName: cat.name });
        }
    }

    // Colors
    console.log(`\nKreiram ${colorNames.size} boja...`);
    const colorMap: Record<string, string> = {};
    for (const name of colorNames) {
        const color = await prisma.color.create({
            data: { storeId: store.id, name, value: getHex(name) },
        });
        colorMap[name] = color.id;
    }

    // Billboards + Categories
    console.log("\nKreiram billboarde i kategorije...");
    const categoryMap: Record<string, string> = {};

    for (const cat of CATEGORIES) {
        const first = entries.find((e) => e.categoryName === cat.name);
        const rawUrl = first?.product?.images?.[0]?.src?.split("?")[0] ?? "";
        const imageUrl = rawUrl ? (await uploadToCloudinary(rawUrl) ?? "") : "";

        const billboard = await prisma.billboard.create({
            data: { storeId: store.id, label: cat.name, imageUrl },
        });
        const category = await prisma.category.create({
            data: { storeId: store.id, billboardId: billboard.id, name: cat.name },
        });
        categoryMap[cat.name] = category.id;
        console.log(`  ✓ ${cat.name}`);
    }

    // Products
    console.log(`\nKreiram ${entries.length} proizvoda...`);
    let created = 0;

    for (const { product: p, categoryName } of entries) {
        const colorName = extractColor(p.title);
        const colorId = colorMap[colorName];
        const categoryId = categoryMap[categoryName];
        if (!colorId || !categoryId) continue;

        const price = parseFloat(p.variants?.[0]?.price ?? "0");

        const rawImages = ((p.images ?? []) as any[])
            .map((img) => (img.src as string).split("?")[0])
            .filter((url) => !/(infografik|size.guide|velicina|guide|chart)/i.test(url))
            .slice(0, 3);

        const uploadedUrls = await Promise.all(
            rawImages.map((url) => uploadToCloudinary(url))
        );

        const images = uploadedUrls
            .filter((url): url is string => url !== null)
            .map((url) => ({ url }));

        // Per-size stock from Shopify variants
        const productSizes = SIZES
            .map((sizeName) => {
                const sizeId = sizeMap[sizeName];
                if (!sizeId) return null;
                const variant = (p.variants ?? []).find((v: any) => v.option1 === sizeName);
                const inStock = variant?.available ?? false;
                return { sizeId, stock: inStock ? Math.floor(Math.random() * 10) + 3 : 0 };
            })
            .filter((s): s is { sizeId: string; stock: number } => s !== null);

        await prisma.product.create({
            data: {
                storeId: store.id,
                categoryId,
                colorId,
                name: p.title,
                price,
                isFeatured: Math.random() > 0.65,
                isArchived: false,
                images: { create: images },
                sizes: { createMany: { data: productSizes } },
            },
        });

        created++;
        console.log(`  [${created}/${entries.length}] ${p.title}`);
    }

    console.log(`\nGotovo! Kreirano ${created} proizvoda u ${CATEGORIES.length} kategorija.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
