export interface EmployeeModel {
    matricule?: number; // Optional property
    nom: string;
    prenom: string;
    poste: string;
    adresse: string;
    dateNaissance?: Date; // Optional property
    lieuNaissance: string;
    cin?: string;
    dateCin: Date; // Optional property
    categoriePro: string;
    salaireb?: number; // Optional property
    salairen?: number; // Optional property
}