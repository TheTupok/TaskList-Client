import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

export interface IPageData {
  pageIndex: number
  pageSize: number
}

@Injectable({
  providedIn: 'root'
})

export class PaginatorService {

  private _paginatorData: Subject<IPageData> = new Subject<IPageData>();

  getPaginatorData() {
    return this._paginatorData.asObservable();
  }

  setPaginatorData(data: IPageData) {
    this._paginatorData.next(data);
  }
}
