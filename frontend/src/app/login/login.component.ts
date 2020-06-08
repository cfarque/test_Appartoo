import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
@Injectable()
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  data: object = {};

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({ password: [], email: [] });
  }

  login() {
    this.httpClient
      .post<object>(`${environment.backendServer}/user/login`, {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
      .subscribe(
        (response) => {
          this.data = response;
          const token = response['token'];
          const id = response['id'];
          localStorage.setItem('token', token);
          localStorage.setItem('id', id);
          this.router.navigate(['/home']);
        },
        (error) => {
          console.log('Erreur ! : ' + error.message);
        }
      );
  }
}
