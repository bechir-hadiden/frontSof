

export class FileData {
    fileName(arg0: string, fileName: any) {
      throw new Error('Method not implemented.');
    }
    id?: number; // Assurez-vous que cela correspond à votre structure de données
    filename!: any; // Nom du fichier
    type!: string;
    data?: string; // Optionnel si vous stockez le contenu en base64 ou un chemin vers le fichier
    content!: Blob; // Ajoutez cette propriété si elle manque

  }