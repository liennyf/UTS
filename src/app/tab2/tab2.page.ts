import { Component, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
  isiData : Observable<Note[]>;
  isiDataColl:AngularFirestoreCollection<Note>;

  constructor(afs : AngularFirestore) {
    this.isiDataColl = afs.collection('note');
    this.isiData = this.isiDataColl.valueChanges();
  }
}
