import axios from 'axios';
import { Report } from './report.model'

export class ReportsService {
    url = 'http://localhost:3000/reports';

    async createReport(report: Report) {
        await axios.post(this.url, report);
    }

    async getReports() {
        return await axios.get(this.url);
    }
}