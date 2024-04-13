import request from 'supertest';
import server from '../../server';

describe('POST /api/bots', () => {
    it('debería mostrar errores de validación', async () => {
        const response = await request(server).post('/api/bots').send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(4);
    });

    it('debería validar que el precio sea mayor que 0', async () => {
        const response = await request(server).post('/api/bots').send({
            name: 'GPT 8',
            price: 0
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
    });

    it('debería validar que el precio sea un número y mayor que 0', async () => {
        const response = await request(server).post('/api/bots').send({
            name: 'GPT 8',
            price: 'Hola'
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(2);
    });

    it('debería crear un nuevo bot', async () => {
        const response = await request(server).post('/api/bots').send({
            name: "Mouse - Testing",
            price: 50
        });
        expect(response.status).toEqual(201);
        expect(response.body).toHaveProperty('data');
    });
});

describe('GET /api/bots', () => {
    it('debería verificar si la URL api/bots existe', async () => {
        const response = await request(server).get('/api/bots');
        expect(response.status).not.toBe(404);
    });

    it('debería obtener una respuesta JSON con bots', async () => {
        const response = await request(server).get('/api/bots');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('data');
        expect(response.body).not.toHaveProperty('errors');
    });
});

describe('GET /api/bots/:id', () => {
    it('debería retornar un 404 para un bot que no existe', async () => {
        const botId = 2000;
        const response = await request(server).get(`/api/bots/${botId}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Bot No Encontrado');
    });

    it('debería verificar un ID válido en la URL', async () => {
        const response = await request(server).get('/api/bots/not-valid-url');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('ID no válido');
    });

    it('debería obtener una respuesta JSON para un solo bot', async () => {
        const response = await request(server).get('/api/bots/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
});

describe('PUT /api/bots/:id', () => {
    it('debería verificar un ID válido en la URL', async () => {
        const response = await request(server).put('/api/bots/not-valid-url').send({
            name: "GPT 8",
            availability: true,
            price: 300,
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('ID no válido');
    });

    it('debería mostrar mensajes de error de validación al actualizar un bot', async () => {
        const response = await request(server).put('/api/bots/1').send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(5);
    });

    it('debería validar que el precio sea mayor que 0 al actualizar un bot', async () => {
        const response = await request(server).put('/api/bots/1').send({
            name: "GPT 8",
            availability: true,
            price: 0
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('Precio no válido');
    });

    it('debería retornar un 404 para un bot que no existe al actualizar', async () => {
        const botId = 2000;
        const response = await request(server).put(`/api/bots/${botId}`).send({
            name: "GPT 8",
            availability: true,
            price: 300
        });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Bot No Encontrado');
    });

    it('debería actualizar un bot existente con datos válidos', async () => {
        const response = await request(server).put(`/api/bots/1`).send({
            name: "GPT 8",
            availability: true,
            price: 300
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
});

describe('PATCH /api/bots/:id', () => {
    it('debería retornar un 404 para un bot que no existe', async () => {
        const botId = 2000;
        const response = await request(server).patch(`/api/bots/${botId}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Bot No Encontrado');
    });

    it('debería actualizar la disponibilidad del bot', async () => {
        const response = await request(server).patch('/api/bots/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.availability).toBe(false);
    });
});

describe('DELETE /api/bots/:id', () => {
    it('debería verificar un ID válido', async () => {
        const response = await request(server).delete('/api/bots/not-valid');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0].msg).toBe('ID no válido');
    });

    it('debería retornar un 404 para un bot que no existe', async () => {
        const botId = 2000;
        const response = await request(server).delete(`/api/bots/${botId}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Bot No Encontrado');
    });

    it('debería eliminar un bot', async () => {
        const response = await request(server).delete('/api/bots/1');
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("Bot Eliminado");
    });
});
