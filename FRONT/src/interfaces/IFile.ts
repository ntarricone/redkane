export interface IFile {
  multimediaId: number;
  path: string;
  title: string;
  time: string;
  type: string;
  price: number;
  category: string;
  language: string;
  textArea: any; //I type is as any because it can also come html
  description: string;
  reading_time: string;
  views: number; //check if this peta
  id: number;
}
