import { METHOD } from '@/constants';
import { fetcher } from '@/utils/fetcher';
export class ImageUploadAdapter {
  private loader: any;
  private token?: string;
  constructor(loader: any, token?: string) {
    this.loader = loader;
    this.token = token;
  }
  upload = async () => {
    const file = await this.loader.file;
    const formData = new FormData();
    formData.append('file', file!);
    try {
      const res = await fetcher(
        '/api/file',
        METHOD.POST,
        formData,

      );
      return {
        default: (res.url as any),
      };
    } catch (error) {
      console.log(error);
      return {};
    }
  };
  abort() { }
}
