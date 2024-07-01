import { ContinentEntity } from "./entities/Continent.entity";
import { CountryEntity } from "./entities/Country.entity";
import datasource from "./lib/datasource";
import { ContinentResolver } from "./resolvers/Continent.resolver";


const continentData = [
  { name: "North America", countries: [
      { name: "United States", countryCode: "US", emoji: "🇺🇸" },
      { name: "Canada", countryCode: "CA", emoji: "🇨🇦" },
    ]
  },
  { name: "Europe", countries: [
      { name: "United Kingdom", countryCode: "GB", emoji: "🇬🇧" },
      { name: "Germany", countryCode: "DE", emoji: "🇩🇪" },
      { name: "France", countryCode: "FR", emoji: "🇫🇷" },
      { name: "Italy", countryCode: "IT", emoji: "🇮🇹" },
      { name: "Spain", countryCode: "ES", emoji: "🇪🇸" },
    ]
  },
  { name: "Asia", countries: [
      { name: "Japan", countryCode: "JP", emoji: "🇯🇵" },
    ]
  },
  { name: "Oceania", countries: [
      { name: "Australia", countryCode: "AU", emoji: "🇦🇺" },
    ]
  },
  { name: "South America", countries: [
      { name: "Brazil", countryCode: "BR", emoji: "🇧🇷" },
    ]
  },
];

async function seedDatabase() {
  await datasource.initialize();
  const dbCountry = datasource.getRepository(CountryEntity);
  const dbContinent = datasource.getRepository(ContinentEntity);

  const continentResolver = new ContinentResolver(); // Instantiate your resolver

  // Clear existing data
  await dbCountry.clear();
  await dbContinent.clear();

  // Seed continents and countries
  for (const continentInfo of continentData) {
    const { name, countries } = continentInfo;

    // Create continent entity and save
    const continent = dbContinent.create({ name });
    await dbContinent.save(continent);

    // Iterate over countries and add them to the continent using resolver method
    for (const countryInfo of countries) {
      const { name, countryCode, emoji } = countryInfo;

      // Create country entity (not saved directly here)
      const country = dbCountry.create({
        name,
        countryCode,
        emoji,
        continent: continent, // Assign continent directly
      });

      // Save country entity
      await dbCountry.save(country);

      // Call resolver method to associate country with continent
      await continentResolver.addCountryToContinentByIds(continent.id, country.id);
    }
  }

  console.log("Database cleared && seeded successfully!");
}

seedDatabase();