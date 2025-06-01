import { Component, EventEmitter, Output } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../environments/firebase-config'; // asegúrate de tener este archivo

// Solo inicializa una vez Firebase App
initializeApp(firebaseConfig);

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
})
export class UploadImageComponent {
  @Output() imageUploaded = new EventEmitter<string>();

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, `profile_photos/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`📤 Subiendo: ${progress.toFixed(2)}%`);
      },
      (error) => {
        console.error('❌ Error subiendo imagen:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('✅ Imagen subida con éxito:', downloadURL);
        this.imageUploaded.emit(downloadURL); // devuelve la URL al componente padre
      }
    );
  }
}
