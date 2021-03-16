import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, CameraSource, CameraPhoto, FilesystemDirectory, Capacitor } from '@capacitor/core'
import { FnParam } from '@angular/compiler/src/output/output_ast';
import { stringify } from '@angular/compiler/src/util';
import { readSync, read } from 'fs';
import { Direct } from 'protractor/built/driverProviders';
import { FormStyle } from '@angular/common';
import { Platform } from '@ionic/angular';

const { Camera , Filesystem, Storage} = Plugins;


@Injectable({
  providedIn: 'root'
})
export class FotoService {

  public dataFoto : Photo[] = [];
  private keyfoto : string = "foto"; 
  private platform : Platform
  constructor(platform : Platform) { }
  public async tambahfoto(){
    const Foto = await Camera.getPhoto({
        resultType : CameraResultType.Uri,
        source : CameraSource.Camera,
        quality : 100
    });
    console.log(Foto);
    this.dataFoto.unshift({
      filepath:"Load",
      webviewPath:Foto.webPath
    })
    Storage.set({
      key : this.keyfoto,
      value : JSON.stringify(this.dataFoto)
    })
  }
  public async simpanFoto(foto : CameraPhoto){
    const base64Data = await this.readAsBase64(foto);
    const namaFile = new Date().getTime + 'jpeg';
    const simpanFile = await Filesystem.writeFile({
      path : namaFile,
      data : base64Data,
      directory : FilesystemDirectory.Data
    });
    if (this.platform.is('hybrid')){
      return {
        filepath : simpanFile.uri,
        webviewPath : Capacitor.convertFileSrc(simpanFile.uri)
  
      }
    }else {
      return {
        filepath : namaFile,
        webviewPath : foto.webPath
  
      }
    }
    
  }
  private async readAsBase64(foto : CameraPhoto){
    if (this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path : foto.path
      });
      return file.data;
    }else{
      const response = await fetch(foto.webPath);
      const blob = await response.blob()
      return await this.convertBlobtoBase64(blob) as string; 
    }
   
  }
  convertBlobtoBase64 = (blob : Blob) => new Promise((resolve, reject)=>{
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    }
    reader.readAsDataURL(blob);
  })
  public async loadfoto(){
    const listFoto = await Storage.get({key : this.keyfoto});
    this.dataFoto = JSON.parse(listFoto.value) || [];
    if (!this.platform.is('hybrid')){
      for (let foto of this.dataFoto){
        const readFile = await Filesystem.readFile({
          path : foto.filepath,
          directory : FilesystemDirectory.Data
        });
        foto.webviewPath = `data:image/jpeg;base64, ${readFile.data}`;
      }
    }
  
  }
}
export interface Photo{
  filepath : string;
  webviewPath : string;
}