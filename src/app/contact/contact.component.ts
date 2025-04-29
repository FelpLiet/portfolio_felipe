import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForm }    from '@angular/forms';
import emailjs       from 'emailjs-com';
import { environment } from '../../environments/environment';
import { ConstNode } from 'three/examples/jsm/nodes/Nodes.js';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})

export class ContactComponent {
  sending = false;
  feedback?: string;

  onSubmit(form: NgForm, formElement: HTMLFormElement) {
    if (!form.valid) return;
    this.sending = true;
    console.log(environment.emailJs.userId);
    emailjs.sendForm(
      environment.emailJs.serviceId,
      environment.emailJs.templateId,
      formElement,                 
      environment.emailJs.userId
    ).then(() => {
      this.feedback = 'E-mail enviado com sucesso!';
      form.resetForm();             
    }).catch(err => {
      console.error(err);
      this.feedback = 'Falha ao enviar e‑mail.';
    }).finally(() => this.sending = false);
  }
}
