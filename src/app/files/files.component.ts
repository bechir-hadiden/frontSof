import { Component, OnInit } from '@angular/core';
import { AppService } from '../Services/app.service';
import { Router } from '@angular/router';
import { FileData } from '../Model/fileModel';


import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
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


  constructor(private fileUploadService: AppService , private rout :Router , private sanitizer: DomSanitizer , private http: HttpClient) {}



  openDocument(fileName: string): void {
    this.fileUploadService.getDocument(fileName).subscribe({
      next: (blob) => {
        if (blob.size > 0) {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank'); // Ouvre dans un nouvel onglet
        } else {
          console.error("❌ Le fichier reçu est vide.");
          alert("Le fichier est vide.");
        }
      },
      error: (err) => {
        console.error("❌ Erreur lors de l'ouverture du fichier :", err);
        alert("Impossible d'ouvrir le fichier.");
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

  // afficherFichier(file: FileData): void {
  //   // const input = event.target as HTMLInputElement;
  
  //   console.log('Afficher le fichier:', file);
  
  //   if (!(file instanceof Blob)) {
  //     console.error('Le fichier fourni n’est pas un Blob compatible.');
  //     return;
  //   }
  
  //   // const reader = new FileReader(); // Création de l'instance FileReader
  //   // if (file.type === 'application/pdf') {
  //   //   reader.readAsArrayBuffer(file);
  //   // } else if (file.type.startsWith('text/')) {
  //   //   reader.readAsText(file);
  //   // } else {
  //   //   reader.readAsDataURL(file); // Lecture générique pour d'autres types
  //   // }
  
  //   // reader.onload = () => {
  //   //   console.log('Contenu du fichier:', reader.result);
  //   // };
  
  //   // reader.onerror = () => {
  //   //   console.error('Erreur lors de la lecture du fichier:', reader.error);
  //   // };
  // }
  

  
  // rechercheDepartement(){
  //   this.appService.rechercherParNom(this.FileData = this.files).
  //   subscribe(depar => { this.files = file;
  //        console.log(depar)});
  //   }

  // afficherFichier(fileId: any) {
  //   const fileUrl = `http://localhost:8084/api/files/download/${fileId}`;
  //   window.open(fileUrl, '_blank');
  // }
  
  

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
  
  
    
  
    openFile(fileName: any) {
      console.log('Tentative de récupération du fichier : ', fileName);
      this.fileUploadService.getDocument(fileName).subscribe(
        (blob: Blob) => {
          console.log('Blob récupéré avec succès : ', );
          if(blob.type === 'application/json') {
          console.error('Erreur API :', blob);
          }
          if (blob.size > 0) {
            const fileURL = URL.createObjectURL(blob);
            this.selectedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          } else {
            alert('Le fichier est vide.');
          }
        },
        error => {
          console.error('Erreur lors de la récupération du fichier : ', error);
          alert('Impossible de récupérer le fichier. Vérifiez les logs pour plus de détails.');
        }
      );
    }
    

    downloadFile(fileName: any) {
      this.fileUploadService.getFileByName(fileName).subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url); // Ouvre le fichier dans un nouvel onglet
      }, error => {
        console.error('Erreur lors du téléchargement du fichier', error);
      });
    }


    // downloadFile(fileName: string) {
    //   // Correction du nom de la méthode (getDocument au lieu de getFileByName)
    //   this.fileUploadService.getDocument(fileName).subscribe({
    //     next: (blob) => {
    //       const url = window.URL.createObjectURL(blob);
    //       window.open(url); // Ouvre le PDF
    //     },
    //     error: (err) => {
    //       console.error('Erreur:', err);
    //       this.showError(err.message); // Affiche un message d'erreur à l'utilisateur
    //     }
    //   });
    // }
    
    // private showError(message: string) {
    //   // Exemple d'affichage d'une alerte ou mise à jour de l'UI
    //   alert(`Échec du chargement : ${message}`);
    // }

    viewFile() {
      console.log("📂 Nom du fichier envoyé :", this.fileName);
      console.log(`🔍 URL de l'API: http://localhost:8084/sofasoufa/api/files/fileByName/${this.fileName}`);

      this.http.get(`http://localhost:8084/sofasoufa/api/files/fileByName/${this.fileName}`, { responseType: 'blob' })
        .subscribe(blob => {
          console.log("✅ Réponse reçue :", blob);
    
          if (blob.size === 0) {
            console.error("❌ Le fichier reçu est vide !");
            alert("Le fichier est vide ou corrompu !");
            return;
          }
    
          const url = window.URL.createObjectURL(blob);
          this.pdfUrl = url;
          window.open(this.pdfUrl); // Ouvre le fichier dans un nouvel onglet
        }, error => {
          console.error("❌ Erreur lors du chargement du fichier :", error);
          alert("Fichier introuvable !");
        });
    }
    
    




  //   Document(fileName: any): void {
  //     const encodedFilename = encodeURIComponent(fileName);
  //     this.fileUploadService.getDocument(fileName).subscribe(blob => {
  //       if (blob.type === 'application/json') {
  //         blob.text().then(text => console.error('Erreur API :', text));
  //       } else {
  //         const url = URL.createObjectURL(blob);
  //         this.previewUrl = url;
  //       }
  //     }, error => {
  //       console.error('Erreur HTTP :', error);
  //     });
      
    




  // }
  
  

}