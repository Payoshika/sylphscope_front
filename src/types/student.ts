import type { Country } from './country';
import type { Gender } from './gender';

export interface Student {
  id: string;
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  addressCountry: Country;
  addressState: string;
  addressCity: string;
  addressElse: string;
  citizenshipCountry: Country[];
  profilePictureUrl: string;
  phoneNumber: string;
  gender: Gender;
}