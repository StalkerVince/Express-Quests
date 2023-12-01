const request = require("supertest");
const crypto = require("node:crypto");

const app = require("../src/app");

const database = require("../database");

afterAll(() => database.end());

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Deez",
      lastname: "Nuts",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Ligma",
      language: "Murican",
    };

    const response = await request(app).post("/api/users").send(newUser);
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );

    const [userInDatabase] = result;
    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(newUser.firstname);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Joe" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);
    expect(response.status).toEqual(500);
  });
});

describe("PUT /api/users/:id", () => {
  it("should edit users", async () => {
    const newUser = {
      firstname: "Sugondese",
      lastname: "Nuts",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Ligma",
      language: "Murican",
    };

    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",

      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = result.insertId;

    const updatedUser = {
      firstname: "Ligma",
      lastname: "Bawls",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Ligma",
      language: "Murican",
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    expect(response.status).toEqual(204);

    const [users] = await database.query("SELECT * FROM users WHERE id=?", id);

    const [userInDatabase] = users;
    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("title");
    expect(userInDatabase.firstname).toStrictEqual(updatedUser.firstname);
    expect(userInDatabase).toHaveProperty("director");
    expect(userInDatabase.lastname).toStrictEqual(updatedUser.lastname);
    expect(userInDatabase).toHaveProperty("year");
    expect(userInDatabase.email).toStrictEqual(updatedUser.email);
    expect(userInDatabase).toHaveProperty("color");
    expect(userInDatabase.city).toStrictEqual(updatedUser.city);
    expect(userInDatabase).toHaveProperty("duration");
    expect(userInDatabase.language).toStrictEqual(updatedUser.language);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { title: "Sigma" };
    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);
    expect(response.status).toEqual(500);
  });

  it("should return no users", async () => {
    const newUser = {
      firstname: "Jeff",
      lastname: "Mahnamehis",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Ligma",
      language: "Murican",
    };
    const response = await request(app).put("/api/users/0").send(newUser);
    expect(response.status).toEqual(404);
  });
});
