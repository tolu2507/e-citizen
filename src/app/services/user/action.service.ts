import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  doc,
  docData,
  addDoc,
  Firestore,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  public datas: any[] = [];
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  async getUserProfile() {
    this.datas.length = 0;
    const querySnapshot = await getDocs(collection(this.firestore, 'users'));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.data());
      this.datas.push({ ...doc.data(), id: doc.id });
    });
    console.log(this.datas);
  }

  async uploadImage(cameraFile: Photo, name: string) {
    const path = name;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String!, 'base64');

      const imageUrlh = await getDownloadURL(storageRef);
      console.log('new user: ', imageUrlh);

      return imageUrlh;
    } catch (e) {
      return e;
    }
  }

  async create(incidentDetails: Incident) {
    try {
      this.datas.length = 0;
      const docRef = await addDoc(
        collection(this.firestore, 'users'),
        incidentDetails
      );
      console.log('Document written with ID: ', docRef.id);
      return 'created';
    } catch (error) {
      return error;
    }
  }

  async update(updateDetails: any, id: Incident['id']) {
    try {
      this.datas.length = 0;
      const washingtonRef = doc(this.firestore, 'users', id!);
      await updateDoc(washingtonRef, updateDetails);
      return 'updated';
    } catch (error) {
      throw new Error('unable to update db');
    }
  }

  async delete(id: Incident['id']) {
    try {
      this.datas.length = 0;
      const washingtonRef = doc(this.firestore, 'users', id!);
      await deleteDoc(washingtonRef);
      return 'deleted';
    } catch (error) {
      throw new Error('unable to update db');
    }
  }
}

export interface Incident {
  title: string;
  details: string;
  categories: string
  imgUrl?: string;
  id?:string
}
