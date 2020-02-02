import { IFile } from "./IFile";

export interface IFiles {
  byId: Record<number, IFile>;
  order: number[];
  selectedFileId: number | null;
}
