import { Component, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GlobalvarService, Note, Photo } from '../globalvar.service';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  isiData : Observable<Note[]>;
  isiDataColl:AngularFirestoreCollection<Note>;
  
  Judul : string;
  Isi : string;
  Tanggal: string;
  Nilai: number;
  FileName: string;
  dataNote: Note[]=[];

  constructor(public globalService:GlobalvarService, afs : AngularFirestore) {
    this.isiDataColl = afs.collection('note');
    this.isiData = this.isiDataColl.valueChanges();
  }

  TambahFoto(){
    this.globalService.tambahfoto();
  }

  simpan(){
    this.FileName=this.globalService.getFn();

    this.isiDataColl.doc(this.Judul).set({
      judul : this.Judul,
      isi : this.Isi,
      tanggal : this.Tanggal,
      nilai: this.Nilai,
      fileName: this.FileName
    });
    let tempNote: Note = {
      judul : this.Judul,
      isi : this.Isi,
      tanggal : this.Tanggal,
      nilai: this.Nilai,
      fileName: this.FileName
    };
    // this.dataNote.push(tempNote);
  }
}
