import { Request, Response } from 'express'
import Bot from '../models/Bot.model'

export const getBots = async (req: Request, res: Response) => {
    const bots = await Bot.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
    res.json({data: bots})
}

export const getBotById = async (req: Request, res: Response) => {
    const { id } = req.params
    const bot = await Bot.findByPk(id)
    if(!bot) {
        return res.status(404).json({
            error: 'Bot No Encontrado'
        })
    }
    res.json({data: bot})
}

export const createBot = async (req : Request, res : Response) => {
    const bot = await Bot.create(req.body)
    res.status(201).json({data: bot})
}

export const updateBot = async (req: Request, res: Response) => {
    const { id } = req.params
    const bot = await Bot.findByPk(id)

    if(!bot) {
        return res.status(404).json({
            error: 'Bot No Encontrado'
        })
    }
    
    // Actualizar
    await bot.update(req.body)
    await bot.save()
    res.json({data: bot})
}

export const updateAvailability = async (req: Request, res: Response) => {
    const { id } = req.params
    const bot = await Bot.findByPk(id)

    if(!bot) {
        return res.status(404).json({
            error: 'Bot No Encontrado'
        })
    }
    
    bot.availability = !bot.dataValues.availability
    await bot.save()
    res.json({data: bot})
}

export const deleteBot = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await Bot.findByPk(id)

    if(!product) {
        return res.status(404).json({
            error: 'Bot No Encontrado'
        })
    }
    
    await product.destroy()
    res.json({data: 'Bot Eliminado'})
}