import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class MemberListService {

  openMembersList(e: Event) {
    this.closeMembersList();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const parent = target.closest('td') as HTMLElement;
    const contextMenu = parent.querySelector('.element-members-list') as HTMLElement;

    contextMenu.style.top = target.getBoundingClientRect().bottom - 2 + 'px';
    contextMenu.style.left = target.getBoundingClientRect().right - 2 + 'px';

    contextMenu.classList.add('visible')
  }

  closeMembersList() {
    const contextMenu = document.getElementsByClassName('element-members-list') as HTMLCollection;
    Array.prototype.forEach.call(contextMenu, (elem) => {
      elem.classList.remove('visible');
    })
  }
}
