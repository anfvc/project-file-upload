import mongoose from "mongoose";
import User from "./Model/User.js";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";

//* IIFE - immediately invoked function expression
(async function () {
  //* CONNECT TO DB
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("Database is connected! 🐱");
  } catch (error) {
    console.log(error.message);
    console.log("Database connection failed... :(");
  }

  //* DELETE ALL EXISTING USERS
  try {
    await User.deleteMany({});
    console.log("all the users are gone");
  } catch (error) {
    console.log(error);
  }

  
  //* CREATE 20 RANDOM USERS
  let userArr = [];
  const password = "Dci1234!";
  const hashedPassword = await hash(password, 10);

  try {
    for (let i = 0; i < 20; i++) {
      const data = {
        email: faker.internet.email(),
        password: hashedPassword
      };
      const users = new User(data);
      userArr.push(users);
    }
    await User.insertMany(userArr);
    console.log(`${userArr.length} users are added to database`);
  } catch (error) {
    console.log(error);
  }

  //* SHUT DOWN THE CONNECTION TO DB
  mongoose.connection.close();
})();
