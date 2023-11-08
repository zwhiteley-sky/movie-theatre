const { test_db } = require("./database");
const request = require("supertest");
const { app } = require("../src/app");

test_db();

test("can log into user", async () => {
    const response = await request(app)
        .post("/auth/login")
        .send({
            email: "zachary@example.com",
            password: "Password123"
        });

    expect(response.body).toMatchObject({
        id: "739c016b-b413-4f47-90d2-639a1c095989",
        name: "zachary",
        email: "zachary@example.com",
    });
});

test("cannot log into user with incorrect email", async () => {
    const response = await request(app)
        .post("/auth/login")
        .send({
            email: "jordan@example.com",
            password: "Password123"
        });

    expect(response.body.error_code).toBe(0);
});

test("can register new user", async () => {
    const response = await request(app)
        .post("/auth/register")
        .send({
            name: "jordan",
            email: "jordan@example.com",
            password: "Hello123"
        });

    expect(response.body).toMatchObject({
        name: "jordan",
        email: "jordan@example.com"
    });

    await request(app)
        .post("/auth/login")
        .send({
            email: "jordan@example.com",
            password: "Hello123"
        })
        .expect(200);
});

test("cannot register user with the same email", async () => {
    const response = await request(app)
        .post("/auth/register")
        .send({
            name: "zach",
            email: "zachary@example.com",
            password: "CheeseCake15"
        })
        .expect(401);

    expect(response.body.error_code).toBe(1);
});

test("cannot register user with the same name", async () => {
    const response = await request(app)
        .post("/auth/register")
        .send({
            name: "zachary",
            email: "zw@example.com",
            password: "CheeseCake15"
        })
        .expect(401);

    expect(response.body.error_code).toBe(2);
});

test("cannot register user with invalid email", async () => {
    const response = await request(app)
        .post("/auth/register")
        .send({
            name: "zach",
            email: "invalid-email",
            password: "CheeseCake15"
        })
        .expect(400);

    expect(response.body.error[0].path).toBe("email");
});

test("cannot register user with too short password", async () => {
    const response = await request(app)
        .post("/auth/register")
        .send({
            name: "zach",
            email: "zach@example.com",
            password: "Ca12"
        })
        .expect(400);

    expect(response.body.error[0].path).toBe("password");
});

test("cannot register user with too weak password", async () => {
    const response = await request(app)
        .post("/auth/register")
        .send({
            name: "zach",
            email: "zach@example.com",
            password: "passwordpassword"
        })
        .expect(400);

    expect(response.body.error[0].path).toBe("password");
});
