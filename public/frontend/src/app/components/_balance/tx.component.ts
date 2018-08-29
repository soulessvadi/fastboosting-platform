import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService, SocketEvent, Message } from '@app/components/socketio.service';
import { ComponentService } from '@app/components/components.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'sa-tx',
  templateUrl: './tx.component.html',
})

export class TxComponent implements OnInit {

  @ViewChild('chatWindow') chatWindow;
  public Math:any;
  public chat = {
    room: null,
    messages: null,
    message: null,
  };
  public txs;
  public issuedTx;
  public requestedTx = null;
  public stats;
  public found = 0;
  public pagination;
  public page:number = 1;
  private bsModalRef: BsModalRef;

  constructor(
    public _service: ComponentService,
    private socketio: SocketService,
    private el: ElementRef,
    private modalService: BsModalService, 
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.requestedTx = this.route.snapshot.paramMap.get('tx');
    this.Math = Math;
    this.fetch();
  }

  private scrollChat() {
    let $body = $('#chat-body', this.el.nativeElement);
    $body.animate({scrollTop: $body[0].scrollHeight});
  }

  public fetch() {
    this._service.getSelfTxs({tx: this.requestedTx, page: this.page}).subscribe(res => {
      this.txs = res.body.txs;
      this.stats = res.body.stats;
      this.pagination = res.body.pagination;
      this.found = this.stats.reduce((a, c) => a + c.value, 0);
    })
  }

  public openModal(event, template: TemplateRef<any>, tx) {
    this.issuedTx = tx;
    event.preventDefault();
    this.bsModalRef = this.modalService.show(template);
  }

  public modalClose() {
    this.bsModalRef.hide();
  }

  public pageChange(page:number) {
    if(page != this.page) {
      this.page = page;
      this.fetch();
    }
  }
}
