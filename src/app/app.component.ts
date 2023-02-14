import { Component } from '@angular/core';
import { Workbook } from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';

let json_data = [{
  "first-name": "",
  "last-name": "",
  "date-of-birth": "",
  "id": "",
  "gender": "",
  "hmo": ""
}
]

//create new excel work book
let workbook = new Workbook();
//add name to sheet
let worksheet = workbook.addWorksheet("Employee Data");
//add column name
let header = ["first-name", "last-name", "date-of-birth", "id", "gender", "hmo"]
worksheet.addRow(header);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ProjectAngular';
  downloadExcel() {
    for (let x1 of json_data) {
      let x2 = Object.keys(x1);
      let temp = []
      for (let y of x2) {
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }
    //set downloadable file name
    let fname = "user details"

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
  }
}
