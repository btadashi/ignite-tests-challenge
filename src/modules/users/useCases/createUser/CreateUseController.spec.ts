import request from 'supertest';
import { Connection } from 'typeorm';
import createConnection from '../.../../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe("Create user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post('/api/v1/users')
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "1234"
      });

    expect(response.status).toBe(201);
  });
});
