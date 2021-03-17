export enum CloudProvider {
  GOOGLE = "GOOGLE",
  DROPBOX = "DROPBOX",
  LOCAL = "LOCAL",
}

export enum ModalType {
  SEARCH = "SEARCH",
  NEW_FILE = "NEW_FILE",
  NEW_FOLDER = "NEW_FOLDER",
  DRIVE_SPACE = "DRIVE_SPACE",
}

export enum MediaType {
  FILE = "FILE",
  FOLDER = "FOLDER",
}

export interface SidebarInput {
  Username: string;

  ImagePath?: string;
}

export type SearchModalEventPayload = { purpose: string; searchedText: string };

export interface SearchModalPayload {
  FileName: string;

  MediaType: MediaType;
}

export const MAGIC_BYTES_NUMBER: number = 1073741824;

export interface DriveSpacePayload {
  CurrentlyUsed: number;

  MaxSpace: number;
}

export interface DefaultMessageType {
  Message: string;
}

export const DEFAULT_FILES_PER_UPLOAD: number = 10;

export const DEFAULT_FILE_SIZE: number = 50 * 1048576;

export interface DropboxFileType {
  Id: string;

  Path: string;

  Name: string;

  Tag: string;

  DownloadLink?: string;
}

export interface DefaultReponsePayload {
  Message: string;

  ResponsePayload: any;
}

export enum DefaultUserMessage {
  DELETE_MESSAGE = "Deleted",
  CREATE_MESSAGE = "Saved",
}

export interface AuthorizationQueryUrlData {
  Provider: string;
  Code: string;
}

export enum LocalStorageKey {
  GoogleAuthToken = "GoogleAuthToken",
  DropboxAuthToken = "DropboxAuthToken",
  Reservia = "reservia",
}
