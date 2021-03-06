import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UsuarioModel} from '../../model/usuario.model';

@Injectable()
export class UsuarioService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<UsuarioModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<UsuarioModel>(this.url + "/api/usuario/create", body, httpOptions);
    }

    getDados(body:any): Observable<UsuarioModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<UsuarioModel>(this.url + "/api/usuario/find", body, httpOptions);
    }

    getTodos(body:any): Observable<UsuarioModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<UsuarioModel>(this.url + "/api/usuario/findall", body, httpOptions);
    }

    updateDados(body:any): Observable<UsuarioModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<UsuarioModel>(this.url + "/api/usuario/update", body, httpOptions);
    }

    deleteDados(body:any): Observable<UsuarioModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<UsuarioModel>(this.url + "/api/usuario/delete", body, httpOptions);
    }

    saveAcesso(body:any): Observable<UsuarioModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<UsuarioModel>(this.url + "/api/acesso/create", body, httpOptions);
    }
}