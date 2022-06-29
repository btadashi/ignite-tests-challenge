import request from 'supertest';
import { Connection } from "typeorm";
import createConnection from '../.../../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe("Get statement by operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to find a statement by operation", async () => {
    const user = await request(app).post('/api/v1/users')
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

    const deposit = await request(app).post("/api/v1/statements/deposit")
      .send({
        description: "Deposit test",
        amount: 100.00,
      }).set({
        Authorization: `Bearer ${token}`
      });

    const { id } = deposit.body;


    const response = await request(app).get(`/api/v1/statements/${id}`)
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.status).toBe(200);
    expect(response.body.type).toEqual("deposit");
  });
});
