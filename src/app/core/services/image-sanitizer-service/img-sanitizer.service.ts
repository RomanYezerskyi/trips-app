import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImgSanitizerService {

  constructor(private sanitizer: DomSanitizer) { }
  sanitiizeUserImg(img: string): SafeUrl {
    if (img == null)
      return this.sanitizer.bypassSecurityTrustUrl("/assets/images/user.png");
    return this.sanitizer.bypassSecurityTrustUrl(img);
  }
  sanitiizeImg(img: string): SafeUrl {
    if (img == null)
      return "";
    return this.sanitizer.bypassSecurityTrustUrl(img);
  }
}
