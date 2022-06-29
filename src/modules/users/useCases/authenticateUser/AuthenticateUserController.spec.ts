import request from 'supertest';
import { Connection } from "typeorm";
import createConnection from '../.../../../../../database';
import { app } from '../../../../app';


let connection: Connection;

describe("Authenticate user", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });


  it("should be able to authenticate user", async () => {
    await request(app).post('/api/v1/users')
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "1234"
      });


    const response = await request(app).post('/api/v1/sessions')
      .send({
        email: "john@example.com",
        password: "1234"
      });

    expect(response.body.user.name).toEqual("John Doe");
    expect(response.body).toHaveProperty("token");
  });
});
