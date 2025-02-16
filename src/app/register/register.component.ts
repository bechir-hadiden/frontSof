import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { User } from '../Model/userModel';
import { ToastrService } from 'ngx-toastr';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
  export class RegisterComponent implements OnInit {


    public user = new User();
    confirmPassword?:string;
    myForm!: FormGroup;
    err :any;
    loading: boolean = false;
    registrationForm!: FormGroup;


    constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router , private toastr: ToastrService) { }

   
  ngOnInit() {
    this.loadChart();
  }

  loadChart() {
    new Chart("qualityChart", {
      type: 'bar',
      data: {
        labels: ["Performance", "Efficacité Financière", "Satisfaction Client"],
        datasets: [{
          label: "Score (%)",
          data: [85, 75, 90],
          backgroundColor: ["blue", "green", "orange"]
        }]
      },
      options: {
        responsive: true
      }
    });
  }
  }
