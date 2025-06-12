import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GpsRpwService } from './gps-rpw.service';
import { TotvsGpsRpw } from "../totvs-gps-controls.model"
import { PoComboFilterMode, PoComboOption } from '@po-ui/ng-components';
import { TotvsStringUtils } from 'totvs-gps-utils';

@Component({
    selector: 'gps-rpw',
    templateUrl: './gps-rpw.component.html',
    providers: [GpsRpwService],
    standalone: false
})
export class GpsRpwComponent implements OnInit {
  @Input() model:TotvsGpsRpw;

  private _fileNameHidden:boolean = false;
  public _repeatExecAppointmentMinute:string = '';

  @Input() 
    get fileNameHidden() { return this._fileNameHidden; }
    set fileNameHidden(value:boolean) { this.setFileNameHidden(value) };
  @Input() allowMultipleSessions:boolean;
  @Input() setDefaultServer:boolean = false;
  
  private _repeatExecHidden: boolean = false;
  @Input() 
    set repeatExecHidden(value: boolean) {
	   this._repeatExecHidden = value;
	   if(this._repeatExecHidden) this.model.repeatExecution = false;
	}
	get repeatExecHidden(): boolean {
		return this._repeatExecHidden;
	}
  
  private _executionTimeHidden: boolean = false;
  @Input() 
    set executionTimeHidden(value: boolean) {
	   this._executionTimeHidden = value;
	   if(this._executionTimeHidden) this.model.executionTime = '1';
	}
	get executionTimeHidden(): boolean {
		return this._executionTimeHidden;
	}

  @Output() modelChange:EventEmitter<TotvsGpsRpw> = new EventEmitter();

  
  private totvsStringUtils: TotvsStringUtils = TotvsStringUtils.getInstance();

  repeatUnitOptions:Array<PoComboOption> = [
      {label:'Minuto(s)', value:'1'},
      {label:'Hora(s)', value:'2'},
      {label:'Dia(s)', value:'3'},
      {label:'Mês(es)', value:'4'}];

  currentDate:Date;
  
  active: string;
  disabled: Array<string>;
  hidden: Array<string>;  

  filterMode: PoComboFilterMode.contains;
  
  rpwServerOptions:Array<PoComboOption> = [];
  constructor(
    private totvsGpsRpwService:GpsRpwService,
    private cdRef: ChangeDetectorRef
  ) { }
  
  ngOnInit() {
    this.model = new TotvsGpsRpw();
    this.currentDate = new Date();
    this.model.fileNameHidden = this.fileNameHidden;
    this.model.allowMultipleSessions = this.allowMultipleSessions;
    this.getRpwServers();
  }

  rpwNgModelChange(){    
    if(this.model.repeatExecAppointmentUnit == 2 && this._repeatExecAppointmentMinute){
        this.model.repeatExecAppointmentHour = "00:" + this._repeatExecAppointmentMinute;
    }

    this.modelChange.emit(this.model);
  }

  cleanHours(){ 
    this.model.repeatExecAppointmentHour = undefined;
    this._repeatExecAppointmentMinute = undefined;
  }

  getRpwServers(): any {
    this.totvsGpsRpwService.getServers().then(servers => {
      this.rpwServerOptions = servers.map((s) => {
        return {label:s.serverName, value:s.serverCode}
      });

      if(this.setDefaultServer){
        this.totvsGpsRpwService.getUserServerDefault().then(server => {
          
          if (server && server.serverCode)
            this.model.executionServer = server.serverCode;

          this.cdRef.detectChanges();
          this.rpwNgModelChange();
        });
      }
    });
  }

  static validateFields(info:TotvsGpsRpw):string{

    let dateValidator:any;
   
    if(!info.fileNameHidden){
      if((info.outputFile == "") || (info.outputFile == undefined)) return "Nome do arquivo de saída deve ser informado";
    }
    
    if((info.executionServer == "") || (info.executionServer == undefined)) return "Servidor de execução deve ser informado";
    if((info.executionTime == '0') || (info.executionTime == undefined)) return "Data da execução deve ser informada";
    if(info.executionTime == '2'){
      dateValidator = info.executionAppointmentDate;
      if(dateValidator == "Data fora do período") return "Data fora do período"
      if(info.executionAppointmentDate < new Date()) return "Data deve ser maior que hoje"
      if(!info.executionAppointmentHour) return "Horário deve ser informado"
    }
    if(info.repeatExecution){
      if(info.repeatExecAppointmentUnit == undefined) return "Campo 'Frequência' deve ser informado";
      if(info.repeatExecAppointmentQuantity == undefined) return "Campo 'Repete a cada' deve ser informado";
      
      if(info.repeatExecAppointmentUnit == 4 || info.repeatExecAppointmentUnit == 3){
          if(!info.repeatExecAppointmentHour) return "Horário deve ser informado"
      }

      if(info.repeatExecAppointmentUnit == 2){
        if(!info.repeatExecAppointmentHour) return "Minuto deve ser informado"
      }

      if((info.repeatExecAppointmentUnit == 1 || info.repeatExecAppointmentUnit == 2) && !info.repeatExecFinalHour){
          return "Hora final deve ser informada"
      }

      if(info.repeatExecAppointmentUnit == 4){
          if((info.repeatExecOnLastDayOfMonth == 2) && ((info.repeatExecMonthlyDay == 0)||(info.repeatExecMonthlyDay == undefined))) 
          return "Dia do mês não informado ou inválido";
          if((info.repeatExecOnLastDayOfMonth == 2) && (info.repeatExecMonthlyDay > 31)) 
          return "Dia do mês inválido"
      }

      if(!info.repeatExecFinalDate) return "Data fora do período"
      
      dateValidator = info.repeatExecFinalDate;
      if(dateValidator == "Data fora do período") return "Data fora do período"
      
      if(info.repeatExecFinalDate < new Date()) return "Data deve ser maior que hoje"

      if(info.executionTime == '2' && info.repeatExecFinalDate < dateValidator) return "Data fim da repetição deve ser maior que a data de início de agendamento"
    }

    if(info.multisession && (info.numberOfSessions < 1 || info.numberOfSessions > 99 ))
      return "Numero de sessões inválido."

    return "";
  }
  
  isDisabled(index): boolean {
	return this.disabled.includes(index);
  }
  
  isHidden(index): boolean {
	return this.hidden.includes(index);
  }

  private setFileNameHidden(value:any) {
    let bValue = this.totvsStringUtils.toBoolean(value);
    if (bValue != this._fileNameHidden) {
        this._fileNameHidden = bValue;
    }
  }
}
