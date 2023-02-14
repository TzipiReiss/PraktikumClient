import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { InstructionsComponent } from './instructions/instructions.component';

const routes: Routes = [
  { path: "form", component: FormComponent },
  { path: "instructions", component: InstructionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
