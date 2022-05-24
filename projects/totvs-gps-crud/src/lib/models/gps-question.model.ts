export class GpsQuestion{

    sequence:number;
    description:string;
    get descriptionFormatted(){ 
        return this.description.split('\n').map(val => val + '<br />').join('');
    }

    constructor(){}
}