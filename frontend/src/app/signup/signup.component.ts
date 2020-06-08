import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
@Injectable()
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  data: object = {};

  emailReg = new RegExp(/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i);
  passwordReg = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-])/
  );
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      password: [],
      email: [],
      username: [],
      secondPassword: [],
    });
  }

  signup() {
    if (
      this.signupForm.value.email &&
      this.signupForm.value.username &&
      this.signupForm.value.secondPassword &&
      this.signupForm.value.password
    ) {
      if (
        this.signupForm.value.secondPassword === this.signupForm.value.password
      ) {
        if (this.emailReg.test(this.signupForm.value.email)) {
          if (this.passwordReg.test(this.signupForm.value.password)) {
            this.httpClient
              .post<object>(`${environment.backendServer}/user/signup`, {
                email: this.signupForm.value.email,
                password: this.signupForm.value.password,
                username: this.signupForm.value.username,
              })
              .subscribe(
                (response) => {
                  this.data = response;
                  const token = response['token'];
                  const id = response['id'];
                  localStorage.setItem('token', token);
                  localStorage.setItem('id', id);
                  if (token && id) {
                    this.router.navigate(['/home']);
                  } else {
                    alert('an error was occured');
                  }
                },
                (error) => {
                  alert('Erreur ! : ' + error.message);
                }
              );
          } else {
            alert(
              'le mot de passe doit contenir au moins 1 nombre, 1 majuscule, 1 minuscule, 1 caractère spécial'
            );
          }
        } else {
          alert('Email incorrect');
        }
      } else {
        alert('Les deux mots de passe ne sont pas identiques');
      }
    } else {
      alert('Tous les champs doivent être remplis');
    }
  }
}
