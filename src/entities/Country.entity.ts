import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContinentEntity } from "./Continent.entity";

@ObjectType()
@Entity()
export class CountryEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column({ unique: true })
  countryCode: string;

  @Field()
  @Column({ unique: true })
  emoji: string;

  @ManyToOne(() => ContinentEntity, continent => continent.countries, { nullable: false })
  @Field(() => ContinentEntity)
  continent: ContinentEntity;
}

@InputType()
export class CountryInput {
  @Field()
  name: string;

  @Field()
  countryCode: string;

  @Field()
  emoji: string;

  @Field(() => ID)
  continentId: number;
}


