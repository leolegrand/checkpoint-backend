import { Arg, Mutation, Query, Resolver } from "type-graphql";
import datasource from "../lib/datasource";
import { ContinentEntity, ContinentInput } from "../entities/Continent.entity";
import { CountryEntity, CountryInput } from "../entities/Country.entity";
const dbContinent = datasource.getRepository(ContinentEntity);
const dbCountry = datasource.getRepository(CountryEntity);

@Resolver()
export class ContinentResolver {
  @Query(() => [ContinentEntity])
  async getContinents() {
    return await dbContinent.find();
  }

  @Query(() => [CountryEntity])
  async getCountriesByContinent(@Arg('continentId') continentId: number) {
    const continent = await dbContinent.findOneByOrFail({id: continentId});
    if (!continent) {
      throw new Error(`Continent with ID ${continentId} not found.`);
    }
    return continent.countries;
  }

  @Mutation(() => ContinentEntity)
  async addContinent(@Arg('input') input: ContinentInput) {
    const newContinent = dbContinent.create(input);
    return await dbContinent.save(newContinent);
  }

  @Mutation(() => ContinentEntity)
  async addCountryToContinentByIds(
    @Arg('continentId', () => Number) continentId: number,
    @Arg('countryId', () => Number) countryId: number
  ) {
    const continent = await dbContinent.findOne({ where: { id: continentId } });
    if (!continent) {
      throw new Error(`Continent with ID ${continentId} not found.`);
    }

    const country = await dbCountry.findOne({ where: { id: countryId } });
    if (!country) {
      throw new Error(`Country with ID ${countryId} not found.`);
    }

    country.continent = continent;
    await dbCountry.save(country);

    return await dbContinent.findOne({ where: { id: continentId }, relations: ['countries'] });
  }
}