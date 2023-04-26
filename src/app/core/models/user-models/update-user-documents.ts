import { UserDocumentsModel } from "./user-documents-model";

export interface UpdateUserDocuments {
    documentsFile: FormData;
    deletedDocuments: UserDocumentsModel[];
}
