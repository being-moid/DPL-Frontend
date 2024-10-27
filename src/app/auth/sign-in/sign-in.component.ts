import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule} from '@angular/forms';
import AuthService from './service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';



@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],

  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {
  fb:FormBuilder =inject(FormBuilder);
  form:FormGroup;
  Router:Router = inject(Router);
  authService =inject(AuthService);
  constructor(){
    this.form=this.fb.group({
      typeOfUser:[null],
      email:['abc@dpl.com'],
      password:['123']
    })
  }
  ngOnInit(): void {

  }
  toggle=true;

  login(e:any){
    console.log('wokring')
    e.preventDefault();
    let username = this.form.get('email')?.value;
    let password = this.form.get('password')?.value;
    if(username && password){
      this.authService.getAuth(username,password).subscribe(res=>{
        if(res){
          this.authService.Authorized.subscribe(res=>{
            if(res){
              localStorage.setItem('authToken',res.token);
              this.Router.navigateByUrl('/dashboard')
            }
          })
        }
      });

    }
  }
}
