import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { UserAccount } from 'src/auth/entities/auth.entity';

@Entity({ name: 'ratings' })
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 5 })
  score: number;

  @ManyToOne(() => Product, (product) => product.ratings, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => UserAccount, (user) => user.givenRatings, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserAccount;

  @CreateDateColumn({ name: 'rated_at' })
  ratedAt: Date;
}
