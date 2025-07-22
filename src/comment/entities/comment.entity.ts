import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Product } from 'src/product/entities/product.entity';
  import { UserAccount } from 'src/auth/entities/auth.entity';
  
  @Entity({ name: 'comments' })
  export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'text' })
    text: string;
  
    @ManyToOne(() => Product, (product) => product.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;
  
    @ManyToOne(() => UserAccount, (user) => user.writtenComments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    auth: UserAccount;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  