import { UnitOfMeasure } from './UnitOfMeasure';
import { Meridiem } from './Meridiem';

export class FeedRequest {
  date: string;
  timeHour: number;
  timeMinute: number;
  meridiem: Meridiem;
  given: number;
  givenUom: UnitOfMeasure;
  quantity: number;
  quantityUom: UnitOfMeasure;
  vitamin: boolean;
  note: string;
}