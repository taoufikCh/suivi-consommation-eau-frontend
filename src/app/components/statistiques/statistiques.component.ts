import { Component, OnInit, ViewChild } from '@angular/core';
import { Local } from 'src/app/models/local';
import { Compteur } from 'src/app/models/compteur';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LocalService } from 'src/app/service/local.service';
import { Router } from '@angular/router';
import { CompteurService } from 'src/app/service/compteur.service';
import { Region } from 'src/app/models/region';
import { NatureExercise } from 'src/app/models/natureExercice';
import { TypeLocal } from 'src/app/models/typeLocal';
import { District } from 'src/app/models/districts';
import { RegionService } from 'src/app/service/region.service';
import { NatureExerciceService } from 'src/app/service/nature-exercice.service';
import { TypeLocalService } from 'src/app/service/type-local.service';
import { DistrictService } from 'src/app/service/district.service';
import { Consommation } from 'src/app/models/consommation';
import { ConsommationService } from 'src/app/service/consommation.service';
import { Bordereau } from 'src/app/models/bordereau';
import { ConsommationDto } from 'src/app/models/consommationDto';

@Component({
    templateUrl: './statistiques.component.html',
    providers: [MessageService]
})
export class StatistiquesComponent implements OnInit {


    consommations: Consommation[] = [];
    consommationsDto: ConsommationDto[] = [];

    consommation: Consommation = {};
    bordereau: Bordereau = {};

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    items: MenuItem[] | undefined;

    home: MenuItem | undefined;
    
    regions: Region[] = [];
    natureExercices : NatureExercise[] = [];
    typeLocaux : TypeLocal[] = [];
    districts: District[] = [];
    district: District = {}
    region: Region = {};
    natureExercice: NatureExercise = {};
    typeLocal: TypeLocal = {};
    dates: Date[] | undefined;
    maxDate: Date | undefined;
    dateDebut: Date;
    dateFin: Date;
    startDate:String ="";
    endDate:String ="";
 
    filter_params: any ={};
    ////
    basicData: any;

    basicOptions: any;

    

    pieData: any;

    pieOptions: any;
    doughnutData : any;
    doughnutOptions : any;
    
    isData: boolean = false;
    loading: boolean = false;

    consumptionData = [];
   
    labels: string[] = []; 
    dynamicBackgroundColors: string[] = []; 
    dataValues: number[] = [];

    pieDataLocalLabels: String[]=[];
    pieDataLocalValues: number[] = [];

    chartDoughnutDataNatureLabels: String[]=[];
    chartDoughnutDataNatureValues: number[] = [];

    
    constructor(private localService: LocalService, private consommationService: ConsommationService,private compteurService: CompteurService,
      private regionService: RegionService, private natureExerciseService : NatureExerciceService,
    private typeLocalService: TypeLocalService, private districtService : DistrictService, private messageService: MessageService,
       private router: Router) { }

    ngOnInit() {
      //this.isData = true;
      this.items = [{ label: 'Suivi Statistique' , routerLink: '/statistique' }];

        this.home = { icon: 'pi pi-chart-bar', routerLink: '/statistique' };
        this.maxDate = new Date();
       // this.findAll();

        this.getAllDistricts();

      
        //this.initChart();
       
        this.isData = false;
    }
    chartBar(){
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.basicData = {
          //labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          labels: this.labels,
          datasets: [
              {
                  label: '',
                  //data: [540, 325, 702, 620],
                  data: this.dataValues,
                  //backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                  backgroundColor: this.dynamicBackgroundColors,
                  //borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                  borderWidth: 1,
                  borderRadius : 20,
                  //categoryPercentage: 0.4,
                  barPercentage: 0.5,
              }
          ]
      };

      this.basicOptions = {
          plugins: {
              legend: {
                  /*labels: {
                      color: textColor
                  }*/
                  display: false,
              },
              title: {
                display: true,
                text: 'Suivi consommation par Local',
                align : 'start',
                font: {
                  size: 16
              }
            }
          },
          responsive : true,
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              x: {
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

    
  chartPie(){
    const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.pieData = {
            //labels: ['Le Bardo', 'Tunis', 'Sfax'],
           labels: this.pieDataLocalLabels,

            datasets: [
                {
                    //data: [540, 325, 702],
                    data: this.pieDataLocalValues,
                    backgroundColor: this.getRandomColors(this.pieDataLocalLabels.length),
                    //backgroundColor: this.dynamicBackgroundColors,
                    //hoverBackgroundColor: this.dynamicBackgroundColors,
            
                    //backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    //hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor,
                    },
                    position: 'right',
                },
                title: {
                  display: true,
                  text: 'Suivi consommation par type local',
                  align : 'start',
                  font: {
                    size: 16
                }
              }
            },
            responsive : true,
        };
  }
  chartDoughnut(){
    const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.doughnutData = {
            //labels: ['A', 'B', 'C'],
           
            labels: this.chartDoughnutDataNatureLabels
            ,
            datasets: [
                {
                   // data: [300, 50, 100],
                    data: this.chartDoughnutDataNatureValues,
                    
                    backgroundColor: this.getRandomColors(this.chartDoughnutDataNatureLabels.length),
                   // hoverBackgroundColor: this.getRandomColors(this.chartDoughnutDataNatureLabels.length),
                  
                    //backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    //hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };
        this.doughnutOptions = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    },
                    position: 'right',
                },
                title: {
                  display: true,
                  text: "Suivi consommation par Nature d'excercie",
                  align : 'start',
                  font: {
                    size: 16
                }
              }
            },
            responsive : true,
        };
  }
   

    
    resetFilter(){
      
      this.consommations = [];
      this.region = {};
      this.district = {};
      this.natureExercice = {};
      this.typeLocal = {};
      this.dateDebut=null;
      this.dateFin=null;
      this.isData = false;
    }

    generateStatistic() {
      this.loading = true;
      console.log("generate statistic");
      
      if(this.dateDebut!=null){
         this.startDate = this.formatDate(this.dateDebut);
      }
      if(this.dateFin!=null){
        this.endDate = this.formatDate(this.dateFin);
     }
          
      const consommationFilters = {
            regionId: this.region.id, // Value from the selected region dropdown
            dateDebut: this.startDate,
            dateFin: this.endDate
            // Add other filter values as needed
          };
          console.log(consommationFilters);
          this.consommationService.getConsommationsStatistic(consommationFilters)
          .subscribe({
            next:(data)=>{
              console.log('consommations: ', data);
              this.convertStatisticData(data);
              this.getConsommationDataByTypeAndNature(consommationFilters);
             
              //this.consommations = [];
              //this.consommations=data;
            },error:(err)=>{ 
              console.log('error : '+err.message);
            }
      });
      ///this.isData = false;
      
    }
  getConsommationDataByTypeAndNature(consommationFilters:any) {
    this.consommationService.getConsommationsStatisticOfTypeAndNature(consommationFilters)
    .subscribe({
      next:(data)=>{
        console.log('consommations: ', data);
       this.extractStatisticDataTypeAndNature(data);
       this.isData=true;
       this.loading = false;
        
      },error:(err)=>{ 
        console.log('error : '+err.message);
        this.loading = false;
      }
  });
  }
   
    
      formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      formatDateToYearMonth(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
      }
    

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.consommations.length; i++) {
            if (this.consommations[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getAllDistricts():void {
      this.districtService.findAll().subscribe({
        next:(data)=>{
          this.districts=data;
        },error:(err)=>{ 
          console.log('error : '+err.message);
        }
      })
    }

    
    onChangeDistrict(district:District){
      this.regions = [...this.regions];
      console.log(district);
      this.district = district;
      this.regionService.getRegionByDistrict(district).subscribe({
        next:(data)=>{
          this.regions=data;
            this.region = this.regions[0];
             console.log(this.region);
        },error:(err)=>{ 
          console.log('error : '+err.message);
        }
      })
      
    }
    convertStatisticData(consumptionData){
    console.log(consumptionData);

      this.labels = consumptionData.map(item => item.localCode);
    this.dataValues = consumptionData.map(item => item.averageConsumption=='NaN'?0:item.averageConsumption);
    console.log(this.labels);
    console.log(this.dataValues);
     // Generate dynamic backgroundColor array based on labels
     this.dynamicBackgroundColors = this.labels.map(label => this.generateRandomColor());

    this.chartBar();
    }

    generateRandomColor(): string {
      // Function to generate random colors (you can replace this with your own color generation logic)
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      return randomColor;
    }

    getRandomColors(length: number): string[] {
      // Function to generate random colors (you can replace this with your own color generation logic)
      const colors = [];
      for (let i = 0; i < length; i++) {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        colors.push(randomColor);
      }
      return colors;
    }

    extractStatisticDataTypeAndNature(data:any){
      console.log(data);
      const localType = data.typeLocal;
      const natureExercice = data.natureExercise;
      console.log(localType);
      console.log(natureExercice);
      this.pieDataLocalLabels = Object.keys(localType);
      this.pieDataLocalValues = Object.values(localType);
      //this.pieDataLocalLabels = Object.keys(data.typeLocal);
      //this.pieDataLocalValues = Object.values(data.typeLocal);
      console.log(this.pieDataLocalLabels);
      console.log(this.pieDataLocalValues);

      this.chartDoughnutDataNatureLabels = Object.keys(natureExercice);
      this.chartDoughnutDataNatureValues = Object.values(natureExercice);


      console.log(this.chartDoughnutDataNatureLabels);
      console.log(this.chartDoughnutDataNatureValues);

     
      //this.labels = data.map(item => item.localCode);
    //this.dataValues = data.map(item => item.averageConsumption=='NaN'?0:item.averageConsumption);
    this.chartPie();
    this.chartDoughnut();
    
    }
    

}
