import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Customer from "@modules/customers/typeorm/entities/Customer";

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //uma order pode ter um customer - um customer pode ter varias orders
  //relação muitos pra um onde MUITOS orders pra UM customer
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
