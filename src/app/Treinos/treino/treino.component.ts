import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { TreinoService } from './treino.service';
import { TreinoModel } from 'src/app/model/treino.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-treino',
  templateUrl: './treino.component.html',
  styleUrls: ['./treino.component.css'],
  providers: [ConfirmationService,TreinoService,MessageService]
})

export class TreinoComponent implements OnInit, OnDestroy {
    private EmpIdf: number = ServiceConfig.EMPIDF;
    private TreIdf: number = 0;
  
    dadosForm: FormGroup;

    tipos: DropDown[];
  
    addDadosTreino: Subscription;
    updateDadosTreino: Subscription;
    deleteDadosTreino: Subscription;
    lerDadosTreino: Subscription;
  
    isLoading = true;
    editMode = false;
  
    isUpdate = true;
  
    constructor(private router: Router, private route: ActivatedRoute, 
      private srvTreino: TreinoService, private messageService: MessageService) 
    {
      
      this.tipos = [
        {name: 'Treino', code: 'T'},
        {name: 'Campeonato', code: 'C'},
        {name: 'Evento', code: 'E'}
      ];
    }
    ngOnDestroy(): void {
      if (this.lerDadosTreino != null){
        this.lerDadosTreino.unsubscribe();
      }
      if (this.addDadosTreino != null){
        this.addDadosTreino.unsubscribe();
      }
      if (this.updateDadosTreino != null){
        this.updateDadosTreino.unsubscribe();
      }
    }
  
    ngOnInit() {
      this.route.queryParams
        .subscribe(params => {
          this.EmpIdf = params.EmpIdf;
          this.TreIdf = params.TreIdf;
          if (params.Modo == "EDIT")
          {
            this.editMode = true;
            this.getTreino();
          } else {
            this.editMode = false;
            let Treino: TreinoModel;
            this.initForm(Treino);
          }
        }
      );
    }
  
    private getTreino() {
      let Treino: TreinoModel;
      let dados = {
        EmpIdf: this.EmpIdf,
        TreIdf: this.TreIdf
      };
      this.lerDadosTreino = this.srvTreino.getTreDados(dados).subscribe(
        (dados) => {
          Treino = JSON.parse(JSON.stringify(dados));
          Treino.TreData = new Date(Treino.TreData);
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        ()=>{
          this.isLoading = false;
          this.initForm(Treino);
        });
    }
  
    onSubmit() {
      let dados = {
        EmpIdf: this.EmpIdf,
        TreIdf: this.TreIdf,
        TreTipo: this.dadosForm.value['tipo'],
        TreData: this.dadosForm.value['data'],
        TreTitulo:  this.dadosForm.value['titulo'],
        TreResponsavel:  this.dadosForm.value['responsavel'],
        TreObs: this.dadosForm.value['obs'],
      };    
      if (this.editMode)
      {
        let dadosUpdate = {
          ...dados
        }
        this.updateDadosTreino = this.srvTreino.updateTreDados(dadosUpdate).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Successo', detail: 'Treino atualizado!'});
          },
          err => { 
            let msg = err.error.errors.toString();
            this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
          },
          () => {
            this.retorno();
          }
        );
      }else{
        let dadosAdd = {
          ...dados
       }
        this.addDadosTreino = this.srvTreino.addTreDados(dadosAdd).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Successo', detail: 'Treino incluido!'});
          },
          err => { 
            let msg = err.error.errors.toString();
            this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
          },
          () => {
            this.retorno();
          }
        );
      }
    }
  
    cancelar() {
      this.retorno(0);
    }
  
    private retorno(tempo=1010){
      setTimeout(() => 
      {
        this.router.navigate(['../treinolista'], {relativeTo: this.route});
      },
      tempo);
    }
  
    private initForm(dados:TreinoModel) {   
      this.isLoading = false;
      let TreTipo = 'T';
      let TreData = null;
      let TreTitulo = null;
      let TreResponsavel = null;
      let TreObs = null;
      if (dados != null)
      {
        TreTipo = dados.TreTipo;
        TreData = dados.TreData;
        TreTitulo = dados.TreTitulo;	
        TreResponsavel = dados.TreResponsavel;	
        TreObs = dados.TreObs;
      }
      this.dadosForm = new FormGroup({
        'tipo': new FormControl(TreTipo, Validators.required),
        'data': new FormControl(TreData, Validators.required),
        'titulo': new FormControl(TreTitulo, Validators.required),
        'responsavel': new FormControl(TreResponsavel, Validators.required),
        'obs': new FormControl(TreObs),
      });
    }
  
    clear() {
      this.messageService.clear();
    }    
  
  } 

  interface DropDown {
    name: string,
    code: string
  }