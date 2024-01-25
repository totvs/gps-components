import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'gps-notification',
  templateUrl: './gps-notification.component.html',
  styleUrls: ['./gps-notification.component.css']
})
export class GpsNotificationComponent{  
  @Output('gps-action') gpsAction = new EventEmitter<void>();
  @Input('gps-show-close') gpsShowClose: boolean = false;

  protected isShowFeedbackMessage: boolean = false;
  protected feedbackMessage: String;
  protected feedbackMessageType: String;
  protected feedbackMessageIcon: String;
  protected feedbackMessageAction: String;

  constructor(){
    
  }

  showFeedbackMessage(type, icon, message, action?){
    this.isShowFeedbackMessage = true;
    this.feedbackMessage = message;
    this.feedbackMessageType = type;
    this.feedbackMessageIcon = icon;
    this.feedbackMessageAction = action;
  }

  hideFeedbackMessage(){
    this.isShowFeedbackMessage = false;
    this.feedbackMessage = '';
    this.feedbackMessageType = '';
    this.feedbackMessageIcon = '';
    this.feedbackMessageAction = '';
  }

  onExecuteAction(){
    if(this.gpsAction){
      this.gpsAction.emit();
    }
  }

}