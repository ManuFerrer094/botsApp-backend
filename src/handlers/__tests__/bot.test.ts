import request from 'supertest'
import server from '../../server'

describe('POST /api/bots', () => {
    it('should display validation errors', async () => {
        const response = await request(server).post('/api/bots').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/bots').send({
            name: 'GPT 8',
            price: 0
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/bots').send({
            name: 'GPT 8',
            price: "Hola"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })

    it('should create a new bot', async () => {
        const response = await request(server).post('/api/bots').send({
            name : "Mouse - Testing",
            price: 50
        })
    
        expect(response.status).toEqual(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/bots', () => {
    it('should check if api/bots url exists', async () => {
        const response = await request(server).get('/api/bots')
        expect(response.status).not.toBe(404)
    })
    it('GET a JSON response with bots', async () => {
        const response = await request(server).get('/api/bots')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/bots/:id', () => {
    it('Should return a 404 response for a non-existent bot', async () => {
        const botId = 2000
        const response = await request(server).get(`/api/bots/${botId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Bot No Encontrado')
    })

    it('should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/bots/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it('get a JSON response for a single bot', async () => {
        const response = await request(server).get('/api/bots/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/bots/:id', () => {

    it('should check a valid ID in the URL', async () => {
        const response = await request(server)
                            .put('/api/bots/not-valid-url')
                            .send({
                                name: "GPT 8",
                                availability: true,
                                price : 300,
                            })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it('should display validation error messages when updating a bot', async() => {
        const response = await request(server).put('/api/bots/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    }) 

    it('should validate that the price is greater than 0', async() => {
        const response = await request(server)
                                .put('/api/bots/1')
                                .send({
                                    name: "GPT 8",
                                    availability: true,
                                    price : 0
                                })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Precio no válido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    }) 

    it('should return a 404 response for a non-existent bot', async() => {
        const botId = 2000
        const response = await request(server)
                                .put(`/api/bots/${botId}`)
                                .send({
                                    name: "GPT 8",
                                    availability: true,
                                    price : 300
                                })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Bot No Encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    }) 

    it('should update an existing bot with valid data', async() => {
        const response = await request(server)
                                .put(`/api/bots/1`)
                                .send({
                                    name: "GPT 8",
                                    availability: true,
                                    price : 300
                                })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    }) 
    

})

describe('PATCH /api/bots/:id', () => {
    it('should return a 404 response for a non-existing bot', async () => {
        const botId = 2000
        const response = await request(server).patch(`/api/bots/${botId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Bot No Encontrado')
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update the bot availability', async () => {
        const response = await request(server).patch('/api/bots/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/bots/:id', () => {
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/bots/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it('should return a 404 response for a non-existent bot', async () => {
        const botId = 2000
        const response = await request(server).delete(`/api/bots/${botId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Bot No Encontrado')
        expect(response.status).not.toBe(200)
    })

    it('should delete a bot', async () => {
        const response = await request(server).delete('/api/bots/1')
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("Bot Eliminado")

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})
