import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }
  // transform(value: any[], term: string): any[] {
  //   return value.filter(() => value.toLowerCase().startsWith(term.toLowerCase())); //|| x.sekolah.toLowerCase().startsWith(term.toLowerCase()))


  // } 

}
