import { DataSource } from "typeorm";
import { CountryEntity } from "../entities/Country.entity";
import { ContinentEntity } from "../entities/Continent.entity";

export default new DataSource({
    type: 'sqlite',
    database: "database.sqlite",
    entities: [CountryEntity, ContinentEntity],
    synchronize: true,
    logging: false,
});