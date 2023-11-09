const { test_db } = require("./database");
const request = require("supertest");
const { app } = require("../src/app");

test_db();

test("can get all showings", async () => {
    const response = await request(app)
        .get("/showings")
        .expect(200);

    expect(response.body).toMatchObject([
        { id: 1, movie_id: 1, screen_id: 1 },
        { id: 3, movie_id: 1, screen_id: 2 },
        { id: 4, movie_id: 3, screen_id: 1 },
    ]);
});

test("can get individual showings", async () => {
    const response = await request(app)
        .get("/showings/1")
        .expect(200);

    expect(response.body).toMatchObject({
        id: 1,
        screen_id: 1,
        movie: {
            id: 1,
            name: "Five Nights at Freddy's",
        },
        available_seats: [{ id: 3 }, { id: 4 }, { id: 5 }]
    });
});

test("cannot get showing which does not exist", async () => {
    const response = await request(app)
        .get("/showings/1000")
        .expect(404);

    expect(response.body.error_code).toBe(1);
});

test("shown showing does not contain available seats", async () => {
    const response = await request(app)
        .get("/showings/2")
        .expect(200);

    expect(response.body).toMatchObject({
        id: 2,
        screen_id: 1,
        movie: {
            id: 2,
            name: "Sharknado",
        }
    });
});

test("can book a showing", async () => {
    const login_details = await request(app)
        .post("/auth/login")
        .send({
            email: "zachary@example.com",
            password: "Password123"
        })
        .expect(200);
        

    await request(app)
        .post("/showings/1/book")
        .set("Authorization", `Bearer ${login_details.body.token}`)
        .send({
            seats: [3, 4]
        })
        .expect(204);

    const response = await request(app)
        .get("/showings/1")
        .expect(200);

    expect(response.body).toMatchObject({
        id: 1,
        screen_id: 1,
        movie: {
            id: 1,
            name: "Five Nights at Freddy's",
        },
        available_seats: [{ id: 5 }]
    });
});

test("cannot book a showing in the past", async () => {
    const login_details = await request(app)
        .post("/auth/login")
        .send({
            email: "zachary@example.com",
            password: "Password123"
        })
        .expect(200);
        

    const response = await request(app)
        .post("/showings/2/book")
        .set("Authorization", `Bearer ${login_details.body.token}`)
        .send({
            seats: [1]
        })
        .expect(403);

    expect(response.body.error_code).toBe(2);
});

test("cannot book a showing if unauthenticated", async () => {
    const response = await request(app)
        .post("/showings/1/book")
        .send({
            seats: [5]
        })
        .expect(401);

    expect(response.body.error_code).toBe(0);
});

test("cannot book showing that does not exist", async () => {
    const login_details = await request(app)
        .post("/auth/login")
        .send({
            email: "zachary@example.com",
            password: "Password123"
        })
        .expect(200);
        

    const response = await request(app)
        .post("/showings/283/book")
        .set("Authorization", `Bearer ${login_details.body.token}`)
        .send({
            seats: [1]
        })
        .expect(404);

    expect(response.body.error_code).toBe(1);
});

test("cannot book seats that are already booked", async () => {
    const login_details = await request(app)
        .post("/auth/login")
        .send({
            email: "zachary@example.com",
            password: "Password123"
        })
        .expect(200);
        

    const response = await request(app)
        .post("/showings/1/book")
        .set("Authorization", `Bearer ${login_details.body.token}`)
        .send({
            seats: [1]
        })
        .expect(403);

    expect(response.body.error_code).toBe(3);
});
