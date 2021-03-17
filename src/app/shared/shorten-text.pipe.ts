import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "shortenText",
})
export class ShortenTextPipe implements PipeTransform {
  transform(text: string, limit: number = 20): string {
    let shortenedText: string = text;
    if (text?.length > 20) {
      shortenedText = `${text.substr(0, limit)}...`;
    }
    return shortenedText;
  }
}
