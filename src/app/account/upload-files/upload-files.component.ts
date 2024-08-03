import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { UploadFileService } from '../../core/service/upload-file.service';
import { AsyncPipe, NgStyle, CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-files',
  standalone: true,
  imports: [
    AsyncPipe,
    NgStyle,
    CommonModule
  ],
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {

  selectedFiles: FileList | null = null;
  currentFile: File | null = null;
  progress = 0;
  message = '';

  constructor(private uploadService: UploadFileService) { }

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = input.files;
      this.currentFile = this.selectedFiles.item(0);
    }
  }

  ngOnInit(): void {}

  upload(): void {
    this.progress = 0;

    if (this.currentFile) {
      this.uploadService.upload(this.currentFile).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              this.progress = Math.round(100 * event.loaded / event.total);
            }
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
          }
        },
        err => {
          this.progress = 0;
          this.message = 'Could not upload the file!';
          this.currentFile = null;
        });
    }

    this.selectedFiles = null;
  }
}
