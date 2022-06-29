import request from 'supertest';
import { Connection } from "typeorm";
import createConnection from '../.../../../../../database';
import { app } from '../../../../app';

let connection: Connection;

describe("Get balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get user's balance", async () => {
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

    const deposit = await request(app).post("/api/v1/statements/deposit")
      .send({
        description: "Deposit test",
        amount: 100.00,
      }).set({
        Authorization: `Bearer ${token}`
      });

    const withdraw = await request(app).post("/api/v1/statements/withdraw")
      .send({
        description: "Withdraw test",
        amount: 60.00,
      }).set({
        Authorization: `Bearer ${token}`
      });

    const balance = await request(app).get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(balance.body).toHaveProperty("statement");
    expect(balance.body).toHaveProperty("balance");
  });
});
