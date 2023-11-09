const { test_db } = require("./database");
const request = require("supertest");
const { app } = require("../src/app");

test_db();

test("can get movie", async () => {
    const response = await request(app)
        .get("/movies")
        .expect(200);

    expect(response.body).toMatchObject([
        { id: 1, name: "Five Nights at Freddy's" },
        { id: 2, name: "Sharknado" },
        { id: 3, name: "Encanto" },
    ]);
});

test("can get individual movie", async () => {
    const response = await request(app)
        .get("/movies/1")
        .expect(200);

    expect(response.body).toMatchObject({
        id: 1,
        name: "Five Nights at Freddy's",
    });

    expect(new Date(response.body.release)).toStrictEqual(new Date(2023, 10, 27));
});

test("can get showings", async () => {
    const response = await request(app)
        .get("/movies/1/showings")
        .expect(200);

    expect(response.body).toMatchObject([
        { id: 1, movie_id: 1, screen_id: 1 },
        { id: 3, movie_id: 1, screen_id: 2 },
    ]);
});

test("error if movie id is invalid", async () => {
    const r1 = await request(app)
        .get("/movies/218329")
        .expect(404);

    const r2 = await request(app)
        .get("/movies/218329/showings")
        .expect(404);

    expect(r1.body.error_code).toBe(1);
    expect(r2.body.error_code).toBe(1);
});
