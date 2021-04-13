import { Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { Tab1Page } from './tab1/tab1.page';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GlobalvarService {
  public dataFoto : Photo[] = [];
  private keyFoto : string = "foto";
  private platform : Platform;
  // isiData : Observable<Note[]>;
  // isiDataColl:AngularFirestoreCollection<Note>;
  urlImageStorage : string[] = [];
  public fn:string="";

  constructor(private afStorage : AngularFireStorage,platform : Platform) { 
    this.platform = platform;
    // this.isiDataColl = afs.collection('note');
    // this.isiData = this.isiDataColl.valueChanges();
  }
  public getFn(){
    return this.fn;
  }
  public async tambahfoto(){
    const Foto = await Camera.getPhoto({
      resultType:CameraResultType.Uri,
      source:CameraSource.Camera,
      quality: 100
    });
    console.log(Foto);

    const fileFoto = await this.simpanFoto(Foto);
    this.dataFoto.unshift(fileFoto);
  
    Storage.set({
      key : this.keyFoto,
      value: JSON.stringify(this.dataFoto)
    });
  }

  public async simpanFoto(foto : CameraPhoto){
    const base64Data= await this.readAsBase64(foto);

    const namaFile = new Date().getTime()+'.jpeg';

    const simpanFile = await Filesystem.writeFile({
      path : namaFile,
      data : base64Data,
      directory : FilesystemDirectory.Data
    });

    const response = await fetch(foto.webPath);
    const blob = await response.blob();
    const dataFoto = new File([blob],foto.path,{
      type: "images/jpeg"
    });

    if(this.platform.is('hybrid')){
      const imgFilepath = 'img/'+namaFile
      this.afStorage.upload(imgFilepath, dataFoto).then(() =>  {
        this.afStorage.storage.ref().child(imgFilepath).getDownloadURL().then((url)=>{
          this.urlImageStorage.unshift(url);
        });
      });
      
      this.fn = Capacitor.convertFileSrc(simpanFile.uri);
      
      return{
        filePath: simpanFile.uri,
        webviewPath : Capacitor.convertFileSrc(simpanFile.uri),
        dataImage : dataFoto
      }
    }else{
      const imgFilepath = 'img/'+namaFile
      this.afStorage.upload(imgFilepath, dataFoto).then(() =>  {
        this.afStorage.storage.ref().child(imgFilepath).getDownloadURL().then((url)=>{
          this.urlImageStorage.unshift(url);
        });
      });

      this.fn = Capacitor.convertFileSrc(simpanFile.uri);

      return{
        filePath : namaFile,
        webviewPath : foto.webPath,
        dataImage : dataFoto
      }
    }
  }

  private async readAsBase64(foto : CameraPhoto){
    if(this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path : foto.path
      });
      return file.data;
    }else{
      const response = await fetch(foto.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string; 
    }
  }

  convertBlobToBase64 = (blob : Blob) => new Promise((resolve, reject) =>{
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () =>{
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadFoto(){
    const listFoto = await Storage.get({key: this.keyFoto});
    this.dataFoto = JSON.parse(listFoto.value) || [];

    if(!this.platform.is('hybrid')){
      for(let foto of this.dataFoto){
        const readFile = await Filesystem.readFile({
          path : foto.filePath,
          directory : FilesystemDirectory.Data
        });
        foto.webviewPath = 'data:image/jpeg;base64,'+readFile.data;

        const response = await fetch(foto.webviewPath);
        const blob = await response.blob();

        foto.dataImage = new File([blob],foto.filePath,{
          type :"image/jpeg"
        });
      }
    }
    
    console.log(this.dataFoto);
  }

  // public setNote(jdl: string, isi: string, tgl: string, nil:number,ft:Photo) {
  //   let tempNote: Note = {
  //     judul: jdl,
  //     isi: isi,
  //     tanggal: tgl,
  //     nilai: nil,
  //     foto: ft
  //   };
  //   this.dataNote.push(tempNote);
  // }

  // public getNote() {
  //   return this.isiData;
  // }

  // public getNoteind(ind: number) {
  //   return this.isiData[ind];
  // }
}

export interface Note{
  judul: string;
  isi: string;
  tanggal: string;
  nilai: number;
  fileName: string;
}

export interface Photo{
  filePath : string;
  webviewPath : string;
  dataImage: File;
}
