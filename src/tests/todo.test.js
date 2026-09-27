require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/user.model'); // Meng-import model User

let mongoServer;
let app;
let token;
const apiKey = process.env.API_KEY || 'my-secret-api-key-12345';

jest.setTimeout(120000);

beforeAll(async () => {
  // 1. Jalankan MongoDB di memori
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // 2. Konek Mongoose ke database memori
  await mongoose.connect(mongoUri);

  // 3. Import app setelah DB siap
  app = require('../../app');

  // 4. Register user dummy ke database memori agar bisa login
  await request(app)
    .post('/api/auth/register')
    .set('x-api-key', apiKey)
    .send({
      name: 'Siswa Test',
      email: 'siswa@gmail.com',
      password: 'password123'
    });

  // 5. Login untuk mengambil token JWT
  const res = await request(app)
    .post('/api/auth/login')
    .set('x-api-key', apiKey)
    .send({
      email: 'siswa@gmail.com',
      password: 'password123'
    });

  if (res.body && res.body.data && res.body.data.token) {
    token = res.body.data.token;
  } else if (res.body && res.body.token) {
    token = res.body.token;
  }
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Todo API Integration Tests', () => {
  // Test 1: Proteksi API Key
  it('harus menolak request jika tidak ada API Key', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toEqual(401);
  });

  // Test 2: GET /api/todos
  it('harus mengembalikan daftar todo beserta pagination', async () => {
    const res = await request(app)
      .get('/api/todos?page=1&limit=5')
      .set('x-api-key', apiKey)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('pagination');
  });

  // Test 3: POST /api/todos
  it('harus menolak pembuatan todo jika judul kosong', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('x-api-key', apiKey)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toEqual(400);
  });
});