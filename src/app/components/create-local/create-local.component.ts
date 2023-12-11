import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { District } from 'src/app/models/districts';
import { Local } from 'src/app/models/local';
import { LocalStatus } from 'src/app/models/localStatus';
import { NatureExercise } from 'src/app/models/natureExercice';
import { Region } from 'src/app/models/region';
import { TypeLocal } from 'src/app/models/typeLocal';
import { DistrictService } from 'src/app/service/district.service';
import { LocalService } from 'src/app/service/local.service';
import { NatureExerciceService } from 'src/app/service/nature-exercice.service';
import { RegionService } from 'src/app/service/region.service';
import { TypeLocalService } from 'src/app/service/type-local.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './create-local.component.html',
  providers: [MessageService],

})
// Create a reverse mapping object

export class CreateLocalComponent implements OnInit{
  private static readonly API_KEY = environment.mapsKey;
 

  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    //zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    mapTypeId: 'hybrid',
    maxZoom: 15,
    minZoom: 3,
  };
  local: Local = {};
  localEdit: Local ={};
  submitted: boolean = false;

  markers = [];
  regions: Region[] = [];
  natureExercices : NatureExercise[] = [];
  typeLocaux : TypeLocal[] = [];

  districts: District[] = [];

  district: District = {}
  region: Region = {};
  natureExercice: NatureExercise = {};
  typeLocal: TypeLocal = {};
  statusEtat = LocalStatus;
  status: LocalStatus;
  selectedEtat: any;
  getEtatValue: any;
  modesLabels : any [];
  etatOptions: any [];
  editLocal : boolean = false;
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;
  pageTitle : String= "Formulaire d'ajout d'un local ";

  //file: File | null = null;
  selectedFile: File | null = null;
  imgUrl: string | ArrayBuffer = 'assets/local.png';

  constructor(private localService: LocalService, private regionService: RegionService, private natureExerciseService : NatureExerciceService,
    private typeLocalService: TypeLocalService, private districtService : DistrictService, private messageService: MessageService,
 private router: Router, private route: ActivatedRoute) {  
  this.localEdit =this.router.getCurrentNavigation()?.extras.state;
}
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

    @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;


    ngOnInit() {
        this.items = [{ label: 'Les locaux' , routerLink: '/locaux' }];

        this.home = { icon: 'pi pi-building', routerLink: '/locaux' };
      //this.etatOptions = Object.keys(this.statusEtat).map(key => ({ label: this.statusEtat[key], value: key }));
      this.modesLabels = [                        // <-- you still need the array
      LocalStatus.loue, 
      LocalStatus.ferme, 
      LocalStatus.enReparation,
      LocalStatus.proprietaire 
    ];
    
      this.getAllDistricts();
      this.getAllNatureExercises();
      this.getAllTypeLocal();
      if(this.localEdit){
        this.editLocal = true;
        this.getLocalfromRoute();
        this.pageTitle = "Formulaire de modification d'un local ";
      }
      if(this.editLocal){
        navigator.geolocation.getCurrentPosition((position) => {
          this.center = {
              lat: parseFloat(this.local.latitude),
              lng: parseFloat(this.local.longitude)
          };
        });
      }
      else{
        navigator.geolocation.getCurrentPosition((position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
        });
      }
      

  }



/*onChangeEtat(selectedEt: any) {
  
    console.log(selectedEt);
    const result = selectedEt[Object.keys(selectedEt)[0]];
    console.log('result = ' +result)
      
    Object.keys(this.modesLabels).forEach((key, index) => {
   
      if(result==this.modesLabels[key])
      {
        this.local.etat=index;
        console.log('position = ' +index)
      }  
  });
   
}*/
onChangeEtat(selectedEt: any) {
  console.log(selectedEt);
  //const result = selectedEt[Object.keys(selectedEt)[0]];
  //console.log('result = ' + result);
  
  const index = this.modesLabels.indexOf(selectedEt);
  if (index !== -1) {
    this.local.etat = index;
    console.log('position = ' + index);
  }
}
  getLocalfromRoute()
  {
    this.local = history.state;
    console.log(this.local);
    
    //this.district= this.local.region.district;
    
    let id = this.local.region.district.id;
    console.log("id "+id);
    this.getDistrictById(id).subscribe({
      next: (data) => {
        this.district = data; // Set this.district when the data is available
        console.log(this.district);
        this.onChangeDistrict( this.district);
        
      },
      error: (err) => {
        console.log('error : ' + err.message);
        this.district = {}; // Set a default or empty object if an error occurs
      }
    });

    //if(this.editLocal){
     /* this.getRegionById(this.local.region.id).subscribe({
        next: (data) => {
         
          this.region = data; // Set this.district when the data is available
          console.log(this.region);
        },
        error: (err) => {
          console.log('error : ' + err.message);
          this.region = this.local.region; // Set a default or empty object if an error occurs
        }
      });*/
   // }
    
    console.log(this.district);

    this.getEtatValue = this.local.etat;
    if(this.getEtatValue=="loue"){
      this.selectedEtat = LocalStatus.loue;
    }
    else if(this.getEtatValue=="ferme"){
      this.selectedEtat = LocalStatus.ferme;
    }
    else if(this.getEtatValue=="enReparation"){
      this.selectedEtat = LocalStatus.enReparation;
    }
    else if(this.getEtatValue=="proprietaire"){
      this.selectedEtat = LocalStatus.proprietaire;
    }
    console.log("this selected value : "+this.selectedEtat);
   this.addMarker(parseFloat(this.local.latitude),parseFloat(this.local.longitude));
    
  }
  getDistrictById(id: any): Observable<District> {
    return this.districtService.getDistrictById(id);
  }
  
  getRegionById(id: any): Observable<Region> {
    return this.regionService.getRegionById(id);
  }
  
  save() {
    this.submitted = true;
    
    console.log(this.local.designation?.trim()); 

    if (this.local.designation?.trim()) {
        console.log(this.local);
        
        this.local.image="";
        if (this.local.id) {
            console.log("id update"+this.local.id);
            
            this.localService.update(this.local.id, this.local).subscribe(
                response => {
                  console.log('Data updated successfully');
                  this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Local mise à jour avec succès', life: 3000 });
                  this.router.navigate(['/locaux']);
                  
                },
                error => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Mise à jour a échoué', life: 3000 });
                    console.error(error);
                }
              );
        } else {
          
           
            this.localService.create(this.local).subscribe(
                response => {
                 // this.savePhoto(response.id);
                  
                  console.log('local created successfully');
                  this.messageService.add({ severity: 'success', summary: 'Avec succès', detail: 'Local créée avec succès', life: 3000 });
                  this.router.navigate(['/locaux']);
                },
                error => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Création échoué', life: 3000 });
                    console.error(error);
                }
              );
            
        }
    }
}
  click(event: google.maps.MapMouseEvent) {
    const clickedLat = event.latLng.lat();
  const clickedLng = event.latLng.lng();

  this.local.longitude = ''+clickedLng;
  this.local.latitude = ''+clickedLat;
    console.log("lat = "+event.latLng.lat());
    console.log("lng = "+event.latLng.lng());
    this.addMarker(clickedLat,clickedLng);
  }

  addMarker(lat :number, lng : number) {
    this.markers = [];
    this.markers.push({
      position: {
        lat: lat ,
        lng: lng ,
      },
      
     
    });
    
  }
 
  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()));
  }

  getAllDistricts():void{
    this.districtService.findAll().subscribe({
      next:(data)=>{
        this.districts=data;
      },error:(err)=>{ 
        console.log('error : '+err.message);
      }
    })
  }
  getAllNatureExercises():void{
    this.natureExerciseService.findAll().subscribe({
      next:(data)=>{
        this.natureExercices=data;
      },error:(err)=>{ //si j'ai une erreur je suis récuperer le message d'erreure pour affiche le message
        console.log('error : '+err.message);
      }
    })
  }
  getAllTypeLocal():void{
    this.typeLocalService.findAll().subscribe({
      next:(data)=>{
        this.typeLocaux=data;
      },error:(err)=>{ 
        console.log('error : '+err.message);
      }
    })
  }
  
  onUpload(event: any) {
    console.log(event);
    
  }
 
  
  onChangeDistrict(district:District){
    this.regions = [...this.regions];
    console.log(district);
    this.regionService.getRegionByDistrict(district).subscribe({
      next:(data)=>{
        this.regions=data;
        
       if(this.editLocal){
          console.log("id "+this.local.region.id);
          this.region = this.regions.find(r => r.id === this.local.region.id);
           console.log(this.region);
        }
       
      },error:(err)=>{ 
        console.log('error : '+err.message);
      }
    })
    
  }
  onChangeRegion(region:Region){
   
    
    console.log(region);
    this.local.region = region;
    
  }

 /* onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);
      if (this.file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.file);
        console.log(fileReader);
        fileReader.onload = (event) => {
          if (fileReader.result) {
            this.imgUrl = fileReader.result;
            console.log(this.imgUrl);
          }
        };
      }
    }
  }*/

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files?.length) {
      this.selectedFile = inputElement.files[0];
      console.log( this.selectedFile);
    }
  }


  savePhoto(id?: number): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.localService.savePhoto(formData, id).subscribe((response) => {
      console.log('Image uploaded successfully!', response);
     
    });

    
  }
    
}
