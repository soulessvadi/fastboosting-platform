import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'smart-terms-modal',
  templateUrl: './terms-modal.component.html',
})
export class TermsModalComponent {

  @Output() agree = new EventEmitter()
  @Output() close = new EventEmitter()

  constructor() {}

	print(): void {
	    let printContents, printHeader, popupWin;
	    printContents = document.getElementById('print').innerHTML;
	    printHeader = document.getElementById('print-header').innerHTML;
	    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
	    popupWin.document.open();
	    popupWin.document.write(`
	      <html>
	        <head>
	          <title>${printHeader}</title>
	        </head>
    		<body onload="window.print();window.close()">${printContents}</body>
	      </html>`);
	    popupWin.document.close();
	}

}
