import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { AnamneseService } from './anamnese.service';
import { AnamneseModel } from 'src/app/model/anamnese.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlunoModel } from 'src/app/model/aluno.model';
import { AlunoService } from '../aluno.service';

@Component({
  selector: 'app-anamnese',
  templateUrl: './anamnese.component.html',
  styleUrls: ['./anamnese.component.css'],
  providers: [ConfirmationService,AnamneseService,MessageService,AlunoService]
})
export class AnamneseComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  private AluIdf: number = 0;
  private AnaIdf: number = 0;
  private AluUsuIdf: number = 0;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;

  aluno = "";

  dadosForm: FormGroup;

  addDadosAnamnese: Subscription;
  updateDadosAnamnese: Subscription;
  deleteDadosAnamnese: Subscription;
  lerDados: Subscription;

  isLoading = true;
  editMode = true;

  isUpdate = true;
  isOk = false;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvAnamnese: AnamneseService, private messageService: MessageService, 
    private srvAluno: AlunoService,) {}
 
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.EmpIdf = params.EmpIdf;
        this.AluIdf = params.AluIdf;
        this.aluno = params.AluNome;
        this.getAluno();
      }
    );
  }

  private getAluno() {
    let Aluno: AlunoModel;
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf
    };
    this.lerDados = this.srvAluno.getAluDados(dados).subscribe(
      (dados) => {
        Aluno = JSON.parse(JSON.stringify(dados));
        this.AluUsuIdf = Aluno.UsuIdf;
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.getAnamnese();
      });
  }

  
  private getAnamnese() {
    let Anamnese: AnamneseModel;
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf
    };
    this.lerDados = this.srvAnamnese.lastAnaDados(dados).subscribe(
      (dados) => {
        if (dados){
          Anamnese = JSON.parse(JSON.stringify(dados));
          Anamnese.AnaData = new Date(Anamnese.AnaData);
        }else{
          Anamnese = new AnamneseModel;
          Anamnese.AnaIdf = 0;
        }
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.AnaIdf = Anamnese.AnaIdf;
        if (this.AnaIdf == 0){
          this.editMode = false;
        }else{
          this.editMode = true;
        }

        this.initForm(Anamnese);
      });
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf,
      AnaIdf: this.AnaIdf,
      AnaData: this.dadosForm.value['data'],
      AnaConvenio: this.dadosForm.value['convenio'],
      AnaRespEmergencia: this.dadosForm.value['respemer'],
      AnaRespEmeFone: this.dadosForm.value['foneemer'],
      AnaRespEmeObs: this.dadosForm.value['obsemer'],
      AnaTipoSangue: this.dadosForm.value['sangue'],
      AnaHipertenso: this.dadosForm.value['hipertenso'],
      AnaDiabetes: this.dadosForm.value['diabetes'],
      AnaCardiaco: this.dadosForm.value['cardiaco'],
      AnaLabirintite: this.dadosForm.value['labirintite'],
      AnaAsma: this.dadosForm.value['asma'],
      AnaConvulcoes: this.dadosForm.value['convulcoes'],
      AnaAlergia: this.dadosForm.value['alergia'],
      AnaDepressao: this.dadosForm.value['depressao'],
      AnaCns6: this.dadosForm.value['cns6'],
      AnaOutras: this.dadosForm.value['outras'],
      AnaMedicamentos: this.dadosForm.value['medicamentos'],
      AnaCirurgia: this.dadosForm.value['cirurgia'],
      AnaOsseo: this.dadosForm.value['osseo'],
      AnaFratura: this.dadosForm.value['fratura'],
      AnaTratamento: this.dadosForm.value['tratamento']
    };    
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      this.updateDadosAnamnese = this.srvAnamnese.updateAnaDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Anamnese atualizado!'});
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
        ...dados,
        AnaStatus: 'A'
    }
    this.addDadosAnamnese = this.srvAnamnese.addAnaDados(dadosAdd).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Anamnese incluido!'});
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
      this.router.navigate(['../alunolista'], {relativeTo: this.route});
    },
    tempo);
  }

  private initForm(dados:AnamneseModel) {   
    this.isLoading = false;
    let AnaData = new Date();
    let AnaConvenio = null;
    let AnaRespEmergencia = null;
    let AnaRespEmeFone = null;
    let AnaRespEmeObs = null;
    let AnaTipoSangue = null;
    let AnaHipertenso = 'N';
    let AnaDiabetes = 'N';
    let AnaCardiaco = 'N';
    let AnaLabirintite = 'N';
    let AnaAsma = 'N';
    let AnaConvulcoes = 'N';
    let AnaAlergia = null;
    let AnaDepressao = 'N';
    let AnaCns6 = 'N';
    let AnaOutras = null;
    let AnaMedicamentos = null;
    let AnaCirurgia = null;
    let AnaOsseo = null;
    let AnaFratura = null;
    let AnaTratamento = null;
   
    if (dados != null)
    {
      AnaData = dados.AnaData;
      AnaConvenio = dados.AnaConvenio;
      AnaRespEmergencia = dados.AnaRespEmergencia;
      AnaRespEmeFone = dados.AnaRespEmeFone;
      AnaRespEmeObs = dados.AnaRespEmeObs;
      AnaTipoSangue = dados.AnaTipoSangue;
      AnaHipertenso = dados.AnaHipertenso;
      AnaDiabetes = dados.AnaDiabetes;
      AnaCardiaco = dados.AnaCardiaco;
      AnaLabirintite = dados.AnaLabirintite;
      AnaAsma = dados.AnaAsma;
      AnaConvulcoes = dados.AnaConvulcoes;
      AnaAlergia = dados.AnaAlergia;
      AnaDepressao = dados.AnaDepressao;
      AnaCns6 = dados.AnaCns6;
      AnaOutras = dados.AnaOutras;
      AnaMedicamentos = dados.AnaMedicamentos;
      AnaCirurgia = dados.AnaCirurgia;
      AnaOsseo = dados.AnaOsseo;
      AnaFratura = dados.AnaFratura;
      AnaTratamento = dados.AnaTratamento;
    }

    let perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    let isTecnico = (perfil == 'A' || perfil == 'T');
    this.isOk = this.AluUsuIdf == this.UsuIdf || isTecnico;
    if (!this.isOk){
      this.router.navigate(['/denied']);
    }

    this.dadosForm = new FormGroup({
      'data': new FormControl(AnaData),
      'convenio': new FormControl(AnaConvenio),
      'respemer': new FormControl(AnaRespEmergencia, Validators.required),
      'foneemer': new FormControl(AnaRespEmeFone, Validators.required),
      'obsemer': new FormControl(AnaRespEmeObs),
      'sangue': new FormControl(AnaTipoSangue),
      'hipertenso': new FormControl(AnaHipertenso),
      'diabetes': new FormControl(AnaDiabetes),
      'cardiaco': new FormControl(AnaCardiaco),
      'labirintite': new FormControl(AnaLabirintite),
      'asma': new FormControl(AnaAsma),
      'convulcoes': new FormControl(AnaConvulcoes),
      'alergia': new FormControl(AnaAlergia),
      'depressao': new FormControl(AnaDepressao),
      'cns6': new FormControl(AnaCns6),
      'outras': new FormControl(AnaOutras),
      'medicamentos': new FormControl(AnaMedicamentos),
      'cirurgia': new FormControl(AnaCirurgia),
      'osseo': new FormControl(AnaOsseo),
      'fratura': new FormControl(AnaFratura),
      'tratamento': new FormControl(AnaTratamento)
    });
  }

  clear() {
    this.messageService.clear();
  }

  ngOnDestroy(): void {
    if (this.lerDados != null){
      this.lerDados.unsubscribe();
    }
    if (this.addDadosAnamnese != null){
      this.addDadosAnamnese.unsubscribe();
    }
    if (this.updateDadosAnamnese != null){
      this.updateDadosAnamnese.unsubscribe();
    }
  }
}
