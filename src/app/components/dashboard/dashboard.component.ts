import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MenuItem } from 'primeng/api';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { MapMarker } from '@angular/google-maps';
import { async } from 'rxjs';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { LocalService } from 'src/app/service/local.service';
import { Local } from 'src/app/models/local';
@Component({
    templateUrl: './dashboard.component.html',
    
})
export class DashboardComponent implements OnInit {
  constructor(private localService: LocalService) { }
  private static readonly API_KEY = environment.mapsKey;

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
 
  zoom = 11;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    mapTypeId: 'satellite',//roadmap, satellite, hybrid, terrain 
    maxZoom: 20,
    minZoom: 8,
  };
  markers = [];
  infoContent: Local = {};
  locaux: Local[] = [];
  loading: boolean = false;
  items: MenuItem[] | undefined;

    home: MenuItem | undefined;
    chartData: any;

    chartOptions: any;
    isData:boolean = false;
    datasets : any =[];
    labels : any;
 
  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
    this.loading = true;
      this.items = [{ label: 'Tableau de bord' , routerLink: '/' }];

        this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.findAll();
  }
  
 
  findAll():void{
    this.localService.findAll().subscribe({
      next:(data)=>{
        this.locaux=data;
        this.locaux.forEach(local => {
          this.addLocalMarker(local);
        });
      },error:(err)=>{ 
        console.log('error : '+err.message);
      }
    })
    this.loading = false;
  }
  addLocalMarker(local:Local) {
    this.markers.push({
      position: {
        lat: parseFloat(local.latitude),
        lng: parseFloat(local.longitude),
      },
      label: {
        color: 'white',
        text: local.designation,
      },
      title: local.code,
      info: "<b>Région : </b>"+local.region.libille+"<br>"+
      "<b>Adresse : </b>"+local.adresse+"<br>"+
      "<b>Type Local : </b>"+local.type_local.designation+"<br>"+
      "<b>Nature d'exercice : </b>"+local.nature_exercise.designation,
      //"<br><img src='"+local.image+"'</img>",
      options: {
        animation: google.maps.Animation.BOUNCE,
      },
      local: local,
    });
    console.log(this.markers);
  }

 
  zoomIn() {
    if (this.zoom < this.options.maxZoom) this.zoom++;
  }
 
  zoomOut() {
    if (this.zoom > this.options.minZoom) this.zoom--;
  }
 
  click(event: google.maps.MapMouseEvent) {
    console.log(event);
  }
 
  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()));
  }
 

 
  openInfo(marker: MapMarker, content,local:Local) {
    this.loading = true;
    this.infoContent = content;
    this.info.open(marker);
    this.getStatisticDataLocal(local)
    this.initChart();
  }
  getStatisticDataLocal(local: Local) {
    console.log(local);
    this.localService.getConsommationsStatisticLocal(local.id)
    .subscribe({
      next:(data)=>{
        console.log('consommations: ', data);
       //this.extractStatisticDataTypeAndNature(data);
       this.transformDataForChart(data);
       this.isData=true;
       this.loading = false;
        
      },error:(err)=>{ 
        console.log('error : '+err.message);
        this.loading = false;
      }
  });
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      //labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        labels: this.labels,
        datasets: this.datasets,
    };

    this.chartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                },
                position: 'bottom',
            },
            title: {
              display: true,
              text: 'Suivi consommation par compteur',
              align : 'start',
              font: {
                size: 16
            }
          }
        },
        responsive : true,
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
}

transformDataForChart(apiResponse: any): void {
  this.labels='';
  this.datasets=[];
  const counters = Object.keys(apiResponse); // Extract counter keys from API response
  const dates = new Set<string>(); // Collect unique dates

  // Collect all unique dates from all counters
  for (const counter of counters) {
    for (const date of Object.keys(apiResponse[counter])) {
      dates.add(date);
    }
  }

  this.labels = Array.from(dates).sort(); // Sort unique dates for x-axis labels
  

  // Generate datasets for each counter
  for (const counter of counters) {
    const data = [];

  
    for (const label of this.labels) {
      const consumption = apiResponse[counter][label] || 0;
      console.log('label '+label);
      console.log('consumption '+consumption);
      data.push(consumption);
    }

    // Create a dataset for the counter
    this.datasets.push({
      label: counter,
      data: data,
      fill: false,
      backgroundColor: this.getRandomColor(), 
      borderColor: this.getRandomColor(), 
      tension: 0.4
    });
  }

  // Set the transformed data to your chartData property
  /*this.chartData = {
    labels: labels,
    datasets: datasets
  };*/
  this.initChart();
}

// Example function to generate random color (can be customized)
getRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}


}
