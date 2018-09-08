import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ComponentService } from '@app/components/components.service';

@Component({
  selector: 'sa-profile',
  templateUrl: './settings.component.html',
})

export class SettingsComponent implements OnInit {

  	@ViewChild('avatarimg') avatarimg;
	private bsModalRef: BsModalRef;
    private user_default: any;
    public user: any;
    public now: Date = new Date();
    public otypes: any = null;
	public osources: any = null;
    public paymethods: any = null;
    public heroes: any = null;
    public lanes: any = null;
    public medals: any = null;
    public viewMode: boolean = true;
    public avatarUpload = null;
    public reviews = null;
    public reviewsShown = null;
    public logs = null;
    public logsShown = null;
    public activeTab = 1;
    public referrer_link = null;

    constructor(public _service: ComponentService, public _router: Router, private modalService: BsModalService) {
    }

    ngOnInit() {
    	this._service.getProfile().subscribe((res) => {
    		if(res.status == 200) {
	    		this.user_default = JSON.stringify(res.body.user);
    			this.user = res.body.user;
    			this.referrer_link = window.location.origin + "/auth/register/" + this.user.referrer_hash;
	    		this.reviews = res.body.reviews;
	    		this.reviewsShown = this.reviews.slice(0, 5);
	    		this.reviews.splice(0, 5);
	    		this.logs = res.body.logs;
	    		this.logsShown = this.logs.slice(0, 9);
	    		this.logs.splice(0, 9);
			    this.otypes = res.body.otypes;
			    this.osources = res.body.osources;
		    	this._service._countries;
		    	this._service._paymethods.then((methods) => this.paymethods = methods);
		    	this._service._heroes.then((heroes) => this.heroes = heroes);
		    	this._service._lanes.then((lanes) => this.lanes = lanes);
    			this._service._medals.then((medals: any) => this.medals = medals);
		    }
    	}, (e) => {
			this._router.navigate(['/auth/login']);
    	});    	
    }

	loadMoreReviews() {
		this.reviewsShown = this.reviewsShown.concat(this.reviews.slice(0, 5));
		this.reviews.splice(0, 5);

	}

	loadMoreLogs() {
		this.logsShown = this.logsShown.concat(this.logs.slice(0, 9));
		this.logs.splice(0, 9);
	}

	saveProfile() {
	    let formData = this.avatarUpload instanceof FormData ? this.avatarUpload : new FormData();
	    formData.delete('user');
		formData.append("user", JSON.stringify(this.user));
		this._service.updateProfile(formData).subscribe((res) => {
			this.user.avatar = res.body;
			this.user_default = JSON.stringify(this.user);
			this.viewMode = !this.viewMode;
			this._service._user = {
				id: this.user.id,
				first_name: this.user.first_name,
				last_name: this.user.last_name,
				nick_name: this.user.nick_name,
				avatar: this.user.avatar,
				is_busy: this.user.is_busy,
				active_order: this.user.active_order,
				rating: this.user.rating,
			};
		}, (error) => {

		});
	}

	switchMode(reset: boolean) {
		this.viewMode = !this.viewMode;
		if(reset) this.avatarUpload = null, this.user = JSON.parse(this.user_default);
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

	public copyInputValue(inputElement) {
	    inputElement.select();
	    document.execCommand('copy');
	    // inputElement.setSelectionRange(0, 0);
	}

}
