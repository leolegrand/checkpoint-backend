import { Arg, Mutation, Query, Resolver } from "type-graphql";
import datasource from "../lib/datasource";
import { CountryEntity, CountryInput } from "../entities/Country.entity";

const db = datasource.getRepository(CountryEntity);

@Resolver()
export class CountryResolver {
  @Query(() => [CountryEntity])
  async getCountries() {
    return await db.find();
  }

  @Query(() => CountryEntity)
  async getCountry(@Arg('countryCode') countryCode: string) {
    return await db.findOneByOrFail({ countryCode });
  }

  @Mutation(() => CountryEntity)
  async addCountry(@Arg('infos') infos : CountryInput) {
    const newData = db.create(infos);
    return await db.save(newData);
  }
}