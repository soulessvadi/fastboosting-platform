import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {
  transform(value: any, format?: any): any {
    return moment(value).format(format);
  }
}

@Pipe({
  name: 'momentFromNow'
})
export class MomentFromNowPipe implements PipeTransform {
  transform(value: any, format?: any): any {
    if (Math.abs(moment().diff(value)) < 30000) {
        return 'только что';
    } else if (moment(value).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
    	return 'сегодня ' + moment(value).format('HH:mm');
    }
    return moment(value).format(format);
  }
}
