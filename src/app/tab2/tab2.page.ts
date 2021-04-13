import { Component, Injectable } from '@angular/core';
import { GlobalvarService, Note } from '../globalvar.service';
import { Tab1Page } from '../tab1/tab1.page';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  isinote: Array<Note>;

  constructor(public page1:Tab1Page) {
    this.isinote=this.page1.dataNote;
    console.log(this.isinote);
  }

}
