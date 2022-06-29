import request from 'supertest';
import { Connection } from "typeorm";
import createConnection from '../.../../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe("Show user", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    connection.dropDatabase();
    connection.close();
  });

  it("should be able to show user profile", async () => {
    await request(app).post('/api/v1/users')
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "1234"
      });

    const responseToken = await request(app).post('/api/v1/sessions')
      .send({
        email: "john@example.com",
        password: "1234"
      });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");

  });
});
