const axios = require("axios");
const { User, Pet, Product } = require("./database");

// API-uri externe
const CAT_API = "https://api.thecatapi.com/v1/breeds";
const DOG_API = "https://dog.ceo/api/breeds/list/all";
// Fake Store API pentru produse, filtrăm doar pentru animale
const STORE_API = "https://fakestoreapi.com/products";

async function seedUsers() {
  const sampleUsers = [
    { name: "Ana", email: "ana@example.com", password: "123456", type: "admin" },
    { name: "Mihai", email: "mihai@example.com", password: "123456" },
    { name: "Ioana", email: "ioana@example.com", password: "123456" },
    { name: "Andrei", email: "andrei@example.com", password: "123456" },
    { name: "Maria", email: "maria@example.com", password: "123456" }
  ];

  for (const user of sampleUsers) {
    await User.findOrCreate({
      where: { email: user.email },
      defaults: user
    });
  }

  console.log(" Users ready");
}

async function seedPets() {
  try {
    // Ștergem datele vechi
    await Pet.destroy({ truncate: true, restartIdentity: true });

    // Pisici (preluate din API)
    const cats = (await axios.get(CAT_API)).data.slice(0, 5);

    // Câini (preluate din API)
    const dogsResponse = await axios.get(DOG_API);
    const dogs = Object.keys(dogsResponse.data.message).slice(0, 5);

    // Inserăm pisicile
    for (let c of cats) {
      await Pet.create({
        name: c.name,
        type: "Cat",
        age: Math.floor(Math.random() * 10) + 1,
        userId: 1
      });
    }

    // Inserăm câinii
    for (let d of dogs) {
      await Pet.create({
        name: d,
        type: "Dog",
        age: Math.floor(Math.random() * 10) + 1,
        userId: 2
      });
    }

    // Hamsteri - adăugăm manual
    const hamsters = ["Hammy", "Nibbles", "Fuzzy"];
    for (let h of hamsters) {
      await Pet.create({
        name: h,
        type: "Hamster",
        age: Math.floor(Math.random() * 3) + 1,
        userId: 3
      });
    }

    // Păsări - adăugăm manual
    const birds = ["Tweety", "Polly", "Sky"];
    for (let b of birds) {
      await Pet.create({
        name: b,
        type: "Bird",
        age: Math.floor(Math.random() * 5) + 1,
        userId: 4
      });
    }

    console.log(" Pets inserted (Cats, Dogs, Hamsters, Birds)");
  } catch (err) {
    console.error("Eroare la seed Pets:", err.message);
  }
}


async function seedProducts() {
  try {
    await Product.destroy({ truncate: true, restartIdentity: true });

    // Array manual cu 20 de produse pentru animale
    const products = [
      { name: "Dog Food Premium", description: "High quality dog food for all breeds", price: 50, stock: 20, targetAnimal: "Dog" },
      { name: "Cat Food Premium", description: "High quality cat food for kittens and adults", price: 45, stock: 15, targetAnimal: "Cat" },
      { name: "Bird Seed Mix", description: "Nutritious seed mix for all pet birds", price: 20, stock: 25, targetAnimal: "Bird" },
      { name: "Dog Chew Toy", description: "Durable chew toy for dogs", price: 15, stock: 30, targetAnimal: "Dog" },
      { name: "Cat Scratching Post", description: "Keep your cat happy and healthy", price: 35, stock: 10, targetAnimal: "Cat" },
      { name: "Dog Leash Leather", description: "Strong leather leash for daily walks", price: 25, stock: 20, targetAnimal: "Dog" },
      { name: "Cat Collar with Bell", description: "Adjustable cat collar with safety bell", price: 10, stock: 50, targetAnimal: "Cat" },
      { name: "Rabbit Hay", description: "Fresh hay for rabbits and small animals", price: 12, stock: 40, targetAnimal: "Rabbit" },
      { name: "Dog Shampoo", description: "Gentle shampoo for all dog breeds", price: 18, stock: 15, targetAnimal: "Dog" },
      { name: "Catnip Toy", description: "Fun toy infused with catnip", price: 8, stock: 60, targetAnimal: "Cat" },
      { name: "Aquarium Fish Food", description: "Nutritious food for freshwater fish", price: 12, stock: 35, targetAnimal: "Fish" },
      { name: "Dog Bed", description: "Comfortable bed for medium and large dogs", price: 60, stock: 10, targetAnimal: "Dog" },
      { name: "Cat Tunnel", description: "Interactive tunnel for cats to play", price: 20, stock: 25, targetAnimal: "Cat" },
      { name: "Bird Cage Small", description: "Cage suitable for small birds", price: 50, stock: 5, targetAnimal: "Bird" },
      { name: "Hamster Wheel", description: "Fun exercise wheel for hamsters", price: 15, stock: 30, targetAnimal: "Hamster" },
      { name: "Dog Treats Mix", description: "Healthy treats for training and rewards", price: 12, stock: 40, targetAnimal: "Dog" },
      { name: "Cat Litter", description: "Clumping cat litter for easy cleaning", price: 18, stock: 25, targetAnimal: "Cat" },
      { name: "Dog Jacket", description: "Waterproof jacket for dogs", price: 35, stock: 15, targetAnimal: "Dog" },
      { name: "Pet Grooming Kit", description: "Complete grooming kit for small pets", price: 40, stock: 20, targetAnimal: "SmallPet" },
      { name: "Bird Perches Set", description: "Set of natural wood perches for birds", price: 22, stock: 15, targetAnimal: "Bird" }
    ];

    // Inserăm produsele în DB
    for (let p of products) {
      await Product.create(p);
    }

    console.log(" 20 Products for Pets inserted successfully");

  } catch (err) {
    console.error("Eroare la seed produse:", err.message);
  }
}



async function runSeed() {
  try {
    await seedUsers();
    await seedPets();
    await seedProducts();
    console.log(" Seed complet din API-uri reale");
  } catch (err) {
    console.error("Eroare la seed:", err.message);
  }
}

module.exports = runSeed;
