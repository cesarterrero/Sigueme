import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { FirebaseImageModel } from './image-crud.model';

@Injectable({
  providedIn: 'root'
})
export class ImageCrudService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private firestore: Firestore
  ) {}

  // * Firebase Create User Modal
  public createImage(report: FirebaseImageModel): Promise<void> {
    // Remove isShell property so it doesn't get stored in Firebase
    const { isShell, ...imageDataToSave } = report;
    const imageDocumentRef = doc(collection(this.firestore, 'images'));

    return setDoc(imageDocumentRef, {...imageDataToSave});
  }

  // // * Get data of a specific User
  // private getUser(userId: string): Observable<FirebaseUserModel> {
  //   const userDocumentRef = doc(this.firestore, 'users', userId) as DocumentReference<FirebaseUserModel>;
  //   const userDocumentSnapshotPromise = getDoc(userDocumentRef);

  //   const userDataSource: Observable<FirebaseUserModel> = from(userDocumentSnapshotPromise)
  //   .pipe(
  //     map((userSnapshot: DocumentSnapshot<FirebaseUserModel>) => {
  //       if (userSnapshot.exists()) {
  //         const user: FirebaseUserModel = userSnapshot.data();
  //         // const age = this.calcUserAge(user.birthdate);
  //         const id = userSnapshot.id;

  //         return { id, ...user } as FirebaseUserModel;
  //       }
  //     })
  //   );

  //   return userDataSource;
  // }
}
