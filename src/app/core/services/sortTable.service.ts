import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

export interface ISortData {
  active: string
  direction: string
}

@Injectable({
  providedIn: 'root'
})

export class SortTableService {

  private _sortData: Subject<ISortData> = new Subject<ISortData>();

  getSortData() {
    return this._sortData.asObservable();
  }

  setSortData(data: ISortData) {
    if (!data.direction) {
      data = { active: 'id', direction: 'asc' }
    }
    this._sortData.next(data);
  }
}
