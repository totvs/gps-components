import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'gps-notification',
    templateUrl: './gps-notification.component.html',
    styleUrls: ['./gps-notification.component.css'],
    standalone: false
})
export class GpsNotificationComponent{  
  @Output('gps-action') gpsAction = new EventEmitter<void>();
  @Output('gps-dropdown-selected-item') gpsDropdownSelectedItem = new EventEmitter<void>();
  @Input('gps-show-close') gpsShowClose: boolean = false;

  protected isShowFeedbackMessage: boolean = false;
  protected feedbackMessage: String;
  protected feedbackMessageType: String;
  protected feedbackMessageIcon: String;
  protected feedbackMessageAction: String;
  protected feedbackMessageArrayOptions: any[];

  constructor(){
    
  }

  showFeedbackMessage(type, icon, message, action?, array?){
    this.isShowFeedbackMessage = true;
    this.feedbackMessage = message;
    this.feedbackMessageType = type;
    this.feedbackMessageIcon = icon;
    this.feedbackMessageAction = action;
    this.feedbackMessageArrayOptions = array;
    

    if (this.feedbackMessageArrayOptions?.length > 0) {
      this.feedbackMessageArrayOptions.forEach((item) => {
        item['action'] = this.onChangeOption.bind(this)
      })
      this.onChangeOption(this.feedbackMessageArrayOptions[0])
    }
  }

  //Troca o texto da mensagem para o label do item do array
  //Emite o objeto
  onChangeOption(item) {
  this.feedbackMessage = item.label;
  this.gpsDropdownSelectedItem.emit(item)
  }

  hideFeedbackMessage(){
    this.isShowFeedbackMessage = false;
    this.feedbackMessage = '';
    this.feedbackMessageType = '';
    this.feedbackMessageIcon = '';
    this.feedbackMessageAction = '';
    this.feedbackMessageArrayOptions = [];
  }

  onExecuteAction(){
    if(this.gpsAction){
      this.gpsAction.emit();
    }
  }

}
