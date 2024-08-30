export interface ContractsModel {
    id?: number; // Optional property
    type: string;
    datedeb: Date;
    dateFin: Date;
    salaireb?: number; // Optional property
    salairen?: number; // Optional property
    employeeId: number;
    signature?: boolean;
}