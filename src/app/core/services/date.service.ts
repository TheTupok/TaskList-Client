import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DateService {

  public convertDate(date: string) {
    if (date) {
      const [day, month, year] = date.split('.')
      return year + '-' + month + '-' + day;
    } else {
      return '';
    }
  }

  public getCurrentDate() {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return yyyy + '.' + mm + '.' + dd;
  }

  public checkCurrentAndDeadlineDate(date: string) {
    const currentDate = new Date(this.getCurrentDate());
    const deadlineDate = new Date(this.convertDate(date));

    return currentDate >= deadlineDate;
  }
}
