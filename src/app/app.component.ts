import { Component } from '@angular/core';
import { AppService } from './Services/app.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  pdfSrc !: any ; 
  selectedFile: File | null = null;
  uploadMessage!: any

  constructor(private http: HttpClient , private fileUploadService : AppService) {}

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
