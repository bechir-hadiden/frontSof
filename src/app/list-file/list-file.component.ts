import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as mammoth from 'mammoth';
import { AppService } from '../Services/app.service';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-list-file',
  standalone : false ,
  templateUrl: './list-file.component.html',
  styleUrl: './list-file.component.css'
})
export class ListFileComponent {
  pdfSrc !: any ; 
  selectedFile: File | null = null;
  uploadMessage!: any
  reponse !: any ;

  constructor(private http: HttpClient , private fileUploadService : AppService , public authService : AuthService) {}

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
        }
      });
    } else {
      console.warn('Aucun fichier sélectionné.');
      this.uploadMessage = 'Veuillez sélectionner un fichier.';
    }
  }

}