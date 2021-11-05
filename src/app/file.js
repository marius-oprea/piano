export default class File {
  uploadedFileContent;

  constructor() {
  }

  uploadFile(fileUploadId) {
    const fileInput = document.getElementById(fileUploadId);
    fileInput.onchange = (event) => {
      const selectedFile = fileInput.files[0];
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        this.uploadedFileContent = event.target.result;
      }
      fileReader.readAsText(selectedFile);
    };
  }

  downloadFile(fileDownloadId) {
    const fileOutput = document.getElementById(fileDownloadId);
    fileOutput.onclick = (event) => {
      const type = "application/xml";
      const name = "download.xml";
      this.downloadBlob(this.uploadedFileContent, type, name);

      alert('your file has downloaded!');
    }
  }

  downloadBlob(data, type, name) {
    let blob = new Blob([data], {type});
    let url = window.URL.createObjectURL(blob);
    this.downloadURI(url, name);
    window.URL.revokeObjectURL(url);
  }
  
  downloadURI(uri, name) {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
  }  
}