import { FileSystemStoredFile, HasMimeType, IsFile } from 'nestjs-form-data';

export class FormDataTestDto {
  @IsFile()
  @HasMimeType(['text/csv', 'text/x-csv'])
  file: FileSystemStoredFile;
}
