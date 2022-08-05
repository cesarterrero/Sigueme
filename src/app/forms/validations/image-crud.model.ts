import { ShellModel } from '../../shell/data-store';

export class FirebaseImageModel extends ShellModel {
  id: string;
  base64: string;

  constructor() {
    super();
  }
}
