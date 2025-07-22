import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserAccount } from 'src/auth/entities/auth.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserAccount, auth => auth, { onDelete: 'CASCADE' })
  @JoinColumn()
  auth: UserAccount;

  @ManyToOne(() => Product, product => product.likes, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: Product;
}
