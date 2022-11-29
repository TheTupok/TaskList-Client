import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DateService {

  public convertDate(date: string) {
    const [day, month, year] = date.split('.')
    return year + '-' + month + '-' + day;
  }
}
