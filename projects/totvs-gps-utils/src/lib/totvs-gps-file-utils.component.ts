export class TotvsFileUtils {

  static getInstance(): TotvsFileUtils {
    return new TotvsFileUtils();
  }
  
  public downloadFile(fileName:string, content:Blob): Blob {
    let downloadUrl = window.URL.createObjectURL(content);
    let link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;

    // IE
    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
      window.navigator.msSaveBlob(content, fileName);
      return;
    }
    document.body.appendChild(link);
    link.click();
  }

}
