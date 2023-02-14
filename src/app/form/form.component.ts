import { Component, OnDestroy, OnInit } from '@angular/core';
import User from '../models/User';
import { UserService } from '../services/user.service';
import { angularMath } from 'angular-ts-math/dist/angular-ts-math/angular-ts-math';
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
  hmoControl = new FormControl(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  hmo: { name: string, code: number }[] =
    [{ name: 'Clalit', code: 0 }, { name: 'Leumit', code: 1 },
    { name: 'Maccabi', code: 2 }, { name: 'Meuhedet', code: 3 }]
  data = [];
  save() {
    this.userService.currentUser.hmo = (Number)(this.userService.currentUser.hmo);
    this.userService.currentUser.gender = (Number)(this.userService.currentUser.gender);
    this.downloadExcel()
    this.userService.addUser(this.userService.currentUser).subscribe(succ => {
      console.log(succ);
      this.data.push(this.userService.currentUser);

    });
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

  // idVerification(id: String) {
  //   if (id.length == 8 || id.length == 9) {
  //     idNumber: Number = parseNum(id);
  //      idArray:Number[]=[];

  //     while (idArray.Count < 9) {
  //                   int digit = idNumber % 10;
  //       idNumber /= 10;
  //       idArray.Add(digit);
  //     }
  //     var sum = 0;
  //     for (int index = idArray.Count - 1; index >= 0; index--)
  //     {
  //       if (index % 2 != 0) {
  //         var digit = idArray[index];
  //         digit *= 2;
  //         if (digit >= 10) {
  //                           int last = digit % 10;
  //                           int first = digit / 10;
  //           digit = last + first;
  //         }
  //         idArray[index] = digit;
  //       }
  //       sum += idArray[index];
  //     }

  //     if ((sum >= 10) && (sum % 10 == 0)) {
  //       return true;
  //     }
  //   }

  //   return false;
  // }
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

    // for (let x1 of json_data) {
    //   let x2 = Object.keys(x1);
    //   let temp = []
    //   for (let y of x2) {
    //     temp.push(x1[y])
    //   }
    //   worksheet1.addRow(temp)
    // }

    //set downloadable file name
    let fname = "user details"

    //add data and file name and download
    workbook1.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
  }
  cheakDateUser() {
    if (this.userService.currentUser.dateOfBirth) {
      if (this.userService.currentUser.dateOfBirth.getFullYear < this.today.getFullYear)
        return true;
    }
    return false;
  }
  cheakDateChild() {
    if (this.userService.currentChild.dateOfBirth) {
      if (this.userService.currentChild.dateOfBirth.getFullYear < this.today.getFullYear &&
        this.userService.currentChild.dateOfBirth.getFullYear < this.userService.currentUser.dateOfBirth.getFullYear)
        return true;
    }
    return false;
  }

  ngOnInit(): void {
  }
}