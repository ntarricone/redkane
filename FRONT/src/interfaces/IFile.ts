export interface IFile {
  multimediaId: number;
  path: string;
  title: string;
  time: string;
  type: string;
  price: number;
  category: string;
  textArea: any; //I type is as any because it can also come html
  reading_time: string;
  view: number; //check if this peta
  id: number;
}
