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

  /**
   * Converte um conteúdo de base64 para Blob
   * @param data conteúdo em base64
   */
  public static base64ToArray(data): Blob {
    let byteCharacters = atob(data);
    let byteNumbers = new Array(byteCharacters.length);      
    for (let i=0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);       
    return new Blob([byteArray], {type : "application/octet-stream"});            
  }

}
