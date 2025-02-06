import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { User } from '../Model/userModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  user = new User();
  message: string = "";
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private formBuilder: FormBuilder
  ) { }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onLoggedin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.message = ""; // Réinitialiser le message d'erreur
      
      // Mettre à jour l'objet user avec les valeurs du formulaire
      this.user.username = this.loginForm.get('username')?.value;
      this.user.password = this.loginForm.get('password')?.value;

      this.authService.login(this.user).subscribe({
        next: (response) => {
          const token = response.headers.get('Authorization');
          if (token) {
            this.authService.saveToken(token); // Assurez-vous d'avoir cette méthode dans votre AuthService
            this.router.navigate(['/departement']);
          }
        },
        error: (error) => {
          console.log(error);
          if (error.error && error.error.errorCause === 'disabled') {
            this.message = "Utilisateur désactivé, veuillez contacter votre administrateur";
          } else if (error.status === 401) {
            this.message = "Identifiant ou mot de passe incorrect";
          } else {
            this.message = "Une erreur est survenue, veuillez réessayer plus tard";
          }
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.message = "Veuillez remplir tous les champs correctement";
    }
  }

  }