import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'deliveries',
  timestamps: true,
  paranoid: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
})
export class Delivery extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare customerName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare contact: string; // email or phone

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare origin: string; // address or coordinates

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare destination: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare lastKnownDelay: number; // in minutes

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare delivered: boolean;
}
