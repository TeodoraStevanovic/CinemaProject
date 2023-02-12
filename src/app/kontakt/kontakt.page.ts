import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { IonContent } from '@ionic/angular';
@Component({
  selector: 'app-kontakt',
  templateUrl: './kontakt.page.html',
  styleUrls: ['./kontakt.page.scss'],
})
export class KontaktPage implements OnInit,OnDestroy  {
  @ViewChild('pageTop') pageTop: IonContent;
  constructor() {
    console.log('constructor');
  }

  ngOnInit() {console.log('ngOnInit');
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
  public pageScroller(){
    //scroll to page top
    this.pageTop.scrollToTop();
  }
}
