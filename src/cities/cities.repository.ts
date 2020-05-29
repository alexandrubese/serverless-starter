import { City } from './cities.interfaces';

export class CitiesRepository {
  public exists(id: number): boolean {
    return id > 0;
  }

  public getCity(id: number, defaultCountry: string): City {
    return {
      country: defaultCountry,
      id,
      name: 'Cluj',
      populationDensity: Math.random()
    };
  }

  public hasAccess(id: number): boolean {
    return id !== 666;   // tslint:disable-line no-magic-numbers (Demo number.)
  }
}
