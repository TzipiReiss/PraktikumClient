import { Component, OnDestroy, OnInit } from '@angular/core';
import User from '../models/User';
import { UserService } from '../services/user.service';
import Child from '../models/Child';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Workbook } from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit {
  constructor(public userService: UserService) { }
  c: Child[] = []
  today = new Date();
  hmo: { name: string, code: number }[] =
    [{ name: 'Clalit', code: 0 }, { name: 'Leumit', code: 1 },
    { name: 'Maccabi', code: 2 }, { name: 'Meuhedet', code: 3 }]
  save() {
    this.userService.currentUser.hmo = (Number)(this.userService.currentUser.hmo);
    this.userService.currentUser.gender = (Number)(this.userService.currentUser.gender);
    this.downloadExcel()
    this.userService.addUser(this.userService.currentUser)
    this.userService.currentUser = new User(0, null, null, null, null, null, null, this.c);
    this.userService.currentChild = new Child(0, null, null, null, 0);
    this.userService.currentUser.children = []
    this.userService.addChild = false;

  }
  saveChild() {
    this.userService.currentUser.children.push(this.userService.currentChild)
    this.userService.currentChild = new Child(0, null, null, null, 0);
    this.userService.addChild = false;
    console.log(this.userService.currentUser)
    console.log(this.userService.currentUser.children)
  }

  downloadExcel() {
    //create new excel work book
    let workbook1 = new Workbook();
    let workbook2 = new Workbook();
    //add name to sheet
    let worksheet1 = workbook1.addWorksheet("User");
    let worksheet2 = workbook1.addWorksheet("Children");
    //add column name
    let header = ["first-name", "last-name", "date-of-birth", "id", "gender", "hmo"]
    worksheet1.addRow(header);
    header = ["first-name", "date-of-birth", "id"]
    worksheet2.addRow(header);

    let json_data_user = [{
      "first-name": this.userService.currentUser.firstName,
      "last-name": this.userService.currentUser.lastName,
      "date-of-birth": this.userService.currentUser.dateOfBirth?.toLocaleString(),
      "id": this.userService.currentUser.idNumber,
      "gender": this.userService.currentUser?.gender == 1 ? 'male' : 'female',
      "hmo": this.hmo[this.userService.currentUser.hmo]?.name
    }
    ]
    let json_data_children = []
    this.userService.currentUser.children.forEach(element => {
      json_data_children.push({
        "first-name": element.firstName,
        "date-of-birth": element.dateOfBirth?.toLocaleString(),
        "id": element.idNumber
      })
    });

    for (let x1 of json_data_user) {
      let x2 = Object.keys(x1);
      let temp = []
      for (let y of x2) {
        temp.push(x1[y])
      }
      worksheet1.addRow(temp)
    }
    for (let x1 of json_data_children) {
      let x2 = Object.keys(x1);
      let temp = []
      for (let y of x2) {
        temp.push(x1[y])
      }
      worksheet2.addRow(temp)
    }

    //set downloadable file name
    let fname = "user details"

    //add data and file name and download
    workbook1.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
  }

  ngOnInit(): void {
  }
}
