import { expect } from 'chai';
import { Chance } from 'chance';
import { instance, mock, reset, when } from 'ts-mockito';

import { ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { City, GetCityResult } from './cities.interfaces';
import { CitiesRepository } from './cities.repository';
import { CitiesService } from './cities.service';

// tslint:disable no-unsafe-any (Generates false alarm with ts-mockito functions.)

const chance: Chance.Chance = new Chance();

// tslint:disable-next-line:typedef
describe('CitiesService', () => {
  const citiesRepositoryMock: CitiesRepository = mock(CitiesRepository);
  const citiesRepositoryMockInstance: CitiesRepository = instance(citiesRepositoryMock);
  let service: CitiesService;
  let testCity: City;

  // tslint:disable-next-line:typedef
  beforeEach(() => {
    reset(citiesRepositoryMock);
    service = new CitiesService(citiesRepositoryMockInstance, process.env);
    testCity = {
      country: chance.country(),
      id: chance.natural(),
      name: chance.city(),
      populationDensity: chance.natural()
    };
  });

  // tslint:disable-next-line:typedef
  describe('getCity function', () => {
    // tslint:disable-next-line:typedef
    it('should resolve with the input id', async () => {
      process.env.DEFAULT_COUNTRY = testCity.country;
      when(citiesRepositoryMock.exists(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.getCity(testCity.id, testCity.country)).thenReturn(testCity);

      const result: GetCityResult = await service.getCity(testCity.id);
      expect(result.city.id).to.equal(testCity.id);
    });

    // tslint:disable-next-line:typedef
    it('should resolve with the default country from the environment variable', async () => {
      process.env.DEFAULT_COUNTRY = testCity.country;
      when(citiesRepositoryMock.exists(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.getCity(testCity.id, testCity.country)).thenReturn(testCity);

      const result: GetCityResult = await service.getCity(testCity.id);
      expect(result.city.country).to.equal(testCity.country);
    });

    // tslint:disable-next-line:typedef
    it('should resolve with the hard coded default country', async () => {
      const aTestCity: City = testCity;
      aTestCity.country = 'Romania';

      process.env.DEFAULT_COUNTRY = '';

      when(citiesRepositoryMock.exists(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(testCity.id)).thenReturn(true);
      when(citiesRepositoryMock.getCity(testCity.id, testCity.country)).thenReturn(aTestCity);

      const result: GetCityResult = await service.getCity(testCity.id);
      expect(result.city.country).to.equal(aTestCity.country);
    });

    // tslint:disable-next-line:typedef
    it('should reject for non-existing ID', () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenReturn(false);

      service.getCity(id)
          // tslint:disable-next-line:typedef
        .catch((error: ErrorResult) => {
          expect(error instanceof NotFoundResult).to.equal(true);
        });
    });

    // tslint:disable-next-line:typedef
    it('should reject for ID without permission', () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenReturn(true);
      when(citiesRepositoryMock.hasAccess(id)).thenReturn(false);

      service.getCity(id)
          // tslint:disable-next-line:typedef
        .catch((error: ErrorResult) => {
          expect(error instanceof ForbiddenResult).to.equal(true);
        });
    });

    // tslint:disable-next-line:typedef
    it('should reject if the repository call fails', () => {
      const id: number = chance.natural();
      when(citiesRepositoryMock.exists(id)).thenThrow(new Error());

      service.getCity(id)
          // tslint:disable-next-line:typedef
        .catch((error: Error) => {
          expect(error instanceof Error).to.equal(true);
        });
    });
  });
});
