import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError, BehaviorSubject, Subscription } from "rxjs";
import { catchError, throttleTime, map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import {
  CloudProvider,
  DefaultReponsePayload,
  DropboxFileType,
  MAGIC_BYTES_NUMBER,
  DriveSpacePayload,
  LocalStorageKey,
} from "../types/data.types";

@Injectable({
  providedIn: "root",
})
export class ApiEndpointService {
  private errorMessageObs$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >(null);
  private successMessageObs$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >(null);
  private folderPointerLocation$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >("/");
  private appProvider$: BehaviorSubject<CloudProvider> = new BehaviorSubject<
    CloudProvider
  >(null);
  private isUploadHappening$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  private fileListOnPathObs$: BehaviorSubject<
    DropboxFileType[]
  > = new BehaviorSubject<DropboxFileType[]>([]);
  private currentlyActiveGoogleFolder$: BehaviorSubject<
    string
  > = new BehaviorSubject<string>("root");
  private googleFileIdBuilder$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >("root");
  /**
   * Will be attached to the http headers using a http interceptor,
   * So the server will identify each individual user
   */
  private googleAuthCode: BehaviorSubject<string> = new BehaviorSubject<string>(
    ""
  );

  constructor(private readonly httpClient: HttpClient) {}

  formatPathURL() {
    const path: string = this.getFolderPointerLocation();
    let backPath = "/";
    const matches = path.match(/\//g);
    if (matches.length > 1) {
      //Split the path
      const pathSplit = path.split("/");
      //remove the last array elements
      const arrayWithoutLastElement = pathSplit.filter(
        (path, index) => index !== pathSplit.length - 1
      );
      backPath = arrayWithoutLastElement.toString().replace(/\,/g, "/");
    }
    return backPath;
  }

  setGoogleAuthCode(code: string): void {
    this.googleAuthCode.next(code);
  }

  getGoogleAuthCode(): string {
    return this.googleAuthCode.getValue();
  }

  getGoogleAuthCodeAsObs(): Observable<string> {
    return this.googleAuthCode.asObservable();
  }

  getCurrentFolderIdToPreview(): string {
    const currentLocation: string = this.getGoogleFileIdBuilder();
    if (currentLocation !== "root") {
      let folderIdArray: string[] = this.getGoogleFileIdBuilder()?.split("*");
      //filter out the last element
      folderIdArray = folderIdArray.filter(
        (folder: string, index: number) => index !== folderIdArray?.length - 1
      );
      const locationsPath: string = folderIdArray
        .toString()
        .replace(/\,/g, "*");
      this.setGoogleFileIdBuilder(locationsPath);
      return folderIdArray[folderIdArray?.length - 1];
    }
    return "root";
  }

  setGoogleFileIdBuilder(fileRow: string): void {
    this.googleFileIdBuilder$.next(fileRow);
  }

  getGoogleFileIdBuilder(): string {
    return this.googleFileIdBuilder$.getValue();
  }

  getGoogleFileIdBuilderAsObs(): Observable<string> {
    return this.googleFileIdBuilder$.asObservable();
  }

  setCurrentlyActiveGoogleFolder(folderId: string): void {
    this.currentlyActiveGoogleFolder$.next(folderId);
  }

  getCurrentlyActiveGoogleFolder(): string {
    return this.currentlyActiveGoogleFolder$.getValue();
  }

  getCurrentlyActiveGoogleFolderAsObs(): Observable<string> {
    return this.currentlyActiveGoogleFolder$.asObservable();
  }

  setFileListOnPath(payload: DropboxFileType[]): void {
    this.fileListOnPathObs$.next(payload);
  }

  getFileListOnPath(): Observable<DropboxFileType[]> {
    return this.fileListOnPathObs$.asObservable();
  }

  getFileListOnPathAsLiteral(): DropboxFileType[] {
    return this.fileListOnPathObs$.getValue() || [];
  }

  getIsUploadHappeningAsObs(): Observable<boolean> {
    return this.isUploadHappening$.asObservable();
  }

  setIsUploadHappening(status: boolean): void {
    this.isUploadHappening$.next(status);
  }

  getFolderPointerLocation(): string {
    const loc = this.folderPointerLocation$.getValue();
    return loc === "/" ? loc : `${loc}/`;
  }

  getFolderPointerLocationAsObs(): Observable<string> {
    return this.folderPointerLocation$.asObservable();
  }

  setFolderPointerLocation(path: string): void {
    this.folderPointerLocation$.next(path);
  }

  setErrorMessageObs(message: string): void {
    this.errorMessageObs$.next(message);
  }

  getErrorMessageObs(): string {
    return this.errorMessageObs$.getValue();
  }

  getErrorMessageAsObs(): Observable<string> {
    return this.errorMessageObs$.asObservable();
  }

  setSuccessMessageObs(message: string): void {
    this.successMessageObs$.next(message);
  }

  getSuccessMessageObs(): string {
    return this.successMessageObs$.getValue();
  }

  getSuccessMessageAsObs(): Observable<string> {
    return this.successMessageObs$.asObservable();
  }

  getAppProvider(): CloudProvider {
    return this.appProvider$.getValue();
  }

  getAppProviderAsObs(): Observable<CloudProvider> {
    return this.appProvider$.asObservable();
  }

  setAppProvider(provider: CloudProvider): void {
    this.appProvider$.next(provider);
  }

  displayErrorMessage(message: string): void {
    const errorModalEl: HTMLElement = document.querySelector("#danger-modal");
    //Set the error Message Observable
    this.setErrorMessageObs(message);

    const messageSub: Subscription = this.getSuccessMessageAsObs().subscribe(
      (response: string) => {
        if (response) {
          errorModalEl.classList.remove("hide-element");
          errorModalEl.classList.add("show-element-flex");

          setTimeout(() => {
            errorModalEl.classList.add("hide-element");
            errorModalEl.classList.remove("show-element-flex");
          }, 10000);
        }
      }
    );
    messageSub.unsubscribe();
  }

  displaySuccessMessage(message: string): void {
    const successModalEl: HTMLElement = document.querySelector(
      "#success-modal"
    );
    //Set the error Messga Observable
    this.setSuccessMessageObs(message);

    const messageSub: Subscription = this.getSuccessMessageAsObs().subscribe(
      (response: string) => {
        if (response) {
          successModalEl.classList.remove("hide-element");
          successModalEl.classList.add("show-element-flex");

          setTimeout(() => {
            successModalEl.classList.add("hide-element");
            successModalEl.classList.remove("show-element-flex");
          }, 10000);
        }
      }
    );
    messageSub.unsubscribe();
  }

  //DropBox methods
  authorizeDropboxDrive(): Observable<any> {
    try {
      const dropboxObs$: Observable<any> = this.httpClient
        .get(`${environment.apiRoot}/dropbox/authorize-drive`)
        .pipe(catchError((err) => throwError(err)));
      return dropboxObs$;
    } catch (ex) {
      throw ex;
    }
  }

  getDropboxToken(): Observable<any> {
    try {
      const tokenObs$: Observable<any> = this.httpClient
        .get(`${environment.apiRoot}/dropbox/get-token`)
        .pipe(
          throttleTime(2000),
          catchError((err) => throwError(err))
        );
      return tokenObs$;
    } catch (ex) {
      throw ex;
    }
  }

  getDropboxUserDetails(): Observable<any> {
    try {
      const userDetail$: Observable<any> = this.httpClient
        .get(`${environment.apiRoot}/dropbox/get-user-details`)
        .pipe(
          throttleTime(1000),
          catchError((err) => throwError(err))
        );
      return userDetail$;
    } catch (ex) {
      throw ex;
    }
  }

  searchDropboxDrive(searchQuery: string): Observable<any> {
    try {
      const searchResults$: Observable<any> = this.httpClient
        .get(
          `${environment.apiRoot}/dropbox/search-for-files?searchQuery=${searchQuery}`
        )
        .pipe(
          throttleTime(2000), //Wait for 2 seconds before making the request
          catchError((err) => throwError(err))
        );
      return searchResults$;
    } catch (ex) {
      throw ex;
    }
  }

  getDropboxDriveSpace(): Observable<DriveSpacePayload> {
    try {
      const driveSpace$: Observable<DriveSpacePayload> = this.httpClient
        .get(`${environment.apiRoot}/dropbox/get-drive-space`)
        .pipe(
          throttleTime(2000),
          map((res: any) => {
            return {
              CurrentlyUsed: parseFloat(
                (res.used / MAGIC_BYTES_NUMBER).toFixed(2)
              ),
              MaxSpace: res.allocation.allocated / MAGIC_BYTES_NUMBER,
            };
          }),
          catchError((err) => throwError(err))
        );
      return driveSpace$;
    } catch (ex) {
      throw ex;
    }
  }

  getFileNameFromDropboxPath(filePath: string): string {
    const filePathSplit: string[] = filePath.split("/");
    return filePathSplit[filePathSplit?.length - 1];
  }

  createDropboxFolder(folderName: string): Observable<any> {
    try {
      const createFolder$: Observable<any> = this.httpClient
        .get(
          `${
            environment.apiRoot
          }/dropbox/create-folder?pathToFolder=${this.getFolderPointerLocation()}${folderName}`
        )
        .pipe(catchError((err) => throwError(err)));
      return createFolder$;
    } catch (ex) {
      throw ex;
    }
  }

  //Save files to Dropbox
  saveFilesToDropbox(files: File[]): Observable<any> {
    try {
      const formdata: FormData = new FormData();
      if (files?.length > 0) {
        for (const file of files) {
          formdata.append("files", file);
        }
      }

      let curentFolderLocation: string;
      const folderLocation: Subscription = this.getFolderPointerLocationAsObs().subscribe(
        (response: string) => {
          curentFolderLocation = response;
        }
      );
      folderLocation.unsubscribe();

      let uploadEndpoint: string = `${environment.apiRoot}/dropbox/upload-files`;
      if (curentFolderLocation !== "/") {
        uploadEndpoint = `${uploadEndpoint}?filePath=${curentFolderLocation}`;
      }
      const fileUploadObs$: Observable<any> = this.httpClient.post(
        uploadEndpoint,
        formdata
      );
      return fileUploadObs$;
    } catch (ex) {
      throw ex;
    }
  }

  formatDropboxFilePath(): string {
    let curentFolderLocation: string;
    const folderLocation: Subscription = this.getFolderPointerLocationAsObs().subscribe(
      (response: string) => {
        curentFolderLocation = response;
      }
    );
    folderLocation.unsubscribe();

    return curentFolderLocation !== "/" ? curentFolderLocation : null;
  }

  //Get files from a give path in dropbox
  getFilesFromDropbox(): Observable<DropboxFileType[]> {
    try {
      const currentPath: string = this.formatDropboxFilePath();
      let apiEndpiont: string = `${environment.apiRoot}/dropbox/get-all-files-and-folders`;
      if (currentPath) {
        apiEndpiont = `${apiEndpiont}?filePath=${currentPath}`;
      }
      const retrievedFiles$: Observable<any> = this.httpClient
        .get(apiEndpiont)
        .pipe(
          throttleTime(1000),
          map((response: any) => {
            let driveRources: DropboxFileType[];
            if (response.entries?.length > 0) {
              driveRources = response.entries.map((file) => {
                return {
                  Id: file.id,
                  Name: file.name,
                  Path: file.path_lower,
                  Tag: file[".tag"],
                };
              });
            }
            return driveRources;
          }),
          catchError((err) => throwError(err))
        );
      return retrievedFiles$;
    } catch (ex) {
      throw ex;
    }
  }

  deleteFileFromDropbox(filePath: string): Observable<DefaultReponsePayload> {
    try {
      //Run the request
      const fileDeleteObs$: Observable<DefaultReponsePayload> = this.httpClient
        .delete<DefaultReponsePayload>(
          `${environment.apiRoot}/dropbox/delete-file?filePath=${filePath}`
        )
        .pipe(
          throttleTime(1000),
          catchError((err) => throwError(err))
        );

      return fileDeleteObs$;
    } catch (ex) {
      throw ex;
    }
  }

  //Get Download link
  getDownloadLink(filePath: string): Observable<any> {
    try {
      const apiEndpoint: string = `${environment.apiRoot}/dropbox/get-file-metadata-and-link?filePath=${filePath}&link_only=true`;
      //Query the endpoint and retieve only the download link for a file
      const downloadLinkObs$: Observable<any> = this.httpClient
        .get(apiEndpoint)
        .pipe(
          throttleTime(1000),
          catchError((err) => throwError(err))
        );
      return downloadLinkObs$;
    } catch (ex) {
      throw ex;
    }
  }

  //Google Methods
  authorizeGoogleDrive(): Observable<any> {
    try {
      const googleDriveObs$: Observable<any> = this.httpClient
        .get(`${environment.apiRoot}/google/authorize-drive`)
        .pipe(catchError((err) => throwError(err)));
      return googleDriveObs$;
    } catch (ex) {
      throw ex;
    }
  }

  getGoogleUserDetails(): Observable<any> {
    try {
      const userDetail$: Observable<any> = this.httpClient
        .get(`${environment.apiRoot}/google/get-user-details`)
        .pipe(
          throttleTime(1000),
          catchError((err) => throwError(err))
        );
      return userDetail$;
    } catch (ex) {
      throw ex;
    }
  }

  getGoogleToken(): Observable<any> {
    try {
      const tokenObs$: Observable<any> = this.httpClient
        .get(`${environment.apiRoot}/google/get-token`)
        .pipe(
          throttleTime(2000),
          catchError((err) => throwError(err))
        );
      return tokenObs$;
    } catch (ex) {
      throw ex;
    }
  }

  emptyGoogleRecycleBin(): Observable<any> {
    const recycleObs$: Observable<any> = this.httpClient
      .delete(`${environment.apiRoot}/google/empty-trash`)
      .pipe(catchError((err) => throwError(err)));
    return recycleObs$;
  }

  getGoogleDriveSpace(): Observable<DriveSpacePayload> {
    try {
      //Get the available space on the google drive
      const fileDriveSpace$: Observable<DriveSpacePayload> = this.httpClient
        .get(`${environment.apiRoot}/google/get-drive-space`)
        .pipe(
          throttleTime(1000),
          map((response: any) => {
            const { limit, usageInDrive } = response.storageQuota;
            return {
              CurrentlyUsed: parseFloat(
                (usageInDrive / MAGIC_BYTES_NUMBER).toFixed(2)
              ),
              MaxSpace: limit / MAGIC_BYTES_NUMBER,
            };
          }),
          catchError((err) => throwError(err))
        );
      return fileDriveSpace$;
    } catch (ex) {
      throw ex;
    }
  }

  //Search the drive for more data
  searchGoogleDrive(searchQuery: string): Observable<any[]> {
    try {
      const searchResults$: Observable<any[]> = this.httpClient
        .get(
          `${environment.apiRoot}/google/search-for-files?searchQuery=${searchQuery}`
        )
        .pipe(
          throttleTime(1000), //Wait for 1 seconds before making the request
          map((response: any) => response.files),
          catchError((err) => throwError(err))
        );
      return searchResults$;
    } catch (ex) {
      throw ex;
    }
  }

  //Create folder
  createGoogleFolder(folderName: string): Observable<any> {
    try {
      const parentId = this.getCurrentlyActiveGoogleFolder();
      const apiEndpoint: string = `${environment.apiRoot}/google/create-folder?folderName=${folderName}&parentId=${parentId}`;
      const createFolder$: Observable<any> = this.httpClient
        .get(apiEndpoint)
        .pipe(
          throttleTime(1000),
          catchError((err) => throwError(err))
        );
      return createFolder$;
    } catch (ex) {
      throw ex;
    }
  }

  saveFilesToGoogle(files: File[]): Observable<any> {
    try {
      const formdata: FormData = new FormData();
      if (files?.length > 0) {
        for (const file of files) {
          formdata.append("files", file);
        }
      }

      let curentFolderLocation: string;
      const folderLocation: Subscription = this.getCurrentlyActiveGoogleFolderAsObs().subscribe(
        (response: string) => {
          curentFolderLocation = response;
        }
      );
      folderLocation.unsubscribe();

      const uploadEndpoint: string = `${environment.apiRoot}/google/upload-files/${curentFolderLocation}`;
      const fileUploadObs$: Observable<any> = this.httpClient.post(
        uploadEndpoint,
        formdata
      );
      return fileUploadObs$;
    } catch (ex) {
      throw ex;
    }
  }

  getFilesFromGoogle(): Observable<any> {
    try {
      let curentFolderLocation: string;
      const folderLocation: Subscription = this.getCurrentlyActiveGoogleFolderAsObs().subscribe(
        (response: string) => {
          curentFolderLocation = response;
        }
      );
      folderLocation.unsubscribe();

      const fileList$: Observable<any> = this.httpClient
        .get(
          `${environment.apiRoot}/google/get-files-from-parent-folder/${curentFolderLocation}`
        )
        .pipe(
          throttleTime(1000),
          map((response: any) => {
            let driveRources: DropboxFileType[];
            if (response.files?.length > 0) {
              driveRources = response.files.map((file) => {
                return {
                  Id: file.id,
                  Name: file.name,
                  Path: file.parents[0],
                  Tag: /folder/.test(file.mimeType) ? "folder" : "file",
                  DownloadLink: file.webContentLink || null,
                };
              });
            }
            return driveRources;
          }),
          catchError((err) => throwError(err))
        );
      return fileList$;
    } catch (ex) {
      throw ex;
    }
  }

  deleteFileFromGoogle(fileId: string): Observable<any> {
    try {
      const deleteFileObs$: Observable<any> = this.httpClient
        .delete(`${environment.apiRoot}/google/delete-file/${fileId}`)
        .pipe(
          throttleTime(1000),
          catchError((err) => throwError(err))
        );

      return deleteFileObs$;
    } catch (ex) {
      throw ex;
    }
  }

  getLocalStorageValues(): any {
    return JSON.parse(localStorage.getItem(LocalStorageKey.Reservia));
  }

  getGoogleAuthTokenFromLocalStorage(): any {
    const reserviaObject: any = this.getLocalStorageValues();
    if (reserviaObject) {
      const fullObject: any = reserviaObject[LocalStorageKey.Reservia];
      return JSON.parse(fullObject[LocalStorageKey.GoogleAuthToken]) || null;
    }
  }

  getDropboxAuthTokenFromLocalStorage(): any {
    const reserviaObject: any = this.getLocalStorageValues();
    if (reserviaObject) {
      const fullObject: any = reserviaObject[LocalStorageKey.Reservia];
      return JSON.parse(fullObject[LocalStorageKey.DropboxAuthToken]) || null;
    }
  }

  //Local storage Methods
  setToLocalStorage(key: string, value: any): void {
    const lsValue: any = {
      reservia: {},
    };
    const existingLocalStorageValue: any =
      this.getLocalStorageValues() || lsValue;
    existingLocalStorageValue.reservia[key] = value;

    localStorage.setItem(
      LocalStorageKey.Reservia,
      JSON.stringify(existingLocalStorageValue)
    );
  }

  //Authenticate Google user
  authenticateGoogleUser(): boolean {
    try {
      let isUserAuthenticated: boolean = false;
      const googleToken: any = this.getGoogleAuthTokenFromLocalStorage();
      if (googleToken?.expiry_date >= Date.now()) {
        isUserAuthenticated = true;
      }
      return isUserAuthenticated;
    } catch (ex) {
      throw ex;
    }
  }

  //Authenticating Dropbox user
  authenticateDropboxUser(): boolean {
    try {
      let isUserAuthenticated: boolean = false;
      const dropboxToken: any = this.getDropboxAuthTokenFromLocalStorage();
      if (dropboxToken?.access_token) {
        isUserAuthenticated = true;
      }
      return isUserAuthenticated;
    } catch (ex) {
      throw ex;
    }
  }
}
