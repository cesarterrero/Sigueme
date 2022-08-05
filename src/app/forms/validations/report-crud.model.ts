import { ShellModel } from '../../shell/data-store';

export class FirebaseReportModel extends ShellModel {
  id: string;
  date: string;
  email: string;
  address: string;
  image: string;

  constructor() {
    super();
  }
}
