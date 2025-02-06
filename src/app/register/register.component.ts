import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { User } from '../Model/userModel';
import { ToastrService } from 'ngx-toastr';


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
      this.registrationForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      });
    }
    
    onRegister() {
      if (this.registrationForm.valid) {
        this.loading = true;
        // Récupérer les valeurs du formulaire
        this.user = this.registrationForm.value;
        
        this.authService.registerUser(this.user).subscribe({ 
          next: (res) => { 
            this.authService.setRegistredUser(this.user); 
            this.loading = false;
            this.toastr.success('Inscription réussie!', 'Succès');
            this.router.navigate(["/login"]); 
          }, 
          error: (err: any) => {  
            this.loading = false;
            if(err.error.errorCode == "USER_EMAIL_ALREADY_EXISTS"){ 
              this.toastr.error('Email déjà existant!', 'Erreur');
              this.err = "Email déjà existant!"; 
            } 
          } 
        }); 
      } else {
        this.toastr.error('Veuillez remplir correctement tous les champs', 'Erreur de validation');
      }
    }
  }
