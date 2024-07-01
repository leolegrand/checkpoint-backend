import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CountryEntity } from "./Country.entity";


@Entity()
@ObjectType()
export class ContinentEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @OneToMany(() => CountryEntity, country => country.continent)
  @Field(() => [CountryEntity], { nullable: true })
  countries?: CountryEntity[];
}

@InputType()
export class ContinentInput {
    @Field()
    name: string;
}