import { faker, allFakers } from "@faker-js/faker";

// Get locale-specific faker instance
const getFaker = (locale = "en") => {
  try {
    // allFakers has locale-specific instances like allFakers.de, allFakers.fr, etc.
    const key = locale.replace("-", "_"); // normalize e.g. zh_CN
    if (allFakers[key]) return allFakers[key];
    return faker; // fallback to default (en)
  } catch {
    return faker;
  }
};

// ---------- Generators ----------

export const generateUsers = (count = 10, locale = "en") => {
  const f = getFaker(locale);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    firstName: f.person.firstName(),
    lastName: f.person.lastName(),
    email: f.internet.email(),
    phone: f.phone.number(),
    username: f.internet.username(),
    avatar: f.image.avatar(),
    birthDate: f.date.birthdate({ min: 18, max: 65, mode: "age" }).toISOString().split("T")[0],
    gender: f.person.sex(),
    jobTitle: f.person.jobTitle(),
  }));
};

export const generateAddresses = (count = 10, locale = "en") => {
  const f = getFaker(locale);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    street: f.location.streetAddress(),
    city: f.location.city(),
    state: f.location.state(),
    zipCode: f.location.zipCode(),
    country: f.location.country(),
    latitude: f.location.latitude(),
    longitude: f.location.longitude(),
  }));
};

export const generateCompanies = (count = 10, locale = "en") => {
  const f = getFaker(locale);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: f.company.name(),
    catchPhrase: f.company.catchPhrase(),
    industry: f.company.buzzNoun(),
    email: f.internet.email(),
    phone: f.phone.number(),
    website: f.internet.url(),
    address: f.location.streetAddress(),
    city: f.location.city(),
    country: f.location.country(),
    employees: f.number.int({ min: 5, max: 10000 }),
    founded: f.date.past({ years: 50 }).getFullYear(),
  }));
};

export const generateProducts = (count = 10, locale = "en") => {
  const f = getFaker(locale);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: f.commerce.productName(),
    description: f.commerce.productDescription(),
    category: f.commerce.department(),
    price: parseFloat(f.commerce.price({ min: 1, max: 999 })),
    sku: f.string.alphanumeric(8).toUpperCase(),
    stock: f.number.int({ min: 0, max: 500 }),
    brand: f.company.name(),
    rating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
    color: f.color.human(),
  }));
};

export const generateOrders = (count = 10, locale = "en") => {
  const f = getFaker(locale);
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    orderId: f.string.alphanumeric(10).toUpperCase(),
    customer: `${f.person.firstName()} ${f.person.lastName()}`,
    email: f.internet.email(),
    product: f.commerce.productName(),
    quantity: f.number.int({ min: 1, max: 20 }),
    price: parseFloat(f.commerce.price({ min: 5, max: 500 })),
    total: parseFloat(f.commerce.price({ min: 10, max: 5000 })),
    status: statuses[f.number.int({ min: 0, max: 4 })],
    date: f.date.recent({ days: 90 }).toISOString().split("T")[0],
    shippingAddress: f.location.streetAddress(),
    city: f.location.city(),
    country: f.location.country(),
  }));
};
