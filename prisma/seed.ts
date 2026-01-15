import prisma from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("Cleared existing data...");

  const hashPassword = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.create({
    data: {
      email: "jfestus178@gmail.com",
      name: "Admin User",
      passwordHash: hashPassword,
      role: "ADMIN",
    },
  });

  console.log("Created admin user...");

  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Electronic devices and gadgets",
    },
  });

  const clothing = await prisma.category.create({
    data: { name: "Clothing", description: "Apparel and fashion items" },
  });

  const home = await prisma.category.create({
    data: {
      name: "Home & Garden",
      description: "Items for home and outdoor",
    },
  });

  console.log("Created categories...");

  //Products
  // ELECTRONICS
  await prisma.product.createMany({
    data: [
      {
        name: "MacBook Pro 2022",
        description: "High-performance laptop with M2 chip",
        sku: "ELEC-001",
        price: 1200.99,
        stock: 40,
        categoryId: electronics.id,
      },
      {
        name: "iPhone 15 Pro Max",
        description: "Flagship Apple smartphone with advanced camera system",
        sku: "ELEC-002",
        price: 1799.99,
        stock: 23,
        categoryId: electronics.id,
      },
      {
        name: "Sony WH-1000XM5 Headphones",
        description: "Noise-cancelling wireless headphones",
        sku: "ELEC-003",
        price: 399.99,
        stock: 55,
        categoryId: electronics.id,
      },
    ],
  });

  // CLOTHING
  await prisma.product.createMany({
    data: [
      {
        name: "Men's Jogger Pants",
        description: "Comfortable cotton joggers for everyday wear",
        sku: "CLOT-001",
        price: 49.99,
        stock: 120,
        categoryId: clothing.id,
      },
      {
        name: "Unisex Hoodie",
        description: "Warm fleece hoodie with minimalist design",
        sku: "CLOT-002",
        price: 69.99,
        stock: 85,
        categoryId: clothing.id,
      },
      {
        name: "Classic Denim Jacket",
        description: "Durable denim jacket with modern fit",
        sku: "CLOT-003",
        price: 89.99,
        stock: 60,
        categoryId: clothing.id,
      },
    ],
  });

  // HOME & GARDEN
  await prisma.product.createMany({
    data: [
      {
        name: "Air Fryer XL",
        description: "Large-capacity air fryer for healthy cooking",
        sku: "HOME-001",
        price: 149.99,
        stock: 30,
        categoryId: home.id,
      },
      {
        name: "Indoor Plant Pot Set",
        description: "Ceramic plant pots for indoor decoration",
        sku: "HOME-002",
        price: 39.99,
        stock: 75,
        categoryId: home.id,
      },
      {
        name: "LED Desk Lamp",
        description: "Adjustable LED lamp with brightness control",
        sku: "HOME-003",
        price: 59.99,
        stock: 50,
        categoryId: home.id,
      },
    ],
  });

  const customer1 = await prisma.customer.create({
    data: {
      email: "jfestus18@gmail.com",
      firstName: "Jeffrey",
      lastName: "Festus",
      phone: "+2348012345678",
      addresses: {
        create: [
          {
            street: "123 Main Street",
            city: "Lagos",
            state: "Lagos",
            postalCode: "100001",
            country: "Nigeria",
            isDefault: true,
          },
          {
            street: "45 Admiralty Way",
            city: "Lekki",
            state: "Lagos",
            postalCode: "105102",
            country: "Nigeria",
            isDefault: false,
          },
          {
            street: "18 Independence Avenue",
            city: "Abuja",
            state: "FCT",
            postalCode: "900001",
            country: "Nigeria",
            isDefault: false,
          },
        ],
      },
    },
    include: { addresses: true },
  });

  const customer2 = await prisma.customer.create({
    data: {
      email: "jfestus@gmail.com",
      firstName: "Frey",
      lastName: "Kwamu",
      phone: "+2348012245678",
      addresses: {
        create: [
          {
            street: "22 GRA Phase II Road",
            city: "Port Harcourt",
            state: "Rivers",
            postalCode: "500001",
            country: "Nigeria",
            isDefault: false,
          },
          {
            street: "7 Ring Road",
            city: "Ibadan",
            state: "Oyo",
            postalCode: "200001",
            country: "Nigeria",
            isDefault: false,
          },
          {
            street: "88 Okpanam Road",
            city: "Asaba",
            state: "Delta",
            postalCode: "320001",
            country: "Nigeria",
            isDefault: false,
          },

          {
            street: "14 Awolowo Road",
            city: "Ikoyi",
            state: "Lagos",
            postalCode: "101233",
            country: "Nigeria",
            isDefault: true,
          },
        ],
      },
    },
    include: { addresses: true },
  });

  const customer3 = await prisma.customer.create({
    data: {
      email: "maekrjoe@gmail.com",
      firstName: "Mark",
      lastName: "Luka",
      phone: "+2348012343678",
      addresses: {
        create: [
          {
            street: "56 Airport Road",
            city: "Benin City",
            state: "Edo",
            postalCode: "300001",
            country: "Nigeria",
            isDefault: false,
          },
          {
            street: "9 New Market Road",
            city: "Onitsha",
            state: "Anambra",
            postalCode: "434101",
            country: "Nigeria",
            isDefault: true,
          },
          {
            street: "5 Stadium Road",
            city: "Abeokuta",
            state: "Ogun",
            postalCode: "110001",
            country: "Nigeria",
            isDefault: false,
          },
          {
            street: "31 Emir Palace Road",
            city: "Kano",
            state: "Kano",
            postalCode: "700001",
            country: "Nigeria",
            isDefault: false,
          },
        ],
      },
    },
    include: { addresses: true },
  });

  const macbook = await prisma.product.findUnique({
    where: { sku: "ELEC-001" },
  });

  const iPhone = await prisma.product.findUnique({
    where: { sku: "ELEC-002" },
  });

  const sony = await prisma.product.findUnique({
    where: { sku: "ELEC-003" },
  });

  const joggers = await prisma.product.findUnique({
    where: { sku: "CLOT-001" },
  });

  const hoodie = await prisma.product.findUnique({
    where: { sku: "CLOT-002" },
  });

  const airFryer = await prisma.product.findUnique({
    where: { sku: "HOME-001" },
  });

  const potSet = await prisma.product.findUnique({
    where: { sku: "HOME-002" },
  });

  const deskLamp = await prisma.product.findUnique({
    where: { sku: "HOME-003" },
  });

  console.log("Fetched products for orders...");

  await prisma.order.create({
    data: {
      orderNumber: "ORD-2024-001",
      customerId: customer1.id,
      shippingAddressId: customer1.addresses[0].id,
      status: "DELIVERED",
      subtotal: 1200.99,
      tax: 120.1,
      shippingCost: 15.0,
      total: 1336.09,
      orderItems: {
        create: [
          {
            productId: macbook!.id,
            quantity: 1,
            unitPrice: 1200.99,
            total: 1200.99,
          },
          {
            productId: joggers!.id,
            quantity: 4,
            unitPrice: 600.0,
            total: 2400.0,
          },
        ],
      },
    },
  });

  console.log("Created orders...");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
