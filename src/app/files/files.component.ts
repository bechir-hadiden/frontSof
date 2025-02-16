import { Component, OnInit } from '@angular/core';
import { AppService } from '../Services/app.service';
import { Router } from '@angular/router';
import { FileData } from '../Model/fileModel';


import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../Model/userModel';
import { AuthService } from '../Services/auth.service';
@Component({
  selector: 'app-files',
  standalone: false,
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent implements OnInit {
  files!:FileData[] ;
  pdfSrc !: any ; 
  selectedFile: File | null = null;
  uploadMessage!: any
  selectedFileUrl: SafeResourceUrl | null = null;
  previewUrl: any;
  file: FileData = new FileData();  // Objet FileModel
  fileName = '';
  pdfUrl: string | null = null;  // URL du PDF généré
  isModalOpen = false;
  userForm: FormGroup;
  enteredUserName: string | null = null; // Ajoutez cette propriété
  userName: string | null = null;
  user = new User();

  constructor(private authServices: AuthService ,private fb: FormBuilder ,  private fileUploadService: AppService , private rout :Router , private sanitizer: DomSanitizer , private http: HttpClient) {
       this.userForm = this.fb.group({
          username: ['', Validators.required]
        });
  }
  promptUserName(): void {
    const userName = prompt("Nom d'utilisateur:");
    if (!userName || userName.length < 3) {
      alert("Nom d'utilisateur invalide (min. 3 caractères)");
      return;
    }

    this.authServices.login({ UserName: userName }).subscribe({
      next: (response) => {
        if (response.status === 201) {
          console.log('Enregistré !', response.body);
          // Déclencher l'upload
          const fileInput = document.getElementById('fileInput');
          fileInput?.click();
        }
      },
      error: (error) => {
        let errorMessage = "Erreur inconnue";
        if (error.error?.message) {
          errorMessage = error.error.message; // Message personnalisé du backend
        } else if (error.status === 0) {
          errorMessage = "Connexion au serveur impossible";
        }
        alert(errorMessage);
      }
    });
  }

  ngOnInit(): void {
    this.fileUploadService.getAllFiles().subscribe(data => {
      this.files = data; // Stockez les fichiers dans la liste
      console.log("slm alikom2 " , this.files); // Vérifiez ici si les fichiers sont correctement reçus
      console.log("slm alikom2 " , this.files); // Vérifiez ici si les fichiers sont correctement reçus

      this.files.forEach(file => {
        console.log('Fichier:',file.fileName  );;
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];

      if (file.type === 'application/pdf') {
        this.selectedFile = file;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.pdfSrc = e.target?.result;
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert('Veuillez sélectionner un fichier PDF.');
      }
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      console.log('Envoi du fichier :', this.selectedFile.name);
      this.fileUploadService.uploadFile(this.selectedFile).subscribe({
        next: (response) => {
          console.log('Réponse du serveur :', response);
          this.uploadMessage = response;
        },
        error: (err) => {
          console.error('Erreur lors de l\'upload :', err);
          this.uploadMessage = 'Erreur lors de l\'upload du fichier.';
          this.rout.navigate(['/files']);
        }
      });
    } else {
      console.warn('Aucun fichier sélectionné.');
      this.uploadMessage = 'Veuillez sélectionner un fichier.';
    }
  }  



  // getDocument(fileName: string)  {
  //   const encodedFilename = encodeURIComponent(fileName);
  //   this.fileUploadService.getDocument(encodedFilename).subscribe(
  //     (data) => {
  //       console.log("Données reçues :", data);
  //       if (data.size === 0) {
  //         alert("Le fichier est vide !");
  //         return;
  //       }
  //       const blob = new Blob([data], { type: 'application/pdf' });
  //       console.log("Blob créé :", blob);
        
  //       if (blob.size === 0) {
  //         alert("Le fichier récupéré est vide !");
  //         return;
  //       }
  
  //       const url = window.URL.createObjectURL(blob);
  //       window.open(url);
  //     },
  //     (error) => {
  //       console.error("Erreur lors de la récupération du fichier :", error);
  //       alert("Échec de récupération du fichier !");
  //     }
  //   );
  // }
   

   

    downloadFile(fileName: any) {
      this.fileUploadService.getFileByName(fileName).subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url); 
      }, error => {
        console.error('Erreur lors du téléchargement du fichier', error);
      });
    }

    openModal(): void {
      if (this.selectedFile) {
        this.isModalOpen = true;
      } 
    }

    closeModal(): void {
      this.isModalOpen = false;
      this.userForm.reset();
    }

    onSubmit(): void {
      if (this.userForm.valid) {
        const username = this.userForm.get('username')?.value;
        // Ici vous pouvez combiner l'upload du fichier avec le nom d'utilisateur
        this.uploadFile(); // Votre fonction d'upload existante
        this.closeModal();
      }
    }  

}