export class ContractFilterCriteria {
    types: string[] = []; // Ensure it's initialized to avoid null issues
    isActive?: boolean;
    isEndingSoon?: boolean;
    isEndedRecently?: boolean;
    EndedOverOneMonth?: boolean;
    startDate?: Date;
    endDate?: Date;
  }