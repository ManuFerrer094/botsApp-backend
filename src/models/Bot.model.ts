import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

@Table({
    tableName: 'bots'
})
class Bot extends Model {
    @Column({
        type: DataType.STRING(100)  
    })
    declare name: string;

    @Column({
        type: DataType.FLOAT
    })
    declare price: number;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN
    })
    declare availability: boolean;

    @Column({
        type: DataType.STRING(255)  
    })
    declare description: string;

    @Column({
        type: DataType.STRING(50)  
    })
    declare basePersonality: string;

    @Column({
        type: DataType.STRING(50)  
    })
    declare formality: string;

    @Column({
        type: DataType.STRING(50)  
    })
    declare enthusiasm: string;

    @Column({
        type: DataType.STRING(50)  
    })
    declare humor: string;

    @Column({
        type: DataType.STRING(100)  
    })
    declare useCaseTemplate: string;
}

export default Bot;
