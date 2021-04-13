import { Component } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Note, GlobalvarService } from '../globalvar.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  isiData : Note;
  isiDataColl:AngularFirestoreCollection<Note>;

  Judul : string;
  Isi : string;
  Tanggal: string;
  Nilai: number;
  FileName: string;
  dataNote: Note[]=[];
  paramindex : string;

  constructor(private route : ActivatedRoute, public globalService:GlobalvarService, afs : AngularFirestore) {
    this.isiDataColl = afs.collection('note');
  }

  ngOnInit(afs : AngularFirestore) {
    let isiindex = this.route.snapshot.paramMap.get('nama');
    this.paramindex = isiindex;
    console.log(this.paramindex);

    if(this.paramindex==""||this.paramindex==null){
    }
    else{
      const isi = afs.collection("note").doc(this.paramindex).ref.get().then(function(doc){
        this.Judul = this.isiDataColl[0].judul;
        this.Isi = this.isiDataColl[0].isi;
        this.Tanggal = this.isiDataColl[0].tanggal;
        this.Nilai = this.isiDataColl[0].nilai;      
      });
      
      
      // this.Nilai = this.isiDataColl[0].nilai;

      // console.log(this.Judul);
    }
  }

  TambahFoto(){
    this.globalService.tambahfoto();
  }

  update(){
    this.FileName=this.globalService.getFn();

    this.isiDataColl.doc(this.paramindex).set({
      judul : this.Judul,
      isi : this.Isi,
      tanggal : this.Tanggal,
      nilai: this.Nilai,
      fileName: this.FileName
    });
    alert("Updated!");

  }

  delete(afs : AngularFirestore){
    this.isiDataColl.doc(this.paramindex).delete();
    alert("Deleted!");
  }
}
