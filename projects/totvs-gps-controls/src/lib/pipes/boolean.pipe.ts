import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'boolean',
    standalone: false
})
export class BooleanPipe implements PipeTransform {
    transform(value): any {
		if (!!value)
    		return 'Sim';
    	return 'Não';
  	}
}
