import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from '../role.enum';
import { Rating } from 'src/rating/entities/rating.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Cart } from 'src/cart/entities/cart.entity';

@Entity('users')
export class UserAccount {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Foydalanuvchi unikal IDsi (UUID formatida)',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchi elektron pochta manzili',
    format: 'email',
    required: true,
    uniqueItems: true,
  })
  @Column({ name: 'email', unique: true }) // Database ustun nomi 'email' deb belgilandi
  emailAddress: string; // Kodda ishlatiladigan nom

  // ... qolgan propertylar o'zgartirilmasdan qoldirildi
  @Column()
  hashedPassword: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationCode?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  codeGeneratedAt?: Date;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  accessLevel: Role;

  @OneToMany(() => Rating, (rating) => rating.user)
  givenRatings: Rating[];

  @OneToMany(() => Comment, (comment) => comment.auth)
  writtenComments: Comment[];

  @OneToMany(() => Like, (like) => like.auth)
  reactions: Like[];

  @OneToMany(() => Cart, (cart) => cart.user)
  shoppingCarts: Cart[];
}