declare module 'firebase/app' {
  export interface FirebaseApp {
    name: string;
    options: Record<string, unknown>;
  }

  export function initializeApp(options?: Record<string, unknown>): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function getApp(name?: string): FirebaseApp;
}

declare module 'firebase/auth' {
  import type { FirebaseApp } from 'firebase/app';

  export interface UserInfo {
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
    uid: string;
  }

  export interface User extends UserInfo {
    emailVerified: boolean;
    providerData: UserInfo[];
    tenantId: string | null;
  }

  export interface Auth {
    app: FirebaseApp;
    currentUser: User | null;
  }

  export type Unsubscribe = () => void;

  export function getAuth(app?: FirebaseApp): Auth;
  export function onAuthStateChanged(
    auth: Auth,
    next: (user: User | null) => void,
    error?: (error: Error) => void
  ): Unsubscribe;
  export function signInAnonymously(auth: Auth): Promise<unknown>;
  export function createUserWithEmailAndPassword(
    auth: Auth,
    email: string,
    password: string
  ): Promise<unknown>;
  export function signInWithEmailAndPassword(
    auth: Auth,
    email: string,
    password: string
  ): Promise<unknown>;
}

declare module 'firebase/firestore' {
  import type { FirebaseApp } from 'firebase/app';

  export interface Firestore {
    app: FirebaseApp;
  }

  export interface DocumentData {
    [field: string]: unknown;
  }

  export interface FirestoreError extends Error {
    code: string;
  }

  export interface DocumentSnapshot<T = DocumentData> {
    id: string;
    exists(): boolean;
    data(): T;
  }

  export interface QuerySnapshot<T = DocumentData> {
    docs: Array<DocumentSnapshot<T>>;
  }

  export interface Query<T = DocumentData> {
    type?: string;
  }

  export interface CollectionReference<T = DocumentData> extends Query<T> {
    path: string;
    type: 'collection';
  }

  export interface DocumentReference<T = DocumentData> {
    path: string;
  }

  export interface SetOptions {
    merge?: boolean;
    mergeFields?: string[];
  }

  export function getFirestore(app?: FirebaseApp): Firestore;
  export function onSnapshot<T = DocumentData>(
    target: Query<T> | CollectionReference<T> | DocumentReference<T>,
    next: (snapshot: QuerySnapshot<T> & DocumentSnapshot<T>) => void,
    error?: (error: FirestoreError) => void
  ): () => void;
  export function setDoc<T = DocumentData>(
    reference: DocumentReference<T>,
    data: Partial<T>,
    options?: SetOptions
  ): Promise<void>;
  export function addDoc<T = DocumentData>(
    reference: CollectionReference<T>,
    data: Partial<T>
  ): Promise<DocumentReference<T>>;
  export function updateDoc<T = DocumentData>(
    reference: DocumentReference<T>,
    data: Partial<T>
  ): Promise<void>;
  export function deleteDoc(reference: DocumentReference): Promise<void>;
}
