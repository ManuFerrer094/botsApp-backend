import { Router } from 'express'
import { body, param } from 'express-validator'
import { createBot, deleteBot, getBotById, getBots, updateAvailability, updateBot } from './handlers/bots'
import { handleInputErrors } from './middleware'

const router = Router()

/**
 * @swagger
 * components:
 *      schemas:
 *          Bot:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The Bot ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The Bot name
 *                      example: GPT 8
 *                  price:
 *                      type: number
 *                      description: The Bot price
 *                      example: 300
 *                  availability:
 *                      type: boolean
 *                      description: The Bot availability
 *                      example: true
 */

/**
 * @swagger
 * /api/bots:
 *      get:
 *          summary: Get a list of bots
 *          tags:
 *              - Bots
 *          description: Return a list of bots
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Bot'
 *      
 */
router.get('/', getBots)

/**
 * @swagger
 * /api/bots/{id}:
 *  get:
 *      summary: Get a bot by ID
 *      tags:
 *          - Bots
 *      description: Return a bot based on its unique ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the bot to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Bot'
 *          404:
 *              description: Not found
 *          400:
 *              description: Bad Request - Invalid ID
 */
router.get('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    getBotById
)

/**
 * @swagger
 * /api/bots:
 *  post:
 *      summary: Creates a new bot
 *      tags:
 *          - Bots
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "GPT 8"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Bot'
 *          400:
 *              description: Bad Request - invalid input data
 * 
 */
router.post('/', 
    // Validación
    body('name')
        .notEmpty().withMessage('El nombre de Bot no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio de Bot no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'),
    handleInputErrors,
    createBot
)

/**
 * @swagger
 * /api/bots/{id}:  
 *  put:
 *      summary: Updates a bot with user input
 *      tags:
 *          - Bots
 *      description: Returns the updated bot
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the bot to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "GPT 8"
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Bot'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Bot Not Found
 */

router.put('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre de Bot no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio de Bot no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'),
    body('availability')
        .isBoolean().withMessage('Valor para disponibilidad no válido'),
    handleInputErrors,
    updateBot
)

/**
 * @swagger
 * /api/bots/{id}:
 *  patch:
 *      summary: Update Bot availability
 *      tags: 
 *          - Bots
 *      description: Returns the updated availability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the bot to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Bot'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Bot Not Found
 */

router.patch('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    updateAvailability
)


/**
 * @swagger
 * /api/bots/{id}:
 *  delete:
 *      summary: Deletes a bot by a given ID
 *      tags: 
 *          - Bots
 *      description: Returns a confirmation message
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the bot to delete
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Bot Eliminado'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Bot Not Found
 */

router.delete('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deleteBot
)

export default router