import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ComponentService } from '@app/components/components.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html'
})

export class ConfigureComponent implements OnInit {

  	@ViewChild('avatarimg') avatarimg;
  	@ViewChild('wizardControls') wizardControls;

	private bsModalRef: BsModalRef;
    public user: any;
    public step: 1;
    public now: Date = new Date();
    public paymethods: any;
    public heroes: any;
    public lanes: any;
    public lanes_checked = [];
    public avatarUpload = null;
    public wizardFinish = false;

	constructor(private _router: Router, private _service: ComponentService, private modalService: BsModalService) { 
    	this._service.getProfile().subscribe((res) => {
    		if(res.status == 200) {
    			this.user = res.body.user;
		    	this._service._countries;
		    	this._service._paymethods.then((methods) => {
		    		this.paymethods = methods;
		    	});
		    	this._service._heroes.then((heroes) => { 
		    		this.heroes = heroes;
		    	});
		    	this._service._lanes.then((lanes) => {
		    		this.lanes = lanes;
		    	});
		    }
    	}, (e) => {
			this._router.navigate(['/auth/login']);
    	});
    }

	ngOnInit() {

	}

	public onWizardChanged(event) {
		this.step = event.step;
	}

	public onWizardComplete(event) {
	    let formData = this.avatarUpload instanceof FormData ? this.avatarUpload : new FormData();
	    formData.delete('user');
		formData.append("user", JSON.stringify(this.user));
		this._service.updateProfile(formData).subscribe((res) => {
			this.wizardFinish = true;
			this.wizardControls.nativeElement.style.display = 'none';
			this.user.avatar = res.body;
			this._service._user = {
				id: this.user.id,
				first_name: this.user.first_name,
				last_name: this.user.last_name,
				nick_name: this.user.nick_name,
				avatar: this.user.avatar,
				is_busy: this.user.is_busy,
				active_order: this.user.active_order,
			};
			setTimeout(() => {
				this._router.navigate(['/profile/settings']);
			}, 2500);
		}, (error) => {

		});
	}

	openModal(event, template: TemplateRef<any>) {
		event.preventDefault();
		this.bsModalRef = this.modalService.show(template);
	}

	modalClose() {
		this.bsModalRef.hide();
	}

	public heroesChanged(hero) {
		if(hero.checked) 
			this.user.heroes.push(hero.id);
		else if (this.user.heroes.indexOf(hero.id) !== -1)
			this.user.heroes.splice(this.user.heroes.indexOf(hero.id), 1);
	}

	public lanesChanged(lane) {
		if(lane.checked) 
			this.user.lanes.push(lane.id);
		else 
			this.user.lanes = this.user.lanes.filter(e => e != lane.id);
	} 

  	addProp() {
  		this.user.props.push({id: 0, prop: "", method_id: 0, method: "", country: this.user.country});
  	}

  	removeProp(prop) {
  		this.user.props = this.user.props.filter(e => e != prop);
  	}

  	changeProp(prop) {
  		this.paymethods.forEach(e => { if(e.id == prop.method_id) prop.method = e.name; });
  	}

	onimgloaded(event) : void {
		var path = event.target.value.split('\\');
		var filename = path.pop();
		var ext = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : null;
		if(['jpeg','jpg','gif','png'].indexOf(ext) === -1) {
			return event.target.value = null;
		}
		var files: any = event.target.files;
		var formData: any = new FormData();
	    formData.delete('files');
		formData.append("files", files[0], files[0]['name']);
		this.avatarUpload = formData;
		var file = event.target.files[0];
		var reader = new FileReader();
		reader.onload = (e:any) => { this.avatarimg.nativeElement.src = e.target.result; }
		reader.readAsDataURL(file);
	}

}
