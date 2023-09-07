import { faker } from "@faker-js/faker/locale/es_MX";

export const generateProduct = () => {
  return {
    title: faker.commerce.product(),
    price: faker.number.int({ max: 50000, min: 1500 }),
    description: faker.commerce.productDescription(),
    thumbnail: faker.image.url(),
    code: faker.string.alphanumeric(8),
    stock: faker.number.int(100),
    category: faker.commerce.department(),
    status: true,
  };
};

export const generateUser = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 5 }),
  };
};
