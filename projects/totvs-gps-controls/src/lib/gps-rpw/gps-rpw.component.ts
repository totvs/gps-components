import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GpsRpwService } from './gps-rpw.service';
import { TotvsGpsRpw } from "../totvs-gps-controls.model"
import { PoComboFilterMode, PoComboOption } from '@po-ui/ng-components';
import { TotvsStringUtils } from 'totvs-gps-utils';

@Component({
  selector: 'gps-rpw',
  templateUrl: './gps-rpw.component.html',
  providers:[GpsRpwService]
})
export class GpsRpwComponent implements OnInit {
  @Input() model:TotvsGpsRpw;

  private _fileNameHidden:boolean = false;
  @Input() 
    get fileNameHidden() { return this._fileNameHidden; }
    set fileNameHidden(value:boolean) { this.setFileNameHidden(value) };
  @Input() allowMultipleSessions:boolean;
  
  private _repeatExecHidden: boolean = false;
  @Input() 
    set repeatExecHidden(value: boolean) {
	   this._repeatExecHidden = value;
	   if(this._repeatExecHidden) this.model.repeatExecution = false;
	}
	get repeatExecHidden(): boolean {
		return this._repeatExecHidden;
	}

  @Output() modelChange:EventEmitter<TotvsGpsRpw> = new EventEmitter();

  
  private totvsStringUtils: TotvsStringUtils = TotvsStringUtils.getInstance();
  repeatExecutionPatternOptions = [{ label: 'Diária', value: 1 },{ label: 'Mensal', value: 2 }];
  repeatEachDailyOptions:Array<PoComboOption> = [];
  repeatEachWeeklyOptions:Array<PoComboOption> = [];  
  repeatEachMonthlyOptions:Array<PoComboOption> = [];

  currentDate:Date;

  days = [];
  weeks = [];
  weekDays = [
    {label:'Domingo', value:'0'},
    {label:'Segunda', value:'1'},
    {label:'Terça', value:'2'},
    {label:'Quarta', value:'3'},
    {label:'Quinta', value:'4'},
    {label:'Sexta', value:'5'},
    {label:'Sábado', value:'6'}];
  months = [];
  
  active: string;
  disabled: Array<string>;
  hidden: Array<string>;  

  filterMode: PoComboFilterMode.contains;
  
  rpwServerOptions:Array<PoComboOption> = [];
  constructor(private totvsGpsRpwService:GpsRpwService) { }
  
  ngOnInit() {
    this.model = new TotvsGpsRpw();
    this.currentDate = new Date();
    this.model.fileNameHidden = this.fileNameHidden;
    this.model.allowMultipleSessions = this.allowMultipleSessions;
    this.getRpwServers();
    this.restoreTabs();
    this.initializeRepeatEachOptions();
  }

  rpwNgModelChange(){    
    this.modelChange.emit(this.model);
  }

  getRpwServers(): any {
    this.totvsGpsRpwService.getServers().then(servers => {
      this.rpwServerOptions = servers.map((s) => {
        return {label:s.serverName, value:s.serverCode}
      });
    });
  }

  initializeRepeatEachOptions(){
    this.repeatEachDailyOptions = []
    this.repeatEachWeeklyOptions = []
    this.repeatEachMonthlyOptions = []

    this.repeatEachDailyOptions.push(...this.getDays());
    this.repeatEachWeeklyOptions.push(...this.getWeeks());
    this.repeatEachMonthlyOptions.push(...this.getMonths());
  }
  
  restoreTabs() {
    this.model.activeTab = 1;
    this.disabled = [];
    this.hidden = [];
  }

  setActiveTab(n) {
    this.model.activeTab = n;
    this.model.repeatExecPattern = n;
    this.rpwNgModelChange();
  }

  getDays(){
    for(let i = 0; i < 31; i++)      
      this.days[i] = i;
    
    return this.days.map((d, i) => (i === 0) ? {label: (i + 1) + ' dia', value: (i + 1) } : {label: (i + 1) + ' dias', value:(i + 1) });    
  }

  getWeeks(){
    for(let i = 1; i < 29; i++)
      this.weeks[i-1] = i;

    return this.weeks.map((d, i) => (i === 0) ? {label: (i + 1) + ' semana', value: (i + 1) } : {label: (i + 1) + ' semanas', value: (i + 1) });
  }

  getMonths(){
    for(let i = 1; i <= 12; i++) 
      this.months[i-1] = i;
    
    return this.months.map((d, i) => (i === 0) ? {label: (i + 1) + ' mês', value: (i + 1) } : {label: (i + 1) + ' meses', value: (i + 1) });
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
      if(info.activeTab == 1){
        if(info.repeatExecAppointmentDaily == undefined) return "Campo 'repete a cada' deve ser informado";
        if(!info.repeatExecAppointmentHourDaily) return "Horário deve ser informado"
      }else if(info.activeTab == 2){
        if(info.repeatExecAppointmentMonthly == undefined) return "Campo 'repete a cada' deve ser informado";
        if(!info.repeatExecAppointmentHourMonthly) return "Horário deve ser informado"
        if((info.repeatExecOnLastDayOfMonth == 2) && ((info.repeatExecMonthlyDay == 0)||(info.repeatExecMonthlyDay == undefined))) 
          return "Dia do mês não informado ou inválido";
        if((info.repeatExecOnLastDayOfMonth == 2) && (info.repeatExecMonthlyDay > 31)) 
          return "Dia do mês inválido"
      }
      if(!info.repeatExecFinalDate) return "Data fora do período"
      
      dateValidator = info.repeatExecFinalDate;
      if(dateValidator == "Data fora do período") return "Data fora do período"
      
      if(info.repeatExecFinalDate < new Date()) return "Data deve ser maior que hoje"
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
