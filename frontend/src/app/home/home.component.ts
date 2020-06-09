import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import 'moment/locale/fr';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  addFriendsForm: FormGroup;
  updateForm: FormGroup;
  data: object;
  friends: object;
  dateOfBirth;
  loader: boolean = true;
  response: {};

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      password: [],
      breed: [],
      subfamily: [],
      email: [],
      dateOfBirth: [],
      username: [],
      food: [],
    });
    this.addFriendsForm = this.fb.group({
      friends: [],
    });
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    this.httpClient
      .get<object>(`${environment.backendServer}/user/read/${id}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .subscribe(
        (response) => {
          this.data = response;
          this.friends = response['account']['friends'];
          this.dateOfBirth = moment(response['account']['dateOfBirth']).format(
            'L'
          );
          this.loader = false;
        },
        (error) => {
          console.log('Erreur ! : ' + error.message);
          this.loader = false;
        }
      );
  }
  update() {
    console.log('test');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    this.httpClient
      .post<object>(
        `${environment.backendServer}/user/update/${id}`,
        {
          password: this.updateForm.value.password,
          breed: this.updateForm.value.breed,
          subfamily: this.updateForm.value.subfamily,
          email: this.updateForm.value.email,
          dateOfBirth: this.updateForm.value.dateOfBirth,
          username: this.updateForm.value.username,
          food: this.updateForm.value.food,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      )
      .subscribe(
        (response) => {
          this.data = response;
          this.dateOfBirth = moment(response['account']['dateOfBirth']).format(
            'L'
          );
        },
        (error) => {
          console.log('Erreur ! : ' + error.message);
        }
      );
  }

  updateFriends() {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    this.httpClient
      .post<object>(
        `${environment.backendServer}/user/update/friend/${id}`,
        {
          friends: this.addFriendsForm.value.friends,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      )
      .subscribe(
        (response) => {
          console.log(response);
          if (response['friends']) {
            this.data = response;
            this.friends = response['friends'];
          } else {
            alert(response['message']);
          }
        },
        (error) => {
          console.log('Erreur ! : ' + error.message);
        }
      );
  }

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
