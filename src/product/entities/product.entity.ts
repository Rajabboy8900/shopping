import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Cart } from 'src/cart/entities/cart.entity';

export enum MemoryOption {
    GB_128 = '128GB',
    GB_256 = '256GB',
    GB_512 = '512GB',
    TB_1 = '1TB',
}

export enum StorageOption {
    HDD = 'HDD',
    SSD = 'SSD',
    NVME_SSD = 'NVMe SSD',
}

export enum ProductCategory {
    PHONE = 'Phone',
    LAPTOP = 'Laptop',
    TABLET = 'Tablet',
    MONITOR = 'Monitor',
    ACCESSORY = 'Accessory',
}

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
id: string; // SHU BO'LISHI KERAK



    @Column({ type: 'text' })
    image: string;

    @Column()
    productTitle: string;

    @Column()
    modelName: string;

    @Column()
    productDescription: string;

    @Column({
        type: 'enum',
        enum: ProductCategory,
    })
    productType: ProductCategory;

    @Column({ nullable: true })
    manufacturer?: string;

    @Column({ nullable: true })
    colorName?: string;

    @Column({
        type: 'enum',
        enum: MemoryOption,
        nullable: true,
    })
    ramSize?: MemoryOption;

    @Column({
        type: 'enum',
        enum: StorageOption,
        nullable: true,
    })
    storageType?: StorageOption;

    @Column({ nullable: true })
    storageSize?: string;

    @Column({ nullable: true })
    processor?: string;

    @Column({ nullable: true })
    graphicsProcessor?: string;

    @Column({ nullable: true })
    displaySize?: string;

    @Column({ nullable: true })
    batteryCapacity?: string;

    @Column({ nullable: true })
    cameraSpecs?: string;

    @Column('decimal')
    priceAmount: number;

    @Column({ type: 'text' })
    mainImageUrl: string;

    @Column({ nullable: true })
    categoryRefId?: string;

    @ManyToOne(() => Category, (cat) => cat.id, {
        eager: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'categoryRefId' })
    category?: Category;

    @OneToMany(() => Rating, (rate) => rate.product)
    ratings?: Rating[];

    @OneToMany(() => Comment, (comm) => comm.product)
    comments?: Comment[];

    @OneToMany(() => Like, (like) => like.product)
    likes?: Like[];

    @OneToMany(() => Cart, (cart) => cart.product)
    cartItems?: Cart[];

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
