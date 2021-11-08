import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { AlunoService } from './aluno.service';
import { AlunoModel } from 'src/app/model/aluno.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css'],
  providers: [MessageService,ConfirmationService,AlunoService,MessageService]
})
export class AlunoComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  private AluIdf: number = 0;

  dadosForm: FormGroup;

  addDadosAluno: Subscription;
  updateDadosAluno: Subscription;
  deleteDadosAluno: Subscription;
  lerDadosAluno: Subscription;

  isLoading = true;
  editMode = false;

  estados: UF[];
  selectedEstado: UF;
  
  alunoDialog: boolean;

  submitted: boolean;

  isUpdate = true;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvAluno: AlunoService, private messageService: MessageService,
    private confirmationService: ConfirmationService) {

    this.estados = [
      {name: 'Acre', code: 'AC'},
      {name: 'Alagoas', code: 'AL'},
      {name: 'Amapá', code: 'AP'},
      {name: 'Amazonas', code: 'AM'},
      {name: 'Bahia', code: 'BA'},
      {name: 'Ceará', code: 'CE'},
      {name: 'Distrito Federal', code: 'DF'},
      {name: 'Espirito Santo', code: 'ES'},
      {name: 'Goiás', code: 'GO'},
      {name: 'Maranhão', code: 'MA'},
      {name: 'Mato Grosso do Sul', code: 'MS'},
      {name: 'Mato Grosso', code: 'MT'},
      {name: 'Minas Gerais', code: 'MG'},
      {name: 'Paraná', code: 'PR'},
      {name: 'Paraíba', code: 'PB'},
      {name: 'Pará', code: 'PA'},
      {name: 'Pernambuco', code: 'PE'},
      {name: 'Piauí', code: 'PI'},
      {name: 'Rio Grande do Norte', code: 'RN'},
      {name: 'Rio Grande do Sul', code: 'RS'},
      {name: 'Rio de Janeiro', code: 'RJ'},
      {name: 'Rondonia', code: 'RO'},
      {name: 'Roraima', code: 'RR'},
      {name: 'Santa Catarina', code: 'SC'},
      {name: 'Sergipe', code: 'SE'},
      {name: 'São Paulo', code: 'SP'},
      {name: 'Tocantins', code: 'TO'}
    ];    
   }
  ngOnDestroy(): void {
    if (this.lerDadosAluno != null){
      this.lerDadosAluno.unsubscribe();
    }
    if (this.addDadosAluno != null){
      this.addDadosAluno.unsubscribe();
    }
    if (this.updateDadosAluno != null){
      this.updateDadosAluno.unsubscribe();
    }
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.EmpIdf = params.EmpIdf;
        this.AluIdf = params.AluIdf;
        if (params.Modo == "EDIT")
        {
          this.editMode = true;
          this.getAluno();
        } else {
          this.editMode = false;
          let Aluno: AlunoModel;
          this.initForm(Aluno);
        }
      }
    );
  }

  private getAluno() {
    let Aluno: AlunoModel;
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf
    };
    this.lerDadosAluno = this.srvAluno.getDados(dados).subscribe(
      (dados) => {
        Aluno = JSON.parse(JSON.stringify(dados));
        Aluno.AluDataNasc = new Date(Aluno.AluDataNasc);
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.initForm(Aluno);
      });
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.EmpIdf,
      AluNome: this.dadosForm.value['nome'],
      AluCPF:  this.dadosForm.value['cpf'],
      AluDataNasc: this.dadosForm.value['nascimento'],
      AluNomeResp: this.dadosForm.value['resp'],
      AluFoneResp: this.dadosForm.value['foneresp'],
      AluFone: this.dadosForm.value['fone'],
      AluLogradouro: this.dadosForm.value['logradouro'],
      AluLogNum: this.dadosForm.value['lognum'],
      AluBairro: this.dadosForm.value['bairro'],
      AluCidade: this.dadosForm.value['cidade'],
      AluUF: this.dadosForm.value['uf'],
      AluEmail: this.dadosForm.value['email'],
      AluPeso: this.dadosForm.value['peso'],
      AluAltura: this.dadosForm.value['altura']
    };    
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      this.updateDadosAluno = this.srvAluno.updateDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Aluno atualizado!'});
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
        AluStatus: 'A'
     }
      this.addDadosAluno = this.srvAluno.addDados(dadosAdd).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Aluno incluido!'});
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
    this.retorno();
  }

  private retorno(){
    setTimeout(() => 
    {
      this.router.navigate(['../alunolista'], {relativeTo: this.route});
    },
    3010);
  }

  private initForm(dados:AlunoModel) {   
    this.isLoading = false;
    let AluNome = null;
    let AluCPF = null;
    let AluDataNasc = null;
    let AluNomeResp = null;
    let AluFoneResp = null;
    let AluFone = null;
    let AluLogradouro = null;
    let AluLogNum = null;
    let AluBairro = null;
    let AluCidade = null;
    let AluUF = null;
    let AluEmail = null;
    let AluPeso = null;
    let AluAltura = null;
   
    if (dados != null)
    {
      AluNome = dados.AluNome;
      AluCPF = dados.AluCPF;
      AluNome = dados.AluNome;
      AluCPF = dados.AluCPF;		
      AluDataNasc = dados.AluDataNasc;
      AluNomeResp = dados.AluNomeResp;
      AluFoneResp = dados.AluFoneResp;
      AluFone = dados.AluFone;
      AluLogradouro = dados.AluLogradouro;
      AluLogNum = dados.AluLogNum;
      AluBairro = dados.AluBairro;
      AluCidade = dados.AluCidade;
      AluUF = dados.AluUF;
      AluEmail = dados.AluEmail;
      AluPeso = dados.AluPeso;
      AluAltura = dados.AluAltura;    
    }
    this.dadosForm = new FormGroup({
      'nome': new FormControl(AluNome, Validators.required),
      'cpf': new FormControl(AluCPF),
      'nascimento': new FormControl(AluDataNasc),
      'resp': new FormControl(AluNomeResp),
      'foneresp': new FormControl(AluFoneResp),
      'fone': new FormControl(AluFone),
      'logradouro': new FormControl(AluLogradouro),
      'lognum': new FormControl(AluLogNum),
      'bairro': new FormControl(AluBairro),
      'cidade': new FormControl(AluCidade),
      'uf': new FormControl(AluUF),
      'email': new FormControl(AluEmail, Validators.email),
      'peso': new FormControl(AluPeso, Validators.max(300)),
      'altura': new FormControl(AluAltura, Validators.max(2.9))
    });
  }

  clear() {
    this.messageService.clear();
  }    

}

interface UF {
  name: string,
  code: string
}