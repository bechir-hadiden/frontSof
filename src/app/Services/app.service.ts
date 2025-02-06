import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { FileData } from '../Model/fileModel';
import pdfMake from 'pdfmake/build/pdfmake';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private baseUrl = 'http://localhost:8084/sofasoufa/api/files/upload'; // URL du backend
  private baseUrlget = 'http://localhost:8084/sofasoufa/api/files/all';
  private baseUrlgetNom = 'http://localhost:8084/sofasoufa/api/files/fileByName';

  private baseUrlA   = 'http://localhost:8084/sofasoufa/api/files/fileByName';

  constructor(private http: HttpClient) {}




  openFile(fileName: string) {
    const encodedFileName = encodeURIComponent(fileName);
    const url = `${this.baseUrlA}/${encodedFileName}`;
  
    this.http.get(url, { 
      responseType: 'blob',
      observe: 'response' // Nécessaire pour vérifier les headers
    }).subscribe({
      next: (response) => {
        // Vérification 1 : Contenu non vide
        if (!response.body || response.body.size === 0) {
          throw new Error('Fichier vide reçu');
        }
  
        // Vérification 2 : Type MIME correct
        const contentType = response.headers.get('Content-Type');
        if (contentType !== 'application/pdf') {
          throw new Error(`Type de fichier invalide: ${contentType}`);
        }
  
        // Création du Blob
        const blob = new Blob([response.body], { type: 'application/pdf' });
        
        // Création de l'URL
        const fileURL = URL.createObjectURL(blob);
        
        // Ouverture dans un nouvel onglet
        const newWindow = window.open(fileURL, '_blank');
        
        // Gestion des bloqueurs de popup
        if (!newWindow || newWindow.closed) {
          alert('Autorisez les popups pour afficher le PDF');
        }
        
        // Nettoyage mémoire
        setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
      },
      error: (err) => {
        // Gestion des erreurs serveur
        // if (err.error instanceof Blob) {
        //   const reader = new FileReader();
        //   reader.onload = (e) => {
        //     try {
        //       const error = JSON.parse(e.target?.result as string);
        //       console.error('Erreur serveur:', error.message);
        //     } catch (parseError) {
        //       console.error('Erreur inconnue:', err.statusText);
        //     }
        //   };
        //   reader.readAsText(err.error);
        // } else {
        //   console.error('Erreur réseau:', err.message);
        // }
      },
      complete: () => console.log('Téléchargement PDF terminé')
    });
  }



  // getFile(fileName: any): Observable<Blob> {
  //   const encodedFilename = encodeURIComponent(fileName);

  //   return this.http.get(`${this.baseUrlgetNom}/${encodedFilename}`, { responseType: 'blob' });
  // }

  uploadFile(file: File): Observable<{ message: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<{ message: string }>(this.baseUrl, formData).pipe(
        tap(response => {
            console.log('Réponse du backend :', response);
        }),
        catchError((error: HttpErrorResponse) => {
            console.error('Erreur lors de l\'envoi du fichier', error);
            return throwError(() => error);
        })
    );
}
  
  getAllFiles(): Observable<FileData[]> {
    
    const url = this.http.get<FileData[]>(this.baseUrlget);
    return url 
    console.log(url);

  }


  rechercherParNom(nomcol: string): Observable<File[]> {
    const url = `${this.baseUrlgetNom}/search/${File.name}`;
    // Utilisation de la méthode http.get avec les options
    return this.http.get<File[]>(url);



  }

  getDocument(fileName: string): Observable<any> {
    const encodedFilename = encodeURIComponent(fileName);
    return this.http.get(`${this.baseUrlA}/${encodedFilename}`, {
      responseType: 'blob'
    }).pipe(
      tap(blob => {
        if (blob.type === 'application/json') {
          blob.text().then(text => console.error('❌ Erreur API reçue :', text));
        }
      }),
      catchError(error => {
        console.error('❌ Erreur HTTP :', error);
        return throwError(error);
      })
    );
  }



  getFileByName(fileName: any): Observable<Blob> {
    const url = `${this.baseUrlA}/${fileName}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((blob: Blob) => {
        return new Blob([blob], { type: 'application/pdf' }); // Définit explicitement le type MIME
      })
    );
  }


  // getDocument(fileName: any): Observable<Blob> {
  //   const encodedFilename = encodeURIComponent(fileName);
  //   return this.http.get(`${this.baseUrlA}/${encodedFilename}`, {
  //     responseType: 'blob'
  //   }).pipe(
  //     switchMap(blob => {
  //       // Vérifie si le blob est une erreur JSON
  //       if (blob.type === 'application/json') {
  //         return from(blob.text()).pipe(
  //           switchMap(text => {
  //             const error = JSON.parse(text);
  //             console.error('❌ Erreur API :', error);
  //             return throwError(() => new Error(error.message || 'Erreur serveur'));
  //           })
  //         );
  //       }
  //       return of(blob);
  //     }),
  //     catchError(error => {
  //       console.error('❌ Erreur HTTP :', error);
  //       return throwError(() => new Error('Impossible de charger le document'));
  //     })
  //   );
  // }

  // getFile(fileName: string): Observable<Blob> {
  //   return this.http.get(`${this.baseUrlA}/${encodeURIComponent(fileName)}`, {
  //     responseType: 'blob',
  //     observe: 'events'
  //   }).pipe(
  //     tap(event => {
  //       if (event instanceof HttpResponse) {
  //         if (event.body && event.body.size === 0) {
  //           throw new Error('Fichier vide');
  //         }
  //       }
  //     }),
  //     filter(event => event instanceof HttpResponse),
  //     map(event => (event as HttpResponse<Blob>).body),
  //     filter(body => body !== null),
  //     map(body => body as Blob),
  //     catchError(error => {
  //       if (error.error instanceof Blob) {
  //         const reader = new FileReader();
  //         reader.onload = (e) => {
  //           if (e.target) {
  //             console.error('Erreur serveur :', JSON.parse(e.target.result as string));
  //           } else {
  //             console.error('Erreur serveur : e.target is null');
  //           }
  //         };
  //         reader.readAsText(error.error);
  //       }
  //       return throwError(() => error);
  //     })
  //   );
  // }
}
  
  
  // getDocument(fileName: string): Observable<Blob> {
  //   const encodedFilename = encodeURIComponent(fileName);
  //   return new Observable<Blob>((observer) => {
  //     this.http.get(`${this.baseUrlgetNom}/${encodedFilename}`, {
  //       responseType: 'arraybuffer',
  //       observe: 'response'
  //     }).subscribe(
  //       (response) => {
  //         console.log("Statut HTTP :", response.status);
  //         console.log("Headers :", response.headers);
  //         console.log("Données reçues :", response.body);
    
  //         if (response.body) {
  //           console.log("Taille du fichier reçu :", response.body.byteLength);
    
  //           if (response.body.byteLength < 500) { // Un PDF est généralement plus grand
  //             console.warn("Le fichier semble trop petit pour être un PDF valide.");
              
  //             // 🔹 Convertir la réponse en texte et l'afficher
  //             const textDecoder = new TextDecoder("utf-8");
  //             const responseText = textDecoder.decode(new Uint8Array(response.body));
  //             console.warn("Réponse du serveur sous forme de texte :", responseText);
  //             observer.error("Le fichier semble trop petit pour être un PDF valide.");
  //             return;
  //           }
    
  //           const blob = new Blob([response.body], { type: 'application/pdf' });
  //           observer.next(blob);
  //           observer.complete();
  //         } else {
  //           console.error("Aucune donnée reçue !");
  //           observer.error("Aucune donnée reçue !");
  //         }
  //       },
  //       (error) => {
  //         console.error("Erreur lors de la récupération du fichier :", error);
  //         alert("Échec de récupération du fichier !");
  //         observer.error(error);
  //       }
  //     );
  //   });
  // }
  
  
  


//   generatePDF() {
//     let docDefinition = {
//         content: ['This is a sample PDF printed with pdfMake']
//     };

//     pdfMake.createPdf(docDefinition).open();
// }
// }







