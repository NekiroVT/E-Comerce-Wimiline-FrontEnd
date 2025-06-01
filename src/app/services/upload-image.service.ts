import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../environments/firebase-config';

@Injectable({ providedIn: 'root' })
export class UploadImageService {
  constructor() {}

  async uploadImageFromFile(file: File, username: string): Promise<string> {
    if (!file || file.size === 0) {
      throw new Error('❌ El archivo está vacío o no se pudo leer');
    }

    const fileRef = ref(storage, `profile_photos/${username}.jpg`);
    console.log('📂 Subiendo archivo a Firebase Storage:', fileRef.fullPath);

    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    console.log('✅ Imagen subida con éxito:', url);

    return url;
  }
}
