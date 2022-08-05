import app from "../app";
import request from "supertest";
import { dbConfig } from "@interfaces/db.interface";
import config from "config";
import mongoose from "mongoose";
const { host, port, name }: dbConfig = config.get("dbConfig");

describe("auth", () => {
  beforeAll(() => {
    mongoose.connect(`mongodb://${host}:${port}/${name}`);
  });

  afterAll(() => {
    mongoose.disconnect();
  });

  it("should authenticate user with success", async () => {
    const response = await request(app).post("/api/users/login").send({ email: "ahmed@test.com", password: "123456" });
    expect(response.statusCode).toBe(200);
  });

  it("should authenticate user with failure", async () => {
    const response = await request(app).post("/api/users/login").send({ email: "ahme@test.com", password: "123456" });
    expect(response.statusCode).toBe(403);
  });

  it("should retreive all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.body).toBeInstanceOf(Array<any>);
  });
});
