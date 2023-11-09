const { test_db } = require("./database");
const request = require("supertest");
const { app } = require("../src/app");

test_db();

async function login(email) {
    if (!email) email = "zachary@example.com";

    const login_response = await request(app)
        .post("/auth/login")
        .send({
            email,
            password: "Password123"
        })
        .expect(200);

    return `Bearer ${login_response.body.token}`;
}

test("can get bookings", async () => {
    const token = await login();

    const response = await request(app)
        .get("/bookings")
        .set("Authorization", token)
        .expect(200);

    expect(response.body).toMatchObject([
        {
            id: 1,
            showing: {
                id: 1,
                movie: {
                    id: 1,
                    name: "Five Nights at Freddy's"
                },
            }
        }
    ]);
});

test("can get individual booking", async () => {
    const token = await login();

    const response = await request(app)
        .get("/bookings/1")
        .set("Authorization", token)
        .expect(200);

    expect(response.body).toMatchObject({
        id: 1,
        showing: {
            id: 1,
            screen_id: 1,
            movie: {
                id: 1,
                name: "Five Nights at Freddy's"
            },
        },
        seats: [
            { id: 1, name: "A1" },
            { id: 2, name: "A2" }
        ]
    });
});

test("cannot get booking when unauthenticated", async () => {
    const r1 = await request(app)
        .get("/bookings")
        .expect(401);

    const r2 = await request(app)
        .get("/bookings/1")
        .expect(401);

    expect(r1.body.error_code).toBe(0);
    expect(r2.body.error_code).toBe(0);
});

test("cannot get booking which doesn't exist", async () => {
    const token = await login();

    const response = await request(app)
        .get("/bookings/1000")
        .set("Authorization", token)
        .expect(404);

    expect(response.body.error_code).toBe(1);
});

test("cannot get booking which belongs to anothet user", async () => {
    const token = await login("jacob@example.com");


    const response = await request(app)
        .get("/bookings/1")
        .set("Authorization", token)
        .expect(404);

    expect(response.body.error_code).toBe(1);
});
