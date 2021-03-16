import { Component } from '@angular/core';
import { FotoService } from '../services/foto.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public angka : number = 0
  public inputangka : number 
  public state : string = ""
  public boolean : boolean = false
  constructor(public fotoservice : FotoService) {
    this.angka = Math.floor(Math.random() * 10);
    console.log(this.angka);
  }
  cek(){
    if (this.angka == this.inputangka){
      this.state = "You Win"
      this.boolean = true
    }
  }
}
